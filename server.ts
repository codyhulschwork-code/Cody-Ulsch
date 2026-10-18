import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { fallbackAnalyzeJD, fallbackGenerateResume } from './src/utils/fallbackGenerator';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '20mb' }));

// Shared Gemini client setup as required by skill guidelines
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Resilient Gemini caller with automatic fallback models, jittered backoff, and quota/demand recovery
async function generateContentWithRetry(params: {
  contents: any;
  config?: any;
}) {
  const models = [
    'gemini-3.1-flash-lite',
    'gemini-3.8-flash',
    'gemini-flash-latest',
    'gemini-2.5-flash',
  ];
  let lastError: any = null;

  for (const model of models) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const res = await ai.models.generateContent({
          model,
          contents: params.contents,
          config: params.config,
        });
        if (res && res.text) {
          return res;
        }
      } catch (err: any) {
        lastError = err;
        const status = err?.status || err?.code || (err?.message?.includes('503') ? 503 : err?.message?.includes('429') ? 429 : 0);
        // On transient 503 high demand or 429 quota burst, pause with jittered backoff before second attempt
        if (attempt === 0 && (status === 503 || status === 429 || status === 'UNAVAILABLE' || status === 'RESOURCE_EXHAUSTED')) {
          await sleep(750 + Math.random() * 450);
          continue;
        }
        // Brief pause before trying next candidate model
        await sleep(250);
        break;
      }
    }
  }
  throw lastError;
}

// Helper to clean scraped text
function cleanText(text: string): string {
  return text
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

// 1. Fetch JD from URL
app.post('/api/fetch-jd-url', async (req: Request, res: Response) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'A valid URL is required.' });
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
    } catch {
      return res.status(400).json({ error: 'Invalid URL format.' });
    }

    const response = await fetch(parsedUrl.toString(), {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Failed to fetch URL. HTTP status: ${response.status} ${response.statusText}`,
      });
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove irrelevant elements
    $('script, style, noscript, nav, header, footer, iframe, svg, [role="navigation"], [role="banner"]').remove();

    // Extract title
    let pageTitle = $('meta[property="og:title"]').attr('content') ||
      $('h1').first().text().trim() ||
      $('title').text().trim() ||
      '';

    // Try common job description containers
    const potentialSelectors = [
      '[class*="job-description"]',
      '[class*="jobDescription"]',
      '[class*="description"]',
      '[data-testid*="job-description"]',
      '#job-description',
      '#content',
      'main',
      'article',
      '.posting-content',
      '.job-detail',
      '.job-body',
    ];

    let extractedText = '';
    for (const selector of potentialSelectors) {
      const el = $(selector);
      if (el.length && el.text().trim().length > 200) {
        extractedText = el.text();
        break;
      }
    }

    if (!extractedText || extractedText.trim().length < 200) {
      // Fallback to body text with sensible paragraph/list collection
      const pieces: string[] = [];
      $('h1, h2, h3, h4, p, li').each((_, elem) => {
        const t = $(elem).text().trim();
        if (t.length > 5) pieces.push(t);
      });
      extractedText = pieces.join('\n');
    }

    const cleaned = cleanText(extractedText);

    if (cleaned.length < 50) {
      return res.status(422).json({
        error: 'Could not extract sufficient text from this job posting URL. Please paste the job description text manually.',
      });
    }

    return res.json({
      title: pageTitle,
      url: parsedUrl.toString(),
      text: cleaned.slice(0, 15000), // Cap length
    });
  } catch (error: any) {
    console.error('Error fetching JD URL:', error);
    return res.status(500).json({
      error: error.message || 'An error occurred while fetching the job description URL.',
    });
  }
});

// 2. Deep JD Stack Analysis
app.post('/api/analyze-jd', async (req: Request, res: Response) => {
  try {
    const { jdText } = req.body;
    if (!jdText || typeof jdText !== 'string' || jdText.trim().length < 20) {
      return res.status(400).json({ error: 'Job description text is too short or missing.' });
    }

    const prompt = `Analyze this Job Description thoroughly for a Senior Software Engineer candidate (Cody Ulsch).

Follow Step 9 (JD STACK ANALYSIS) of the system rules:
Identify the JD's highest-priority technologies in:
- Backend
- Frontend
- Database
- Cloud
- DevOps / CI/CD
- Containers / Infrastructure
- Testing
- Messaging / Events
- Architecture
- Observability
- Security
- AI / Automation

Also determine:
1. Target Role Title & Target Company (if mentioned)
2. Work model (Remote, Hybrid, Onsite)
3. Experience level requested (e.g., 5+, 7+, 10+ years, Senior / Staff)
4. Must-have / Required core qualifications vs Nice-to-have / Preferred
5. Key engineering ownership themes (e.g. high-throughput distributed systems, event-driven pipelines, API modernization)
6. Recommended 12-20 technical skills prioritized strictly for this JD

Return clean structured JSON matching the requested schema.

JOB DESCRIPTION:
${jdText.slice(0, 12000)}`;

    let parsed: any;
    try {
      const response = await generateContentWithRetry({
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              roleTitle: { type: Type.STRING },
              companyName: { type: Type.STRING },
              workModel: { type: Type.STRING },
              experienceLevel: { type: Type.STRING },
              summaryAssessment: { type: Type.STRING },
              mustHaveSkills: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              niceToHaveSkills: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              stackAnalysis: {
                type: Type.OBJECT,
                properties: {
                  backend: { type: Type.ARRAY, items: { type: Type.STRING } },
                  frontend: { type: Type.ARRAY, items: { type: Type.STRING } },
                  database: { type: Type.ARRAY, items: { type: Type.STRING } },
                  cloud: { type: Type.ARRAY, items: { type: Type.STRING } },
                  devopsCiCd: { type: Type.ARRAY, items: { type: Type.STRING } },
                  containersInfra: { type: Type.ARRAY, items: { type: Type.STRING } },
                  testing: { type: Type.ARRAY, items: { type: Type.STRING } },
                  messagingEvents: { type: Type.ARRAY, items: { type: Type.STRING } },
                  architecture: { type: Type.ARRAY, items: { type: Type.STRING } },
                  observability: { type: Type.ARRAY, items: { type: Type.STRING } },
                  security: { type: Type.ARRAY, items: { type: Type.STRING } },
                  aiAutomation: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
              },
              recommendedSkills: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '12 to 20 unique high-priority technical skills from the JD',
              },
              keyEngineeringThemes: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: [
              'roleTitle',
              'companyName',
              'summaryAssessment',
              'mustHaveSkills',
              'stackAnalysis',
              'recommendedSkills',
            ],
          },
        },
      });

      parsed = JSON.parse(response.text || '{}');
    } catch {
      parsed = fallbackAnalyzeJD(jdText);
    }

    return res.json(parsed);
  } catch (error: any) {
    console.error('Error analyzing JD:', error);
    return res.status(500).json({ error: error.message || 'Failed to analyze Job Description.' });
  }
});

// 3. Generate Tailored Resume and Cover Letter for Cody Ulsch
app.post('/api/generate-resume', async (req: Request, res: Response) => {
  try {
    const { jdText, targetRole, targetCompany } = req.body;
    if (!jdText || typeof jdText !== 'string' || jdText.trim().length < 20) {
      return res.status(400).json({ error: 'Job description is required.' });
    }

    const systemPrompt = `You are the AUTHENTIC SENIOR SOFTWARE ENGINEER RESUME GENERATOR — CODY ULSCH (CONCISE 2026 VERSION).

PURPOSE:
Create a realistic, ATS-friendly Senior Software Engineer resume for Cody Ulsch, tailored directly to the provided Job Description (JD).
The JD is the source of truth for the target technology stack.
Prioritize:
- Strong JD alignment
- Realistic engineering ownership
- Current technology terminology
- Clean ATS language
- Concise, technically credible bullets
Do not keyword-stuff the resume or invent technologies, products, clients, metrics, or achievements.

Candidate Information:
Name: Cody Ulsch
Email: codyh.ulsch.work@gmail.com
Phone Number: +1(720)-970-4896
Address: Halethorpe,Maryland MD
Website: linkedin.com/in/cody-ulsch (Note: Per template instructions, LinkedIn profile is omitted from contact row in the PDF, website or location only if needed)

RULES:
1. CORE RULE: Build the resume around the JD's most important technologies and engineering responsibilities. 
              Only use technologies explicitly mentioned in JD or directly supporting a required JD technology. 
              Do not carry unrelated technologies from previous versions. 
              Use career history to determine realistic responsibility and seniority, not to introduce unrelated technology.
              Most recent role has strongest alignment.

2. TECHNOLOGY VERSION RULE: Use standard technology names. 
                            If JD specifies a version, use that version. 
                            If JD does not specify a version:
                            - Use the standard technology name.
                            - Do not invent minor versions. 
                            - Keep technology historically believable for the employment period. 
                            Current tech (Python, TypeScript, React, AWS, Azure, Kubernetes, Docker, Terraform, Kafka, OpenTelemetry, etc.) used only when supported by the JD.
3. EXPERIENCE STYLE:
Use this format for EVERY bullet:
**Technical Area (JD-Aligned Key Stack) —** concise description of the engineering work and practical impact.
The Technical Area should be short and meaningful (e.g. Distributed Ingestion, API Gateway, Cloud Infrastructure, Event Streaming, Observability).
Do NOT write keyword-stuffed bullets like "Backend Services — Java, Spring Boot, PostgreSQL, AWS, Docker...".
BOLDING RULE (CRITICAL): Strong skills, core technologies, and primary action verbs MUST be in BOLD (**):
- Bold the technical area & stack lead-in: **Technical Area (Key Stack) —**
- Bold primary action keywords: e.g. **Architected**, **Designed**, **Implemented**, **Optimized**, **Automated**, **Integrated**, **Refactored**, **Scaled**, **Deployed**, **Built**
- Bold key technologies and strong skills: e.g. **Python**, **TypeScript**, **AWS**, **Kubernetes**, **Kafka**, **Docker**, **PostgreSQL**

4. BULLET RULES:
Each bullet should:
- Be concise
- Usually contain 2–4 relevant technologies
- Describe real engineering work
- Show technical ownership
- Include practical impact when possible
- Be explainable in a technical interview
Use natural engineering verbs: Designed, Developed, Implemented, Maintained, Improved, Optimized, Refactored, Integrated, Automated, Tested, Debugged, Supported, Collaborated, Reviewed, Mentored.
AVOID: Spearheaded, Revolutionized, Game-changing, Cutting-edge, Visionary, World-class, Industry-leading.
DO NOT invent percentages, revenue, scale, customer counts, or performance numbers.
5. CAREER PROGRESSION & BULLET COUNTS:
Role 1: BairesDev
Title: Senior Software Engineer
Period: 2021 – Present
Location: Remote / 810 Francis Halethorpe MD
BULLET COUNT: EXACTLY 12 BULLETS.
Most recent / highest ownership: Production systems, backend engineering, APIs, cloud, distributed services, scalability, reliability, architecture contributions, automation, testing, observability, code reviews, mentoring.

Role 2: Cognizant
Title: Senior Software Engineer
Period: 2017 – 2021
Location: Linthicum Heights, MD
BULLET COUNT: EXACTLY 10 BULLETS.
Mid-career / broader application ownership: Enterprise applications, SaaS/backend development, APIs, database design, integrations, performance, testing, application architecture, production troubleshooting, modernization.

Role 3: Capital One
Title: Software Engineer
Period: 2014 – 2017
Location: McLean, VA
BULLET COUNT: EXACTLY 8 BULLETS.
Earlier-career foundation: Feature development, backend implementation, APIs, SQL/database work, testing, debugging, bug fixing, production support.

6. SKILLS:
20 to 30 meaningful technical skills based ONLY on JD relevance.
Every technology must appear only once in the skills section! No duplicates.

7. SUMMARY:
Write 4–5 concise sentences communicating:
- Senior Software Engineer experience with over 10 years
- Strong backend/system development
- Relevant JD technologies
- Cloud and production experience
- API/distributed systems experience when relevant
- Architecture, scalability, or reliability experience when relevant
- Collaboration and engineering ownership
Avoid generic statements and career objectives.

8. COVER LETTER:
Write a concise, human, JD-specific cover letter:
- Sound like a senior engineer speaking directly to a hiring team
- Relevant engineering experience tailored to this exact JD
- Backend/system development, cloud/production, APIs, technical ownership, engineering collaboration
- Mention target company and role if available.

9. EDUCATION:
B.S. in Computer Science, University of Maryland, Baltimore County (UMBC) (2010 – 2014)

10. CERTIFICATIONS:
Do NOT include any certifications. Certifications section has been deleted; return an empty array [] for certifications.`;

    const userPrompt = `Target Role: ${targetRole || 'Senior Software Engineer'}
Target Company: ${targetCompany || 'Hiring Company'}

JOB DESCRIPTION:
${jdText.slice(0, 12000)}

Generate the complete JSON payload containing:
- name: "Cody Ulsch"
- title: "Senior Software Engineer" (tailored to role)
- contact: email, phone, location ("810 Francis Halethorpe MD")
- summary (5-6 concise sentences)
- experience: array of 3 jobs (BairesDev: exactly 12 bullets, Cognizant: exactly 10 bullets, Capital One: exactly 8 bullets).
- skills: array of 20-30 unique skills
- education: array
- coverLetter: complete markdown/text letter tailored specifically to this JD`;

    let resumeData: any;
    try {
      const response = await generateContentWithRetry({
        contents: [
          { role: 'user', parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] },
        ],
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              title: { type: Type.STRING },
              contact: {
                type: Type.OBJECT,
                properties: {
                  email: { type: Type.STRING },
                  phone: { type: Type.STRING },
                  location: { type: Type.STRING },
                  website: { type: Type.STRING },
                },
                required: ['email', 'phone', 'location'],
              },
              summary: { type: Type.STRING },
              experience: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    company: { type: Type.STRING },
                    role: { type: Type.STRING },
                    period: { type: Type.STRING },
                    location: { type: Type.STRING },
                    bullets: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: 'Bullet in format: Technical Area (JD-Aligned Key Stack) — concise description...',
                    },
                  },
                  required: ['company', 'role', 'period', 'location', 'bullets'],
                },
              },
              skills: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '20 to 30 unique technical skills from the JD',
              },
              education: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    school: { type: Type.STRING },
                    degree: { type: Type.STRING },
                    field: { type: Type.STRING },
                    period: { type: Type.STRING },
                    location: { type: Type.STRING },
                  },
                  required: ['school', 'degree', 'period'],
                },
              },
              certifications: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    issuer: { type: Type.STRING },
                    year: { type: Type.STRING },
                  },
                  required: ['name', 'issuer'],
                },
              },
              coverLetter: {
                type: Type.OBJECT,
                properties: {
                  recipient: { type: Type.STRING },
                  company: { type: Type.STRING },
                  date: { type: Type.STRING },
                  body: { type: Type.STRING },
                },
                required: ['recipient', 'company', 'date', 'body'],
              },
              atsPlainText: {
                type: Type.STRING,
                description: 'ATS-formatted plain text version containing SUMMARY, SKILLS, BairesDev, Cognizant, Capital One, and COVER LETTER',
              },
            },
            required: [
              'name',
              'title',
              'contact',
              'summary',
              'experience',
              'skills',
              'education',
              'coverLetter',
            ],
          },
        },
      });

      resumeData = JSON.parse(response.text || '{}');
    } catch {
      resumeData = fallbackGenerateResume(jdText, targetRole, targetCompany);
    }

    // Quality check enforcement (Section 15: Final Quality Check)
    // 1. Ensure contact info is exact
    resumeData.name = 'Cody Ulsch';
    resumeData.contact = {
      email: 'codyh.ulsch.work@gmail.com',
      phone: '+1(720)-970-4896',
      location: '810 Francis Halethorpe MD',
      ...(resumeData.contact?.website ? { website: resumeData.contact.website } : {}),
    };

    // 2. Validate bullet counts (BairesDev: 12, Cognizant: 10, Capital One: 8)
    if (Array.isArray(resumeData.experience)) {
      resumeData.experience.forEach((job: any) => {
        const compLower = (job.company || '').toLowerCase();
        if (compLower.includes('baires')) {
          if (!job.bullets) job.bullets = [];
          if (job.bullets.length > 12) job.bullets = job.bullets.slice(0, 12);
        } else if (compLower.includes('cognizant')) {
          if (!job.bullets) job.bullets = [];
          if (job.bullets.length > 10) job.bullets = job.bullets.slice(0, 10);
        } else if (compLower.includes('capital')) {
          if (!job.bullets) job.bullets = [];
          if (job.bullets.length > 8) job.bullets = job.bullets.slice(0, 8);
        }
      });
    }

    // 3. Deduplicate skills and limit to 20-30
    if (Array.isArray(resumeData.skills)) {
      const uniqueSkills = Array.from(new Set(resumeData.skills.map((s: string) => s.trim()))).filter(Boolean);
      resumeData.skills = uniqueSkills.slice(0, 30);
    }

    // 4. Ensure certifications section is deleted
    resumeData.certifications = [];

    return res.json(resumeData);
  } catch (error: any) {
    console.error('Error generating tailored resume:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate tailored resume.' });
  }
});

// 4. Batch Process Multiple JDs
app.post('/api/batch-process', async (req: Request, res: Response) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items array must not be empty.' });
    }

    // Limit batch size to protect resources
    const maxBatch = 5;
    const toProcess = items.slice(0, maxBatch);

    const results = [];

    for (const item of toProcess) {
      const textToUse = item.text || '';
      if (!textToUse || textToUse.length < 20) {
        results.push({
          id: item.id || Math.random().toString(),
          title: item.title || 'Untitled JD',
          success: false,
          error: 'No valid JD text provided for this item.',
        });
        continue;
      }

      try {
        // Generate tailored resume & cover letter
        const prompt = `AUTHENTIC SENIOR SOFTWARE ENGINEER RESUME GENERATOR — CODY ULSCH
Create a realistic, ATS-friendly Senior Software Engineer resume for Cody Ulsch tailored to this JD.
Contact: Cody Ulsch, codyh.ulsch.work@gmail.com, +1(720)-970-4896, 810 Francis Halethorpe MD.
Format: **Technical Area (JD-Aligned Key Stack) —** concise engineering description with **strong skills** and **action verbs** in BOLD.
Progression: BairesDev (12 bullets), Cognizant (10 bullets), Capital One (8 bullets).
Skills: 20-30 unique skills.
Summary: 5-6 concise sentences with core technologies bolded.
Cover Letter: Human, senior-level tailored letter.

JOB DESCRIPTION:
${textToUse.slice(0, 10000)}`;

        const response = await generateContentWithRetry({
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                title: { type: Type.STRING },
                contact: {
                  type: Type.OBJECT,
                  properties: {
                    email: { type: Type.STRING },
                    phone: { type: Type.STRING },
                    location: { type: Type.STRING },
                  },
                },
                summary: { type: Type.STRING },
                experience: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      company: { type: Type.STRING },
                      role: { type: Type.STRING },
                      period: { type: Type.STRING },
                      location: { type: Type.STRING },
                      bullets: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                  },
                },
                skills: { type: Type.ARRAY, items: { type: Type.STRING } },
                education: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      school: { type: Type.STRING },
                      degree: { type: Type.STRING },
                      period: { type: Type.STRING },
                    },
                  },
                },
                coverLetter: {
                  type: Type.OBJECT,
                  properties: {
                    recipient: { type: Type.STRING },
                    company: { type: Type.STRING },
                    date: { type: Type.STRING },
                    body: { type: Type.STRING },
                  },
                },
              },
            },
          },
        });

        const resumeData = JSON.parse(response.text || '{}');
        resumeData.name = 'Cody Ulsch';
        resumeData.contact = {
          email: 'codyh.ulsch.work@gmail.com',
          phone: '+1(720)-970-4896',
          location: '810 Francis Halethorpe MD',
        };
        resumeData.certifications = [];

        results.push({
          id: item.id,
          title: item.title || resumeData.title || 'Senior Software Engineer',
          company: item.company || resumeData.coverLetter?.company || 'Hiring Company',
          success: true,
          resumeData,
        });
      } catch {
        try {
          const fallbackData = fallbackGenerateResume(textToUse, item.title, item.company);
          results.push({
            id: item.id,
            title: item.title || fallbackData.title || 'Senior Software Engineer',
            company: item.company || fallbackData.coverLetter?.company || 'Hiring Company',
            success: true,
            resumeData: fallbackData,
          });
        } catch (fbErr: any) {
          results.push({
            id: item.id,
            title: item.title || 'Untitled',
            success: false,
            error: fbErr?.message || 'Failed to process item.',
          });
        }
      }
    }

    return res.json({ results });
  } catch (error: any) {
    console.error('Batch error:', error);
    return res.status(500).json({ error: error.message || 'Batch processing failed.' });
  }
});

// Vite dev server integration or static file serving
if (process.env.NODE_ENV !== 'production') {
  const vite = await createViteServer({
    server: {
      middlewareMode: true,
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

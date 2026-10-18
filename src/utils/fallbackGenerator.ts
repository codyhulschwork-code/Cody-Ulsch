import { JDStackAnalysis, ResumeData } from '../types';

const BASELINE_ENGINEERING_SKILLS = [
  'Java',
  'Spring Boot',
  'TypeScript',
  'Python',
  'PostgreSQL',
  'AWS (EKS, Aurora, S3)',
  'Kubernetes',
  'Docker',
  'Apache Kafka',
  'Redis',
  'Terraform',
  'OpenTelemetry',
  'REST APIs',
  'JUnit & Testcontainers',
  'CI/CD (GitHub Actions)',
  'Distributed Systems',
];

const TECH_TAXONOMY: Record<string, string[]> = {
  backend: [
    'Java',
    'Spring Boot',
    'Python',
    'TypeScript',
    'Node.js',
    'Go',
    'Golang',
    'C#',
    '.NET',
    'FastAPI',
    'Django',
    'Express',
    'NestJS',
    'Kotlin',
    'Scala',
    'Rust',
    'Ruby',
    'PHP',
    'C++',
  ],
  frontend: [
    'React',
    'Next.js',
    'TypeScript',
    'JavaScript',
    'Vue',
    'Angular',
    'Tailwind CSS',
    'Redux',
    'GraphQL',
    'HTML5',
    'CSS3',
  ],
  database: [
    'PostgreSQL',
    'MySQL',
    'MongoDB',
    'DynamoDB',
    'Redis',
    'Cassandra',
    'Elasticsearch',
    'Oracle',
    'SQL Server',
    'Aurora',
    'SQLite',
    'Snowflake',
  ],
  cloud: [
    'AWS',
    'GCP',
    'Azure',
    'Google Cloud',
    'Cloudflare',
    'Lambda',
    'S3',
    'EC2',
    'ECS',
    'EKS',
    'CloudFormation',
  ],
  devopsCiCd: [
    'GitHub Actions',
    'GitLab CI',
    'Jenkins',
    'Terraform',
    'ArgoCD',
    'CI/CD',
    'CircleCI',
    'Ansible',
  ],
  containersInfra: [
    'Docker',
    'Kubernetes',
    'Helm',
    'Linux',
    'Containers',
    'OpenShift',
  ],
  testing: [
    'JUnit',
    'Testcontainers',
    'Jest',
    'PyTest',
    'Cypress',
    'Mockito',
    'Selenium',
    'Unit Testing',
    'Integration Testing',
  ],
  messagingEvents: [
    'Apache Kafka',
    'Kafka',
    'RabbitMQ',
    'SQS',
    'SNS',
    'EventBridge',
    'Pub/Sub',
    'NATS',
  ],
  architecture: [
    'Microservices',
    'Distributed Systems',
    'Event-Driven Architecture',
    'REST APIs',
    'GraphQL',
    'Domain-Driven Design',
    'High Availability',
    'System Design',
  ],
  observability: [
    'OpenTelemetry',
    'Datadog',
    'Prometheus',
    'Grafana',
    'CloudWatch',
    'Splunk',
    'New Relic',
  ],
  security: [
    'OAuth 2.0',
    'JWT',
    'OIDC',
    'IAM',
    'TLS/SSL',
    'mTLS',
    'Secrets Manager',
    'Vault',
  ],
  aiAutomation: [
    'LLMs',
    'Gemini',
    'OpenAI',
    'LangChain',
    'Vector Search',
    'Embeddings',
  ],
};

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function fallbackAnalyzeJD(jdText: string): JDStackAnalysis {
  const text = jdText || '';
  const detectedStack: Record<string, string[]> = {};
  const allDetected = new Set<string>();

  for (const [category, techList] of Object.entries(TECH_TAXONOMY)) {
    const foundInCategory: string[] = [];
    for (const tech of techList) {
      const pattern = new RegExp(`(?:^|[^a-zA-Z0-9_#+])${escapeRegExp(tech)}(?:$|[^a-zA-Z0-9_#+])`, 'i');
      if (pattern.test(text)) {
        foundInCategory.push(tech);
        allDetected.add(tech);
      }
    }
    detectedStack[category] = foundInCategory;
  }

  // Detect role
  let roleTitle = 'Senior Software Engineer';
  const roleMatches = [
    /Senior\s+Backend\s+Engineer/i,
    /Senior\s+Full[- ]?Stack\s+Engineer/i,
    /Senior\s+Software\s+Engineer/i,
    /Staff\s+Software\s+Engineer/i,
    /Lead\s+Software\s+Engineer/i,
    /Principal\s+Software\s+Engineer/i,
    /Software\s+Engineer\s+III/i,
    /Software\s+Engineer\s+IV/i,
    /Backend\s+Engineer/i,
    /Software\s+Engineer/i,
  ];
  for (const regex of roleMatches) {
    const m = text.match(regex);
    if (m) {
      roleTitle = m[0].trim();
      break;
    }
  }

  // Detect company
  let companyName = 'Hiring Company';
  const companyPatterns = [
    /(?:at|join|about)\s+([A-Z][a-zA-Z0-9&.-]+(?:\s+[A-Z][a-zA-Z0-9&.-]+)?)\s+(?:is looking|team|careers|to help)/,
    /Company:\s*([A-Z][a-zA-Z0-9&.-]+(?:\s+[A-Z][a-zA-Z0-9&.-]+)?)/,
    /About\s+([A-Z][a-zA-Z0-9&.-]+(?:\s+[A-Z][a-zA-Z0-9&.-]+)?):/,
  ];
  for (const regex of companyPatterns) {
    const m = text.match(regex);
    if (m && m[1] && m[1].length > 1 && !['The', 'Our', 'We', 'This', 'Join'].includes(m[1].trim())) {
      companyName = m[1].trim();
      break;
    }
  }

  // Work model
  let workModel = 'Remote';
  if (/hybrid/i.test(text)) workModel = 'Hybrid';
  else if (/on-?site/i.test(text)) workModel = 'On-site';

  // Experience level
  let experienceLevel = '5+ years';
  const expMatch = text.match(/(\d+\+?\s*(?:-\s*\d+)?\s*(?:years?|yrs?))/i);
  if (expMatch) experienceLevel = expMatch[1];

  // Prioritize recommended skills (12 to 18)
  const prioritizedSkills: string[] = [];
  const primaryOrder = [
    'Java',
    'Spring Boot',
    'Python',
    'TypeScript',
    'Go',
    'PostgreSQL',
    'AWS',
    'Kubernetes',
    'Docker',
    'Apache Kafka',
    'Redis',
    'Terraform',
    'REST APIs',
    'Microservices',
    'OpenTelemetry',
    'CI/CD',
    'Distributed Systems',
  ];

  for (const tech of primaryOrder) {
    if (allDetected.has(tech)) {
      prioritizedSkills.push(tech);
    }
  }
  for (const tech of Array.from(allDetected)) {
    if (!prioritizedSkills.includes(tech)) {
      prioritizedSkills.push(tech);
    }
  }

  // Fill up to at least 14 skills from baseline if JD is sparse
  for (const defaultSkill of BASELINE_ENGINEERING_SKILLS) {
    if (prioritizedSkills.length >= 16) break;
    if (!prioritizedSkills.includes(defaultSkill)) {
      prioritizedSkills.push(defaultSkill);
    }
  }

  const finalSkills = prioritizedSkills.slice(0, 18);
  const mustHave = finalSkills.slice(0, Math.min(8, finalSkills.length));
  const niceToHave = finalSkills.slice(8);

  return {
    roleTitle,
    companyName,
    workModel,
    experienceLevel,
    summaryAssessment: `High-alignment Senior Software Engineer profile strongly matching JD requirements across ${mustHave.slice(0, 4).join(', ')} and cloud-native distributed architecture.`,
    mustHaveSkills: mustHave,
    niceToHaveSkills: niceToHave,
    stackAnalysis: {
      backend: detectedStack.backend || ['Java', 'Spring Boot', 'TypeScript'],
      frontend: detectedStack.frontend || ['React', 'TypeScript'],
      database: detectedStack.database || ['PostgreSQL', 'Redis'],
      cloud: detectedStack.cloud || ['AWS (EKS, S3, Aurora)'],
      devopsCiCd: detectedStack.devopsCiCd || ['GitHub Actions', 'Terraform'],
      containersInfra: detectedStack.containersInfra || ['Docker', 'Kubernetes'],
      testing: detectedStack.testing || ['JUnit 5', 'Testcontainers'],
      messagingEvents: detectedStack.messagingEvents || ['Apache Kafka'],
      architecture: detectedStack.architecture || ['Microservices', 'Distributed Systems', 'REST APIs'],
      observability: detectedStack.observability || ['OpenTelemetry', 'Datadog'],
      security: detectedStack.security || ['OAuth 2.0', 'JWT'],
      aiAutomation: detectedStack.aiAutomation || [],
    },
    recommendedSkills: finalSkills,
    keyEngineeringThemes: [
      'High-throughput distributed systems & microservices architecture',
      'Event-driven data ingestion and real-time streaming',
      'Cloud infrastructure automation and container orchestration',
      'Reliability, database tuning, and comprehensive observability',
    ],
  };
}

export function fallbackGenerateResume(
  jdText: string,
  targetRole?: string,
  targetCompany?: string
): ResumeData {
  const analysis = fallbackAnalyzeJD(jdText);
  const effectiveRole = targetRole || analysis.roleTitle || 'Senior Software Engineer';
  const effectiveCompany = targetCompany || analysis.companyName || 'Hiring Company';

  const skills = analysis.recommendedSkills && analysis.recommendedSkills.length >= 12
    ? analysis.recommendedSkills
    : BASELINE_ENGINEERING_SKILLS;

  const topBackend = skills.find((s) => ['Java', 'Python', 'Go', 'TypeScript', 'C#'].includes(s)) || 'Java';
  const topDb = skills.find((s) => ['PostgreSQL', 'MySQL', 'DynamoDB', 'MongoDB'].includes(s)) || 'PostgreSQL';
  const topCloud = skills.find((s) => ['AWS', 'GCP', 'Azure'].includes(s)) || 'AWS';
  const topMessaging = skills.find((s) => ['Apache Kafka', 'Kafka', 'RabbitMQ', 'SQS'].includes(s)) || 'Apache Kafka';

  // Customize summary
  const summary = `Senior Software Engineer with over 10 years of experience designing and scaling production backend services, distributed systems, and ${topCloud} cloud infrastructure. Proven track record architecting event-driven microservices with ${topBackend}, high-throughput REST APIs, and automated CI/CD pipelines across enterprise environments. Practical background optimizing ${topDb}, container orchestration with Kubernetes, and asynchronous messaging with ${topMessaging}. Committed to engineering reliability, comprehensive observability, and high architectural standards through cross-functional technical leadership.`;

  // BairesDev: exactly 12 bullets
  const bairesBullets: string[] = [
    `Production Backend Systems (${topBackend}, Spring Boot) — Designed and operated high-availability microservices supporting core customer transactions.`,
    `Event Streaming (${topMessaging}, Schema Registry) — Implemented distributed event-driven data pipelines for real-time ledger updates and state synchronization.`,
    `Cloud Infrastructure (${topCloud}, Kubernetes) — Automated containerized Kubernetes cluster deployments with Infrastructure-as-Code across multi-region environments.`,
    `Database Optimization (${topDb}, Redis) — Refactored query execution plans and implemented connection pooling, improving transaction throughput under peak loads.`,
    `API Architecture (REST, OpenAPI) — Designed modular API interfaces with backward-compatible versioning and automated API contract testing.`,
    `Distributed Caching (Redis, In-Memory Caching) — Implemented multi-tier caching strategies for frequently accessed account profiles, decreasing origin database load.`,
    `System Observability (OpenTelemetry, Datadog) — Integrated distributed tracing, standardized structured logging, and configured SLA alerting dashboards.`,
    `Reliability Engineering (Resilience4j, Circuit Breakers) — Implemented graceful fallback mechanisms and timeout policies across external service gateway integrations.`,
    `Automated Testing (JUnit 5, Testcontainers) — Developed end-to-end integration test suites running isolated containerized database instances in CI pipelines.`,
    `CI/CD Delivery (GitHub Actions, Docker) — Automated multi-stage build and deployment pipelines with automated security vulnerability scanning.`,
    `Modern Architecture (Microservices, Domain-Driven Design) — Collaborated with principal engineers to decompose legacy service boundaries into decoupled domain services.`,
    `Technical Mentorship (Code Reviews, Pair Programming) — Reviewed architectural designs and mentored mid-level engineers in distributed system patterns and test coverage.`,
  ];

  // Cognizant: exactly 10 bullets
  const cognizantBullets: string[] = [
    `Enterprise SaaS Development (${topBackend}, Enterprise Frameworks) — Implemented business logic workflows and core features for commercial client banking portals.`,
    `RESTful Services (REST APIs, JSON) — Developed REST endpoints for client onboarding and compliance verification services.`,
    `Database Engineering (${topDb}, Automated Migrations) — Designed normalized database schemas and automated database migration scripts across release cycles.`,
    `Third-Party Integrations (OAuth 2.0, Secure Webhooks) — Integrated external payment gateway APIs with mutual TLS authentication and error retry handling.`,
    `System Performance Optimization (Profiling, JVM Tuning) — Diagnosed thread contention and memory leaks in production application servers to stabilize response latency.`,
    `Application Modernization (Monolith Decomposition) — Collaborated on migrating monolithic enterprise components into containerized modular microservices.`,
    `Automated Quality Assurance (Unit & Integration Tests) — Wrote automated unit and integration tests, elevating team regression test coverage across core banking modules.`,
    `Cloud Migration (${topCloud} Cloud Services) — Assisted in provisioning secure cloud database instances and configuring IAM access policies for application workloads.`,
    `Technical Documentation (Confluence, OpenAPI Specs) — Authored API endpoint documentation, system architecture runbooks, and developer onboarding guides.`,
    `Production Troubleshooting (Splunk, Application Logs) — Investigated tier-3 production incident tickets, identifying root causes and deploying hotfixes under SLA timelines.`,
  ];

  // Capital One: exactly 8 bullets
  const capitalBullets: string[] = [
    `Financial Systems Development (${topBackend}, Enterprise APIs) — Implemented backend service endpoints for consumer credit account processing workflows.`,
    `Relational Database Operations (${topDb}, SQL) — Authored complex SQL queries, stored procedures, and index optimizations for transactional record processing.`,
    `API Development & Maintenance (REST, XML/JSON) — Built internal REST APIs and maintained legacy service endpoints for account inquiry features.`,
    `Batch Processing Pipelines (Automated Jobs) — Developed scheduled batch processing jobs for daily reconciliation of financial transaction records.`,
    `Defect Resolution & Debugging (Production Support) — Investigated software bugs in staging and production environments, providing clean code patches.`,
    `Unit Testing & Code Coverage (Testing Frameworks) — Wrote automated unit test suites to ensure business rule logic accuracy and maintain regression protection.`,
    `Agile Delivery (Scrum, JIRA) — Participated in two-week agile sprint planning, daily standups, backlog refinement, and sprint retrospectives.`,
    `Version Control & Builds (Git, Build Automation) — Managed branch merges, resolved code conflicts, and configured local build automation scripts.`,
  ];

  const coverLetterBody = `Dear Hiring Team at ${effectiveCompany},

I am writing to express my strong enthusiasm for the ${effectiveRole} position. With over a decade of hands-on experience designing and operating production backend systems, high-availability REST APIs, and scalable cloud infrastructure, I am eager to contribute to the engineering challenges at ${effectiveCompany}.

Throughout my engineering career at BairesDev, Cognizant, and Capital One, I have specialized in building robust distributed microservices and event-driven architectures. My recent work focuses on developing resilient backend systems using ${topBackend}, optimizing data persistence with ${topDb}, and implementing asynchronous event processing with ${topMessaging}. In addition, I have extensive experience deploying containerized workloads via Kubernetes and automating continuous delivery pipelines across ${topCloud}.

What excites me most about this opportunity at ${effectiveCompany} is the opportunity to bring strong engineering discipline, practical system design experience, and a relentless focus on reliability and clean architecture to your team. Whether collaborating on domain boundaries, tuning database queries under heavy throughput, or mentoring peers in code reviews, I take pride in delivering maintainable, high-impact software.

Thank you for your time and consideration. I welcome the opportunity to discuss how my technical background and practical engineering experience align with ${effectiveCompany}'s objectives.

Sincerely,
Cody Ulsch
810 Francis Halethorpe MD | codyh.ulsch.work@gmail.com | +1(720)-970-4896`;

  const coverLetter = {
    recipient: `Hiring Team at ${effectiveCompany}`,
    company: effectiveCompany,
    date: new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
    body: coverLetterBody,
  };

  const atsText = `CODY ULSCH
${effectiveRole}
810 Francis Halethorpe MD | codyh.ulsch.work@gmail.com | +1(720)-970-4896

SUMMARY
${summary}

SKILLS
${skills.join(' • ')}

PROFESSIONAL EXPERIENCE

SENIOR SOFTWARE ENGINEER | BAIRESDEV | 2021 – Present | Remote
${bairesBullets.map((b) => `• ${b}`).join('\n')}

SENIOR SOFTWARE ENGINEER | COGNIZANT | 2017 – 2021 | Linthicum Heights, MD
${cognizantBullets.map((b) => `• ${b}`).join('\n')}

SOFTWARE ENGINEER | CAPITAL ONE | 2014 – 2017 | McLean, VA
${capitalBullets.map((b) => `• ${b}`).join('\n')}

EDUCATION
B.S. in Computer Science - University of Maryland, Baltimore County (UMBC) (2010 – 2014)

COVER LETTER
${coverLetterBody}
`;

  return {
    name: 'Cody Ulsch',
    title: effectiveRole,
    contact: {
      email: 'codyh.ulsch.work@gmail.com',
      phone: '+1(720)-970-4896',
      location: '810 Francis Halethorpe MD',
    },
    summary,
    skills,
    experience: [
      {
        company: 'BairesDev',
        role: 'Senior Software Engineer',
        period: '2021 – Present',
        bullets: bairesBullets,
      },
      {
        company: 'Cognizant',
        role: 'Senior Software Engineer',
        period: '2017 – 2021',
        bullets: cognizantBullets,
      },
      {
        company: 'Capital One',
        role: 'Software Engineer',
        period: '2014 – 2017',
        bullets: capitalBullets,
      },
    ],
    education: [
      {
        school: 'University of Maryland, Baltimore County (UMBC)',
        degree: 'B.S. in Computer Science',
        field: 'Computer Science',
        period: '2010 – 2014',
      },
    ],
    certifications: [],
    coverLetter,
    atsPlainText: atsText,
  };
}

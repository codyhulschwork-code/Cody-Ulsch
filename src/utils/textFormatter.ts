export interface FormattedToken {
  text: string;
  isBold: boolean;
}

export const ACTION_KEYWORDS: string[] = [
  'Architected',
  'Engineered',
  'Designed',
  'Developed',
  'Implemented',
  'Optimized',
  'Maintained',
  'Automated',
  'Integrated',
  'Refactored',
  'Scaled',
  'Deployed',
  'Modernized',
  'Streamlined',
  'Authored',
  'Provisioned',
  'Containerized',
  'Benchmarked',
  'Configured',
  'Orchestrated',
  'Overhauled',
  'Migrated',
  'Monitored',
  'Reviewed',
  'Spearheaded',
  'Built',
  'Led',
  'Constructed',
  'Formulated',
  'Mentored',
  'Diagnosed',
  'Investigated',
  'Decoupled',
  'Hardened',
  'Standardized',
  'Established',
  'Delivered',
  'Resolved',
  'Accelerated',
  'Consolidated',
  'Pioneered',
  'Architecting',
  'Engineering',
  'Designing',
  'Developing',
  'Implementing',
  'Optimizing',
  'Automating',
  'Integrating',
  'Scaling',
  'Deploying',
  'Refactoring',
  'Modernizing',
  'Leading',
  'Mentoring',
];

export const DEFAULT_STRONG_SKILLS: string[] = [
  'Python',
  'TypeScript',
  'JavaScript',
  'Java',
  'Golang',
  'Go',
  'Rust',
  'C++',
  'C#',
  'Spring Boot',
  'Spring Framework',
  'Spring',
  'Node.js',
  'Express',
  'FastAPI',
  'Django',
  'Flask',
  'React',
  'Next.js',
  'Vue',
  'Angular',
  'PostgreSQL',
  'Postgres',
  'MySQL',
  'MongoDB',
  'Redis',
  'Elasticsearch',
  'Cassandra',
  'DynamoDB',
  'Aurora',
  'SQLite',
  'AWS',
  'EKS',
  'ECS',
  'S3',
  'EC2',
  'Lambda',
  'RDS',
  'IAM',
  'CloudFront',
  'GCP',
  'Google Cloud',
  'Azure',
  'Kubernetes',
  'Docker',
  'Terraform',
  'Helm',
  'Ansible',
  'Apache Kafka',
  'Kafka',
  'RabbitMQ',
  'EventBridge',
  'SQS',
  'SNS',
  'OpenTelemetry',
  'Datadog',
  'Prometheus',
  'Grafana',
  'Splunk',
  'CloudWatch',
  'REST APIs',
  'RESTful APIs',
  'REST API',
  'REST',
  'GraphQL',
  'gRPC',
  'OpenAPI',
  'Swagger',
  'CI/CD',
  'GitHub Actions',
  'GitLab CI',
  'Jenkins',
  'GitOps',
  'Microservices',
  'Distributed Systems',
  'Event-Driven Architecture',
  'Domain-Driven Design',
  'OAuth 2.0',
  'OAuth',
  'JWT',
  'mTLS',
  'JUnit 5',
  'JUnit',
  'Testcontainers',
  'Mockito',
  'PyTest',
  'Jest',
  'Linux',
  'Git',
  'SQL',
  'NoSQL',
  'Kafka Streams',
  'System Design',
];

/**
 * Scans plain text segments and highlights action verbs and strong skills with isBold: true.
 */
function highlightKeywordsInText(
  plainText: string,
  keywords: string[]
): FormattedToken[] {
  if (!plainText || keywords.length === 0) {
    return [{ text: plainText, isBold: false }];
  }

  const escaped = keywords.map((k) =>
    k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  );
  // Match with boundary checking that supports words starting/ending with word characters
  const regex = new RegExp(
    `(?:^|(?<=[^a-zA-Z0-9_]))(${escaped.join('|')})(?=[^a-zA-Z0-9_]|$)`,
    'gi'
  );

  const tokens: FormattedToken[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(plainText)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({
        text: plainText.slice(lastIndex, match.index),
        isBold: false,
      });
    }
    tokens.push({
      text: match[0],
      isBold: true,
    });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < plainText.length) {
    tokens.push({
      text: plainText.slice(lastIndex),
      isBold: false,
    });
  }

  return tokens.filter((t) => t.text.length > 0);
}

/**
 * Parses resume bullets and summaries into bold / regular formatted tokens.
 * Guarantees that:
 * 1. Markdown **bold** lead-ins are parsed as bold.
 * 2. Unmarked bullet lead-ins ("Category — ") are parsed as bold.
 * 3. Strong skills and action keywords are highlighted as bold throughout all text.
 */
export function parseFormattedTokens(
  rawText: string,
  skills: string[] = []
): FormattedToken[] {
  if (!rawText) return [];

  // Compile combined keywords list sorted longest-first
  const cleanedSkills = (skills || [])
    .map((s) => s.trim())
    .filter((s) => s.length >= 2);

  const allKeywords = Array.from(
    new Set([...ACTION_KEYWORDS, ...DEFAULT_STRONG_SKILLS, ...cleanedSkills])
  )
    .filter((k) => Boolean(k) && k.length >= 2)
    .sort((a, b) => b.length - a.length);

  // 1. If text explicitly contains markdown **bold**, split and highlight unbolded parts
  if (rawText.includes('**')) {
    const parts = rawText.split(/\*\*(.*?)\*\*/g);
    const tokens: FormattedToken[] = [];
    for (let i = 0; i < parts.length; i++) {
      if (!parts[i]) continue;
      if (i % 2 === 1) {
        tokens.push({
          text: parts[i],
          isBold: true,
        });
      } else {
        tokens.push(...highlightKeywordsInText(parts[i], allKeywords));
      }
    }
    return tokens;
  }

  // 2. Identify bullet lead-in: "Technical Area (Key Stack) — " or "Technical Area: "
  const dashMatch = rawText.match(/^(.*?)(—|--|:)(\s+.*)$/);
  if (dashMatch) {
    const leadIn = dashMatch[1] + dashMatch[2];
    const body = dashMatch[3];
    return [
      { text: leadIn, isBold: true },
      ...highlightKeywordsInText(body, allKeywords),
    ];
  }

  // 3. Regular text (e.g. summary or body paragraph)
  return highlightKeywordsInText(rawText, allKeywords);
}

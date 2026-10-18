import { ResumeData } from '../types';

export const MASTER_ENGINEERING_SKILLS = [
  'Python',
  'TypeScript',
  'Java',
  'Spring Boot',
  'PostgreSQL',
  'AWS (EKS, Aurora, S3)',
  'Kubernetes',
  'Docker',
  'Apache Kafka',
  'Redis',
  'Terraform',
  'OpenTelemetry',
  'REST APIs',
  'Microservices Architecture',
  'GraphQL',
  'React / Next.js',
  'Distributed Systems',
  'CI/CD (GitHub Actions)',
  'JUnit & Testcontainers',
  'SQL & Query Optimization',
  'OAuth 2.0 & IAM',
  'Elasticsearch',
  'System Design & Scalability',
  'Linux & Git',
];

export const INITIAL_CODY_RESUME: ResumeData = {
  name: 'Cody Ulsch',
  title: 'Senior Software Engineer',
  contact: {
    email: 'codyh.ulsch.work@gmail.com',
    phone: '+1(720)-970-4896',
    location: '810 Francis Halethorpe MD',
    website: 'linkedin.com/in/cody-ulsch',
  },
  summary:
    'Senior Software Engineer with over 10 years of experience designing, architecting, and scaling high-throughput distributed systems, event-driven microservices, and cloud infrastructure on AWS. Proven track record leading backend engineering initiatives, optimizing PostgreSQL database clusters, and deploying automated CI/CD pipelines with Docker and Kubernetes. Dedicated to engineering reliability, comprehensive observability with OpenTelemetry, and rigorous architectural standards across enterprise production environments.',
  skills: [
    'Python',
    'TypeScript',
    'Java',
    'Spring Boot',
    'PostgreSQL',
    'AWS (EKS, Aurora, S3)',
    'Kubernetes',
    'Docker',
    'Apache Kafka',
    'Redis',
    'Terraform',
    'OpenTelemetry',
    'REST APIs',
    'Microservices Architecture',
    'GraphQL',
    'React / Next.js',
    'Distributed Systems',
    'CI/CD (GitHub Actions)',
    'JUnit & Testcontainers',
    'SQL & Query Optimization',
    'OAuth 2.0 & IAM',
    'Elasticsearch',
    'System Design & Scalability',
    'Linux & Git',
  ],
  experience: [
    {
      company: 'BairesDev',
      role: 'Senior Software Engineer',
      period: '2021 – Present',
      location: 'Remote / 810 Francis Halethorpe MD',
      bullets: [
        '**Distributed Ingestion (Apache Kafka, Python) —** **Architected** high-throughput event streaming pipelines processing real-time ledger updates with zero data loss.',
        '**Cloud Infrastructure (AWS EKS, Terraform) —** **Automated** containerized multi-region Kubernetes deployments using Infrastructure-as-Code and declarative GitOps.',
        '**Backend Microservices (Spring Boot, Java) —** **Implemented** mission-critical banking microservices with strict transactional integrity and backward-compatible versioning.',
        '**Database Optimization (PostgreSQL, Redis) —** **Optimized** complex relational queries and configured multi-tier connection pooling, reducing peak latency.',
        '**API Gateway Architecture (REST APIs, OpenAPI) —** **Designed** modular public API interfaces with automated schema validation and contract testing.',
        '**System Observability (OpenTelemetry, Datadog) —** **Integrated** distributed tracing and standardized structured metrics dashboards across all production services.',
        '**Resilience Engineering (Resilience4j, Circuit Breakers) —** **Implemented** graceful degradation policies and automated retries across third-party payment endpoints.',
        '**Distributed Caching (Redis) —** **Engineered** cache-aside layers for high-volume customer authentication sessions, reducing database query pressure.',
        '**Automated Testing (JUnit 5, Testcontainers) —** **Constructed** automated integration test suites spinning up ephemeral containerized databases in CI.',
        '**CI/CD Automation (GitHub Actions, Docker) —** **Built** automated deployment pipelines with static security analysis and container vulnerability scanning.',
        '**Domain-Driven Modernization (Microservices) —** **Led** architectural domain boundary decomposition, splitting monolithic modules into scalable services.',
        '**Engineering Leadership (Mentorship, Code Reviews) —** **Mentored** mid-level engineers in distributed system patterns, concurrency, and clean architecture practices.',
      ],
    },
    {
      company: 'Cognizant',
      role: 'Senior Software Engineer',
      period: '2017 – 2021',
      location: 'Linthicum Heights, MD',
      bullets: [
        '**Enterprise SaaS Platforms (Java, Spring Boot) —** **Engineered** commercial client portal features and transactional business workflows under strict SLAs.',
        '**RESTful Service Delivery (REST APIs, JSON) —** **Developed** secure client onboarding and compliance verification microservices.',
        '**Database Engineering (PostgreSQL, Automated Migrations) —** **Designed** normalized relational database schemas and automated zero-downtime schema migrations.',
        '**Third-Party Integrations (OAuth 2.0, Secure Webhooks) —** **Integrated** external financial gateway APIs with mutual TLS encryption and idempotency keys.',
        '**Performance Tuning (JVM Profiling, Memory Optimization) —** **Diagnosed** thread contention bottlenecks and eliminated memory leaks in production application servers.',
        '**Monolith Modernization (Docker, Microservices) —** **Migrated** legacy enterprise monolithic services into containerized, independent deployment units.',
        '**Automated Quality Assurance (JUnit, Integration Tests) —** **Authored** comprehensive test suites, raising automated regression test coverage across core banking modules.',
        '**Cloud Platform Migration (AWS Cloud Services) —** **Provisioned** secure RDS PostgreSQL database clusters and configured IAM principle-of-least-privilege policies.',
        '**Technical Documentation (OpenAPI, Architecture Runbooks) —** **Authored** architectural runbooks, endpoint specifications, and onboarding documentation for engineering teams.',
        '**Production Troubleshooting (Splunk, Incident Response) —** **Investigated** tier-3 production incident alerts, identifying root causes and deploying hotfixes.',
      ],
    },
    {
      company: 'Capital One',
      role: 'Software Engineer',
      period: '2014 – 2017',
      location: 'McLean, VA',
      bullets: [
        '**Financial Systems Development (Java, Enterprise APIs) —** **Implemented** backend service endpoints for consumer credit account processing workflows.',
        '**Relational Database Development (PostgreSQL, SQL) —** **Authored** transactional SQL queries, stored procedures, and schema indexing for customer records.',
        '**Service Modernization (REST APIs) —** **Refactored** legacy SOAP endpoints into modern JSON-based REST APIs with comprehensive documentation.',
        '**Automated Build Pipelines (Maven, Jenkins) —** **Configured** automated continuous integration build scripts, cutting release packaging cycle times.',
        '**Application Security (OAuth 2.0, Encryption) —** **Integrated** cryptographic data masking and secure token validation for consumer financial data.',
        '**Defect Resolution & Debugging (Java, Production Support) —** **Resolved** critical defect tickets in transaction validation logic ahead of scheduled banking releases.',
        '**Unit Testing & Validation (JUnit, Mockito) —** **Wrote** unit test suites verifying edge-case data validations and business calculation correctness.',
        '**Cross-Functional Collaboration (Agile, Sprint Delivery) —** **Collaborated** with business analysts, QA automation engineers, and scrum leads to deliver quarterly sprint goals.',
      ],
    },
  ],
  education: [
    {
      school: 'University of Maryland, Baltimore County (UMBC)',
      degree: 'B.S.',
      field: 'Computer Science',
      period: '2010 – 2014',
      location: 'Baltimore, MD',
    },
  ],
  certifications: [],
  coverLetter: {
    recipient: 'Hiring Team',
    company: 'Target Company',
    date: 'October 13, 2026',
    body: `Dear Hiring Team,\n\nI am writing to express my strong interest in the Senior Software Engineer position. With over a decade of hands-on software engineering experience specializing in distributed systems, backend architectures, and scalable cloud solutions on AWS, I have consistently delivered robust, production-grade systems that support critical business operations.\n\nThroughout my career at BairesDev, Cognizant, and Capital One, I have architected high-throughput event streaming pipelines using Apache Kafka, built resilient microservices with Spring Boot and Python, and automated containerized deployments with Kubernetes and Docker. I take deep ownership of system reliability, database tuning with PostgreSQL, and automated test coverage across the full software lifecycle.\n\nI welcome the opportunity to discuss how my technical leadership and hands-on engineering background will contribute to your team's success.\n\nSincerely,\nCody Ulsch`,
  },
  atsPlainText: '',
};

/**
 * Empty resume template where all content sections
 * (summary, skills, experience, education, certifications, cover letter) are cleared.
 */
export const EMPTY_RESUME: ResumeData = {
  name: 'Cody Ulsch',
  title: 'Senior Software Engineer',
  contact: {
    email: 'codyh.ulsch.work@gmail.com',
    phone: '+1(720)-970-4896',
    location: '810 Francis Halethorpe MD',
    website: 'linkedin.com/in/cody-ulsch',
  },
  summary: '',
  skills: [],
  experience: [],
  education: [],
  certifications: [],
  coverLetter: {
    recipient: '',
    company: '',
    date: '',
    body: '',
  },
  atsPlainText: '',
};

/**
 * Creates an empty resume while optionally preserving contact information.
 */
export function createEmptySectionsResume(
  preserveContact = true,
  existingData?: ResumeData
): ResumeData {
  return {
    name: preserveContact && existingData?.name ? existingData.name : 'Cody Ulsch',
    title: preserveContact && existingData?.title ? existingData.title : 'Senior Software Engineer',
    contact: preserveContact && existingData?.contact ? { ...existingData.contact } : {
      email: 'codyh.ulsch.work@gmail.com',
      phone: '+1(720)-970-4896',
      location: '810 Francis Halethorpe MD',
      website: 'linkedin.com/in/cody-ulsch',
    },
    summary: '',
    skills: [],
    experience: [],
    education: [],
    certifications: [],
    coverLetter: {
      recipient: '',
      company: '',
      date: '',
      body: '',
    },
    atsPlainText: '',
  };
}

-- Starter job descriptions. Inserted as DRAFTS (is_published = false):
-- review, edit and publish real openings from Admin → Jobs.
insert into public.jobs (slug, title, department, location, employment_type, experience, summary, responsibilities, requirements, is_published) values
('senior-software-developer', 'Senior Software Developer (Java / React)', 'Engineering', 'Remote (US)', 'Full-time', '6+ years',
 'Design and build secure, scalable web applications and APIs for enterprise clients, working across the stack with product owners and QA.',
 array['Design, build and maintain services in Java / Spring Boot and front ends in React','Develop integrations with third-party systems and maintain existing ones','Write automated tests and take part in code reviews','Work with DevOps to ship through CI/CD pipelines'],
 array['6+ years of professional software development','Strong Java, Spring Boot, REST and SQL skills','Hands-on React / TypeScript experience','Familiarity with AWS or Azure and Git-based workflows'], false),

('salesforce-technical-architect', 'Salesforce Technical Architect', 'Enterprise Applications', 'Hybrid — Dallas, TX', 'Contract', '10+ years',
 'Own the technical design of multi-cloud Salesforce programs, from data model and integration patterns to release management.',
 array['Lead solution design across Sales, Service and Experience Cloud','Define integration architecture with ERP and data platforms','Set coding standards and mentor developers','Guide CI/CD using Salesforce DX and Git'],
 array['10+ years in Salesforce delivery, 3+ as architect','Application or System Architect certification (CTA a plus)','Strong Apex, LWC and integration experience','Excellent problem-solving and stakeholder communication'], false),

('information-systems-analyst', 'Information Systems Analyst', 'Consulting', 'Remote (US)', 'Full-time', '3+ years',
 'Translate business needs into clear system requirements and help teams deliver the right solution the first time.',
 array['Run requirement workshops and document user stories','Map current and future-state processes','Support UAT planning and defect triage','Produce reports and dashboards for stakeholders'],
 array['3+ years as a business or systems analyst','Strong SQL and data analysis skills','Experience with Jira / Confluence','Clear written and verbal communication'], false),

('computer-systems-architect', 'Computer Systems Engineer / Architect', 'Infrastructure', 'Onsite — Miami, FL', 'Full-time', '8+ years',
 'Plan and evolve hybrid cloud infrastructure with a focus on reliability, security and cost.',
 array['Design cloud and on-prem infrastructure for new workloads','Automate provisioning with Terraform / Ansible','Define monitoring, backup and DR strategies','Partner with security on hardening and compliance'],
 array['8+ years in systems engineering','Deep AWS or Azure experience','Infrastructure-as-code and Linux expertise','Relevant certifications preferred'], false),

('workday-hcm-consultant', 'Workday HCM Consultant', 'Enterprise Applications', 'Remote (US)', 'Contract-to-hire', '5+ years',
 'Configure and optimize Workday HCM modules for mid-size and enterprise clients.',
 array['Configure Core HCM, Absence and Benefits','Lead data conversion and testing cycles','Build reports and calculated fields','Support go-live and hypercare'],
 array['5+ years Workday HCM experience','Experience in Core HR, Payroll, Benefits or Absence','Workday certification preferred','Experience on large-scale implementations'], false),

('data-engineer', 'Data Engineer', 'Data & AI', 'Hyderabad, India', 'Full-time', '4+ years',
 'Build reliable data pipelines and models that power analytics and AI products.',
 array['Develop batch and streaming pipelines','Model data in a cloud warehouse','Implement data quality checks and observability','Collaborate with analysts and ML engineers'],
 array['4+ years in data engineering','Python and advanced SQL','Experience with Spark, dbt or Airflow','Snowflake, BigQuery or Databricks exposure'], false)
on conflict (slug) do nothing;

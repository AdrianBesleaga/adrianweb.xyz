const experiences = [
    {
        title: 'Founder & Chief Everything Officer',
        company: 'Piwi.ai',
        period: 'Present',
        description:
            'Building a scalable and affordable Intelligent Document Processing (IDP) solution for small and medium businesses. Sole developer and founder, handling everything from business to engineering \u2014 both online SaaS and offline privacy-first editions.',
        highlights: [
            'Online SaaS platform and 100% offline edition with local AI',
            'Open-sourcing business configuration: document types, entities, validation & extraction logic',
            'Privacy-first \u2014 no data leaves the user\u2019s device',
            'Full-stack: React + TypeScript frontend, Node.js + Java backend, AWS infrastructure',
        ],
    },
    {
        title: 'Senior Full-Stack Consultant',
        company: 'Nuxeo (Maretha.io)',
        period: '3+ years',
        description:
            'Worked on Digital Asset Management (DAM) solutions and AI-powered features within the Nuxeo platform \u2014 a leading enterprise content management system.',
        highlights: [
            'DAM platform development with Java, Elasticsearch, and cloud services',
            'AI integration for intelligent content processing and enrichment',
            'Enterprise-grade architecture serving large-scale deployments',
        ],
    },
    {
        title: 'Back End Developer (Java)',
        company: 'KONUX',
        period: '2020 \u2013 2022',
        description:
            'Built cloud-native microservices for an industrial IoT platform, working with AWS, Java 15, Spring Framework, and domain-driven design.',
        highlights: [
            'Microservices architecture with Spring Boot and DDD',
            'AWS cloud infrastructure and Docker containerization',
            'Elasticsearch and Redis/RedisGraph for data and search',
        ],
    },
    {
        title: 'Software Developer',
        company: 'ifap Service-Institut',
        period: '2019 \u2013 2020',
        description:
            'Developed Java microservices with hexagonal architecture in the healthcare domain, working with FHIR interoperability standards.',
        highlights: [
            'Java microservices with hexagonal (ports & adapters) architecture',
            'FHIR healthcare interoperability standards',
            'Elasticsearch and Spring Framework',
        ],
    },
    {
        title: 'Java Developer',
        company: 'CGM (CompuGroup Medical)',
        period: '2015 – 2019',
        description: 'Java development in the healthcare software industry.',
        highlights: [
            'Java microservices and Elasticsearch',
            'FHIR healthcare interoperability standards',
        ],
    },
    {
        title: 'Solo Developer & Founder',
        company: 'Freelance',
        period: '2012 – 2015',
        description:
            'Built and maintained a PHP-based SEO platform with 100K+ active users and a WooCommerce e-commerce shop — sole developer handling everything from dedicated server administration to production maintenance.',
        highlights: [
            'PHP SEO platform serving 100K+ users on dedicated servers',
            'WooCommerce e-commerce shop — full lifecycle ownership',
            'Hands-on production ops: server management, deployments, and plenty of unslept nights',
            'Foundational programming experience and deep lessons from real-world issues with live users',
        ],
    },
]

function ExperienceCard({ exp }) {
    return (
        <div className="experience-card">
            <div className="experience-header">
                <h3>{exp.title}</h3>
                <span className="experience-meta">
                    {exp.company}
                    {exp.period && <> &middot; {exp.period}</>}
                </span>
            </div>
            <p>{exp.description}</p>
            {exp.highlights && exp.highlights.length > 0 && (
                <ul className="experience-highlights">
                    {exp.highlights.map((h, i) => (
                        <li key={i}>{h}</li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default function ExperienceSection({ showTitle = true }) {
    return (
        <section className="experience">
            {showTitle && <h2 className="section-title">Experience</h2>}
            <div className="experience-list">
                {experiences.map((exp, i) => (
                    <ExperienceCard key={i} exp={exp} />
                ))}
            </div>
        </section>
    )
}

import { Helmet } from 'react-helmet-async'
import ExperienceSection from '../components/Experience'

export default function About() {
    return (
        <div className="about-page">
            <Helmet>
                <title>About — Adrian Besleaga</title>
                <meta name="description" content="Adrian Besleaga — full-stack developer with 10+ years of experience in Java, TypeScript, and cloud engineering. Founder of Piwi.ai." />
                <meta property="og:title" content="About — Adrian Besleaga" />
                <meta property="og:description" content="Full-stack developer with 10+ years of experience. Founder of Piwi.ai." />
                <meta property="og:url" content="https://adrianweb.xyz/about" />
                <link rel="canonical" href="https://adrianweb.xyz/about" />
            </Helmet>
            <h1>About Me</h1>

            <section className="about-intro">
                <p>
                    Hi, I'm <strong>Adrian Besleaga</strong> — a full-stack developer and
                    founder of <a href="https://piwi.ai" target="_blank" rel="noreferrer">Piwi.ai</a>,
                    where I'm building an affordable, privacy-first Intelligent Document
                    Processing (IDP) platform for small and medium businesses.
                </p>
                <p>
                    I'm an <strong>AWS Certified</strong> professional with deep expertise in
                    cloud-native development, microservices architecture, and AI-powered
                    applications. I bring a pragmatic and quality-driven approach to
                    every project I work on.
                </p>
            </section>

            <ExperienceSection />

            <section className="about-skills">
                <h2>Technical Skills</h2>
                <ul>
                    <li>
                        <strong>Backend</strong> — Java, Spring Framework, Node.js,
                        RESTful APIs, GraphQL
                    </li>
                    <li>
                        <strong>Frontend</strong> — React, TypeScript, Next.js
                    </li>
                    <li>
                        <strong>Cloud & Infrastructure</strong> — AWS (certified), Docker,
                        CI/CD pipelines
                    </li>
                    <li>
                        <strong>Data & Search</strong> — Elasticsearch, MongoDB, Redis
                    </li>
                    <li>
                        <strong>AI & ML</strong> — Document processing, Gemini API, local AI models
                    </li>
                    <li>
                        <strong>Architecture</strong> — Microservices, DDD, event-driven
                        systems
                    </li>
                </ul>
            </section>

            <section className="about-certs">
                <h2>Certifications</h2>
                <p>
                    ☁️{' '}
                    <a
                        href="https://www.credly.com/badges/24f69965-8aa4-4d09-9336-a4e487292704/public_url"
                        target="_blank"
                        rel="noreferrer"
                    >
                        AWS Certified
                    </a>
                </p>
            </section>

            <section className="about-contact">
                <h2>Get in Touch</h2>
                <div className="contact-links">
                    <a
                        href="https://www.linkedin.com/in/adrian-besleaga/"
                        className="btn btn-primary"
                        target="_blank"
                        rel="noreferrer"
                    >
                        LinkedIn
                    </a>
                    <a
                        href="https://github.com/AdrianBesleaga"
                        className="btn btn-outline"
                        target="_blank"
                        rel="noreferrer"
                    >
                        GitHub
                    </a>
                </div>
            </section>
        </div>
    )
}

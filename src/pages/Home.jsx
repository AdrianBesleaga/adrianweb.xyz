import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import posts from '../data/posts.json'
import ExperienceSection from '../components/Experience'

export default function Home() {
    const latestPosts = posts.slice(0, 3)

    return (
        <div className="home">
            <Helmet>
                <title>Adrian Besleaga — Developer & Founder of Piwi.ai</title>
                <meta name="description" content="Full-stack developer and founder of Piwi.ai — building privacy-first AI document processing for small and medium businesses." />
                <meta property="og:title" content="Adrian Besleaga — Developer & Founder" />
                <meta property="og:description" content="Full-stack developer and founder of Piwi.ai — privacy-first AI document processing." />
                <meta property="og:url" content="https://adrianweb.xyz/" />
                <link rel="canonical" href="https://adrianweb.xyz/" />
            </Helmet>
            <section className="hero">
                <p className="hero-greeting">$ whoami</p>
                <h1 className="hero-name">
                    <img src="/profile.png" alt="Adrian Besleaga" className="profile-picture-small" />
                    Adrian <span className="accent">Besleaga</span>
                </h1>
                <p className="hero-tagline">
                    Founder of Piwi.ai &middot; AWS Certified &middot; Contractor
                </p>
                <p className="hero-intro">
                    I build scalable systems with Java, Spring, React, TypeScript, and
                    cloud-native technologies. Currently building an affordable, privacy-first
                    IDP platform at Piwi.ai.
                </p>
                <div className="hero-actions">
                    <a href="https://www.linkedin.com/in/adrian-besleaga/" className="btn btn-primary" target="_blank" rel="noreferrer">
                        LinkedIn
                    </a>
                    <a href="https://github.com/AdrianBesleaga" className="btn btn-outline" target="_blank" rel="noreferrer">
                        GitHub
                    </a>
                    <a href="https://www.credly.com/badges/24f69965-8aa4-4d09-9336-a4e487292704/public_url" className="btn btn-outline" target="_blank" rel="noreferrer">
                        AWS Certified ☁️
                    </a>
                </div>
            </section>

            <section className="latest-posts">
                <h2 className="section-title">Latest Posts</h2>
                <ul className="post-list">
                    {latestPosts.map((post) => (
                        <li key={post.slug} className="post-item">
                            <span className="post-date">{formatDate(post.date)}</span>
                            <h3>
                                <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                            </h3>
                            <p className="post-excerpt">{post.excerpt}</p>
                        </li>
                    ))}
                </ul>
                <Link to="/blog" className="view-all">
                    View all posts &rarr;
                </Link>
            </section>

            <section className="skills">
                <h2 className="section-title">What I Work With</h2>
                <div className="skills-grid">
                    <div className="skill-card">
                        <div className="skill-icon">☁️</div>
                        <h3>Cloud & Infrastructure</h3>
                        <p>AWS, Docker, CI/CD, Infrastructure as Code</p>
                    </div>
                    <div className="skill-card">
                        <div className="skill-icon">⚙️</div>
                        <h3>Backend</h3>
                        <p>Java, Spring Boot, REST APIs, GraphQL, Microservices</p>
                    </div>
                    <div className="skill-card">
                        <div className="skill-icon">🗄️</div>
                        <h3>Data</h3>
                        <p>Elasticsearch, MongoDB, Redis, PostgreSQL</p>
                    </div>
                    <div className="skill-card">
                        <div className="skill-icon">🖥️</div>
                        <h3>Frontend & Runtime</h3>
                        <p>React, TypeScript, Node.js, Next.js</p>
                    </div>
                </div>
            </section>

            <ExperienceSection />
        </div>
    )
}

function formatDate(dateStr) {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

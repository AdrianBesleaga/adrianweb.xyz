import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import posts from '../data/posts.json'

export default function Blog() {
    return (
        <div className="blog-page">
            <Helmet>
                <title>Blog — Adrian Besleaga</title>
                <meta name="description" content="Articles about building Piwi.ai, TypeScript, AI-powered document processing, and the solo founder journey." />
                <meta property="og:title" content="Blog — Adrian Besleaga" />
                <meta property="og:description" content="Articles about building Piwi.ai, TypeScript, AI-powered document processing, and the solo founder journey." />
                <meta property="og:url" content="https://adrianweb.xyz/blog" />
                <link rel="canonical" href="https://adrianweb.xyz/blog" />
            </Helmet>
            <h1>Blog</h1>
            <p className="blog-description">
                Thoughts on Java, cloud architecture, and building software.
            </p>
            <ul className="post-list">
                {posts.map((post) => (
                    <li key={post.slug} className="post-item">
                        <span className="post-date">{formatDate(post.date)}</span>
                        <h3>
                            <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                        </h3>
                        <p className="post-excerpt">{post.excerpt}</p>
                    </li>
                ))}
            </ul>
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

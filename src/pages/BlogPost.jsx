import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import posts from '../data/posts.json'
import MatrixText from '../components/MatrixText'

export default function BlogPost() {
    const { slug } = useParams()
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(true)

    const post = posts.find((p) => p.slug === slug)

    useEffect(() => {
        if (!post) {
            setLoading(false)
            return
        }

        fetch(`/posts/${slug}.md`)
            .then((res) => {
                if (!res.ok) throw new Error('Not found')
                return res.text()
            })
            .then((text) => {
                // Strip the first H1 line since we render the title from posts.json
                const stripped = text.replace(/^#\s+.+\n*/, '')
                setContent(stripped)
                setLoading(false)
            })
            .catch(() => {
                setContent('Failed to load post.')
                setLoading(false)
            })
    }, [slug, post])

    if (!post) {
        return (
            <div className="blog-post not-found">
                <h1>Post not found</h1>
                <p>
                    The post you're looking for doesn't exist.{' '}
                    <Link to="/blog">Back to blog</Link>
                </p>
            </div>
        )
    }

    const readingTime = content
        ? Math.max(1, Math.ceil(content.split(/\s+/).length / 200))
        : null

    return (
        <article className="blog-post">
            <Helmet>
                <title>{post.title} — Adrian Besleaga</title>
                <meta name="description" content={post.excerpt} />
                <meta property="og:title" content={post.title} />
                <meta property="og:description" content={post.excerpt} />
                <meta property="og:type" content="article" />
                <meta property="og:url" content={`https://adrianweb.xyz/blog/${post.slug}`} />
                <meta property="article:published_time" content={post.date} />
                <link rel="canonical" href={`https://adrianweb.xyz/blog/${post.slug}`} />
            </Helmet>
            <header className="post-header">
                <Link to="/blog" className="post-back-link">
                    &larr; Blog
                </Link>
                <h1><MatrixText text={post.title} /></h1>
                <div className="post-meta">
                    <time>{formatDate(post.date)}</time>
                    {readingTime && (
                        <span className="reading-time">
                            ☕ {readingTime} min read
                        </span>
                    )}
                </div>
            </header>

            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <div className="post-body">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{content}</ReactMarkdown>
                </div>
            )}

            <footer className="post-footer">
                <Link to="/blog" className="btn btn-outline">
                    &larr; Back to all posts
                </Link>
            </footer>
        </article>
    )
}

function formatDate(dateStr) {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

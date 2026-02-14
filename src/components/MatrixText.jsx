import { useState, useEffect, useRef, useCallback } from 'react'

// Matrix-style characters: katakana + code symbols + alphanumeric
const MATRIX_CHARS =
    'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン' +
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>{}[]=/\\|~^'

const randChar = () => MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]

// How many scramble cycles each character goes through before resolving
const SCRAMBLE_PASSES = 3

export default function MatrixText({ text }) {
    const [chars, setChars] = useState([])
    const frameRef = useRef(null)
    const timeoutRef = useRef(null)

    const animate = useCallback(() => {
        if (!text) return

        let tick = 0
        const totalTicks = text.length * SCRAMBLE_PASSES

        // Initialize all characters as scrambled
        setChars(
            text.split('').map((target) => ({
                target,
                display: target === ' ' ? ' ' : randChar(),
                state: target === ' ' ? 'resolved' : 'scrambling',
            }))
        )

        const step = () => {
            tick++

            setChars((prev) =>
                prev.map((c, i) => {
                    if (c.target === ' ') return c

                    const resolveAt = (i + 1) * SCRAMBLE_PASSES
                    const frontierPos = Math.floor(tick / SCRAMBLE_PASSES)

                    if (tick >= resolveAt) {
                        // Resolved — but recently resolved chars get a trail
                        const ticksSinceResolved = tick - resolveAt
                        let state = 'resolved'
                        if (ticksSinceResolved < 4) state = 'trail-hot'
                        else if (ticksSinceResolved < 8) state = 'trail-warm'
                        else if (ticksSinceResolved < 14) state = 'trail-fade'

                        return { ...c, display: c.target, state }
                    }

                    // Active frontier character — the one currently being decoded
                    if (i === frontierPos) {
                        return { ...c, display: randChar(), state: 'frontier' }
                    }

                    // Still scrambling
                    return { ...c, display: randChar(), state: 'scrambling' }
                })
            )

            if (tick < totalTicks + 14) {
                // +14 extra ticks to let the trail fully fade out
                frameRef.current = requestAnimationFrame(() => {
                    // 60ms per tick for the slower pace
                    timeoutRef.current = setTimeout(step, 55)
                })
            } else {
                // All resolved — hold readable for 2.5s then restart
                timeoutRef.current = setTimeout(animate, 2500)
            }
        }

        timeoutRef.current = setTimeout(step, 300) // small initial delay
    }, [text])

    useEffect(() => {
        animate()
        return () => {
            cancelAnimationFrame(frameRef.current)
            clearTimeout(timeoutRef.current)
        }
    }, [animate])

    if (!chars.length) return <span>{text}</span>

    return (
        <span className="matrix-text">
            {chars.map((c, i) => (
                <span key={i} className={`matrix-char ${c.state}`}>
                    {c.display}
                </span>
            ))}
        </span>
    )
}

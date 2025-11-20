import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

interface Proposal {
    id: string
    token_address: string
    title: string
}

export default function Home() {
    const [tokens, setTokens] = useState<string[]>([])

    useEffect(() => {
        // Fetch proposals to find unique tokens
        // In a real app, we would have a /tokens endpoint
        axios.get('http://localhost:3000/proposals')
            .then(res => {
                const proposals = res.data as Proposal[]
                const uniqueTokens = Array.from(new Set(proposals.map(p => p.token_address)))
                // If no proposals, show the deployed token for demo
                if (uniqueTokens.length === 0) {
                    setTokens(['0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'])
                } else {
                    setTokens(uniqueTokens)
                }
            })
            .catch(err => {
                console.error(err)
                // Fallback for demo
                setTokens(['0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'])
            })
    }, [])

    return (
        <div>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Available Tokens</h2>
            <div className="grid">
                {tokens.map(token => (
                    <div key={token} className="card">
                        <h3>Token: {token.slice(0, 6)}...{token.slice(-4)}</h3>
                        <p>Vote on proposals for this token.</p>
                        <Link to={`/proposals/${token}`} className="btn" style={{ marginTop: '1rem' }}>
                            View Proposals
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    )
}

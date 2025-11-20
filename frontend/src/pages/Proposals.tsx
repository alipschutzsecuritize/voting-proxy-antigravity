import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

interface Proposal {
    id: string
    title: string
    description: string
    expiration: string
}

export default function Proposals() {
    const { tokenAddress } = useParams()
    const [proposals, setProposals] = useState<Proposal[]>([])

    useEffect(() => {
        if (tokenAddress) {
            axios.get(`http://localhost:3000/proposals/token/${tokenAddress}`)
                .then(res => setProposals(res.data))
                .catch(console.error)
        }
    }, [tokenAddress])

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem' }}>Proposals for {tokenAddress?.slice(0, 6)}...</h2>
                {/* In a real app, we would have a Create Proposal button here */}
            </div>

            {proposals.length === 0 ? (
                <p>No proposals found for this token.</p>
            ) : (
                <div className="grid">
                    {proposals.map(proposal => (
                        <div key={proposal.id} className="card">
                            <h3>{proposal.title}</h3>
                            <p>{proposal.description}</p>
                            <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                                Expires: {new Date(proposal.expiration).toLocaleDateString()}
                            </p>
                            <Link to={`/proposal/${proposal.id}`} className="btn" style={{ marginTop: '1rem' }}>
                                View Details
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

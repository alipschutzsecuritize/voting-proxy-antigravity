import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseAbi } from 'viem'

interface Proposal {
    id: string
    title: string
    description: string
    contract_address: string
    hash: string // Proposal ID on chain
    expiration: string
}

interface VoteResult {
    yes: number
    no: number
    abstain: number
    total: number
}

const GOVERNOR_ABI = parseAbi([
    'function registerVote(uint256 proposalId) public returns (uint256)',
    'function hasVoted(uint256 proposalId, address account) public view returns (bool)'
])

export default function ProposalDetail() {
    const { id } = useParams()
    const { address, isConnected } = useAccount()
    const [proposal, setProposal] = useState<Proposal | null>(null)
    const [results, setResults] = useState<VoteResult>({ yes: 0, no: 0, abstain: 0, total: 0 })
    const [hasVoted, setHasVoted] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const { data: hash, writeContract, isPending, error: writeError } = useWriteContract()
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash,
    })

    useEffect(() => {
        if (id) {
            fetchProposal()
            fetchResults()
        }
    }, [id])

    useEffect(() => {
        if (isConfirmed && hash) {
            // Record vote in backend
            recordVoteInBackend()
        }
    }, [isConfirmed, hash])

    const fetchProposal = () => {
        axios.get(`http://localhost:3000/proposals/${id}`)
            .then(res => setProposal(res.data))
            .catch(console.error)
    }

    const fetchResults = () => {
        axios.get(`http://localhost:3000/votes/proposal/${id}`)
            .then(res => {
                const votes = res.data
                const resCounts = { yes: 0, no: 0, abstain: 0, total: votes.length }
                votes.forEach((v: any) => {
                    if (v.answer === 0) resCounts.yes++
                    else if (v.answer === 1) resCounts.no++
                    else resCounts.abstain++
                })
                setResults(resCounts)

                if (address) {
                    const userVote = votes.find((v: any) => v.holder_wallet.toLowerCase() === address.toLowerCase())
                    if (userVote) setHasVoted(true)
                }
            })
            .catch(console.error)
    }

    const handleVote = (answer: number) => {
        if (!proposal || !address) return

        // Clear previous errors
        setError(null)
        setPendingChoice(answer)

        console.log('Attempting to vote...')
        console.log('Proposal:', proposal)
        console.log('Contract Address:', proposal.contract_address)
        console.log('Proposal Hash:', proposal.hash)
        console.log('User Address:', address)

        try {
            writeContract({
                address: proposal.contract_address as `0x${string}`,
                abi: GOVERNOR_ABI,
                functionName: 'registerVote',
                args: [BigInt(proposal.hash)],
                chainId: 1337, // Match MetaMask local network
            }, {
                onError: (err) => {
                    console.error('Transaction error:', err)
                    setError(err.message || 'Failed to send transaction')
                },
                onSuccess: (data) => {
                    console.log('Transaction sent:', data)
                }
            })
        } catch (err: any) {
            console.error('Error calling writeContract:', err)
            setError(err.message || 'Failed to initiate transaction')
        }
    }

    const [pendingChoice, setPendingChoice] = useState<number | null>(null)

    // Monitor write errors
    useEffect(() => {
        if (writeError) {
            console.error('Write contract error:', writeError)
            setError(writeError.message || 'Transaction failed')
        }
    }, [writeError])

    const recordVoteInBackend = () => {
        if (pendingChoice === null || !proposal || !address || !hash) return

        axios.post('http://localhost:3000/votes', {
            holder_wallet: address,
            proposal_id: proposal.id,
            answer: pendingChoice,
            weight: "1000000000000000000", // Placeholder weight, should be calculated
            transaction: hash
        })
            .then(() => {
                alert('Vote registered successfully!')
                fetchResults()
                setHasVoted(true)
            })
            .catch(err => {
                console.error(err)
                alert('Failed to record vote in backend')
            })
    }

    if (!proposal) return <div>Loading...</div>

    return (
        <div>
            <div className="card">
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{proposal.title}</h2>
                <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>{proposal.description}</p>

                <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
                    <div>
                        <strong>Status:</strong> {new Date(proposal.expiration) > new Date() ? 'Active' : 'Closed'}
                    </div>
                    <div>
                        <strong>Expires:</strong> {new Date(proposal.expiration).toLocaleDateString()}
                    </div>
                </div>

                {isConnected ? (
                    hasVoted ? (
                        <div style={{ padding: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '0.5rem', border: '1px solid #10b981' }}>
                            You have already voted on this proposal.
                        </div>
                    ) : (
                        <div>
                            <h3 style={{ marginBottom: '1rem' }}>Cast your vote</h3>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button
                                    className="btn"
                                    onClick={() => handleVote(0)}
                                    disabled={isPending || isConfirming}
                                    style={{ backgroundColor: '#10b981' }}
                                >
                                    Yes
                                </button>
                                <button
                                    className="btn"
                                    onClick={() => handleVote(1)}
                                    disabled={isPending || isConfirming}
                                    style={{ backgroundColor: '#ef4444' }}
                                >
                                    No
                                </button>
                                <button
                                    className="btn"
                                    onClick={() => handleVote(2)}
                                    disabled={isPending || isConfirming}
                                    style={{ backgroundColor: '#64748b' }}
                                >
                                    Abstain
                                </button>
                            </div>
                            {(isPending || isConfirming) && <p style={{ marginTop: '1rem', color: '#3b82f6' }}>Processing transaction...</p>}
                            {error && (
                                <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '0.5rem', border: '1px solid #ef4444', color: '#ef4444' }}>
                                    <strong>Error:</strong> {error}
                                </div>
                            )}
                        </div>
                    )
                ) : (
                    <div style={{ padding: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.5rem', border: '1px solid #3b82f6' }}>
                        Connect your wallet to vote.
                    </div>
                )}
            </div>

            <div className="card">
                <h3>Results</h3>
                <div style={{ marginTop: '1rem' }}>
                    <div style={{ marginBottom: '0.5rem' }}>Yes: {results.yes} votes</div>
                    <div style={{ marginBottom: '0.5rem' }}>No: {results.no} votes</div>
                    <div style={{ marginBottom: '0.5rem' }}>Abstain: {results.abstain} votes</div>
                    <div style={{ marginTop: '1rem', borderTop: '1px solid #334155', paddingTop: '0.5rem' }}>
                        Total: {results.total} votes
                    </div>
                </div>
            </div>
        </div>
    )
}

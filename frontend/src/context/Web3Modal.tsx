import { createConfig, http, WagmiProvider } from 'wagmi'
import { mainnet, arbitrum, localhost } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { ReactNode } from 'react'

// 1. Get projectId
const projectId = 'b56e18d47c72ab683b10814fe9495694' // Example ID, user should replace

// 2. Create wagmiConfig
export const networks = [localhost, mainnet, arbitrum]

const wagmiAdapter = new WagmiAdapter({
    networks,
    projectId,
    ssr: false,
})

// 3. Create modal
createAppKit({
    adapters: [wagmiAdapter],
    networks,
    projectId,
    metadata: {
        name: 'Proxy Voting',
        description: 'On-Chain Token-Based Voting System',
        url: 'https://proxy-voting.example.com',
        icons: ['https://avatars.githubusercontent.com/u/37784886']
    }
})

const queryClient = new QueryClient()

export function Web3ModalProvider({ children }: { children: ReactNode }) {
    return (
        <WagmiProvider config={wagmiAdapter.wagmiConfig}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </WagmiProvider>
    )
}

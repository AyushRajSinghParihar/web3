import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton, WalletDisconnectButton } from '@solana/wallet-adapter-react-ui';
import { Airdrop } from './Airdrop'; // Make sure this component is correctly defined and imported
import '@solana/wallet-adapter-react-ui/styles.css'; // Add this to include the styles for Wallet Adapter UI



function App() {
  

  return (
    <ConnectionProvider endpoint={"https://api.mainnet-beta.solana.com"}>
    <WalletProvider wallets={[]} autoConnect>
      <WalletModalProvider>
        <WalletMultiButton></WalletMultiButton>
        <WalletDisconnectButton></WalletDisconnectButton>
      <div>Hi there</div>
      <Airdrop></Airdrop>
      </WalletModalProvider>
      </WalletProvider>
      </ConnectionProvider>
      
  )
}

export default App

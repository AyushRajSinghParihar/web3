import { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair, Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";

export function SolanaWallet({ mnemonic }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [publicKeys, setPublicKeys] = useState([]);
  const [balances, setBalances] = useState([]);
  const [tokens, setTokens] = useState([]);
  const [manualAddress, setManualAddress] = useState("");

  const connection = new Connection(clusterApiUrl("mainnet-beta"));

  const fetchBalance = async (publicKey) => {
    const balance = await connection.getBalance(publicKey);
    return balance / 1e9; // Convert lamports to SOL
  };

  const fetchTokens = async (publicKey) => {
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      publicKey,
      { programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA") } // Token Program ID
    );
    return tokenAccounts.value.map((account) => {
      const tokenInfo = account.account.data.parsed.info;
      return {
        mint: tokenInfo.mint,
        amount: tokenInfo.tokenAmount.uiAmount,
      };
    });
  };

  const handleManualAddressSubmit = async () => {
    try {
      const publicKey = new PublicKey(manualAddress);
      const balance = await fetchBalance(publicKey);
      const tokenList = await fetchTokens(publicKey);

      setPublicKeys([...publicKeys, publicKey]);
      setBalances([...balances, balance]);
      setTokens([...tokens, tokenList]);
    } catch (error) {
      console.error("Error fetching data for manual address:", error);
    }
  };

  return (
    <div>
      <button
        onClick={async function () {
          const seed = mnemonicToSeed(mnemonic);
          const path = `m/44'/501'/${currentIndex}'/0'`;
          const derivedSeed = derivePath(path, seed.toString("hex")).key;
          const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
          const keypair = Keypair.fromSecretKey(secret);

          // Add the new wallet
          setCurrentIndex(currentIndex + 1);
          setPublicKeys([...publicKeys, keypair.publicKey]);

          // Fetch balance and tokens for the new wallet
          const balance = await fetchBalance(keypair.publicKey);
          const tokenList = await fetchTokens(keypair.publicKey);

          setBalances([...balances, balance]);
          setTokens([...tokens, tokenList]);
        }}
      >
        Add Solana Wallet
      </button>

      <div>
        <input
          type="text"
          value={manualAddress}
          onChange={(e) => setManualAddress(e.target.value)}
          placeholder="Enter Solana address"
        />
        <button onClick={handleManualAddressSubmit}>Add Manual Address</button>
      </div>

      {publicKeys.map((p, index) => (
        <div key={p.toBase58()}>
          <div>
            {p.toBase58()} - Balance: {balances[index]} SOL
          </div>
          <div>
            Tokens:
            {tokens[index].length === 0 ? (
              " No tokens"
            ) : (
              <ul>
                {tokens[index].map((token, i) => (
                  <li key={i}>
                    Mint: {token.mint}, Amount: {token.amount}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

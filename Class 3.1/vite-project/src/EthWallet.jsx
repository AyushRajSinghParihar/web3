import { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { Wallet, HDNodeWallet, ethers } from "ethers";

export const EthWallet = ({ mnemonic }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [balances, setBalances] = useState([]);

  const fetchBalance = async (address) => {
    const provider = new ethers.providers.InfuraProvider("mainnet");
    const balance = await provider.getBalance(address);
    return ethers.utils.formatEther(balance); // Convert Wei to Ether
  };

  return (
    <div>
      <button
        onClick={async function () {
          const seed = await mnemonicToSeed(mnemonic);
          const derivationPath = `m/44'/60'/${currentIndex}'/0'`;
          const hdNode = HDNodeWallet.fromSeed(seed);
          const child = hdNode.derivePath(derivationPath);
          const privateKey = child.privateKey;
          const wallet = new Wallet(privateKey);

          // Add the new wallet
          setCurrentIndex(currentIndex + 1);
          setAddresses([...addresses, wallet.address]);

          // Fetch balance for the new wallet
          const balance = await fetchBalance(wallet.address);
          setBalances([...balances, balance]);
        }}
      >
        Add ETH Wallet
      </button>

      {addresses.map((p, index) => (
        <div key={p}>
          {p} - Balance: {balances[index]} ETH
        </div>
      ))}
    </div>
  );
};

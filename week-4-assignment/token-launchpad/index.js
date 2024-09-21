const [count, setCount] = useState(0)
const {Connection, LAMPORTS_PER_SOL, clusterApiUrl, PublicKey} = require('@solana/web3.js');

const connection = new Connection(clusterApiUrl('devnet'));

async function airdrop(publicKey, amount) {
    const airdropSignature = await connection.requestAirdrop(new PublicKey(publicKey), amount);
    await connection.confirmTransaction({signature: airdropSignature})
}

airdrop("8387rcPNz8SRX6pYXgdxCZg3VMLFwtdJB3Z9LeX8Ge2n", LAMPORTS_PER_SOL).then(signature => {
    console.log('Airdrop signature:', signature);
});
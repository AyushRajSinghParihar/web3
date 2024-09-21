import { useWallet, useConnection } from "@solana/wallet-adapter-react"


export function Airdrop() {
    const wallet=useWallet()
    const {connection} = useConnection();

    async function sendAirdropToUser() {
        const amount = document.getElementById("publicKey").value;
        await connection.requestAirdrop(wallet.publicKey, amount*1000000000);
        alert("money sent")
    }
    return <div> 

        <input type="text" placeholder="Amount" id="publicKey"/>
        <button onClick={sendAirdropToUser}>Send Airdrop</button>
    </div>
}
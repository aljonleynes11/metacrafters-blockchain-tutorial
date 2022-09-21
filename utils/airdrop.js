const airdrop = async (connection, receiver, sender)  =>{
    

    console.log("Airdopping some SOL to Sender wallet!");
    const signature = await connection.requestAirdrop(
        new PublicKey(sender.publicKey),
        2 * LAMPORTS_PER_SOL
    );

    return signature;
}
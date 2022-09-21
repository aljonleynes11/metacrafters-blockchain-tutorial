const DEMO_FROM_SECRET_KEY = new Uint8Array(
    [
        125,  88,  59, 144, 206, 252,  46, 181,  17,  11,  38,
         63,  82, 105, 166, 111, 166, 110, 188,  86, 136, 141,
        129, 138, 134, 205, 165,  76,  54,  41, 137,  19, 161,
        215, 173,  40, 148, 138, 219, 165, 239, 136, 213, 157,
          1, 212, 249, 185, 167, 183, 127, 122, 218, 151, 248,
        104,  41, 234,  80,  39, 176,  90,  21, 174
    ]     
);

const getBalance = async (connection, wallet) => {
    try {
        const walletBalance = await connection.getBalance(
            new PublicKey(wallet.publicKey)
        );
        console.log(`Wallet balance: ${parseInt(walletBalance) / LAMPORTS_PER_SOL} SOL`);
        return parseInt(walletBalance) / LAMPORTS_PER_SOL;
    } catch (err) {
        console.log(err);
    }
};

const airdrop = async (connection,sender)  =>{
    console.log("Airdopping some SOL to Sender wallet!");
    const signature = await connection.requestAirdrop(
        new PublicKey(sender.publicKey),
        2 * LAMPORTS_PER_SOL
    );

    return signature;
}

const transfer = async(connection, sender, receiver, amount, airDropSignature) => {

    let latestBlockHash = await connection.getLatestBlockhash();

    await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: airDropSignature
    });

    console.log("Airdrop completed for the Sender account");

    var transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: sender.publicKey,
            toPubkey: receiver.publicKey,
            lamports: amount
        })
    );

    var signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [from]
    );
    console.log('Signature is ', signature);

    return signature;
}

const usage = async() => {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    let sender = Keypair.fromSecretKey(DEMO_FROM_SECRET_KEY);
    let receiver = Keypair.generate();
    const balance = await getBalance(connection, sender);
    let _amount = balance / 2;
    const amount =  _amount * LAMPORTS_PER_SOL; /// transfer half of funds
    const signature =  await airdrop(connection, receiver);
    const transactionId =  await transfer(connection, sender, receiver, signature)

    return {
        'sender': sender,
        'receiver': receiver,
        'amount_transferred': amount,
        'transaction_id': transactionId,
    }
}
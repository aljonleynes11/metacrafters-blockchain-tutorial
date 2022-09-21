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
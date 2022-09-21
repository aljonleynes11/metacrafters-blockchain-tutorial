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
// Import Solana web3 functinalities
const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL,
    Transaction,
    SystemProgram,
    sendAndConfirmRawTransaction,
    sendAndConfirmTransaction
} = require("@solana/web3.js");

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

// const myKey = Keypair.generate();

// const DEMO_FROM_SECRET_KEY = myKey.secretKey;

// console.log(myKey);

const getWalletBalance = async (connection, wallet) => {
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

const transferSol = async() => {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    // Get Keypair from Secret Key
    var from = Keypair.fromSecretKey(DEMO_FROM_SECRET_KEY);

    // Other things to try: 
    // 1) Form array from userSecretKey
    // const from = Keypair.fromSecretKey(Uint8Array.from(userSecretKey));
    // 2) Make a new Keypair (starts with 0 SOL)
    // const from = Keypair.generate();

    // Generate another Keypair (account we'll be sending to)
    const to = Keypair.generate();

    // Aidrop 2 SOL to Sender wallet
    console.log("Airdopping some SOL to Sender wallet!");
    const fromAirDropSignature = await connection.requestAirdrop(
        new PublicKey(from.publicKey),
        2 * LAMPORTS_PER_SOL
    );

    const balance = await getWalletBalance(connection, from);
    const transferAmount = balance / 2;
    const solAmount =  transferAmount * LAMPORTS_PER_SOL;
    console.log(transferAmount);

    // Latest blockhash (unique identifer of the block) of the cluster
    let latestBlockHash = await connection.getLatestBlockhash();

    // Confirm transaction using the last valid block height (refers to its time)
    // to check for transaction expiration
    await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: fromAirDropSignature
    });

    console.log("Airdrop completed for the Sender account");

    // Send money from "from" wallet and into "to" wallet
    var transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: from.publicKey,
            toPubkey: to.publicKey,
            lamports: solAmount
        })
    );

    // Sign transaction
    var signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [from]
    );
    console.log('Signature is ', signature);
}

transferSol();



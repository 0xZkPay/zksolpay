import sol from "@solana/web3.js"
const endpoint = 'https://api.devnet.solana.com';
const solanaConnection = new sol.Connection(endpoint);


const wow = async () => {
    const amout = 2.2;
    let account = "4bF1PRfE7aXgT7t2AmjyxWGvpwgk4kJF19KVLLmc5dNp"

    const pubKey = new sol.PublicKey(account);
    let transactionList = await solanaConnection.getSignaturesForAddress(pubKey, { limit: 1 });
    try {
        const txn = await solanaConnection.getParsedTransaction(transactionList[0].signature, { maxSupportedTransactionVersion: 0 })

        const accounts_keys = txn?.transaction.message.accountKeys
        if (accounts_keys) {
            accounts_keys.forEach((ak, i) => {
                if (ak.pubkey.toBase58() === account) {
                    const pre = txn?.meta?.preBalances[i]
                    const post = txn?.meta?.postBalances[i]
                    // Sometimes the amount is greater by few decimals like 2.200000000000003 instead of 2.2
                    if (pre && post && (post / sol.LAMPORTS_PER_SOL - pre / sol.LAMPORTS_PER_SOL) > amout)
                        console.log("success");
                }
            })
        }
    } catch (error) {
        console.error(error);
    }


}

wow()
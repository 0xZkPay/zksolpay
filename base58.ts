import bs58 from "bs58"
const b64 = process.argv[2];

const w = Buffer.from(b64, "base64")
const ww = bs58.encode(w)
console.log("58", ww);
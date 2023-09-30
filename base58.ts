import bs58 from "bs58"
const b64 = "UskEqdDtrOZ7wWb0HAU4FNCEnIwQNUkV7YSBv0kDzSu5KKg7lGrIa/HTJYM9kUJyoMARWHU+npxlGKdFEw17DA=="
const w = Buffer.from(b64, "base64")
const ww = bs58.encode(w)
console.log("58", ww);
export const Vars = {
    DB: {
        HOSTNAME: process.env.DB_HOST,
        PORT: process.env.DB_ACCESS_PORT,
        USER: process.env.DB_USER,
        PASSWORD: process.env.DB_PASSWORD,
        DB_NAME: process.env.DB_NAME
    },
    EULA: process.env.EULA,
    PASETO_PV_KEY: process.env.PASETO_PV_KEY,
    FEE_WALLET: process.env.FEE_WALLET as string
}
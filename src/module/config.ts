import { RandomID } from "./RandomID";

export default {
    JWT_SECRET: String(process.env.JWT_SECRET) || RandomID(256),
    SALT_ROUND: Number(process.env.SALT_ROUND) || 16,
    PORT: Number(process.env.PORT) || 3000,
}
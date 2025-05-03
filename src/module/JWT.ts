import jwt from "jsonwebtoken";

import config from "./config";

const jwt_key = config.JWT_SECRET;

export async function encodeJWT(token: Object) {
    try {
        if (!token) return null;

        const encode = jwt.sign(token, jwt_key, { expiresIn: new Date().setFullYear(new Date().getFullYear() + 1) });

        return encode;
    } catch (error) {
        return null;
    }
}

export async function decodeJWT(token: String) {
    try {
        if (!token) return null;

        const decode = jwt.verify(String(token), jwt_key);

        return { ...Object(decode) };
    } catch (error) {
        return null;
    }
}
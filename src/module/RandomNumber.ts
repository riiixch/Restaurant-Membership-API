export function RandomNumber(length: Number) {
    if (!length || Number(length) <= 0) length = 16;
    const characters = '0123456789';
    let result = '';
    for (let i = 0; i < Number(length); i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}
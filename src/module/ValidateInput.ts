type InputType = 'text' | 'email' | 'number' | 'boolean' | 'date' | 'array';

export default function ValidateInput(value: any, type: InputType): boolean {
    switch (type) {
        case 'text':
            return typeof value === 'string' && value.trim().length > 0;
        case 'email':
            if (typeof value !== 'string') return false;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(value);
        case 'number':
            return !isNaN(value) && !isNaN(parseFloat(value));
        case 'boolean':
            return typeof value === 'boolean' || value === 'true' || value === 'false';
        case 'date':
            const date = new Date(value);
            return !isNaN(date.getTime());
        case 'array':
            return Array.isArray(value) && value.length > 0;
        default:
            return false;
    }
}
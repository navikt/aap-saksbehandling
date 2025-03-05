export const isLocal = () => process.env.NEXT_PUBLIC_ENVIRONMENT === 'localhost';

export const isProduction = () => process.env.NEXT_PUBLIC_ENVIRONMENT === 'prod';

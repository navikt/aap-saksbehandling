export const isLocal = () => process.env.NEXT_PUBLIC_ENVIRONMENT === 'localhost';
export const isProd = () => process.env.NEXT_PUBLIC_ENVIRONMENT === 'prod';

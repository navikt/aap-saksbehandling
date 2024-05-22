export const isLocal = () => {
  return process.env.NEXT_PUBLIC_ENVIRONMENT === 'localhost';
};

export const isDev = () => {
  return process.env.NEXT_PUBLIC_ENVIRONMENT === 'dev';
};

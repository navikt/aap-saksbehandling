export const isLocal = () => {
  return process.env.NEXT_PUBLIC_ENVIRONMENT === 'localhost';
};

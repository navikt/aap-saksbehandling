export const isLocal = () => {
  if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'localhost') {
    return true;
  }
  return false;
};

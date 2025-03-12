export const isLocal = () => {
  console.log('isLocal:', process.env.NEXT_PUBLIC_ENVIRONMENT)
  return process.env.NEXT_PUBLIC_ENVIRONMENT === 'localhost'
};

export const isProduction = () => {
  console.log('isProduction:', process.env.NEXT_PUBLIC_ENVIRONMENT)
  return process.env.NEXT_PUBLIC_ENVIRONMENT === 'prod'
};

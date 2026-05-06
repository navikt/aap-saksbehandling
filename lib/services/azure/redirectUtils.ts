export function buildOAuthLoginUrl(redirectPath: string | null): string {
  return `/oauth2/login?redirect=${redirectPath ? encodeURIComponent(redirectPath) : ''}`;
}

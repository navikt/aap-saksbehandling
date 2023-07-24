import { logger } from '@navikt/aap-felles-utils';
import { validerToken } from './azuread';
import { NextApiRequest, NextApiResponse } from 'next';

export const enforceAzureADMiddleware = async function (
  req: NextApiRequest,
  res: NextApiResponse,
  next: any,
) {
  const loginPath = `/oauth2/login?redirect=${req.url}/`;
  const { authorization } = req.headers;

  // Not logged in - log in with wonderwall
  if (!authorization) {
    res.redirect(loginPath);
  } else {
    // Validate token and continue to app
    if (await validateAuthorization(authorization)) {
      next();
    } else {
      res.redirect(loginPath);
    }
  }
};

const validateAuthorization = async (authorization: string) => {
  try {
    const token = authorization.split(' ')[1];
    const JWTVerifyResult = await validerToken(token);
    return !!JWTVerifyResult?.payload;
  } catch (e) {
    logger.error('azure ad error', e);
    return false;
  }
};

export const azureUserInfo = async function (req: NextApiRequest, res: NextApiResponse) {
  const { authorization } = req.headers;
  try {
    const token = authorization?.split(' ')[1]!;
    const JWTVerifyResult = await validerToken(token);
    res.json({ name: JWTVerifyResult.payload.name });
  } catch (e) {
    logger.error('azureUserInfo', e);
    res.status(500);
  }
};

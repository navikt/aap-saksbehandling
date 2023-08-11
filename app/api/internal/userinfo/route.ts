import { NextApiRequest, NextApiResponse } from 'next';
import { azureUserInfo } from './middleware';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  return azureUserInfo(req, res);
}

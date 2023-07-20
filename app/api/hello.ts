// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { logger } from '@navikt/aap-felles-utils';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  name: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  logger.info('Loggin works on serverside');
  res.status(200).json({ name: 'John Doe' });
}

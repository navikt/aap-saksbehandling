'use server';

import { revalidateTag } from 'next/cache';
import { logError } from 'lib/serverutlis/logger';
import { ClientError } from 'lib/types/clientTypes';

export async function revalidateFlyt(behandlingReferanse: string) {
  revalidateTag(`flyt/${behandlingReferanse}`, 'max');
}

export async function revalidatePostMottakFlyt(behandlingReferanse: string) {
  revalidateTag(`postmottak/flyt/${behandlingReferanse}`, 'max');
}

export async function logClientError(error: ClientError) {
  logError('Klient-side feil', error);
}

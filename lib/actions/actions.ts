'use server';

import { revalidateTag } from 'next/cache';
import { logWarning } from 'lib/serverutlis/logger';
import { ClientError } from 'lib/types/clientTypes';

export async function revalidateFlyt(behandlingReferanse: string) {
  revalidateTag(`flyt/${behandlingReferanse}`, 'max');
}

export async function revalidatePostMottakFlyt(behandlingReferanse: string) {
  revalidateTag(`postmottak/flyt/${behandlingReferanse}`, 'max');
}

export async function logClientError(error: ClientError) {
  logWarning('Klient-side feil', error);
}

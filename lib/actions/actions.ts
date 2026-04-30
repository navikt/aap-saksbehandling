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

export async function logClientWarning(error: ClientError) {
  logWarning(error.message || 'Client error', error);
}

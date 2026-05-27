'use server';

import { revalidatePath } from 'next/cache';
import { logWarning } from 'lib/serverutlis/logger';
import { ClientError } from 'lib/types/clientTypes';

export async function revalidateFlyt() {
  revalidatePath(`/saksbehandling/sak`, 'layout');
}

export async function revalidatePostMottakFlyt(behandlingReferanse: string) {
  revalidatePath(`/postmottak/${behandlingReferanse}`);
}

export async function logClientWarning(error: ClientError) {
  logWarning(error.message || 'Client error', error);
}

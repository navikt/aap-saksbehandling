'use server';

import { revalidatePath } from 'next/cache';
import { logWarning } from 'lib/serverutlis/logger';
import { ClientError } from 'lib/types/clientTypes';

export async function revalidateBehandlingPath(saksnummer: string, behandlingsreferanse: string) {
  revalidatePath(`/saksbehandling/sak/${saksnummer}/${behandlingsreferanse}`, 'layout');
}

export async function revalidatePostMottakBehandling(behandlingReferanse: string) {
  revalidatePath(`/postmottak/${behandlingReferanse}`);
}

export async function logClientWarning(error: ClientError) {
  logWarning(error.message || 'Client error', error);
}

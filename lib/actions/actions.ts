'use server';

import { revalidateTag } from 'next/cache';

export async function revalidateFlyt(behandlingReferanse: string) {
  revalidateTag(`flyt/${behandlingReferanse}`);
}

export async function revalidateAktivitetspliktHendelser(saksnummer: string) {
  revalidateTag(`aktivitetsplikt/${saksnummer}`);
}

export async function revalidateMineOppgaver() {
  revalidateTag(`oppgaveservice/mine-oppgaver`);
}

export async function revalidatePostMottakFlyt(behandlingReferanse: string) {
  revalidateTag(`postmottak/flyt/${behandlingReferanse}`);
}

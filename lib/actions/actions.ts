'use server';

import { revalidateTag } from 'next/cache';

export async function revalidateFlyt(behandlingReferanse: string) {
  revalidateTag(`flyt/${behandlingReferanse}`, 'max');
}

export async function revalidatePostMottakFlyt(behandlingReferanse: string) {
  revalidateTag(`postmottak/flyt/${behandlingReferanse}`, 'max');
}

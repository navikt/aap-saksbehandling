'use server';

import { revalidateTag } from 'next/cache';

export async function revalidateFlyt(behandlingReferanse: string) {
  revalidateTag(`api/hent/${behandlingReferanse}/flyt`);
}

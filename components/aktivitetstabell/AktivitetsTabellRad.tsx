'use client';

import { AktivitetDto } from 'lib/types/types';

interface Props {
  aktivitet: AktivitetDto;
}

export const AktivitetsTabellRad = ({ aktivitet }: Props) => {
  console.log(aktivitet);
  return <div>Yay en rad</div>;
};

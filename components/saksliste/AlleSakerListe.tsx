'use client';

import { hentAlleSaker } from 'lib/api';
import { SaksInfo } from 'lib/types/types';
import Link from 'next/link';
import useSWR from 'swr';

interface Props {
  alleSaker: SaksInfo[];
}

export const AlleSakerListe = ({ alleSaker }: Props) => {
  const { data } = useSWR('api/sak/alle', hentAlleSaker, { fallbackData: alleSaker });
  return (
    <>
      {data?.map((sak) => (
        <div key={sak.saksnummer}>
          <Link href={`/sak/${sak.saksnummer}/`}>{sak.saksnummer}</Link>
        </div>
      ))}
    </>
  );
};

'use server';

import styles from 'app/sak/[saksId]/aktivitet/page.module.css';
import { Aktivitetsplikt } from 'components/aktivitetsplikt/Aktivitetsplikt';
import { AktivitetspliktHendelse } from 'lib/types/types';

interface Props {
  saksnummer: string;
}

const mockAktivitetspliktHendelser: AktivitetspliktHendelse[] = [
  {
    hendelseId: '12344',
    periode: { fom: '2023-01-01', tom: '2023-02.02' },
    paragraf: 'PARAGRAF_11_8',
    begrunnelse: 'En begrunnelse',
    brudd: 'IKKE_MØTT_TIL_MØTE',
  },
];

export const AktivitetspliktMedDatafetching = async ({ saksnummer }: Props) => {
  console.log(saksnummer)
  // const aktivitetspliktHendelser = await hentAktivitetspliktHendelser(saksnummer);

  return (
    <div className={styles.aktivitetSkjema}>
      <Aktivitetsplikt aktivitetspliktHendelser={mockAktivitetspliktHendelser} />
    </div>
  );
};

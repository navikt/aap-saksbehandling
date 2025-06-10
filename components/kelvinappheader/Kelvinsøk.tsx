'use client';

import { Dispatch, SetStateAction, useState } from 'react';
import { Search } from '@navikt/ds-react';
import styles from './KelvinAppHeader.module.css';
import { Behandlingsstatus } from '../../lib/types/types';

export interface SøkeResultat {
  oppgaver?: {
    label: string;
    href: string;
    status: string;
    harAdressebeskyttelse: boolean;
  }[];
  saker?: { href: string; label: string }[];
  kontor?: { enhet: string }[];
  person?: { href: string; label: string }[];
  behandlingsStatus?: { status: Behandlingsstatus }[];
}
interface Props {
  setSøkeresultat: Dispatch<SetStateAction<SøkeResultat | undefined>>;
}

export const Kelvinsøk = ({ setSøkeresultat }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function utførSøk(søketekst: string) {
    setIsLoading(true);
    let søkedata: SøkeResultat = {};
    try {
      søkedata = await fetch(`/api/kelvinsok`, {
        method: 'POST',
        body: JSON.stringify({ søketekst }),
      }).then((res) => res.json());
    } catch (error) {
      console.error(error);
    }
    const cleanedSøkedata: SøkeResultat = {
      ...søkedata,
      person: søkedata.person?.map((p) => ({
        ...p,
        label: !p.label || p.label === 'null' ? '' : p.label,
      })),
    };

    setSøkeresultat(cleanedSøkedata);

    setIsLoading(false);
  }

  return (
    <form
      data-theme={'dark'}
      className={styles.kelvinOppgavesokForm}
      role={'search'}
      onSubmit={(e) => {
        const input = e.currentTarget.elements?.[0] as HTMLInputElement;
        if (input.value) {
          utførSøk(input.value);
        }
        e.preventDefault();
      }}
    >
      <Search label={'Søk etter person eller sak'} variant="secondary" hideLabel={true} size={'small'}>
        <Search.Button loading={isLoading} />
      </Search>
    </form>
  );
};

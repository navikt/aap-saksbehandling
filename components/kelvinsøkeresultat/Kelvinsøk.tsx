'use client';

import { Dispatch, SetStateAction, useState } from 'react';
import { Search } from '@navikt/ds-react';
import styles from 'components/kelvinappheader/KelvinAppHeader.module.css';
import { SøkeResultat } from 'app/api/kelvinsok/route';
import { useFeatureFlag } from 'context/UnleashContext';

interface Props {
  setSøkeresultat: Dispatch<SetStateAction<SøkeResultat | undefined>>;
  setSøkOverlay: Dispatch<SetStateAction<boolean>>;
}

export const Kelvinsøk = ({ setSøkeresultat, setSøkOverlay }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const visSøkOverlay = useFeatureFlag('SokOverlayFrontend');

  async function utførSøk(søketekst: string, setSøkOverlay: Props['setSøkOverlay']) {
    setIsLoading(true);
    let søkedata: SøkeResultat = {} as SøkeResultat;
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
    if (visSøkOverlay) {
      setSøkOverlay(Boolean(cleanedSøkedata));
    }

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
          utførSøk(input.value, setSøkOverlay);
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

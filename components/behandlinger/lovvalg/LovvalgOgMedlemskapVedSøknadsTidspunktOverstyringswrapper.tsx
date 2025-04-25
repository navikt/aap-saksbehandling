'use client';

import { AutomatiskLovvalgOgMedlemskapVurdering, StegType } from 'lib/types/types';
import { ReactNode, useState } from 'react';
import { AutomatiskVurderingAvLovvalgOgMedlemskap } from 'components/behandlinger/lovvalg/automatiskvurderingavlovvalgogmedlemskap/AutomatiskVurderingAvLovvalgOgMedlemskap';
import { LovvalgOgMedlemskapVedSKnadstidspunkt } from 'components/behandlinger/lovvalg/lovvalgogmedlemskapvedsøknadstidspunkt/LovvalgOgMedlemskapVedSøknadstidspunkt';

interface Props {
  behandlingsReferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
  automatiskVurdering: AutomatiskLovvalgOgMedlemskapVurdering;
  stegSomSkalVises: Array<StegType>;
  erAktivtSteg: boolean;
  visOverstyrKnapp?: boolean;
  children: ReactNode;
}

export const LovvalgOgMedlemskapVedSøknadsTidspunktOverstyringsWrapper = ({
  children,
  automatiskVurdering,
  stegSomSkalVises,
  behandlingVersjon,
  erAktivtSteg,
  readOnly,
  visOverstyrKnapp,
}: Props) => {
  const [overstyring, setOverstyring] = useState<boolean>(false);

  return (
    <>
      <AutomatiskVurderingAvLovvalgOgMedlemskap
        vurdering={automatiskVurdering}
        setOverstyring={setOverstyring}
        visOverstyrKnapp={visOverstyrKnapp}
        visOverstyringsBehov={overstyring}
      />
      {children}
      {overstyring && stegSomSkalVises.length === 0 && (
        <LovvalgOgMedlemskapVedSKnadstidspunkt
          behandlingVersjon={behandlingVersjon}
          readOnly={readOnly}
          erAktivtSteg={erAktivtSteg}
          overstyring={true}
        />
      )}
    </>
  );
};

'use client';

import { AutomatiskLovvalgOgMedlemskapVurdering, MellomlagretVurdering, StegType } from 'lib/types/types';
import { ReactNode, useState } from 'react';
import { AutomatiskVurderingAvLovvalgOgMedlemskap } from 'components/behandlinger/lovvalg/automatiskvurderingavlovvalgogmedlemskap/AutomatiskVurderingAvLovvalgOgMedlemskap';
import { LovvalgOgMedlemskapVedSKnadstidspunkt } from 'components/behandlinger/lovvalg/lovvalgogmedlemskapvedsøknadstidspunkt/LovvalgOgMedlemskapVedSøknadstidspunkt';

interface Props {
  behandlingsReferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
  automatiskVurdering: AutomatiskLovvalgOgMedlemskapVurdering;
  stegSomSkalVises: Array<StegType>;
  visOverstyrKnapp?: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
  children: ReactNode;
}

export const LovvalgOgMedlemskapVedSøknadsTidspunktOverstyringsWrapper = ({
  children,
  automatiskVurdering,
  stegSomSkalVises,
  behandlingVersjon,
  readOnly,
  visOverstyrKnapp,
  initialMellomlagretVurdering,
}: Props) => {
  const [overstyring, setOverstyring] = useState<boolean>(initialMellomlagretVurdering !== undefined);

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
          overstyring={true}
          initialMellomlagretVurdering={initialMellomlagretVurdering}
        />
      )}
    </>
  );
};

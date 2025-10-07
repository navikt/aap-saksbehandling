'use client';

import { AutomatiskLovvalgOgMedlemskapVurdering, MellomlagretVurdering } from 'lib/types/types';
import { ReactNode, useState } from 'react';
import { AutomatiskVurderingAvLovvalgOgMedlemskap } from 'components/behandlinger/lovvalg/automatiskvurderingavlovvalgogmedlemskap/AutomatiskVurderingAvLovvalgOgMedlemskap';
import { LovvalgOgMedlemskapVedSøknadstidspunkt } from 'components/behandlinger/lovvalg/lovvalgogmedlemskapvedsøknadstidspunkt/LovvalgOgMedlemskapVedSøknadstidspunkt';
import { Behovstype } from 'lib/utils/form';

interface Props {
  behandlingsReferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
  automatiskVurdering: AutomatiskLovvalgOgMedlemskapVurdering;
  harAvklaringsbehov: boolean;
  visOverstyrKnapp?: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
  children: ReactNode;
  behovstype: Behovstype;
}

export const LovvalgOgMedlemskapVedSøknadsTidspunktOverstyringsWrapper = ({
  children,
  automatiskVurdering,
  harAvklaringsbehov,
  behandlingVersjon,
  readOnly,
  visOverstyrKnapp,
  initialMellomlagretVurdering,
  behovstype,
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
      {overstyring && !harAvklaringsbehov && (
        <LovvalgOgMedlemskapVedSøknadstidspunkt
          behandlingVersjon={behandlingVersjon}
          readOnly={readOnly}
          overstyring={true}
          initialMellomlagretVurdering={initialMellomlagretVurdering}
          behovstype={behovstype}
        />
      )}
    </>
  );
};

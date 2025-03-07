'use client';

import { AutomatiskLovvalgOgMedlemskapVurdering, StegType } from 'lib/types/types';
import { ReactNode, useState } from 'react';
import { AutomatiskVurderingForutgåendeMedlemskap } from 'components/behandlinger/forutgåendemedlemskap/automatiskvurderingforutgåendemedlemskap/AutomatiskVurderingForutgåendeMedlemskap';
import { ManuellVurderingForutgåendeMedlemskap } from 'components/behandlinger/forutgåendemedlemskap/manuellvurderingforutgåendemedlemskap/ManuellVurderingForutgåendeMedlemskap';

interface Props {
  behandlingsReferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
  automatiskVurdering: AutomatiskLovvalgOgMedlemskapVurdering;
  stegSomSkalVises: Array<StegType>;
  visOverstyrKnapp: boolean;
  children: ReactNode;
}

export const ForutgåendemedlemskapOverstyringswrapper = ({
  children,
  automatiskVurdering,
  stegSomSkalVises,
  behandlingVersjon,
  readOnly,
  visOverstyrKnapp,
}: Props) => {
  const [overstyring, setOverstyring] = useState<boolean>(false);
  return (
    <>
      <AutomatiskVurderingForutgåendeMedlemskap
        vurdering={automatiskVurdering}
        setOverstyring={setOverstyring}
        visOverstyrKnapp={visOverstyrKnapp}
        visOverstyringsBehov={overstyring}
      />
      {children}
      {overstyring && stegSomSkalVises.length === 0 && (
        <ManuellVurderingForutgåendeMedlemskap
          behandlingVersjon={behandlingVersjon}
          grunnlag={{ historiskeManuelleVurderinger: [] }}
          readOnly={readOnly}
          overstyring={true}
        />
      )}
    </>
  );
};

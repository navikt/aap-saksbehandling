'use client';

import { AutomatiskLovvalgOgMedlemskapVurdering, MellomlagretVurdering, StegType } from 'lib/types/types';
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
  harYrkesskade: boolean;
  children: ReactNode;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

export const ForutgåendemedlemskapOverstyringswrapper = ({
  children,
  automatiskVurdering,
  stegSomSkalVises,
  behandlingVersjon,
  readOnly,
  visOverstyrKnapp,
  harYrkesskade,
  initialMellomlagretVurdering,
}: Props) => {
  const [overstyring, setOverstyring] = useState<boolean>(initialMellomlagretVurdering !== undefined);
  return (
    <>
      <AutomatiskVurderingForutgåendeMedlemskap
        vurdering={automatiskVurdering}
        setOverstyring={setOverstyring}
        visOverstyrKnapp={visOverstyrKnapp}
        visOverstyringsBehov={overstyring}
        harYrkesskade={harYrkesskade}
      />
      {children}
      {overstyring && stegSomSkalVises.length === 0 && (
        <ManuellVurderingForutgåendeMedlemskap
          behandlingVersjon={behandlingVersjon}
          readOnly={readOnly}
          overstyring={true}
          initialMellomlagretVurdering={initialMellomlagretVurdering}
        />
      )}
    </>
  );
};

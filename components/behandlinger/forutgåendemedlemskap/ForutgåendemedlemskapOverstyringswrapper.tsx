'use client';

import { AutomatiskLovvalgOgMedlemskapVurdering, MellomlagretVurdering } from 'lib/types/types';
import { ReactNode, useState } from 'react';
import { AutomatiskVurderingForutgåendeMedlemskap } from 'components/behandlinger/forutgåendemedlemskap/automatiskvurderingforutgåendemedlemskap/AutomatiskVurderingForutgåendeMedlemskap';
import { ManuellVurderingForutgåendeMedlemskap } from 'components/behandlinger/forutgåendemedlemskap/manuellvurderingforutgåendemedlemskap/ManuellVurderingForutgåendeMedlemskap';

interface Props {
  behandlingsReferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
  automatiskVurdering: AutomatiskLovvalgOgMedlemskapVurdering;
  harAvklaringsbehov: boolean;
  visOverstyrKnapp: boolean;
  harYrkesskade: boolean;
  children: ReactNode;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

export const ForutgåendemedlemskapOverstyringswrapper = ({
  children,
  automatiskVurdering,
  harAvklaringsbehov,
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
      {overstyring && !harAvklaringsbehov && (
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

import { VStack } from '@navikt/ds-react';
import { alleLandUtenNorge } from 'lib/utils/countries';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { SpørsmålOgSvar } from 'components/sporsmaalogsvar/SpørsmålOgSvar';

type Props = {
  fraDato: string;
  begrunnelse: string;
  land: string | null | undefined;
  oppfyller: boolean;
};

const landSelectOptions = [alleLandUtenNorge[0], { label: 'Annet', value: 'ANNET' }, ...alleLandUtenNorge.slice(1)];

export const OppholdskravTidligereVurdering = ({ fraDato, begrunnelse, land, oppfyller }: Props) => {
  const valgtLand = landSelectOptions.find((option) => option.value === land)?.label ?? land ?? 'Annet';

  return (
    <VStack gap="5">
      <SpørsmålOgSvar spørsmål="Vurderingen gjelder fra?" svar={formaterDatoForFrontend(fraDato)} />
      <SpørsmålOgSvar spørsmål="Vilkårsvurdering" svar={begrunnelse} />
      <SpørsmålOgSvar spørsmål="Oppfyller brukerene vilkårene i § 11-3?" svar={oppfyller ? 'Ja' : 'Nei'} />
      {!oppfyller && <SpørsmålOgSvar spørsmål="Hvilket land oppholder brukeren seg i??" svar={valgtLand} />}
    </VStack>
  );
};

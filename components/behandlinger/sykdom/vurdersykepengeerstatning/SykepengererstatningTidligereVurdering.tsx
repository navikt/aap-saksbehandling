import { VStack } from '@navikt/ds-react';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { SpørsmålOgSvar } from 'components/sporsmaalogsvar/SpørsmålOgSvar';
import { SykepengeerstatningVurderingGrunn } from 'lib/types/types';
import { grunnOptions } from 'components/behandlinger/sykdom/vurdersykepengeerstatning/sykepengererstatning-utils';

type Props = {
  fraDato: string;
  begrunnelse: string;
  oppfyller: boolean;
  grunn: SykepengeerstatningVurderingGrunn | null | undefined;
};

export const OppholdskravSykepengererstatninbgTidligereVurdering = ({
  fraDato,
  begrunnelse,
  grunn,
  oppfyller,
}: Props) => {
  const valgtGtunn = grunnOptions.find((option) => option.value === grunn)?.label ?? grunn ?? 'Annet';

  return (
    <VStack gap="5">
      <SpørsmålOgSvar spørsmål="Vurderingen gjelder fra?" svar={formaterDatoForFrontend(fraDato)} />
      <SpørsmålOgSvar spørsmål="Vilkårsvurdering" svar={begrunnelse} />
      <SpørsmålOgSvar spørsmål="Har brukeren krav på sykepengeerstatning?" svar={oppfyller ? 'Ja' : 'Nei'} />
      {!oppfyller && (
        <SpørsmålOgSvar spørsmål="Hva er grunnen til at brukeren av krav på sykepengeerstatning?" svar={valgtGtunn} />
      )}
    </VStack>
  );
};

import { VStack } from '@navikt/ds-react';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { SpørsmålOgSvar } from 'components/sporsmaalogsvar/SpørsmålOgSvar';

type Props = {
  fraDato: string;
  tilDato: string | null | undefined;
  begrunnelse: string;
  oppfyller: boolean;
};

export const OvergangArbeidTidligereVurdering = ({ fraDato, tilDato, begrunnelse, oppfyller }: Props) => {
  return (
    <VStack gap="5">
      <SpørsmålOgSvar spørsmål="Vurderingen gjelder fra?" svar={formaterDatoForFrontend(fraDato)} />
      <SpørsmålOgSvar
        spørsmål="Vurderingen gjelder til?"
        svar={tilDato == null ? '—' : formaterDatoForFrontend(tilDato)}
      />
      <SpørsmålOgSvar spørsmål="Vilkårsvurdering" svar={begrunnelse} />
      <SpørsmålOgSvar
        spørsmål="Har brukeren krav AAP i perioden som arbeidssøker etter § 11-17?"
        svar={oppfyller ? 'Ja' : 'Nei'}
      />
    </VStack>
  );
};

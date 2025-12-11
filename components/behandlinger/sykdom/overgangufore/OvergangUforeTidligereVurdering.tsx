import { VStack } from '@navikt/ds-react';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { SpørsmålOgSvar } from 'components/sporsmaalogsvar/SpørsmålOgSvar';

type Props = {
  fraDato: string;
  begrunnelse: string;
  brukerHarSøktOmUføretrygd: boolean;
  brukerHarFåttVedtakOmUføretrygd: string | undefined | null;
  brukerRettPåAAP: boolean | undefined | null;
};

export const OvergangUforeTidligereVurdering = ({
  fraDato,
  begrunnelse,
  brukerHarSøktOmUføretrygd,
  brukerHarFåttVedtakOmUføretrygd,
  brukerRettPåAAP,
}: Props) => {
  return (
    <VStack gap="5">
      <SpørsmålOgSvar spørsmål="Vurderingen gjelder fra?" svar={formaterDatoForFrontend(fraDato)} />
      <SpørsmålOgSvar spørsmål="Vilkårsvurdering" svar={begrunnelse} />
      <SpørsmålOgSvar spørsmål="Har brukeren søkt om uføretrygd?" svar={brukerHarSøktOmUføretrygd ? 'Ja' : 'Nei'} />
      {brukerHarFåttVedtakOmUføretrygd && (
        <SpørsmålOgSvar
          spørsmål="Har brukeren fått vedtak på søknaden om uføretrygd?"
          svar={brukerHarFåttVedtakOmUføretrygd}
        />
      )}
      {brukerRettPåAAP === true ||
        (brukerRettPåAAP === false && (
          <SpørsmålOgSvar
            spørsmål="Har brukeren rett på AAP under behandling av krav om uføretrygd etter § 11-18?"
            svar={brukerRettPåAAP ? 'Ja' : 'Nei'}
          />
        ))}
    </VStack>
  );
};

import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { BodyShort, HStack, VStack } from '@navikt/ds-react';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';

type Props = {
  behandlingsreferanse: string;
};

export const AvklarOppfolgingsSteg = async ({ behandlingsreferanse }: Props) => {
  /* const grunnlag = await hentSvarFraAndreinstansGrunnlag(behandlingsreferanse); */
  const flyt = await hentFlyt(behandlingsreferanse);

  if (isError(flyt)) {
    return <ApiException apiResponses={[flyt]} />;
  }

  return (
    <GruppeSteg
      prosessering={flyt.data.prosessering}
      visning={flyt.data.visning}
      behandlingReferanse={behandlingsreferanse}
      behandlingVersjon={flyt.data.behandlingVersjon}
      aktivtSteg={flyt.data.aktivtSteg}
    >
      <VilkårsKort heading={'Oppsummering'} steg={'AVKLAR_OPPFØLGING'}>
        <VStack gap={'4'}>
          <HStack gap="2">
            <BodyShort weight="semibold">Svartype fra Kabal:</BodyShort>
          </HStack>
        </VStack>
      </VilkårsKort>
    </GruppeSteg>
  );
};

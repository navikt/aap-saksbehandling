import { YrkesskadeMedDataFetching } from 'components/behandlinger/sykdom/yrkesskade/YrkesskadeMedDataFetching';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { SykdomsvurderingMedDataFetching } from 'components/behandlinger/sykdom/sykdomsvurdering/SykdomsvurderingMedDataFetching';
import { hentFlyt2 } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { getToken } from 'lib/auth/authentication';
import { headers } from 'next/headers';
import { Meldeplikt } from 'components/behandlinger/sykdom/meldeplikt/Meldeplikt';
import { Oppfølging } from 'components/behandlinger/sykdom/oppfølging/Oppfølging';
import { getStegSomSkalVises } from 'lib/utils/steg';

interface Props {
  behandlingsReferanse: string;
}

export const Sykdom = async ({ behandlingsReferanse }: Props) => {
  const flyt = await hentFlyt2(behandlingsReferanse, getToken(headers()));

  const stegSomSkalVises = getStegSomSkalVises('SYKDOM', flyt);

  return (
    <>
      {stegSomSkalVises.map((steg) => {
        if (steg === 'AVKLAR_YRKESSKADE') {
          return (
            <StegSuspense key={steg}>
              <YrkesskadeMedDataFetching behandlingsReferanse={behandlingsReferanse} />
            </StegSuspense>
          );
        }
        if (steg === 'AVKLAR_SYKDOM') {
          return (
            <StegSuspense key={steg}>
              <SykdomsvurderingMedDataFetching behandlingsReferanse={behandlingsReferanse} />
            </StegSuspense>
          );
        }
      })}

      <Meldeplikt />

      <Oppfølging />
    </>
  );
};

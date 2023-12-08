import { YrkesskadeMedDataFetching } from 'components/behandlinger/sykdom/yrkesskade/YrkesskadeMedDataFetching';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { SykdomsvurderingMedDataFetching } from 'components/behandlinger/sykdom/sykdomsvurdering/SykdomsvurderingMedDataFetching';
import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { getToken } from 'lib/auth/authentication';
import { headers } from 'next/headers';
import { getStegSomSkalVises } from 'lib/utils/steg';
import { OppfølgingMedDataFetching } from 'components/behandlinger/sykdom/oppfølging/OppfølgingMedDataFetching';
import { MeldepliktMedDataFetching } from 'components/behandlinger/sykdom/meldeplikt/MeldepliktMedDataFetching';
import { StudentMedDataFetching } from 'components/behandlinger/sykdom/student/StudentMedDataFetching';
import { UutnyttetArbeidsevneMedDataFetching } from 'components/behandlinger/sykdom/uutnyttetarbeidsevne/UutnyttetArbeidsevneMedDataFetching';
import { SykepengeerstatningMedDataFetching } from 'components/behandlinger/sykdom/vurdersykepengeerstatning/SykepengeerstatningMedDataFetching';

interface Props {
  behandlingsReferanse: string;
}

export const Sykdom = async ({ behandlingsReferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsReferanse, getToken(headers()));

  const stegSomSkalVises = getStegSomSkalVises('SYKDOM', flyt);

  return (
    <>
      {stegSomSkalVises.map((steg) => {
        if (steg === 'AVKLAR_STUDENT') {
          return (
            <StegSuspense key={steg}>
              <StudentMedDataFetching behandlingsReferanse={behandlingsReferanse} />
            </StegSuspense>
          );
        }
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
        if (steg === 'FRITAK_MELDEPLIKT') {
          return (
            <StegSuspense key={steg}>
              <MeldepliktMedDataFetching behandlingsReferanse={behandlingsReferanse} />
            </StegSuspense>
          );
        }
        if (steg === 'VURDER_BISTANDSBEHOV') {
          return (
            <StegSuspense key={steg}>
              <OppfølgingMedDataFetching behandlingsReferanse={behandlingsReferanse} />
            </StegSuspense>
          );
        }
        if (steg === 'VURDER_UUTNYTTET_ARBEIDSEVNE') {
          return (
            <StegSuspense key={steg}>
              <UutnyttetArbeidsevneMedDataFetching />
            </StegSuspense>
          );
        }
        if (steg === 'VURDER_SYKEPENGEERSTATNING') {
          return (
            <StegSuspense key={steg}>
              <SykepengeerstatningMedDataFetching behandlingsReferanse={behandlingsReferanse} />
            </StegSuspense>
          );
        }
      })}
    </>
  );
};

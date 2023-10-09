import style from './Sykdom.module.css';
import { YrkesskadeMedDataFetching } from 'components/behandlinger/sykdom/yrkesskade/YrkesskadeMedDataFetching';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { SykdomsvurderingMedDataFetching } from 'components/behandlinger/sykdom/sykdomsvurdering/SykdomsvurderingMedDataFetching';
import { hentFlyt2 } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { getToken } from 'lib/auth/authentication';
import { headers } from 'next/headers';
import { BehandlingFlytOgTilstand2 } from 'lib/types/types';

const getStegSomSkalVises = (flyt: BehandlingFlytOgTilstand2) => {
  const sykdomsgruppe = flyt.flyt.find((flyt2) => flyt2.stegGruppe === 'SYKDOM');
  return (
    sykdomsgruppe?.steg
      .filter((steg) => steg.avklaringsbehov.length > 0)
      .map((steg) => {
        console.log('steg', steg);
        return {
          type: steg.stegType,
          status: steg.avklaringsbehov.every((avklaringsbehov) => avklaringsbehov.status === 'AVSLUTTET')
            ? 'AVSLUTTET'
            : 'OPPRETTET',
        };
      }) ?? []
  );
};

interface Props {
  behandlingsReferanse: string;
}

export const Sykdom = async ({ behandlingsReferanse }: Props) => {
  const flyt = await hentFlyt2(behandlingsReferanse, getToken(headers()));

  const stegSomSkalVises = getStegSomSkalVises(flyt);

  console.log('stegSomSkalVises', stegSomSkalVises);

  return (
    <div className={style.sykdom}>
      {stegSomSkalVises.map((steg) => {
        if (steg.type === 'AVKLAR_YRKESSKADE') {
          return (
            <StegSuspense key={steg.type}>
              <YrkesskadeMedDataFetching behandlingsReferanse={behandlingsReferanse} status={steg.status} />
            </StegSuspense>
          );
        }
        if (steg.type === 'AVKLAR_SYKDOM') {
          return (
            <StegSuspense key={steg.type}>
              <SykdomsvurderingMedDataFetching behandlingsReferanse={behandlingsReferanse} status={steg.status} />
            </StegSuspense>
          );
        }
      })}

      {/*<Meldeplikt />

    <Oppfølging />*/}
    </div>
  );
};

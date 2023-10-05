import style from './Sykdom.module.css';
import { YrkesskadeMedDataFetching } from 'components/behandlinger/sykdom/yrkesskade/YrkesskadeMedDataFetching';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { SykdomsvurderingMedDataFetching } from 'components/behandlinger/sykdom/sykdomsvurdering/SykdomsvurderingMedDataFetching';
import { Meldeplikt } from 'components/behandlinger/sykdom/meldeplikt/Meldeplikt';
import { Oppfølging } from 'components/behandlinger/sykdom/oppfølging/Oppfølging';

interface Props {
  behandlingsReferanse: string;
}

export const Sykdom = async ({ behandlingsReferanse }: Props) => {
  return (
    <div className={style.sykdom}>
      <StegSuspense>
        <YrkesskadeMedDataFetching behandlingsReferanse={behandlingsReferanse} />
      </StegSuspense>

      <StegSuspense>
        <SykdomsvurderingMedDataFetching behandlingsReferanse={behandlingsReferanse} />
      </StegSuspense>

      <Meldeplikt />

      <Oppfølging />
    </div>
  );
};

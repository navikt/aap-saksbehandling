import { Yrkesskade } from './yrkesskade/Yrkesskade';
import { Sykdomsvurdering } from './sykdomsvurdering/Sykdomsvurdering';
import style from './Sykdom.module.css';
import { Meldeplikt } from 'components/behandlinger/sykdom/meldeplikt/Meldeplikt';
import { Oppfølging } from 'components/behandlinger/sykdom/oppfølging/Oppfølging';
import { hentSykdomsGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { getToken } from 'lib/auth/authentication';
import { headers } from 'next/headers';

interface Props {
  behandlingsReferanse: string;
}

export const Sykdom = async ({ behandlingsReferanse }: Props) => {
  const sykdomsGrunnlag = await hentSykdomsGrunnlag(behandlingsReferanse, getToken(headers()));
  return (
    <div className={style.sykdom}>
      <Yrkesskade behandlingsReferanse={behandlingsReferanse} sykdomsGrunnlag={sykdomsGrunnlag} />

      <Sykdomsvurdering behandlingsReferanse={behandlingsReferanse} sykdomsgrunnlag={sykdomsGrunnlag} />

      <Meldeplikt />

      <Oppfølging />
    </div>
  );
};

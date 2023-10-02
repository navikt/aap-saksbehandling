import { Sykdom } from 'components/behandlinger/sykdom/Sykdom';
import { hentSykdomsGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { getToken } from 'lib/auth/authentication';
import { headers } from 'next/headers';
import { StegGruppe } from '../../lib/types/types';

interface Props {
  className: string;
  behandlingsReferanse: string;
  aktivGruppe: StegGruppe;
}

export const OppgaveKolonne = async ({ className, behandlingsReferanse, aktivGruppe }: Props) => {
  const sykdomsGrunnlag = await hentSykdomsGrunnlag(behandlingsReferanse, getToken(headers()));

  return (
    <div className={className}>
      {aktivGruppe === 'SYKDOM' && (
        <Sykdom sykdomsGrunnlag={sykdomsGrunnlag} behandlingsReferanse={behandlingsReferanse} />
      )}
    </div>
  );
};

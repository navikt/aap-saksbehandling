import { Sykdom } from 'components/behandlinger/sykdom/Sykdom';
import { hentSykdomsGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { getToken } from 'lib/auth/authentication';
import { headers } from 'next/headers';
import { ForeslåVedtak } from 'components/behandlinger/foreslåVedtak/ForeslåVedtak';

interface Props {
  className: string;
  behandlingsReferanse: string;
  behandlingsType: string;
}

export const OppgaveKolonne = async ({ className, behandlingsReferanse, behandlingsType }: Props) => {
  const sykdomsGrunnlag = await hentSykdomsGrunnlag(behandlingsReferanse, getToken(headers()));

  return (
    <div className={className}>
      {behandlingsType === 'AVKLAR_SYKDOM' && (
        <Sykdom sykdomsGrunnlag={sykdomsGrunnlag} behandlingsReferanse={behandlingsReferanse} />
      )}
      {behandlingsType === 'FORESLÅ_VEDTAK' && <ForeslåVedtak />}
    </div>
  );
};

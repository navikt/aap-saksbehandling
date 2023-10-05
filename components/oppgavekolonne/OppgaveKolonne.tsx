import { Sykdom } from 'components/behandlinger/sykdom/Sykdom';
import { StegGruppe } from 'lib/types/types';
import { ForeslåVedtak } from 'components/behandlinger/foreslåvedtak/ForeslåVedtak';

interface Props {
  className: string;
  behandlingsReferanse: string;
  aktivGruppe: StegGruppe;
}

export const OppgaveKolonne = async ({ className, behandlingsReferanse, aktivGruppe }: Props) => {
  return (
    <div className={className}>
      {aktivGruppe === 'SYKDOM' && <Sykdom behandlingsReferanse={behandlingsReferanse} />}
      {aktivGruppe === 'FORESLÅ_VEDTAK' && <ForeslåVedtak />}
    </div>
  );
};

import { Tag } from '@navikt/ds-react';
import { ArrowsSquarepathIcon } from '@navikt/aksel-icons';
import { returStatusTilTekst } from 'components/oppgaveliste/returboks/Returboks';
import { NoNavAapOppgaveReturInformasjonStatus } from '@navikt/aap-oppgave-typescript-types';

interface Props {
  returStatus: NoNavAapOppgaveReturInformasjonStatus;
}

export const ReturStatus = ({ returStatus }: Props) => {
  return (
    <Tag data-color="meta-purple" icon={<ArrowsSquarepathIcon />} variant={'moderate'} size={'small'}>
      {returStatusTilTekst(returStatus)}
    </Tag>
  );
};

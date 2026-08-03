import { NoNavAapOppgaveReturInformasjonDtoStatus } from '@navikt/aap-oppgave-typescript-types';
import { ArrowsSquarepathIcon } from '@navikt/aksel-icons';
import { Tag } from '@navikt/ds-react';

import { returStatusTilTekst } from 'components/oppgaveliste/returboks/ReturInfoUtils';

interface Props {
  returStatus: NoNavAapOppgaveReturInformasjonDtoStatus;
}

export const ReturStatus = ({ returStatus }: Props) => {
  return (
    <Tag data-color="meta-purple" icon={<ArrowsSquarepathIcon />} variant={'moderate'} size={'small'}>
      {returStatusTilTekst(returStatus)}
    </Tag>
  );
};

import { ArrowsSquarepathIcon } from '@navikt/aksel-icons';
import { Tag } from '@navikt/ds-react';
import { ReturStatus as ReturStatusType } from 'lib/types/oppgaveTypes';

import { returStatusTilTekst } from 'components/oppgaveliste/returboks/ReturInfoUtils';

interface Props {
  returStatus: ReturStatusType;
}

export const ReturStatus = ({ returStatus }: Props) => {
  return (
    <Tag data-color="meta-purple" icon={<ArrowsSquarepathIcon />} variant={'moderate'} size={'small'}>
      {returStatusTilTekst(returStatus)}
    </Tag>
  );
};

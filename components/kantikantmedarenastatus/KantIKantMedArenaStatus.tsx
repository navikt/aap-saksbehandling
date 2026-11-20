import { Tag } from '@navikt/ds-react';
import { LinkIcon } from '@navikt/aksel-icons';

export const KantIKantMedArenaStatus = () => {
  return (
    <Tag data-color="meta-purple" icon={<LinkIcon />} variant={'moderate'} size={'small'}>
      Kant i kant med Arena
    </Tag>
  );
};

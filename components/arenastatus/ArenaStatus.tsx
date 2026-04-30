import { Tag } from '@navikt/ds-react';
import { ClockDashedIcon } from '@navikt/aksel-icons';

export const ArenaStatus = () => {
  return (
    <Tag data-color="meta-purple" icon={<ClockDashedIcon />} variant={'moderate'} size={'small'}>
      Arenahistorikk
    </Tag>
  );
};

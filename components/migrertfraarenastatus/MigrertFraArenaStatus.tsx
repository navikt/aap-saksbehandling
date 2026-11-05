import { Tag } from '@navikt/ds-react';
import { MigrationIcon } from '@navikt/aksel-icons';

export const MigrertFraArenaStatus = () => {
  return (
    <Tag data-color="meta-purple" icon={<MigrationIcon />} variant={'moderate'} size={'small'}>
      Migrert fra Arena
    </Tag>
  );
};

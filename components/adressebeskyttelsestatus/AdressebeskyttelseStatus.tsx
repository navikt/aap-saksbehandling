import { Tag, TagProps } from '@navikt/ds-react';

import { ShieldLockIcon } from '@navikt/aksel-icons';
import { Adressebeskyttelsesgrad } from 'lib/utils/adressebeskyttelse';

interface Props {
  adressebeskyttelsesGrad: Adressebeskyttelsesgrad;
  size?: TagProps['size'];
  showLabel?: boolean;
}

export const AdressebeskyttelseStatus = ({ adressebeskyttelsesGrad, size = 'small', showLabel = true }: Props) => {
  return (
    <Tag data-color="warning" icon={<ShieldLockIcon />} variant={'moderate'} size={size}>
      {showLabel && adressebeskyttelsesGrad}
    </Tag>
  );
};

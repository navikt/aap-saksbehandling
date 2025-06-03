import { Tag } from '@navikt/ds-react';
import styles from 'components/oppgavestatus/OppgaveStatus.module.css';
import { ShieldLockIcon } from '@navikt/aksel-icons';
import { Adressebeskyttelsesgrad } from 'lib/utils/adressebeskyttelse';

interface Props {
  adressebeskyttelsesGrad: Adressebeskyttelsesgrad;
}

export const AdressebeskyttelseStatus = ({ adressebeskyttelsesGrad }: Props) => {
  return (
    <Tag className={styles.tag} icon={<ShieldLockIcon />} variant={'warning-moderate'} size={'small'}>
      {adressebeskyttelsesGrad}
    </Tag>
  );
};

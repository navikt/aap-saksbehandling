import { Tag } from '@navikt/ds-react';
import { ArrowsSquarepathIcon } from '@navikt/aksel-icons';
import { returStatusTilTekst } from 'components/oppgaveliste/returboks/Returboks';
import { NoNavAapOppgaveReturInformasjonStatus } from '@navikt/aap-oppgave-typescript-types';
import styles from './ReturStatus.module.css';

interface Props {
  returStatus: NoNavAapOppgaveReturInformasjonStatus;
}

export const ReturStatus = ({ returStatus }: Props) => {
  return (
    <Tag
      data-color="warning"
      className={styles.tag}
      icon={<ArrowsSquarepathIcon />}
      variant={"moderate"}
      size={'small'}>
      {returStatusTilTekst(returStatus)}
    </Tag>
  );
};

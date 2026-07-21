import { HStack } from '@navikt/ds-react/Stack';
import { BodyShort } from '@navikt/ds-react/Typography';
import styles from './OppsummeringTimer.module.css';
import { replaceDotsWithCommas } from 'components/saksoversikt/meldekortoversikt/redigermeldekortmodal/RedigerMeldekortModal';

interface Props {
  timer: number;
}

export const OppsummeringTimer = ({ timer }: Props) => {
  return (
    <HStack className={styles.oppsummering} justify={'space-between'}>
      <BodyShort size={'small'} weight={'semibold'}>
        Sammenlagt for perioden
      </BodyShort>
      <BodyShort size={'small'}>{replaceDotsWithCommas(timer.toString())} timer</BodyShort>
    </HStack>
  );
};

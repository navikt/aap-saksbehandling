import { Heading, HStack } from '@navikt/ds-react';
import { RettighetDto } from 'lib/types/types';
import { formaterDatoForFrontend, formaterPeriode } from 'lib/utils/date';
import styles from './Rettighetsoversikt.module.css';

interface Props {
  rettighetsdata: RettighetDto;
}

enum Rettighetstype {
  BISTANDSBEHOV,
  SYKEPENGEERSTATNING,
  STUDENT,
  ARBEIDSSØKER,
  VURDERES_FOR_UFØRETRYGD,
}

export const Rettighet = ({ rettighetsdata }: Props) => {
  const erRettighetKvotebasert = [Rettighetstype.ARBEIDSSØKER, Rettighetstype.SYKEPENGEERSTATNING].includes(
    Rettighetstype[rettighetsdata.type]
  );

  return (
    <div className={styles.rettighet}>
      <Heading size="small">{hentRettighetstypeVisning(rettighetsdata)}</Heading>
      {erRettighetKvotebasert && (
        <HStack>
          <div className={styles.data}>
            <p>Kvote</p>
            <p>{rettighetsdata.kvote}</p>
          </div>
          <div className={styles.data}>
            <p>Brukt til nå</p>
            <p>{rettighetsdata.bruktKvote}</p>
          </div>
          <div className={styles.data}>
            <p>Gjenstående</p>
            <p>{rettighetsdata.gjenværendeKvote}</p>
          </div>
          <div className={`${styles.data} ${styles.marginTop}`}>
            <p>Maksdato:</p>
            <p className={styles.fetSkrift}>{formaterDatoForFrontend(rettighetsdata.maksDato)}</p>
          </div>
        </HStack>
      )}
      {!erRettighetKvotebasert && (
        <div className={styles.data}>
          <p>Rettighet</p>
          <p>{formaterPeriode(rettighetsdata.startDato, rettighetsdata.maksDato)}</p>
        </div>
      )}
    </div>
  );
};

function hentRettighetstypeVisning(rettighet: RettighetDto): string {
  switch (Rettighetstype[rettighet.type]) {
    case Rettighetstype.BISTANDSBEHOV:
      return '§11-6 Ordinær';
    case Rettighetstype.SYKEPENGEERSTATNING:
      return '§11-13 Sykepengeerstatning';
    case Rettighetstype.STUDENT:
      return '§11-14 Student';
    case Rettighetstype.ARBEIDSSØKER:
      return '§11-17 Arbeidsssøker';
    case Rettighetstype.VURDERES_FOR_UFØRETRYGD:
      return '§11-18 Vurderes for uføretrygd';
  }
}

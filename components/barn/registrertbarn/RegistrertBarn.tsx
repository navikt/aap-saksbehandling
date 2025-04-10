import { BodyShort, Detail } from '@navikt/ds-react';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { IdentifisertBarn } from 'lib/types/types';

import styles from './RegistrertBarn.module.css';
import { kalkulerAlder } from 'components/behandlinger/alder/Alder';
import { ChildEyesIcon } from '@navikt/aksel-icons';

interface Props {
  registrertBarn: IdentifisertBarn;
  navn: string;
}

export const RegistrertBarn = ({ registrertBarn, navn }: Props) => {
  return (
    <section className={styles.barn}>
      <div>
        <ChildEyesIcon title={`registrert barn ${registrertBarn.ident}`} fontSize={'2rem'} />
      </div>
      <div className={styles.tekst}>
        <Detail className={styles.detailgray}>Folkeregistrert barn</Detail>
        <BodyShort size={'small'}>
          {navn}, {registrertBarn.ident.identifikator} ({kalkulerAlder(new Date(registrertBarn.fødselsdato))})
        </BodyShort>
        <BodyShort size={'small'}>
          Forsørgerperiode: {formaterDatoForFrontend(registrertBarn.forsorgerPeriode.fom)}
          {` - ${registrertBarn.forsorgerPeriode.tom ? `${formaterDatoForFrontend(registrertBarn.forsorgerPeriode.tom)}` : ''}`}
        </BodyShort>
      </div>
    </section>
  );
};

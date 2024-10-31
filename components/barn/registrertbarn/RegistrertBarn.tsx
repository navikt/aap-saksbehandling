import { BodyShort } from '@navikt/ds-react';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { IdentifisertBarn } from 'lib/types/types';

import styles from './RegistrertBarn.module.css';
import { kalkulerAlder } from 'components/behandlinger/alder/Alder';

interface Props {
  registrertBarn: IdentifisertBarn;
  navn: string;
}

export const RegistrertBarn = ({ registrertBarn, navn }: Props) => {
  return (
    <section className={styles.barn}>
      <BodyShort size={'small'} spacing>
        {navn}, {registrertBarn.ident.identifikator} ({kalkulerAlder(new Date(registrertBarn.fødselsdato))})
      </BodyShort>
      <BodyShort size={'small'} spacing>
        Folkeregistrert barn
      </BodyShort>
      <BodyShort size={'small'}>
        Forsørgerperiode: {formaterDatoForFrontend(registrertBarn.forsorgerPeriode.fom)}
        {` - ${registrertBarn.forsorgerPeriode.tom ? `${formaterDatoForFrontend(registrertBarn.forsorgerPeriode.tom)}` : ''}`}
      </BodyShort>
    </section>
  );
};

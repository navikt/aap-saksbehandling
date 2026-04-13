import { BodyShort, Detail, Tag } from '@navikt/ds-react';
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
          {navn}, {registrertBarn?.ident?.identifikator} (
          {registrertBarn.fodselsDato ? kalkulerAlder(new Date(registrertBarn.fodselsDato)) : 'Ukjent alder'})
          {registrertBarn.dodsDato ? (
            <Tag variant="alt1" data-color="neutral">
              Død
            </Tag>
          ) : null}
        </BodyShort>
        <BodyShort size={'small'}>
          {registrertBarn.fodselsDato
            ? 'Født:' + formaterDatoForFrontend(registrertBarn.fodselsDato)
            : 'Født: ' + 'Ukjent dato'}
        </BodyShort>
        <BodyShort size={'small'}>
          {registrertBarn.dodsDato
            ? 'Død:' + formaterDatoForFrontend(registrertBarn.dodsDato)
            : 'Fyller 18 år: ' +
              `${registrertBarn?.forsorgerPeriode?.tom ? `${formaterDatoForFrontend(registrertBarn.forsorgerPeriode.tom)}` : 'Ukjent dato'}`}
        </BodyShort>
      </div>
    </section>
  );
};

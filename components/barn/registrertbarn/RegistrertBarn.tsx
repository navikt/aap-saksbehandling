import { BodyShort, ExpansionCard, Heading, Label } from '@navikt/ds-react';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { IdentifisertBarn } from 'lib/types/types';

import styles from './RegistrertBarn.module.css';
import { kalkulerAlder } from 'components/behandlinger/alder/Alder';

interface Props {
  registrertBarn: IdentifisertBarn;
}

export const RegistrertBarn = ({ registrertBarn }: Props) => {
  return (
    <ExpansionCard aria-label={'registrert-barn'} size={'small'} defaultOpen={true} className={styles.barn}>
      <ExpansionCard.Header>
        <ExpansionCard.Title>
          <div>
            <Heading size={'small'}>Eget barn - {registrertBarn.ident.identifikator}</Heading>
            <BodyShort size={'small'}>Barnet sitt navn ({kalkulerAlder(new Date(registrertBarn.fødselsdato))})</BodyShort>
          </div>
        </ExpansionCard.Title>
      </ExpansionCard.Header>
      <ExpansionCard.Content>
        <div>
          <Label>Forsørgerperiode</Label>
          <BodyShort>
            {formaterDatoForFrontend(registrertBarn.forsorgerPeriode.fom)}{' '}
            {` - ${registrertBarn.forsorgerPeriode.tom ? `${formaterDatoForFrontend(registrertBarn.forsorgerPeriode.tom)}` : ''}`}
          </BodyShort>
        </div>
      </ExpansionCard.Content>
    </ExpansionCard>
  );
};

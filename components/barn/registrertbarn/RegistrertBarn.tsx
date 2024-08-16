import React from 'react';
import styles from 'components/barn/Barn.module.css';
import { BodyShort, ExpansionCard, Heading, Label } from '@navikt/ds-react';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { IdentifisertBarn } from 'lib/types/types';

interface Props {
  registrertBarn: IdentifisertBarn;
}

export const RegistrertBarn = ({ registrertBarn }: Props) => {
  return (
    <ExpansionCard aria-label={'registrert-barn'} size={'small'} defaultOpen={true} className={styles.barn}>
      <ExpansionCard.Header>
        <ExpansionCard.Title>
          <div>
            <Heading size={'small'}>{registrertBarn.ident.identifikator}</Heading>
            <BodyShort size={'small'}>Eget barn</BodyShort>
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

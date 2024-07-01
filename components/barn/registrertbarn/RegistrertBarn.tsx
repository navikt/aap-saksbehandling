import React from 'react';
import styles from 'components/barn/Barn.module.css';
import { BodyShort, ExpansionCard, Heading, Label } from '@navikt/ds-react';
import { formaterDatoForFrontend } from 'lib/utils/date';

export interface RegistrertBarnType {
  navn: string;
  ident: string;
  forsørgerPeriode: { fom: string; tom?: string };
}

interface Props {
  registrertBarn: RegistrertBarnType;
}

export const RegistrertBarn = ({ registrertBarn }: Props) => {
  return (
    <ExpansionCard aria-label={'registrert-barn'} size={'small'} defaultOpen={true} className={styles.barn}>
      <ExpansionCard.Header>
        <ExpansionCard.Title>
          <div>
            <Heading size={'small'}>
              {registrertBarn.navn} - {registrertBarn.ident}
            </Heading>
            <BodyShort size={'small'}>Eget barn</BodyShort>
          </div>
        </ExpansionCard.Title>
      </ExpansionCard.Header>
      <ExpansionCard.Content>
        <div>
          <Label>Forsørgerperiode</Label>
          <BodyShort>
            {formaterDatoForFrontend(registrertBarn.forsørgerPeriode.fom)}{' '}
            {` - ${registrertBarn.forsørgerPeriode.tom ? `${formaterDatoForFrontend(registrertBarn.forsørgerPeriode.tom)}` : ''}`}
          </BodyShort>
        </div>
      </ExpansionCard.Content>
    </ExpansionCard>
  );
};

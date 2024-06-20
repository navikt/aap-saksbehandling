import React from 'react';
import { JobbDto } from 'lib/types/types';
import { Alert, BodyShort, Label } from '@navikt/ds-react';

import styles from './FeilendeJobber.module.css';

interface Props {
  jobber: JobbDto[];
}

export const FeilendeJobber = ({ jobber }: Props) => {
  const harFeilendeJobber = jobber.length > 0;

  return (
    <div className={'flex-column'}>
      {harFeilendeJobber ? (
        <Alert variant={'error'}>Det finnes {jobber.length} feilede jobb(er)</Alert>
      ) : (
        <Alert variant={'success'}>Alt kjører OK</Alert>
      )}
      {jobber.length === 0 ? (
        <BodyShort>Ingen feilende jobber</BodyShort>
      ) : (
        <div>
          {jobber.map((jobb, index) => (
            <div key={index} className={`${styles.feilendeJobb} flex-column`}>
              <div className={'flex-row'}>
                <div>
                  <Label>Type</Label>
                  <BodyShort>{jobb.type}</BodyShort>
                </div>

                <div>
                  <Label>Status</Label>
                  <BodyShort>{jobb.status}</BodyShort>
                </div>

                <div>
                  <Label>Antall feilende forsøk</Label>
                  <BodyShort>{jobb.antallFeilendeForsøk}</BodyShort>
                </div>
              </div>

              <div>
                <Label>Feilmelding</Label>
                <BodyShort>{jobb.feilmelding}</BodyShort>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

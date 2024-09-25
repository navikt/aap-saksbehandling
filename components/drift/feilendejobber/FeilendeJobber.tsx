'use client';

import React, { useState } from 'react';
import { JobbInfo } from 'lib/types/types';
import { Alert, BodyShort, Button, Heading, HStack, Label, VStack } from '@navikt/ds-react';

import styles from 'components/drift/feilendejobber/FeilendeJobber.module.css';
import { avbrytKjørendeJobb, rekjørJobb } from 'lib/clientApi';
import { objectToMap } from 'components/drift/jobbtabell/JobbTabell';

interface Props {
  jobber: JobbInfo[];
}

export const FeilendeJobber = ({ jobber }: Props) => {
  const [isLoadingRekjørJobb, setIsLoadingRekjørJobb] = useState<boolean>(false);
  const [isLoadingAvbrytJobb, setIsLoadingAvbrytJobb] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const harFeilendeJobber = jobber.length > 0;

  async function onRekjørJobbClick(id: number) {
    setIsLoadingRekjørJobb(true);
    try {
      const rekjørRes = await rekjørJobb(id);
      if (rekjørRes.ok) {
        const message = await rekjørRes.text();
        setMessage(message);
      } else {
        const message = await rekjørRes.text();
        setMessage(message);
      }
    } catch (err) {
      setMessage('Noe gikk galt');
      setIsLoadingRekjørJobb(false);
    }
    setIsLoadingRekjørJobb(false);
  }

  async function onAvbrytJobbClick(id: number) {
    setIsLoadingAvbrytJobb(true);
    try {
      const res = await avbrytKjørendeJobb(id);
      if (res.ok) {
        const message = await res.text();
        setMessage(message);
      } else {
        const message = await res.text();
        setMessage(message);
      }
    } catch (err) {
      setMessage('Noe gikk galt');
      setIsLoadingAvbrytJobb(false);
    }
    setIsLoadingAvbrytJobb(false);
  }

  return (
    <VStack>
      <Heading size={'small'} level={'3'} spacing>
        Feilende jobber
      </Heading>
      {harFeilendeJobber ? (
        <Alert variant={'error'}>Det finnes {jobber.length} feilede jobb(er)</Alert>
      ) : (
        <Alert variant={'success'}>Det finnes ingen feilende jobber</Alert>
      )}
      {harFeilendeJobber && (
        <VStack>
          {jobber.map((jobb, index) => (
            <div key={index} className={`${styles.feilendeJobb} flex-column`}>
              <div className={styles.topWrapper}>
                <div className={styles.metaData}>
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

                  <div>
                    <Label>ID</Label>
                    <BodyShort>{jobb.id}</BodyShort>
                  </div>
                </div>
                <div>
                  <HStack justify={'end'} gap={'4'}>
                    <Button loading={isLoadingRekjørJobb} onClick={() => onRekjørJobbClick(jobb.id)}>
                      Rekjør
                    </Button>
                    <Button loading={isLoadingAvbrytJobb} onClick={() => onAvbrytJobbClick(jobb.id)}>
                      Avbryt
                    </Button>
                  </HStack>
                  {message && <BodyShort>{message}</BodyShort>}
                </div>
              </div>

              <div>
                <Label>Feilmelding</Label>
                <BodyShort size={'small'}>{jobb.feilmelding}</BodyShort>
              </div>

              {[...objectToMap(jobb.metadata)].map(([key, value]) => {
                return (
                  <div key={key}>
                    <Label>{key}</Label>
                    <BodyShort>{value}</BodyShort>
                  </div>
                );
              })}
            </div>
          ))}
        </VStack>
      )}
    </VStack>
  );
};

'use client';

import React, { FormEvent, useState } from 'react';
import { Alert, Button, HStack, Label, Modal, Pagination, Radio, VStack } from '@navikt/ds-react';
import { SaksbehandlerSøk } from 'components/tildeloppgavemodal/SaksbehandlerSøk';
import { SaksbehandlerFraSøk } from 'lib/types/oppgaveTypes';
import { useForm } from 'react-hook-form';
import { RadioGroupWrapper } from 'components/form/radiogroupwrapper/RadioGroupWrapper';
import { clientTildelTilSaksbehandler } from 'lib/clientApi';
import styles from './TildelOppgaveModal.module.css';

interface Props {
  oppgaver: number[];
  isOpen: boolean;
  onClose: () => void;
}

interface FormFields {
  saksbehandlerIdent: string;
}

export const TildelOppgaveModal = ({ oppgaver, isOpen, onClose }: Props) => {
  const [saksbehandlere, setSaksbehandlere] = useState<SaksbehandlerFraSøk[]>([]);
  const [søketekst, setSøketekst] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pageState, setPageState] = useState(1);
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();

  const saksbehandlerePerPage = 7;
  const skalVisePaginering = saksbehandlere.length > saksbehandlerePerPage;
  const antallSider = skalVisePaginering ? Math.ceil(saksbehandlere.length / saksbehandlerePerPage) : 1;
  const saksbehandlereForValgtSide = skalVisePaginering
    ? saksbehandlere.slice((pageState - 1) * saksbehandlerePerPage, pageState * saksbehandlerePerPage)
    : saksbehandlere;

  const form = useForm<FormFields>();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    await form.handleSubmit(async (data) => {
      setIsLoading(true);
      const res = await clientTildelTilSaksbehandler(oppgaver, data.saksbehandlerIdent);
      if (res.type == 'ERROR') {
        setError(res.apiException.message);
      } else {
        setError(undefined);
        setSuccess(`Oppgave(r) ble tildelt saksbehandler med ident ${data.saksbehandlerIdent}`);
      }
      setIsLoading(false);
    })(event);
  };

  return (
    <Modal
      open={isOpen}
      onClose={() => {
        setSaksbehandlere([]);
        setSøketekst('');
        setError(undefined);
        setSuccess(undefined);
        onClose();
      }}
      header={{ heading: 'Tildel oppgave' }}
      className={styles.tildelOppgaveModal}
    >
      {success ? (
        <>
          <Modal.Body>
            <Alert variant={'success'}>{success}</Alert>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant={'primary'}
              onClick={() => {
                setSaksbehandlere([]);
                setSøketekst('');
                setError(undefined);
                setSuccess(undefined);
                onClose();
              }}
            >
              Tilbake til oppgavelisten
            </Button>
          </Modal.Footer>
        </>
      ) : (
        <>
          <Modal.Body>
            <VStack gap={'2'}>
            <SaksbehandlerSøk
              oppgaver={oppgaver}
              setSaksbehandlere={setSaksbehandlere}
              søketekst={søketekst}
              setSøketekst={setSøketekst}
            />
              <form id="tildelSaksbehandler" onSubmit={handleSubmit}>
                {saksbehandlere.length > 0 && (
                  <Label as="p" size={'medium'}>
                    {`Søkeresultat (${saksbehandlere.length} treff)`}
                  </Label>
                )}
                {error && (
                  <Alert variant={'error'} size={'small'}>
                    {error}
                  </Alert>
                )}
                <RadioGroupWrapper name={'saksbehandlerIdent'} control={form.control}>
                  {saksbehandlereForValgtSide.map((saksbehandler) => {
                    return (
                      <Radio
                        value={saksbehandler.navIdent}
                        key={saksbehandler.navIdent}
                      >{`${saksbehandler.navn} (${saksbehandler.navIdent})`}</Radio>
                    );
                  })}
                </RadioGroupWrapper>
              </form>
            </VStack>
          </Modal.Body>

          {saksbehandlere.length > 0 && (
            <Modal.Footer>
              <HStack justify={'start'}>
                {skalVisePaginering && (
                  <VStack align={'start'}>
                    <Pagination
                      page={pageState}
                      onPageChange={setPageState}
                      count={antallSider}
                      boundaryCount={1}
                      siblingCount={1}
                      size={'small'}
                      srHeading={{
                        tag: 'h2',
                        text: 'Paginering av søkeresultater',
                      }}
                    />
                  </VStack>
                )}
                <HStack gap={'2'}>
                  <Button form={'tildelSaksbehandler'} loading={isLoading}>
                    Tildel
                  </Button>
                  <Button
                    variant={'secondary'}
                    onClick={() => {
                      setSaksbehandlere([]);
                      setSøketekst('');
                      setError(undefined);
                      onClose();
                    }}
                  >
                    Avbryt
                  </Button>
                </HStack>
              </HStack>
            </Modal.Footer>
          )}
        </>
      )}
    </Modal>
  );
};

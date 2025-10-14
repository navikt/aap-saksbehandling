'use client';

import React, { Dispatch, FormEvent, SetStateAction, useState } from 'react';
import { Alert, Button, HStack, Label, Modal, Pagination, Radio, VStack } from '@navikt/ds-react';
import { SaksbehandlerSøk } from 'components/tildeloppgavemodal/SaksbehandlerSøk';
import { SaksbehandlerFraSøk } from 'lib/types/oppgaveTypes';
import { useForm } from 'react-hook-form';
import { RadioGroupWrapper } from 'components/form/radiogroupwrapper/RadioGroupWrapper';
import { clientTildelTilSaksbehandler } from 'lib/clientApi';
import styles from './TildelOppgaveModal.module.css';
import { isError } from 'lib/utils/api';

interface Props {
  oppgaveIder: number[];
  isOpen: boolean;
  onClose: () => void;
  setValgteRader?: Dispatch<SetStateAction<number[]>>;
  skalFjerneValgteRader?: boolean;
}

interface FormFields {
  saksbehandlerIdent: string;
}

export const TildelOppgaveModal = ({ oppgaveIder, isOpen, onClose, setValgteRader, skalFjerneValgteRader }: Props) => {
  const [saksbehandlere, setSaksbehandlere] = useState<SaksbehandlerFraSøk[]>([]);
  const [søketekst, setSøketekst] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pageState, setPageState] = useState(1);
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();
  const [infomelding, setInfomelding] = useState<string>();
  const [søkefeltError, setSøkefeltError] = useState<string>();

  const lukkOgResetModal = () => {
    setSaksbehandlere([]);
    setInfomelding('');
    setSøketekst('');
    setIsLoading(false);
    setError(undefined);
    setSuccess(undefined);
    setPageState(1);
    setSøkefeltError(undefined);
    form.reset();
    onClose();
  };

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
      const res = await clientTildelTilSaksbehandler(oppgaveIder, data.saksbehandlerIdent);
      if (isError(res)) {
        setError(res.apiException.message);
      } else {
        setError(undefined);
        const selectedSaksbehandler = saksbehandlere.find((s) => s.navIdent === data.saksbehandlerIdent);
        setSuccess(`Oppgave(r) ble tildelt ${selectedSaksbehandler?.navn ?? data.saksbehandlerIdent}`);
        if (setValgteRader) {
          skalFjerneValgteRader && setValgteRader([]);
        }
      }
      setIsLoading(false);
    })(event);
  };

  return (
    <Modal
      open={isOpen}
      onClose={lukkOgResetModal}
      header={{ heading: 'Tildel' }}
      className={styles.tildelOppgaveModal}
    >
      {success ? (
        <>
          <Modal.Body>
            <Alert variant={'success'}>{success}</Alert>
          </Modal.Body>
          <Modal.Footer>
            <Button variant={'primary'} onClick={lukkOgResetModal}>
              Gå til oppgavelisten
            </Button>
          </Modal.Footer>
        </>
      ) : (
        <>
          <Modal.Body>
            <VStack gap={'4'}>
              <SaksbehandlerSøk
                oppgaver={oppgaveIder}
                setSaksbehandlere={setSaksbehandlere}
                søketekst={søketekst}
                setSøketekst={setSøketekst}
                setInfomelding={setInfomelding}
                setPageState={setPageState}
                søkefeltError={søkefeltError}
                setSøkefeltError={setSøkefeltError}
              />
              {infomelding && (
                <Alert variant={'info'} size={'small'}>
                  {infomelding}
                </Alert>
              )}
              <form id={'tildelSaksbehandler'} onSubmit={handleSubmit}>
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
                <RadioGroupWrapper
                  name={'saksbehandlerIdent'}
                  control={form.control}
                  rules={{ required: 'Du må velge en veileder/saksbehandler.' }}
                >
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
              {skalVisePaginering && (
                <HStack justify="center">
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
                </HStack>
              )}
            </VStack>
          </Modal.Body>

          <Modal.Footer>
            <HStack gap={'4'}>
              <Button variant={'secondary'} onClick={lukkOgResetModal}>
                Avbryt
              </Button>
              <Button form={'tildelSaksbehandler'} loading={isLoading} type={'submit'}>
                Tildel
              </Button>
            </HStack>
          </Modal.Footer>
        </>
      )}
    </Modal>
  );
};

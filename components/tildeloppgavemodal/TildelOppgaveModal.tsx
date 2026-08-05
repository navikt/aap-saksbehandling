'use client';

import { Button, HStack, Label, Modal, Pagination, Radio, VStack } from '@navikt/ds-react';
import { useTildelOppgaver } from 'context/oppgave/TildelOppgaverContext';
import { clientTildelTilSaksbehandler } from 'lib/clientApi';
import { SaksbehandlerFraSøk } from 'lib/types/oppgaveTypes';
import { isError } from 'lib/utils/api';
import { loggUmamiTildelOppgave } from 'lib/utils/umami/navigering';
import { SubmitEventHandler, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Alert } from 'components/alert/Alert';
import { RadioGroupWrapper } from 'components/form/radiogroupwrapper/RadioGroupWrapper';
import { SaksbehandlerSøk } from 'components/tildeloppgavemodal/SaksbehandlerSøk';

import styles from './TildelOppgaveModal.module.css';

interface FormFields {
  saksbehandlerIdent: string;
}

interface Props {
  revalidateFunction: () => void;
}

interface TildelState {
  saksbehandlere: SaksbehandlerFraSøk[];
  søketekst: string;
  isLoading: boolean;
  pageState: number;
  error?: string;
  success?: string;
  infomelding?: string;
  søkefeltError?: string;
}

const initialState: TildelState = {
  saksbehandlere: [],
  søketekst: '',
  isLoading: false,
  pageState: 1,
};

export const TildelOppgaveModal = ({ revalidateFunction }: Props) => {
  const { modalSkalVises, skjulModal, oppgaveIder, setOppgaveIder } = useTildelOppgaver();
  const [state, setState] = useState<TildelState>(initialState);
  const { saksbehandlere, søketekst, isLoading, pageState, error, success, infomelding, søkefeltError } = state;
  const patch = (partial: Partial<TildelState>) => setState((s) => ({ ...s, ...partial }));

  const lukkOgResetModal = () => {
    setOppgaveIder([]);
    setState(initialState);
    form.reset();
    revalidateFunction();
    skjulModal();
  };

  const saksbehandlerePerPage = 7;
  const skalVisePaginering = saksbehandlere.length > saksbehandlerePerPage;
  const antallSider = skalVisePaginering ? Math.ceil(saksbehandlere.length / saksbehandlerePerPage) : 1;
  const saksbehandlereForValgtSide = skalVisePaginering
    ? saksbehandlere.slice((pageState - 1) * saksbehandlerePerPage, pageState * saksbehandlerePerPage)
    : saksbehandlere;

  const form = useForm<FormFields>();

  const handleSubmit: SubmitEventHandler = async (event) => {
    await form.handleSubmit(async (data) => {
      patch({ isLoading: true });
      const res = await clientTildelTilSaksbehandler(oppgaveIder, data.saksbehandlerIdent);
      if (isError(res)) {
        patch({ error: res.apiException.message, isLoading: false });
      } else {
        loggUmamiTildelOppgave('MINE_OPPGAVER');
        const selectedSaksbehandler = saksbehandlere.find((s) => s.navIdent === data.saksbehandlerIdent);
        patch({
          error: undefined,
          success: `Oppgave(r) ble tildelt ${selectedSaksbehandler?.navn ?? data.saksbehandlerIdent}`,
          isLoading: false,
        });
      }
    })(event);
  };

  return (
    <Modal
      open={modalSkalVises}
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
            <VStack gap={'space-16'}>
              <SaksbehandlerSøk
                oppgaver={oppgaveIder}
                setSaksbehandlere={(action) =>
                  patch({ saksbehandlere: typeof action === 'function' ? action(saksbehandlere) : action })
                }
                søketekst={søketekst}
                setSøketekst={(action) =>
                  patch({ søketekst: typeof action === 'function' ? action(søketekst) : action })
                }
                setInfomelding={(action) =>
                  patch({ infomelding: typeof action === 'function' ? action(infomelding) : action })
                }
                setPageState={(action) =>
                  patch({ pageState: typeof action === 'function' ? action(pageState) : action })
                }
                søkefeltError={søkefeltError}
                setSøkefeltError={(action) =>
                  patch({ søkefeltError: typeof action === 'function' ? action(søkefeltError) : action })
                }
              />
              {infomelding && <Alert variant={'info'}>{infomelding}</Alert>}
              <form id={'tildelSaksbehandler'} onSubmit={handleSubmit}>
                {saksbehandlere.length > 0 && (
                  <Label as="p" size={'medium'}>
                    {`Søkeresultat (${saksbehandlere.length} treff)`}
                  </Label>
                )}
                {error && <Alert variant={'error'}>{error}</Alert>}
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
                    onPageChange={(page) => patch({ pageState: page })}
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
            <HStack gap={'space-16'}>
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

'use client';

import { Behovstype, getJaNeiEllerUndefined, JaEllerNei, JaEllerNeiOptions } from 'lib/postmottakForm';
import { SubmitEventHandler, useEffect, useState } from 'react';
import { usePostmottakLøsBehovOgGåTilNesteSteg } from 'hooks/postmottak/PostmottakLøsBehovOgGåTilNesteStegHook';
import { AvklarTemaGrunnlag, AvklarTemaLøsning } from 'lib/types/postmottakTypes';
import { LøsBehovOgGåTilNesteStegStatusAlert } from 'components/løsbehovoggåtilnestestegstatusalert/LøsBehovOgGåTilNesteStegStatusAlert';
import { postmottakLøsBehovClient } from 'lib/postmottakClientApi';
import { BodyShort, Button, Modal, VStack } from '@navikt/ds-react';
import { useConfigForm } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';
import { CheckmarkCircleIcon } from '@navikt/aksel-icons';
import { toggles } from 'lib/utils/toggles';
import { PostmottakVilkårskort } from 'components/postmottak/vilkårskort/PostmottakVilkårskort';
import { usePostmottakVilkårskortVisning } from 'hooks/postmottak/PostmottakVisningHook';
import { Alert } from 'components/alert/Alert';
import { ClientConfig } from 'lib/types/clientTypes';
import { clientConfig } from 'lib/clientApi';
import { isSuccess } from 'lib/utils/api';
import { useFeatureFlag } from 'context/UnleashContext';

interface Props {
  behandlingsVersjon: number;
  behandlingsreferanse: string;
  grunnlag: AvklarTemaGrunnlag;
  readOnly: boolean;
}

interface FormFields {
  erTemaAAP: string;
  tema: string;
}

const temaer: Record<string, string> = {
  EYB: 'Barnepensjon',
  BAR: 'Barnetrygd',
  BID: 'Bidrag',
  DAG: 'Dagpenger',
  ENF: 'Enslig mor eller far',
  ERS: 'Erstatning',
  FEI: 'Feilutbetaling',
  FOR: 'Foreldre- og svangerskapspenger',
  FUL: 'Fullmakt',
  GEN: 'Generell',
  GRU: 'Grunn- og hjelpestønad',
  KOM: 'Kommunale tjenester',
  OMS: 'Omsorgspenger, pleiepenger og opplæringspenger',
  EYO: 'Omstillingsstønad',
  OPP: 'Oppfølging',
  PEN: 'Pensjon',
  SAK: 'Sakskostnader',
  SER: 'Serviceklage',
  SYK: 'Sykepenger',
  TSO: 'Tilleggsstønad',
  TIL: 'Tiltak',
  IND: 'Tiltakspenger',
  TRK: 'Trekkhåndtering',
  UFO: 'Uføretrygd',
  YRK: 'Yrkesskade',
  UKJENT: 'Ukjent',
};

const NAV_KLAGEINSTANS_ENHET = '4260';
const KLAGE_ETTERSENDELSE_BREVKODE = 'NAVe 90-00.08 K';

export const AvklarTema = ({ behandlingsVersjon, behandlingsreferanse, grunnlag, readOnly }: Props) => {
  const velgTema = useFeatureFlag('PostmottakVelgTema');
  const [config, setConfig] = useState<ClientConfig>();
  const { løsBehovOgGåTilNesteSteg, status, isLoading, løsBehovOgGåTilNesteStegError } =
    usePostmottakLøsBehovOgGåTilNesteSteg<AvklarTemaLøsning>('AVKLAR_TEMA');
  const [visModal, setVisModal] = useState<boolean>(!velgTema && grunnlag.vurdering?.skalTilAap === false);

  const { visningActions, formReadOnly, visningModus } = usePostmottakVilkårskortVisning(readOnly, 'AVKLAR_TEMA');

  const { formFields, form } = useConfigForm<FormFields>(
    {
      erTemaAAP: {
        type: 'radio',
        label: 'Hører dette dokumentet til tema AAP?',
        rules: { required: 'Du må svare på om dokumentet har riktig tema' },
        defaultValue: getJaNeiEllerUndefined(grunnlag.vurdering?.skalTilAap),
        options: JaEllerNeiOptions,
      },
      tema: {
        type: 'select',
        label: 'Velg tema',
        defaultValue: grunnlag.vurdering?.tema ?? '',
        rules: {
          validate: (value, values) =>
            !velgTema || values.erTemaAAP !== JaEllerNei.Nei || !!value || 'Du må velge tema',
        },
        options: [
          { value: '', label: 'Velg tema' },
          ...Object.entries(temaer).map(([value, label]) => ({ value, label })),
        ],
      },
    },
    { readOnly: formReadOnly }
  );

  useEffect(() => {
    clientConfig().then((config) => isSuccess(config) && setConfig(config.data));
  }, []);

  const onSubmit: SubmitEventHandler = (event) => {
    form.handleSubmit((data) => {
      if (data.erTemaAAP === JaEllerNei.Ja || velgTema) {
        løsBehovOgGåTilNesteSteg({
          behandlingVersjon: behandlingsVersjon,
          behov: {
            behovstype: Behovstype.AVKLAR_TEMA,
            skalTilAap: data.erTemaAAP === JaEllerNei.Ja,
            ...(velgTema && data.erTemaAAP === JaEllerNei.Nei ? { tema: data.tema } : {}),
          },
          referanse: behandlingsreferanse,
        });
      } else {
        postmottakLøsBehovClient({
          behandlingVersjon: behandlingsVersjon,
          behov: {
            behovstype: Behovstype.AVKLAR_TEMA,
            skalTilAap: data.erTemaAAP === JaEllerNei.Ja,
          },
          referanse: behandlingsreferanse,
        }).then(() => setVisModal(true));
      }
    })(event);
  };

  const settesPåVent = toggles.featurePostmottakBehandlingerPåVent;

  const skalViseKlageEttersendelseInfo =
    grunnlag.journalpostMetadata.journalfoerendeEnhet === NAV_KLAGEINSTANS_ENHET &&
    grunnlag.journalpostMetadata.brevkode === KLAGE_ETTERSENDELSE_BREVKODE;

  return (
    <PostmottakVilkårskort
      heading={'Avklar tema'}
      steg={'AVKLAR_TEMA'}
      onSubmit={onSubmit}
      isLoading={isLoading}
      status={status}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      knappTekst={'Neste'}
      visningModus={visningModus}
      visningActions={visningActions}
      formReset={() =>
        form.reset({
          erTemaAAP: getJaNeiEllerUndefined(grunnlag.vurdering?.skalTilAap),
          tema: grunnlag.vurdering?.tema ?? '',
        })
      }
    >
      <Modal
        open={visModal}
        header={{
          heading: 'Dokumentet er sendt til Gosys for journalføring',
          icon: <CheckmarkCircleIcon fontSize={'inherit'} />,
        }}
        onClose={() => {
          setVisModal(false);
        }}
        onBeforeClose={() => {
          setVisModal(false);
          return true;
        }}
      >
        <Modal.Body>
          <BodyShort spacing>
            Gå til Gosys for å journalføre dokumentet.{' '}
            {settesPåVent && (
              <>
                Oppgaven settes på vent inntil tema er endret i Gosys. Om den går av vent, trykk <i>Neste</i> igjen
              </>
            )}
          </BodyShort>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type={'button'}
            onClick={() => {
              window.location.replace(config?.gosysUrl ?? '');
              setVisModal(false);
            }}
          >
            Gå til Gosys
          </Button>
        </Modal.Footer>
      </Modal>
      <VStack gap={'space-24'}>
        {skalViseKlageEttersendelseInfo && (
          <Alert variant={'info'}>
            Denne journalposten er en ettersendelse til klage, og journalførende enhet er satt til{'  '}
            {NAV_KLAGEINSTANS_ENHET}. Svar <i>Nei</i> dersom du ønsker å opprette journalføringsoppgave i Gosys for Nav
            Klageinstans.{velgTema && ' Velg Ukjent for å sende dokumentet til Gosys.'}
          </Alert>
        )}
        <LøsBehovOgGåTilNesteStegStatusAlert status={status} />
        <FormField form={form} formField={formFields.erTemaAAP} />
        {velgTema && form.watch('erTemaAAP') === JaEllerNei.Nei && (
          <>
            <FormField form={form} formField={formFields.tema} />
            {!!form.watch('tema') && (
              <BodyShort>
                {form.watch('tema') === 'UKJENT'
                  ? 'Dokumentet sendes til Gosys for avklaring av tema. Behandlingen i Postmottak avsluttes.'
                  : form.watch('tema') === 'OPP'
                    ? 'Dokumentet journalføres på generell sak med tema Oppfølging.'
                    : 'Tema endres på journalposten uten å ferdigstille den. Behandlingen i Postmottak avsluttes.'}
              </BodyShort>
            )}
          </>
        )}
      </VStack>
    </PostmottakVilkårskort>
  );
};

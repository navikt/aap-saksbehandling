'use client';

import { Behovstype, getJaNeiEllerUndefined, JaEllerNei, JaEllerNeiOptions } from 'lib/postmottakForm';
import { FormEvent, FormEventHandler, useState } from 'react';
import { usePostmottakLøsBehovOgGåTilNesteSteg } from 'hooks/postmottak/PostmottakLøsBehovOgGåTilNesteStegHook';
import { AvklarTemaGrunnlag } from 'lib/types/postmottakTypes';
import { LøsBehovOgGåTilNesteStegStatusAlert } from 'components/løsbehovoggåtilnestestegstatusalert/LøsBehovOgGåTilNesteStegStatusAlert';
import { postmottakLøsBehovClient } from 'lib/postmottakClientApi';
import { Alert, BodyShort, Button, Modal, VStack } from '@navikt/ds-react';
import { useConfigForm } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';
import { usePostmottakEndreTema } from 'hooks/FetchHook';
import { CheckmarkCircleIcon } from '@navikt/aksel-icons';
import { toggles } from 'lib/utils/toggles';
import { VilkårskortMedFormOgMellomlagringNyVisning } from 'components/vilkårskort/vilkårskortmedformogmellomlagringnyvisning/VilkårskortMedFormOgMellomlagringNyVisning';
import { useVilkårskortVisning } from 'hooks/postmottak/VisningHook';

interface Props {
  behandlingsVersjon: number;
  behandlingsreferanse: string;
  grunnlag: AvklarTemaGrunnlag;
  readOnly: boolean;
}

interface FormFields {
  erTemaAAP: string;
}

export const AvklarTema = ({ behandlingsVersjon, behandlingsreferanse, grunnlag, readOnly }: Props) => {
  const { løsBehovOgGåTilNesteSteg, status, isLoading, løsBehovOgGåTilNesteStegError } =
    usePostmottakLøsBehovOgGåTilNesteSteg('AVKLAR_TEMA');
  const { postmottakEndreTema, error, isLoading: endreTemaIsLoading, data } = usePostmottakEndreTema();
  const [visModal, setVisModal] = useState<boolean>(grunnlag?.vurdering?.skalTilAap === false || false);

  const { visningActions, formReadOnly, visningModus } = useVilkårskortVisning(readOnly, 'AVKLAR_TEMA');

  const { formFields, form } = useConfigForm<FormFields>(
    {
      erTemaAAP: {
        type: 'radio',
        label: 'Hører dette dokumentet til tema AAP?',
        rules: { required: 'Du må svare på om dokumentet har riktig tema' },
        defaultValue: getJaNeiEllerUndefined(grunnlag.vurdering?.skalTilAap),
        options: JaEllerNeiOptions,
      },
    },
    { readOnly: formReadOnly }
  );

  const onSubmit: FormEventHandler<HTMLFormElement> = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      if (data.erTemaAAP === JaEllerNei.Ja) {
        løsBehovOgGåTilNesteSteg({
          behandlingVersjon: behandlingsVersjon,
          behov: {
            behovstype: Behovstype.AVKLAR_TEMA,
            skalTilAap: data.erTemaAAP === JaEllerNei.Ja,
          },
          // @ts-ignore
          referanse: behandlingsreferanse,
        });
      } else {
        //TODO Vis modal her ?
        // "Dokument er sendt til Gosys for journalføring"
        postmottakLøsBehovClient({
          behandlingVersjon: behandlingsVersjon,
          behov: {
            behovstype: Behovstype.AVKLAR_TEMA,
            skalTilAap: data.erTemaAAP === JaEllerNei.Ja,
          },
          // @ts-ignore
          referanse: behandlingsreferanse,
        }).then(() =>
          postmottakEndreTema(behandlingsreferanse).then((res) => {
            if (res.ok) {
              setVisModal(true);
            }
          })
        );
      }
    })(event);
  };

  const settesPåVent = toggles.featurePostmottakBehandlingerPåVent;

  return (
    <VilkårskortMedFormOgMellomlagringNyVisning
      heading={'Avklar tema'}
      steg={'AVKLAR_TEMA'}
      onSubmit={onSubmit}
      isLoading={isLoading}
      status={status}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      knappTekst={'Neste'}
      vilkårTilhørerNavKontor={false}
      visningModus={visningModus}
      visningActions={visningActions}
      onDeleteMellomlagringClick={undefined}
      onLagreMellomLagringClick={undefined}
      mellomlagretVurdering={undefined}
      formReset={undefined}
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
              if (data?.redirectUrl) {
                window.location.replace(data.redirectUrl);
                setVisModal(false);
              }
            }}
          >
            Gå til Gosys
          </Button>
        </Modal.Footer>
      </Modal>
      <form onSubmit={onSubmit}>
        <VStack gap={'6'}>
          <LøsBehovOgGåTilNesteStegStatusAlert status={status} />
          <FormField form={form} formField={formFields.erTemaAAP} />
          {error && (
            <Alert size={'small'} variant={'error'} title={''}>
              <BodyShort size={'small'}>Noe gikk galt ved endring av tema</BodyShort>
              {error}
            </Alert>
          )}

          {!readOnly && (
            <Button loading={isLoading || endreTemaIsLoading} className={'fit-content'}>
              Neste
            </Button>
          )}
        </VStack>
      </form>
    </VilkårskortMedFormOgMellomlagringNyVisning>
  );
};

import { useParamsMedType } from '../../hooks/saksbehandling/BehandlingHook';
import { useState } from 'react';
import { Button, VStack } from '@navikt/ds-react';
import styles from '../innhentdokumentasjon/InnhentDokumentasjon.module.css';
import { InnhentDokumentasjonSkjema } from '../innhentdokumentasjon/innhentdokumentasjonskjema/InnhentDokumentasjonSkjema';
import { RelevanteDokumenter } from '../innhentdokumentasjon/relevantedokumenter/RelevanteDokumenter';
import { useMeldingerFraDialog } from '../../hooks/saksbehandling/SakMeldingerFraDialogHook';
import { DialogMedBehandler } from './DialogMedBehandler';
import { revalidateBehandlingPath } from '../../lib/actions/actions';

export const BeOmOpplysninger = () => {
  const { meldingerMedDokumentliste, kommendeMeldinger, isLoading, error, refetchDialogmeldingerClient } =
    useMeldingerFraDialog();
  const params = useParamsMedType();

  const [visSkjema, oppdaterVisSkjema] = useState<boolean>(false);
  const skjulSkjema = () => oppdaterVisSkjema(false);
  const skjulOgRefresh = async () => {
    skjulSkjema();
    await Promise.all([
      refetchDialogmeldingerClient(),
      revalidateBehandlingPath(params.saksnummer, params.behandlingsreferanse),
    ]);
  };
  return (
    <section>
      {!visSkjema && (
        <>
          <DialogMedBehandler
            behandlingsreferanse={params.behandlingsreferanse}
            meldingerMedDokumentliste={meldingerMedDokumentliste}
            kommendeMeldinger={kommendeMeldinger}
            isLoading={isLoading}
            error={error}
            refetchDialogmeldingerClient={refetchDialogmeldingerClient}
          />
          <VStack gap={'space-16'} align={'end'}>
            <div>
              <Button type="button" variant={'secondary'} onClick={() => oppdaterVisSkjema(true)}>
                Send forespørsel til behandler
              </Button>
            </div>
          </VStack>
        </>
      )}
      {visSkjema && <InnhentDokumentasjonSkjema onCancel={skjulSkjema} onSuccess={skjulOgRefresh} />}
      <div className={styles.marginTop}>{!visSkjema && <RelevanteDokumenter />}</div>
    </section>
  );
};

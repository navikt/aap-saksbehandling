'use client';

import { FormField } from 'components/form/FormField';
import { useConfigForm } from 'components/form/FormHook';
import { Alert, Button, HStack, VStack } from '@navikt/ds-react';
import { FormEvent, useState } from 'react';
import { AndreStatligeYtelserTabell } from 'components/behandlinger/samordning/samordningandrestatlige/AndreStatligeYtelserTabell';
import { Behovstype } from 'lib/utils/form';
import { formaterDatoForBackend } from 'lib/utils/date';
import { parse } from 'date-fns';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { SamordningAndreStatligeYtelserGrunnlag, SamordningAndreStatligeYtelserYtelse } from 'lib/types/types';
import { VilkårsKortMedForm } from 'components/vilkårskort/vilkårskortmedform/VilkårsKortMedForm';

interface Props {
  grunnlag: SamordningAndreStatligeYtelserGrunnlag;
  behandlingVersjon: number;
  readOnly: boolean;
}
export interface SamordningAndreStatligeYtelserFormFields {
  begrunnelse: string;
  vurderteSamordninger: AnnenStatligYtelse[];
}
export interface AnnenStatligYtelse {
  ytelse?: SamordningAndreStatligeYtelserYtelse;
  fom?: string;
  tom?: string;
  beløp?: number;
}
export const SamordningAndreStatligeYtelser = ({ readOnly, behandlingVersjon, grunnlag }: Props) => {
  const { form, formFields } = useConfigForm<SamordningAndreStatligeYtelserFormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: 'Vurder om bruker har andre statlige ytelser som skal avregnes med AAP',
        rules: { required: 'Du må gjøre en vilkårsvurdering' },
        defaultValue: grunnlag.vurdering?.begrunnelse,
      },
      vurderteSamordninger: {
        type: 'fieldArray',
        defaultValue: (grunnlag.vurdering?.vurderingPerioder || []).map((vurdering) => ({
          ytelse: vurdering.ytelse,
          fom: vurdering.periode.fom,
          tom: vurdering.periode.tom,
          beløp: vurdering.beløp,
        })),
      },
    },
    { readOnly: readOnly }
  );
  const [visYtelsesTabell, setVisYtelsesTabell] = useState<boolean>(grunnlag.vurdering !== null);
  const behandlingsreferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, status, isLoading, løsBehovOgGåTilNesteStegError } = useLøsBehovOgGåTilNesteSteg(
    'SAMORDNING_ANDRE_STATLIGE_YTELSER'
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit(async (data) =>
      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingVersjon,
        behov: {
          behovstype: Behovstype.AVKLAR_SAMORDNING_ANDRE_STATLIGE_YTELSER,
          samordningAndreStatligeYtelserVurdering: {
            begrunnelse: data.begrunnelse,
            vurderingPerioder: data.vurderteSamordninger.map((vurdertSamordning) => ({
              ytelse: vurdertSamordning.ytelse!,
              beløp: vurdertSamordning.beløp!,
              periode: {
                fom: formaterDatoForBackend(parse(vurdertSamordning.fom!, 'dd.MM.yyyy', new Date())),
                tom: formaterDatoForBackend(parse(vurdertSamordning.tom!, 'dd.MM.yyyy', new Date())),
              },
            })),
          },
        },
        referanse: behandlingsreferanse,
      })
    )(event);
  };

  const skalViseBekreftKnapp = !readOnly && visYtelsesTabell;

  return (
    <VilkårsKortMedForm
      heading="Andre ytelser til avregning"
      steg="SAMORDNING_ANDRE_STATLIGE_YTELSER"
      onSubmit={handleSubmit}
      isLoading={isLoading}
      status={status}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      erAktivtSteg={true}
      visBekreftKnapp={skalViseBekreftKnapp}
      vilkårTilhørerNavKontor={false}
    >
      {!visYtelsesTabell && (
        <HStack>
          <Button size={'small'} variant={'secondary'} onClick={() => setVisYtelsesTabell(true)} disabled={readOnly}>
            Legg til ytelser
          </Button>
        </HStack>
      )}
      {visYtelsesTabell && (
        <VStack gap={'6'}>
          <Alert variant={'info'} size={'small'} className={'fit-content'}>
            Det er ikke støtte for refusjonskrav enda. Sett saken på vent og kontakt team AAP.
          </Alert>
          <FormField form={form} formField={formFields.begrunnelse} className={'begrunnelse'} />
          <AndreStatligeYtelserTabell form={form} readOnly={readOnly} />
        </VStack>
      )}
    </VilkårsKortMedForm>
  );
};

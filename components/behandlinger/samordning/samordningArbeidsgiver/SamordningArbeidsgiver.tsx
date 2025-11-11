'use client';

import { FormField } from 'components/form/FormField';
import { useConfigForm } from 'components/form/FormHook';
import { HStack, Label, VStack } from '@navikt/ds-react';
import { FormEvent } from 'react';
import { Behovstype } from 'lib/utils/form';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { MellomlagretVurdering, SamordningArbeidsgiverGrunnlag } from 'lib/types/types';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { validerDato } from 'lib/validation/dateValidation';
import { parse } from 'date-fns';
import { formaterDatoForBackend, formaterDatoForFrontend } from 'lib/utils/date';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { VilkårskortMedFormOgMellomlagringNyVisning } from 'components/vilkårskort/vilkårskortmedformogmellomlagringnyvisning/VilkårskortMedFormOgMellomlagringNyVisning';

interface Props {
  grunnlag: SamordningArbeidsgiverGrunnlag;
  behandlingVersjon: number;
  readOnly: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

export interface SamordningArbeidsgiverFormFields {
  fom?: string;
  tom?: string;
  begrunnelse?: string;
}

type DraftFormFields = Partial<SamordningArbeidsgiverFormFields>;

export const SamordningArbeidsgiver = ({
  readOnly,
  behandlingVersjon,
  grunnlag,
  initialMellomlagretVurdering,
}: Props) => {
  const behandlingsreferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, status, isLoading, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('SAMORDNING_ARBEIDSGIVER');

  const { nullstillMellomlagretVurdering, mellomlagretVurdering, lagreMellomlagring, slettMellomlagring } =
    useMellomlagring(Behovstype.AVKLAR_SAMORDNING_ARBEIDSGIVER, initialMellomlagretVurdering);

  const { visningActions, formReadOnly, visningModus } = useVilkårskortVisning(
    readOnly,
    'SAMORDNING_ARBEIDSGIVER',
    mellomlagretVurdering
  );

  const defaultValue: DraftFormFields = initialMellomlagretVurdering
    ? JSON.parse(initialMellomlagretVurdering.data)
    : mapVurderingToDraftFormFields(grunnlag.vurdering);

  const { form, formFields } = useConfigForm<SamordningArbeidsgiverFormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: 'Vurder om brukeren skal ha 100 % reduksjon av AAP i en periode som følge av ytelse fra arbeidsgiver',
        rules: { required: 'Du må gjøre en vilkårsvurdering' },
        defaultValue: defaultValue.begrunnelse,
      },
      fom: {
        type: 'text',
        label: 'Fra dato',
        rules: { required: 'Du må velge en dato' },
        defaultValue: defaultValue.fom,
      },
      tom: {
        type: 'text',
        label: 'Til dato',
        rules: { required: 'Du må velge en dato' },
        defaultValue: defaultValue.tom,
      },
    },
    { readOnly: formReadOnly }
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit(async (data) =>
      løsBehovOgGåTilNesteSteg(
        {
          behandlingVersjon: behandlingVersjon,
          behov: {
            behovstype: Behovstype.AVKLAR_SAMORDNING_ARBEIDSGIVER,
            samordningArbeidsgiverVurdering: {
              vurdering: data.begrunnelse!!,
              fom: formaterDatoForBackend(parse(data.fom!!, 'dd.MM.yyyy', new Date())),
              tom: formaterDatoForBackend(parse(data.tom!!, 'dd.MM.yyyy', new Date())),
            },
          },
          referanse: behandlingsreferanse,
        },
        () => nullstillMellomlagretVurdering()
      )
    )(event);
  };

  return (
    <VilkårskortMedFormOgMellomlagringNyVisning
      heading="§ 11-24 Reduksjon av AAP på grunn av ytelser fra arbeidsgiver"
      steg="SAMORDNING_ARBEIDSGIVER"
      onSubmit={handleSubmit}
      isLoading={isLoading}
      status={status}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      vilkårTilhørerNavKontor={false}
      vurdertAvAnsatt={grunnlag.vurdering?.vurdertAv}
      mellomlagretVurdering={mellomlagretVurdering}
      onLagreMellomLagringClick={() => lagreMellomlagring(form.watch())}
      onDeleteMellomlagringClick={() =>
        slettMellomlagring(() =>
          form.reset(grunnlag.vurdering ? mapVurderingToDraftFormFields(grunnlag.vurdering) : emptyDraftFormFields())
        )
      }
      visningModus={visningModus}
      visningActions={visningActions}
      formReset={() => form.reset(mellomlagretVurdering ? JSON.parse(mellomlagretVurdering.data) : undefined)}
    >
      {
        <VStack gap={'6'}>
          <FormField form={form} formField={formFields.begrunnelse} className={'begrunnelse'} />
          <Label size={'small'}>Legg til start- og sluttdato for reduksjon som følge av ytelse fra arbeidsgiver</Label>
          <HStack gap={'6'}>
            <DateInputWrapper
              control={form.control}
              label={'Startdato'}
              name={`fom`}
              hideLabel={false}
              rules={{
                required: 'Du må velge når reduksjonen gjelder fra',
                validate: (value) => {
                  return validerDato(value as string);
                },
              }}
              readOnly={formReadOnly}
            />
            <DateInputWrapper
              control={form.control}
              label={'Sluttdato'}
              name={`tom`}
              hideLabel={false}
              rules={{
                required: 'Du må velge når reduksjonen gjelder til',
                validate: (value) => {
                  return validerDato(value as string);
                },
              }}
              readOnly={formReadOnly}
            />
          </HStack>
        </VStack>
      }
    </VilkårskortMedFormOgMellomlagringNyVisning>
  );
};

function mapVurderingToDraftFormFields(vurdering: SamordningArbeidsgiverGrunnlag['vurdering']): DraftFormFields {
  return {
    begrunnelse: vurdering?.begrunnelse,
    tom: vurdering?.tom ? formaterDatoForFrontend(vurdering?.tom) : '',
    fom: vurdering?.fom ? formaterDatoForFrontend(vurdering?.fom) : '',
  };
}

function emptyDraftFormFields(): DraftFormFields {
  return {
    begrunnelse: '',
    tom: '',
    fom: '',
  };
}

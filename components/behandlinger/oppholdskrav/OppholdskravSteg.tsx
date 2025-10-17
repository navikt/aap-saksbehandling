'use client';

import { Button, ErrorMessage, VStack } from '@navikt/ds-react';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { Behovstype } from 'lib/utils/form';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { OppholdskravForm } from 'components/behandlinger/oppholdskrav/types';
import { LøsPeriodisertBehovPåBehandling, MellomlagretVurdering, OppholdskravGrunnlagResponse } from 'lib/types/types';
import { useFieldArray, useForm } from 'react-hook-form';
import { VilkårskortMedFormOgMellomlagringNyVisning } from 'components/vilkårskort/vilkårskortmedformogmellomlagringnyvisning/VilkårskortMedFormOgMellomlagringNyVisning';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { PlusIcon } from '@navikt/aksel-icons';
import { CustomExpandableCard } from 'components/customexpandablecard/CustomExpandableCard';
import {
  getDefaultValuesFromGrunnlag,
  mapFormTilDto,
  parseDatoFraDatePickerOgTrekkFra1Dag,
} from 'components/behandlinger/oppholdskrav/oppholdskrav-utils';
import { OppholdskravFormInput } from 'components/behandlinger/oppholdskrav/OppholdskravFormInput';
import { OppholdskravTidligereVurdering } from 'components/behandlinger/oppholdskrav/OppholdskravTidligereVurdering';
import { OppholdskravVurdertAv } from 'components/behandlinger/oppholdskrav/OppholdskravVurdertAv';
import {
  OppholdskravNyPeriodeHeading,
  OppholdskravTidligerePeriodeHeading,
} from 'components/behandlinger/oppholdskrav/OppholdskravPeriodeHeading';
import { parseISO } from 'date-fns';
import { formaterDatoForBackend, parseDatoFraDatePicker, stringToDate } from 'lib/utils/date';

type Props = {
  grunnlag: OppholdskravGrunnlagResponse | undefined;
  initialMellomlagring?: MellomlagretVurdering;
  behandlingVersjon: number;
  readOnly: boolean;
};

export const OppholdskravSteg = ({ grunnlag, initialMellomlagring, behandlingVersjon, readOnly }: Props) => {
  const behandlingsreferanse = useBehandlingsReferanse();

  const { løsPeriodisertBehovOgGåTilNesteSteg, status, løsBehovOgGåTilNesteStegError, isLoading } =
    useLøsBehovOgGåTilNesteSteg('VURDER_OPPHOLDSKRAV');

  const { mellomlagretVurdering, nullstillMellomlagretVurdering, lagreMellomlagring, slettMellomlagring } =
    useMellomlagring(Behovstype.OPPHOLDSKRAV_KODE, initialMellomlagring);

  const { visningActions, visningModus, formReadOnly } = useVilkårskortVisning(
    readOnly,
    'VURDER_OPPHOLDSKRAV',
    mellomlagretVurdering
  );

  const defaultValues =
    mellomlagretVurdering != null
      ? (JSON.parse(mellomlagretVurdering.data) as OppholdskravForm)
      : getDefaultValuesFromGrunnlag(grunnlag);

  const form = useForm<OppholdskravForm>({
    defaultValues,
    reValidateMode: 'onChange',
  });

  const {
    fields: vurderingerFields,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: 'vurderinger',
    rules: {
      validate: (fields) => {
        const sorterteVurderinger = fields.toSorted((a, b) => {
          const aParsed = stringToDate(a.fraDato, 'dd.MM.yyyy')!;
          const bParsed = stringToDate(b.fraDato, 'dd.MM.yyyy')!;
          return aParsed.getTime() - bParsed.getTime();
        });
        const likRekkefølge = sorterteVurderinger.every((value, index) => value.fraDato === fields[index].fraDato);
        if (!likRekkefølge) {
          return 'Vurderingene som legges til må være i kronologisk rekkefølge fra eldst til nyest';
        }
      },
    },
  });

  function onAddPeriode() {
    append({
      begrunnelse: '',
      oppfyller: undefined,
      land: '',
      landAnnet: undefined,
      fraDato: undefined,
    });
  }

  function onSubmit(data: OppholdskravForm) {
    const losning: LøsPeriodisertBehovPåBehandling = {
      behandlingVersjon: behandlingVersjon,
      referanse: behandlingsreferanse,
      behov: {
        behovstype: Behovstype.OPPHOLDSKRAV_KODE,
        løsningerForPerioder: data.vurderinger.map((periode, index) => {
          const isLast = index === data.vurderinger.length - 1;
          const tilDato = isLast
            ? undefined
            : parseDatoFraDatePickerOgTrekkFra1Dag(data.vurderinger[index + 1].fraDato);
          return mapFormTilDto(periode, tilDato != null ? formaterDatoForBackend(tilDato) : undefined);
        }),
      },
    };

    løsPeriodisertBehovOgGåTilNesteSteg(losning, () => {
      nullstillMellomlagretVurdering();
    });
  }

  const tidligereVurderinger = grunnlag?.sisteVedtatteVurderinger ?? [];
  const vedtatteVurderinger = grunnlag?.sisteVedtatteVurderinger ?? [];
  const foersteNyePeriode = vurderingerFields.length > 0 ? form.watch('vurderinger.0.fraDato') : null;

  return (
    <VilkårskortMedFormOgMellomlagringNyVisning
      heading={'Oppholdskrav § 11-3'}
      steg={'VURDER_OPPHOLDSKRAV'}
      onSubmit={form.handleSubmit(onSubmit)}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      visBekreftKnapp={true}
      vilkårTilhørerNavKontor={false}
      isLoading={isLoading}
      status={status}
      mellomlagretVurdering={mellomlagretVurdering}
      onLagreMellomLagringClick={() => lagreMellomlagring(form.watch())}
      onDeleteMellomlagringClick={() => slettMellomlagring(() => form.reset(getDefaultValuesFromGrunnlag(grunnlag)))}
      readOnly={readOnly}
      visningModus={visningModus}
      visningActions={visningActions}
      extraActions={
        <Button variant={'secondary'} icon={<PlusIcon />} onClick={onAddPeriode} type="button">
          Legg til ny vurdering
        </Button>
      }
    >
      <VStack gap="8">
        <VStack gap="2">
          {vedtatteVurderinger.map((vurdering) => (
            <CustomExpandableCard
              key={vurdering.fom}
              editable={false}
              defaultOpen={false}
              heading={
                <OppholdskravTidligerePeriodeHeading
                  fom={parseISO(vurdering.fom)}
                  tom={vurdering.tom != null ? parseISO(vurdering.tom) : null}
                  foersteNyePeriode={foersteNyePeriode != null ? parseDatoFraDatePicker(foersteNyePeriode) : null}
                  oppfylt={vurdering.oppfylt}
                />
              }
            >
              <>
                <OppholdskravTidligereVurdering
                  fraDato={vurdering.fom}
                  begrunnelse={vurdering.begrunnelse}
                  land={vurdering.land}
                  oppfyller={vurdering.oppfylt}
                />
                {vurdering.vurdertAv != null && (
                  <OppholdskravVurdertAv
                    navn={vurdering.vurdertAv.ansattnavn}
                    ident={vurdering.vurdertAv.ident}
                    dato={vurdering.vurdertAv.dato}
                  />
                )}
              </>
            </CustomExpandableCard>
          ))}
          {vurderingerFields.map((vurdering, index) => (
            <CustomExpandableCard
              key={vurdering.id}
              editable
              defaultOpen
              heading={
                <OppholdskravNyPeriodeHeading
                  form={form}
                  index={index}
                  isLast={index === vurderingerFields.length - 1}
                />
              }
            >
              <>
                <OppholdskravFormInput
                  form={form}
                  readOnly={formReadOnly}
                  index={index}
                  harTidligereVurderinger={tidligereVurderinger.length !== 0}
                  onRemove={() => remove(index)}
                  visningModus={visningModus}
                />
                {vurdering.vurdertAv != null && (
                  <OppholdskravVurdertAv
                    navn={vurdering.vurdertAv.navn}
                    ident={vurdering.vurdertAv.ident}
                    dato={vurdering.vurdertAv.dato}
                  />
                )}
              </>
            </CustomExpandableCard>
          ))}
        </VStack>
        {form.formState.errors.vurderinger && (
          <ErrorMessage size={'small'} showIcon>
            {form.formState.errors.vurderinger?.root?.message}
          </ErrorMessage>
        )}
      </VStack>
    </VilkårskortMedFormOgMellomlagringNyVisning>
  );
};

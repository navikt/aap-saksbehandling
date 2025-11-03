'use client';

import { Button, ErrorSummary, VStack } from '@navikt/ds-react';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { Behovstype } from 'lib/utils/form';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { OppholdskravForm, OppholdskravVurderingForm } from 'components/behandlinger/oppholdskrav/types';
import { LøsPeriodisertBehovPåBehandling, MellomlagretVurdering, OppholdskravGrunnlagResponse } from 'lib/types/types';
import { useFieldArray, useForm } from 'react-hook-form';
import { VilkårskortMedFormOgMellomlagringNyVisning } from 'components/vilkårskort/vilkårskortmedformogmellomlagringnyvisning/VilkårskortMedFormOgMellomlagringNyVisning';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { PlusIcon } from '@navikt/aksel-icons';
import {
  getDefaultValuesFromGrunnlag,
  mapFormTilDto,
  mapPeriodiserteVurderingerErrorList,
  parseDatoFraDatePickerOgTrekkFra1Dag,
} from 'components/behandlinger/oppholdskrav/oppholdskrav-utils';
import { OppholdskravFormInput } from 'components/behandlinger/oppholdskrav/OppholdskravFormInput';
import { OppholdskravTidligereVurdering } from 'components/behandlinger/oppholdskrav/OppholdskravTidligereVurdering';
import { isAfter, min, parseISO } from 'date-fns';
import { formaterDatoForBackend, formaterDatoForFrontend, parseDatoFraDatePicker, stringToDate } from 'lib/utils/date';
import { TidligereVurderingExpandableCard } from 'components/periodisering/tidligerevurderingexpandablecard/TidligereVurderingExpandableCard';
import { NyVurderingExpandableCard } from 'components/periodisering/nyvurderingexpandablecard/NyVurderingExpandableCard';

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

  const tidligereVurderinger = grunnlag?.sisteVedtatteVurderinger ?? [];
  const vedtatteVurderinger = grunnlag?.sisteVedtatteVurderinger ?? [];

  const {
    fields: vurderingerFields,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: 'vurderinger',
    rules: {},
  });

  const errorList = mapPeriodiserteVurderingerErrorList<OppholdskravVurderingForm>(form.formState.errors);

  function onAddPeriode() {
    append({
      begrunnelse: '',
      oppfyller: undefined,
      land: '',
      landAnnet: undefined,
      fraDato: undefined,
    });
  }
  function validerVurderingerRekkefølge(vurderinger: OppholdskravVurderingForm[]): boolean {
    const sorterteVurderinger = vurderinger.toSorted((a, b) => {
      const aParsed = stringToDate(a.fraDato, 'dd.MM.yyyy')!;
      const bParsed = stringToDate(b.fraDato, 'dd.MM.yyyy')!;
      return aParsed.getTime() - bParsed.getTime();
    });
    const likRekkefølge = sorterteVurderinger.every((value, index) => value.fraDato === vurderinger[index].fraDato);
    if (!likRekkefølge) {
      vurderinger.forEach((_vurdering, index) => {
        form.setError(`vurderinger.${index}.fraDato`, {
          message: 'Vurderingene som legges til må være i kronologisk rekkefølge fra eldst til nyest',
          type: 'custom',
        });
      });
      return false;
    }

    const tidligsteDato = min([
      ...sorterteVurderinger.map((i) => parseDatoFraDatePicker(i.fraDato)!),
      ...tidligereVurderinger.map((i) => parseISO(i.fom)),
    ]);

    const tidligsteDatoSomMåVurderes = new Date(grunnlag?.kanVurderes[0]?.fom!);
    if (isAfter(tidligsteDato, tidligsteDatoSomMåVurderes)) {
      vurderinger.forEach((vurdering, index) => {
        form.setError(`vurderinger.${index}.fraDato`, {
          message: `Den tidligste vurderte datoen må være startdatoen for rettighetsperioden. Tidligste vurderte dato er ${formaterDatoForFrontend(tidligsteDato)} men rettighetsperioden starter ${formaterDatoForFrontend(tidligsteDatoSomMåVurderes)}`,
        });
      });
      return false;
    }

    return true;
  }

  function onSubmit(data: OppholdskravForm) {
    const erPerioderGyldige = validerVurderingerRekkefølge(data.vurderinger);
    if (!erPerioderGyldige) {
      return;
    }
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
      formReset={() => form.reset(mellomlagretVurdering ? JSON.parse(mellomlagretVurdering.data) : undefined)}
    >
      <VStack gap="4">
        <VStack gap="2">
          {vedtatteVurderinger.map((vurdering) => (
            <TidligereVurderingExpandableCard
              key={vurdering.fom}
              fom={parseISO(vurdering.fom)}
              tom={vurdering.tom != null ? parseISO(vurdering.tom) : null}
              foersteNyePeriodeFraDato={foersteNyePeriode != null ? parseDatoFraDatePicker(foersteNyePeriode) : null}
              oppfylt={vurdering.oppfylt}
            >
              <OppholdskravTidligereVurdering
                fraDato={vurdering.fom}
                begrunnelse={vurdering.begrunnelse}
                land={vurdering.land}
                oppfyller={vurdering.oppfylt}
              />
            </TidligereVurderingExpandableCard>
          ))}
          {vurderingerFields.map((vurdering, index) => (
            <NyVurderingExpandableCard
              key={vurdering.id}
              fraDato={vurdering.fraDato}
              oppfylt={form.watch(`vurderinger.${index}.oppfyller`)}
              nestePeriodeFraDato={form.watch(`vurderinger.${index + 1}.fraDato`)}
              isLast={index === vurderingerFields.length - 1}
              vurdertAv={vurdering.vurdertAv}
            >
              <OppholdskravFormInput
                form={form}
                readOnly={formReadOnly}
                index={index}
                harTidligereVurderinger={tidligereVurderinger.length !== 0}
                onRemove={() => remove(index)}
                visningModus={visningModus}
              />
            </NyVurderingExpandableCard>
          ))}
        </VStack>
        {errorList.length > 0 && (
          <ErrorSummary size={'small'}>
            {errorList.map((error) => (
              <ErrorSummary.Item key={error.ref} href={error.ref}>
                {error?.message}
              </ErrorSummary.Item>
            ))}
          </ErrorSummary>
        )}
      </VStack>
    </VilkårskortMedFormOgMellomlagringNyVisning>
  );
};

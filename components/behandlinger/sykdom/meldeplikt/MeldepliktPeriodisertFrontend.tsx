'use client';

import { HStack, Link, Radio, VStack } from '@navikt/ds-react';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import {
  FritakMeldepliktGrunnlag,
  LøsPeriodisertBehovPåBehandling,
  MellomlagretVurdering,
  PeriodisertFritaksvurderingDto,
} from 'lib/types/types';
import { Behovstype, getJaNeiEllerUndefined, JaEllerNei } from 'lib/utils/form';
import { gyldigDatoEllerNull, validerDato } from 'lib/validation/dateValidation';
import { useFieldArray, useForm } from 'react-hook-form';
import { RadioGroupWrapper } from 'components/form/radiogroupwrapper/RadioGroupWrapper';

import { formaterDatoForBackend, formaterDatoForFrontend, parseDatoFraDatePicker } from 'lib/utils/date';
import { parse, parseISO } from 'date-fns';
import { TextAreaWrapper } from 'components/form/textareawrapper/TextAreaWrapper';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { VilkårskortPeriodisert } from 'components/vilkårskort/vilkårskortperiodisert/VilkårskortPeriodisert';
import { finnesFeilForVurdering, mapPeriodiserteVurderingerErrorList } from 'lib/utils/formerrors';
import { NyVurderingExpandableCard } from 'components/periodisering/nyvurderingexpandablecard/NyVurderingExpandableCard';
import { validerPeriodiserteVurderingerRekkefølge } from 'lib/utils/validering';
import { parseDatoFraDatePickerOgTrekkFra1Dag } from 'components/behandlinger/oppholdskrav/oppholdskrav-utils';
import { SpørsmålOgSvar } from 'components/sporsmaalogsvar/SpørsmålOgSvar';
import { TidligereVurderingExpandableCard } from 'components/periodisering/tidligerevurderingexpandablecard/TidligereVurderingExpandableCard';
import React from 'react';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';

interface Props {
  behandlingVersjon: number;
  grunnlag?: FritakMeldepliktGrunnlag;
  readOnly: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

export interface FritakMeldepliktForm {
  vurderinger: FritakMeldepliktVurderingForm[];
}

export interface FritakMeldepliktVurderingForm {
  begrunnelse: string;
  harFritak: string | undefined;
  fraDato: string | undefined;
  vurdertAv?: {
    ansattnavn: string | null | undefined;
    ident: string;
    dato: string;
  };
}

export const MeldepliktPeriodisertFrontend = ({
  behandlingVersjon,
  grunnlag,
  readOnly,
  initialMellomlagretVurdering,
}: Props) => {
  const behandlingsreferanse = useBehandlingsReferanse();

  const { løsPeriodisertBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('FRITAK_MELDEPLIKT');

  const { mellomlagretVurdering, nullstillMellomlagretVurdering, lagreMellomlagring, slettMellomlagring } =
    useMellomlagring(Behovstype.FRITAK_MELDEPLIKT_KODE, initialMellomlagretVurdering);

  const { visningActions, formReadOnly, visningModus } = useVilkårskortVisning(
    readOnly,
    'FRITAK_MELDEPLIKT',
    mellomlagretVurdering
  );

  const nyeVurderinger = grunnlag?.nyeVurderinger ?? [];

  const defaultValues =
    initialMellomlagretVurdering != null
      ? (JSON.parse(initialMellomlagretVurdering.data) as FritakMeldepliktForm)
      : getDefaultValuesFromGrunnlag(grunnlag);

  const form = useForm<FritakMeldepliktForm>({
    defaultValues,
  });

  const vedtatteVurderinger = grunnlag?.sisteVedtatteVurderinger ?? [];

  const { fields, append, remove } = useFieldArray({ name: 'vurderinger', control: form.control });

  function onAddPeriode() {
    append({
      begrunnelse: '',
      fraDato: fields.length === 0 ? formaterDatoForFrontend(new Date()) : undefined,
      harFritak: undefined,
    });
  }

  function onSubmit(data: FritakMeldepliktForm) {
    const erPerioderGyldige = validerPeriodiserteVurderingerRekkefølge({
      form,
      nyeVurderinger: data.vurderinger,
      grunnlag,
      tidligsteDatoMåMatcheMedRettighetsperiode: false,
    });
    if (!erPerioderGyldige) {
      return;
    }

    if (data.vurderinger.length === 0 && nyeVurderinger.length === 0) {
      visningActions.onBekreftClick();
      return;
    }

    const losning: LøsPeriodisertBehovPåBehandling = {
      behandlingVersjon: behandlingVersjon,
      referanse: behandlingsreferanse,
      behov: {
        behovstype: Behovstype.FRITAK_MELDEPLIKT_KODE,
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
      visningActions.onBekreftClick();
    });
  }

  const foersteNyePeriode = fields.length > 0 ? form.watch('vurderinger.0.fraDato') : null;
  const errorList = mapPeriodiserteVurderingerErrorList<FritakMeldepliktVurderingForm>(form.formState.errors);

  const showAsOpen =
    (grunnlag?.nyeVurderinger && grunnlag.nyeVurderinger.length >= 1) || initialMellomlagretVurdering !== undefined;

  return (
    <VilkårskortPeriodisert
      heading={'§ 11-10 tredje ledd. Unntak fra meldeplikt (valgfritt)'}
      steg="FRITAK_MELDEPLIKT"
      vilkårTilhørerNavKontor={true}
      defaultOpen={showAsOpen}
      onSubmit={form.handleSubmit(onSubmit)}
      status={status}
      isLoading={isLoading}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      vurdertAvAnsatt={grunnlag?.sisteVedtatteVurderinger?.[0]?.vurdertAv}
      kvalitetssikretAv={grunnlag?.sisteVedtatteVurderinger?.[0]?.kvalitetssikretAv}
      mellomlagretVurdering={mellomlagretVurdering}
      onLagreMellomLagringClick={() => lagreMellomlagring(form.watch())}
      onDeleteMellomlagringClick={() => slettMellomlagring(() => form.reset(getDefaultValuesFromGrunnlag(grunnlag)))}
      visningModus={visningModus}
      visningActions={visningActions}
      formReset={() => form.reset(getDefaultValuesFromGrunnlag(grunnlag))}
      onLeggTilVurdering={onAddPeriode}
      errorList={errorList}
    >
      {!formReadOnly && (
        <VStack paddingBlock={'4'}>
          <Link href={'https://lovdata.no/pro/rundskriv/r11-00/KAPITTEL_12'} target="_blank">
            Du kan lese hvordan vilkåret skal vurderes i rundskrivet til § 11-10 (lovdata.no)
          </Link>
        </VStack>
      )}

      {vedtatteVurderinger.map((vurdering) => (
        <TidligereVurderingExpandableCard
          key={vurdering.fom}
          fom={parseISO(vurdering.fom)}
          tom={vurdering.tom != null ? parseISO(vurdering.tom) : null}
          foersteNyePeriodeFraDato={foersteNyePeriode != null ? parseDatoFraDatePicker(foersteNyePeriode) : null}
          oppfylt={vurdering.harFritak}
        >
          <VStack gap={'5'}>
            <SpørsmålOgSvar spørsmål="Vurderingen gjelder fra?" svar={formaterDatoForFrontend(vurdering.fom)} />
            <SpørsmålOgSvar spørsmål="Vilkårsvurdering" svar={vurdering.begrunnelse} />
            <SpørsmålOgSvar
              spørsmål="Skal brukeren få fritak fra meldeplikt?"
              svar={getJaNeiEllerUndefined(vurdering.harFritak)!}
            />
          </VStack>
        </TidligereVurderingExpandableCard>
      ))}

      {fields.map((vurdering, index) => (
        <NyVurderingExpandableCard
          key={vurdering.id}
          fraDato={gyldigDatoEllerNull(form.watch(`vurderinger.${index}.fraDato`))}
          oppfylt={
            form.watch(`vurderinger.${index}.harFritak`)
              ? form.watch(`vurderinger.${index}.harFritak`) === JaEllerNei.Ja
              : undefined
          }
          nestePeriodeFraDato={gyldigDatoEllerNull(form.watch(`vurderinger.${index + 1}.fraDato`))}
          isLast={index === vedtatteVurderinger.length - 1}
          vurdertAv={undefined}
          finnesFeil={finnesFeilForVurdering(index, errorList)}
          readonly={formReadOnly}
          onRemove={() => remove(index)}
          // vilkåret er valgfritt, kan derfor slette vurderingen selv om det ikke finnes en tidligere vurdering
          harTidligereVurderinger={true}
          index={index}
        >
          <HStack justify={'space-between'}>
            <DateInputWrapper
              name={`vurderinger.${index}.fraDato`}
              label="Virkningstidspunkt for vurderingen"
              control={form.control}
              rules={{
                required: 'Vennligst velg et virkningstidspunkt for vurderingen',
                validate: (value) => validerDato(value as string),
              }}
              readOnly={formReadOnly}
            />
          </HStack>
          <TextAreaWrapper
            label={'Vilkårsvurdering'}
            control={form.control}
            name={`vurderinger.${index}.begrunnelse`}
            rules={{ required: 'Du må begrunne vurderingen din' }}
            className={'begrunnelse'}
            readOnly={formReadOnly}
          />
          <RadioGroupWrapper
            label={'Skal brukeren få fritak fra meldeplikt?'}
            control={form.control}
            name={`vurderinger.${index}.harFritak`}
            rules={{ required: 'Du må svare på om brukeren skal få fritak fra meldeplikt' }}
            readOnly={formReadOnly}
            horisontal
          >
            <Radio value={JaEllerNei.Ja}>Ja</Radio>
            <Radio value={JaEllerNei.Nei}>Nei</Radio>
          </RadioGroupWrapper>
        </NyVurderingExpandableCard>
      ))}
    </VilkårskortPeriodisert>
  );
};

function getDefaultValuesFromGrunnlag(grunnlag: FritakMeldepliktGrunnlag | undefined): FritakMeldepliktForm {
  if (grunnlag == null || (grunnlag.nyeVurderinger.length === 0 && grunnlag.sisteVedtatteVurderinger.length === 0)) {
    // Vi har ingen tidligere vurderinger eller nye vurderinger, legg til en tom array med vurderinger
    return {
      vurderinger: [],
    };
  }

  // Vi har allerede data lagret, vis enten de som er lagret i grunnlaget her eller tom liste
  return {
    vurderinger: grunnlag?.nyeVurderinger.map((vurdering) => ({
      begrunnelse: vurdering.begrunnelse,
      fraDato: formaterDatoForFrontend(vurdering.fom),
      harFritak: vurdering.harFritak ? JaEllerNei.Ja : JaEllerNei.Nei,
      vurdertAv:
        vurdering.vurdertAv != null
          ? {
              ansattnavn: vurdering.vurdertAv.ansattnavn,
              ident: vurdering.vurdertAv.ident,
              dato: vurdering.vurdertAv.dato,
            }
          : undefined,
    })),
  };
}
function mapFormTilDto(
  periodeForm: FritakMeldepliktVurderingForm,
  tilDato: string | undefined | null
): PeriodisertFritaksvurderingDto {
  return {
    begrunnelse: periodeForm.begrunnelse,
    fom: formaterDatoForBackend(parse(periodeForm.fraDato!, 'dd.MM.yyyy', new Date())),
    tom: tilDato,
    harFritak: periodeForm.harFritak === JaEllerNei.Ja,
  };
}

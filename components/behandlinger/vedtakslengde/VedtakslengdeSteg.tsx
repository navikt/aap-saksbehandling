'use client';

import {
  MellomlagretVurdering,
  VedtakslengdeGrunnlag,
  VedtakslengdeVurderingResponse,
  VurderingMeta,
} from 'lib/types/types';
import { Radio, VStack } from '@navikt/ds-react';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { Behovstype } from 'lib/utils/form';
import { VilkårskortPeriodisert } from 'components/vilkårskort/vilkårskortperiodisert/VilkårskortPeriodisert';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { useFieldArray, useForm } from 'react-hook-form';
import { TextAreaWrapper } from 'components/form/textareawrapper/TextAreaWrapper';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { formaterDatoForBackend, formaterDatoForFrontend, parseDatoFraDatePicker } from 'lib/utils/date';
import { gyldigDatoEllerNull, validerDato } from 'lib/validation/dateValidation';
import {
  NyVurderingExpandableCard,
  skalVæreInitiellEkspandert,
} from 'components/periodisering/nyvurderingexpandablecard/NyVurderingExpandableCard';
import { TidligereVurderingExpandableCard } from 'components/periodisering/tidligerevurderingexpandablecard/TidligereVurderingExpandableCard';
import { SpørsmålOgSvar } from 'components/sporsmaalogsvar/SpørsmålOgSvar';
import { VurderingStatus } from 'components/periodisering/VurderingStatusTag';
import { useAccordionsSignal } from 'hooks/AccordionSignalHook';
import { addDays, parse, parseISO } from 'date-fns';
import { LøsningerForPerioder } from 'lib/types/løsningerforperioder';
import { finnesFeilForVurdering, hentFeilmeldingerForForm } from 'lib/utils/formerrors';
import { RadioGroupWrapper } from 'components/form/radiogroupwrapper/RadioGroupWrapper';
import React from 'react';

interface VedtakslengdeVurderingForm extends VurderingMeta {
  manuellVurdering: boolean;
  erNyVurdering: boolean;
  behøverVurdering: boolean;
  fraDato: string;
  sluttdato: string;
  begrunnelse: string;
  endring: 'FORLENGELSE';
}

interface VedtakslengdeForm {
  vurderinger: VedtakslengdeVurderingForm[];
}

interface Props {
  grunnlag: VedtakslengdeGrunnlag;
  behandlingVersjon: number;
  readOnly: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

function getDefaultValuesFromGrunnlag(grunnlag: VedtakslengdeGrunnlag): VedtakslengdeForm {
  const manuelleVurderinger: VedtakslengdeVurderingForm[] = grunnlag.nyeVurderinger
    .filter((v) => v.manuellVurdering)
    .map((v) => ({
      fraDato: v.fom ? formaterDatoForFrontend(v.fom) : '',
      begrunnelse: v.begrunnelse,
      sluttdato: formaterDatoForFrontend(v.sluttdato),
      erNyVurdering: false,
      behøverVurdering: false,
      manuellVurdering: true,
      endring: 'FORLENGELSE',
      vurdertAv: v.vurdertAv,
      besluttetAv: v.besluttetAv,
    }));

  return {
    vurderinger: manuelleVurderinger,
  };
}

export const VedtakslengdeSteg = ({ grunnlag, behandlingVersjon, readOnly, initialMellomlagretVurdering }: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();

  const { løsPeriodisertBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('FASTSETT_VEDTAKSLENGDE');

  const { accordionsSignal, closeAllAccordions } = useAccordionsSignal();

  const { visningModus, visningActions, formReadOnly, erAktivUtenAvbryt } = useVilkårskortVisning(
    readOnly,
    'FASTSETT_VEDTAKSLENGDE',
    initialMellomlagretVurdering
  );

  const defaultValues: VedtakslengdeForm = initialMellomlagretVurdering
    ? JSON.parse(initialMellomlagretVurdering.data)
    : getDefaultValuesFromGrunnlag(grunnlag);

  const form = useForm<VedtakslengdeForm>({
    defaultValues,
    reValidateMode: 'onChange',
  });

  const { slettMellomlagring, mellomlagretVurdering, nullstillMellomlagretVurdering } = useMellomlagring(
    Behovstype.FASTSETT_VEDTAKSLENGDE,
    initialMellomlagretVurdering,
    form
  );

  const {
    fields: vurderingerFields,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: 'vurderinger',
  });

  const foersteNyePeriode = vurderingerFields.length > 0 ? form.watch('vurderinger.0.fraDato') : null;
  const errorList = hentFeilmeldingerForForm(form.formState.errors);
  const harManuellVurdering = vurderingerFields.some((v) => v.manuellVurdering);

  const sisteVedtatteVurdering = grunnlag.sisteVedtatteVurderinger.at(-1);
  const sistVedtatteSluttdato = sisteVedtatteVurdering?.tom ? parseISO(sisteVedtatteVurdering.tom) : null;
  const fraDatoManuellVurdering =
    sistVedtatteSluttdato != null ? addDays(sistVedtatteSluttdato, 1) : parseISO(grunnlag.kanVurderes[0].fom);

  function onAddVurdering() {
    append({
      fraDato: formaterDatoForFrontend(fraDatoManuellVurdering),
      begrunnelse: '',
      sluttdato: '',
      erNyVurdering: true,
      behøverVurdering: false,
      manuellVurdering: true,
      endring: 'FORLENGELSE',
    });
  }

  function onSubmit(data: VedtakslengdeForm) {
    const manuelleVurderinger = data.vurderinger.filter((v) => v.manuellVurdering);

    const losning: LøsningerForPerioder = {
      behandlingVersjon: behandlingVersjon,
      referanse: behandlingsReferanse,
      behov: {
        behovstype: Behovstype.FASTSETT_VEDTAKSLENGDE as const,
        løsningerForPerioder: manuelleVurderinger.map((vurdering) => {
          const fraDato = formaterDatoForBackend(parse(vurdering.fraDato, 'dd.MM.yyyy', new Date()));
          const sluttdato = formaterDatoForBackend(parse(vurdering.sluttdato, 'dd.MM.yyyy', new Date()));
          return {
            fom: fraDato,
            tom: sluttdato,
            begrunnelse: vurdering.begrunnelse,
            sluttdato: sluttdato,
          };
        }),
      },
    };

    løsPeriodisertBehovOgGåTilNesteSteg(losning, () => {
      closeAllAccordions();
      visningActions.onBekreftClick();
      nullstillMellomlagretVurdering();
    });
  }

  return (
    <VilkårskortPeriodisert
      heading={'§ 6 i AAP forskriften. Vedtaksperiode'}
      steg={'FASTSETT_VEDTAKSLENGDE'}
      vilkårTilhørerNavKontor={false}
      onSubmit={form.handleSubmit(onSubmit)}
      status={status}
      isLoading={isLoading}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      onDeleteMellomlagringClick={() => slettMellomlagring(() => form.reset(getDefaultValuesFromGrunnlag(grunnlag)))}
      mellomlagretVurdering={mellomlagretVurdering}
      visningModus={visningModus}
      visningActions={visningActions}
      onLeggTilVurdering={!harManuellVurdering ? onAddVurdering : undefined}
      errorList={errorList}
      formReset={() => form.reset(getDefaultValuesFromGrunnlag(grunnlag))}
    >
      {grunnlag.sisteVedtatteVurderinger.map((vurdering, index) => (
        <TidligereVurderingExpandableCard
          key={`vedtatt-${index}`}
          fom={parseISO(vurdering.fom)}
          tom={vurdering.tom ? parseISO(vurdering.tom) : null}
          foersteNyePeriodeFraDato={foersteNyePeriode == null ? null : parseDatoFraDatePicker(foersteNyePeriode)}
          vurderingStatus={
            vurdering.manuellVurdering
              ? VurderingStatus.VedtaksperiodeManuell
              : VurderingStatus.VedtaksperiodeAutomatisk
          }
          vurdertAv={vurdering.vurdertAv}
          kvalitetssikretAv={vurdering.kvalitetssikretAv}
          besluttetAv={vurdering.besluttetAv}
        >
          <VedtakslengdeVurderingInnhold vurdering={vurdering} />
        </TidligereVurderingExpandableCard>
      ))}

      {grunnlag.nyeVurderinger
        .filter((v) => !v.manuellVurdering)
        .map((vurdering, index) => (
          <TidligereVurderingExpandableCard
            key={`ny-automatisk-${index}`}
            fom={parseISO(vurdering.fom)}
            tom={vurdering.tom ? parseISO(vurdering.tom) : null}
            foersteNyePeriodeFraDato={foersteNyePeriode == null ? null : parseDatoFraDatePicker(foersteNyePeriode)}
            vurderingStatus={VurderingStatus.VedtaksperiodeAutomatisk}
            vurdertAv={vurdering.vurdertAv}
            kvalitetssikretAv={vurdering.kvalitetssikretAv}
            besluttetAv={vurdering.besluttetAv}
          >
            <VedtakslengdeVurderingInnhold vurdering={vurdering} />
          </TidligereVurderingExpandableCard>
        ))}

      {vurderingerFields.map((vurdering, index) => (
        <NyVurderingExpandableCard
          key={vurdering.id}
          initiellEkspandert={skalVæreInitiellEkspandert(vurdering.erNyVurdering, erAktivUtenAvbryt)}
          fraDato={fraDatoManuellVurdering}
          nestePeriodeFraDato={(() => {
            // Utleder neste periode slik at periode slik at det blir satt en sluttdato
            const dato = gyldigDatoEllerNull(form.watch(`vurderinger.${index}.sluttdato`));
            return dato ? addDays(dato, 1) : null;
          })()}
          isLast={true}
          finnesFeil={finnesFeilForVurdering(index, errorList)}
          vurderingStatus={vurdering.erNyVurdering ? undefined : VurderingStatus.VedtaksperiodeManuell}
          vurdering={vurdering}
          readonly={formReadOnly}
          onSlettVurdering={() => remove(index)}
          harTidligereVurderinger={
            grunnlag.sisteVedtatteVurderinger.length > 0 ||
            grunnlag.nyeVurderinger.filter((v) => !v.manuellVurdering).length > 0 ||
            index > 0
          }
          index={index}
          accordionsSignal={accordionsSignal}
        >
          <VStack gap={'4'}>
            <RadioGroupWrapper
              label={'Ønsket endring'}
              control={form.control}
              name={`vurderinger.${index}.endring`}
              readOnly={readOnly}
              rules={{
                required: 'Feltet er påkrevet',
              }}
              horisontal
            >
              <Radio value={'FORLENGELSE'}>Forleng vedtak</Radio>
            </RadioGroupWrapper>

            <DateInputWrapper
              name={`vurderinger.${index}.sluttdato`}
              control={form.control}
              label={'Sett ny sluttdato for vedtaksperiode'}
              description={'Sluttdatoen kan ikke være tidligere enn forrige vedtatte sluttdato'}
              rules={{
                required: 'Du må oppgi en sluttdato',
                validate: (value) => validerDato(value as string),
              }}
              readOnly={formReadOnly}
            />

            <TextAreaWrapper
              name={`vurderinger.${index}.begrunnelse`}
              control={form.control}
              label={'Begrunnelse for endring av vedtakslengde'}
              rules={{
                required: 'Du må gi en begrunnelse',
              }}
              readOnly={formReadOnly}
            />
          </VStack>
        </NyVurderingExpandableCard>
      ))}
    </VilkårskortPeriodisert>
  );
};

const VedtakslengdeVurderingInnhold = ({ vurdering }: { vurdering: VedtakslengdeVurderingResponse }) => (
  <VStack gap={'2'}>
    <SpørsmålOgSvar spørsmål={'Sluttdato'} svar={formaterDatoForFrontend(vurdering.sluttdato)} />
    <SpørsmålOgSvar spørsmål={'Begrunnelse'} svar={vurdering.begrunnelse} />
  </VStack>
);

'use client';

import { VedtakslengdeGrunnlag, VedtakslengdeVurderingResponse, MellomlagretVurdering } from 'lib/types/types';
import { VStack } from '@navikt/ds-react';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { Behovstype } from 'lib/utils/form';
import { VilkårskortPeriodisert } from 'components/vilkårskort/vilkårskortperiodisert/VilkårskortPeriodisert';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { useFieldArray, useForm } from 'react-hook-form';
import { TextAreaWrapper } from 'components/form/textareawrapper/TextAreaWrapper';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { formaterDatoForBackend, formaterDatoForFrontend } from 'lib/utils/date';
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
import { finnesFeilForVurdering, mapPeriodiserteVurderingerErrorList } from 'lib/utils/formerrors';

interface VedtakslengdeVurderingFormFields {
  begrunnelse: string;
  sluttdato: string;
  erNyVurdering: boolean;
  behøverVurdering: boolean;
  manuellVurdering: boolean;
}

interface VedtakslengdeFormFields {
  vurderinger: VedtakslengdeVurderingFormFields[];
}

interface Props {
  grunnlag: VedtakslengdeGrunnlag;
  behandlingVersjon: number;
  readOnly: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

function getDefaultValuesFromGrunnlag(
  grunnlag: VedtakslengdeGrunnlag,
  mellomlagretData: VedtakslengdeFormFields | undefined
): VedtakslengdeFormFields {
  if (mellomlagretData) {
    return mellomlagretData;
  }

  const automatiskeVurderinger: VedtakslengdeVurderingFormFields[] = grunnlag.nyeVurderinger
    .filter((v) => !v.manuellVurdering)
    .map((v) => ({
      begrunnelse: v.begrunnelse,
      sluttdato: formaterDatoForFrontend(v.sluttdato),
      erNyVurdering: false,
      behøverVurdering: false,
      manuellVurdering: false,
    }));

  const manuelleVurderinger: VedtakslengdeVurderingFormFields[] = grunnlag.nyeVurderinger
    .filter((v) => v.manuellVurdering)
    .map((v) => ({
      begrunnelse: v.begrunnelse,
      sluttdato: formaterDatoForFrontend(v.sluttdato),
      erNyVurdering: false,
      behøverVurdering: false,
      manuellVurdering: true,
    }));

  const nyeVurderinger: VedtakslengdeVurderingFormFields[] =
    grunnlag.behøverVurderinger.length > 0 && manuelleVurderinger.length === 0
      ? [
          {
            begrunnelse: '',
            sluttdato: '',
            erNyVurdering: true,
            behøverVurdering: true,
            manuellVurdering: true,
          },
        ]
      : [];

  return {
    vurderinger: [...automatiskeVurderinger, ...manuelleVurderinger, ...nyeVurderinger],
  };
}

export const VedtakslengdeSteg = ({ grunnlag, behandlingVersjon, readOnly, initialMellomlagretVurdering }: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();

  console.log(grunnlag);
  const { løsPeriodisertBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('FASTSETT_VEDTAKSLENGDE');

  const { lagreMellomlagring, slettMellomlagring, mellomlagretVurdering, nullstillMellomlagretVurdering } =
    useMellomlagring(Behovstype.FASTSETT_VEDTAKSLENGDE, initialMellomlagretVurdering);

  const { accordionsSignal, closeAllAccordions } = useAccordionsSignal();

  const { visningModus, visningActions, formReadOnly, erAktivUtenAvbryt } = useVilkårskortVisning(
    readOnly,
    'FASTSETT_VEDTAKSLENGDE',
    mellomlagretVurdering
  );

  const mellomlagretData = mellomlagretVurdering
    ? (JSON.parse(mellomlagretVurdering.data) as VedtakslengdeFormFields)
    : undefined;

  const defaultValues = getDefaultValuesFromGrunnlag(grunnlag, mellomlagretData);

  const form = useForm<VedtakslengdeFormFields>({
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
  });

  function onAddVurdering() {
    append({
      begrunnelse: '',
      sluttdato: '',
      erNyVurdering: true,
      behøverVurdering: false,
      manuellVurdering: true,
    });
  }

  function onSubmit(data: VedtakslengdeFormFields) {
    const fom = grunnlag.kanVurderes.length > 0 ? grunnlag.kanVurderes[0].fom : grunnlag.nyeVurderinger[0]?.fom;

    const manuelleVurderinger = data.vurderinger.filter((v) => v.manuellVurdering);

    const losning: LøsningerForPerioder = {
      behandlingVersjon: behandlingVersjon,
      referanse: behandlingsReferanse,
      behov: {
        behovstype: Behovstype.FASTSETT_VEDTAKSLENGDE as const,
        løsningerForPerioder: manuelleVurderinger.map((vurdering) => {
          const sluttdato = formaterDatoForBackend(parse(vurdering.sluttdato, 'dd.MM.yyyy', new Date()));
          return {
            fom: fom,
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

  const harVurderinger =
    grunnlag.nyeVurderinger.length > 0 ||
    grunnlag.sisteVedtatteVurderinger.length > 0 ||
    grunnlag.behøverVurderinger.length > 0;

  if (!harVurderinger) {
    return <></>;
  }

  const sisteVedtatteVurdering = grunnlag.sisteVedtatteVurderinger.at(-1);
  const sistVedtatteTom = sisteVedtatteVurdering?.tom ? parseISO(sisteVedtatteVurdering.tom) : null;
  const errorList = mapPeriodiserteVurderingerErrorList<VedtakslengdeFormFields>(form.formState.errors);

  const harManuellVurdering = vurderingerFields.some((v) => v.manuellVurdering);

  return (
    <VilkårskortPeriodisert
      heading={'§ 6 i AAP forskriften. Vedtaksperiode'}
      steg={'FASTSETT_VEDTAKSLENGDE'}
      vilkårTilhørerNavKontor={false}
      onSubmit={form.handleSubmit(onSubmit)}
      status={status}
      isLoading={isLoading}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      onLagreMellomLagringClick={() => lagreMellomlagring(form.watch())}
      onDeleteMellomlagringClick={() =>
        slettMellomlagring(() => form.reset(getDefaultValuesFromGrunnlag(grunnlag, undefined)))
      }
      mellomlagretVurdering={mellomlagretVurdering}
      visningModus={visningModus}
      visningActions={visningActions}
      onLeggTilVurdering={!harManuellVurdering ? onAddVurdering : undefined}
      errorList={errorList}
      formReset={() => form.reset(getDefaultValuesFromGrunnlag(grunnlag, undefined))}
    >
      {grunnlag.sisteVedtatteVurderinger.map((vurdering, index) => (
        <TidligereVurderingExpandableCard
          key={`vedtatt-${index}`}
          fom={parseISO(vurdering.fom)}
          tom={vurdering.tom ? parseISO(vurdering.tom) : null}
          foersteNyePeriodeFraDato={null}
          vurderingStatus={
            vurdering.manuellVurdering ? VurderingStatus.VedtakslengdeManuell : VurderingStatus.VedtakslengdeAutomatisk
          }
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
          fraDato={sistVedtatteTom ? addDays(sistVedtatteTom, 1) : parseISO(grunnlag.kanVurderes[0].fom)}
          nestePeriodeFraDato={(() => {
            const dato = gyldigDatoEllerNull(form.watch(`vurderinger.${index}.sluttdato`));
            return dato ? addDays(dato, 1) : null;
          })()}
          isLast={index === vurderingerFields.length - 1}
          finnesFeil={finnesFeilForVurdering(index, errorList)}
          vurderingStatus={
            vurdering.manuellVurdering
              ? vurdering.erNyVurdering
                ? undefined
                : VurderingStatus.VedtakslengdeManuell
              : harManuellVurdering
                ? VurderingStatus.Overskrevet
                : VurderingStatus.VedtakslengdeAutomatisk
          }
          vurdering={vurdering}
          readonly={!vurdering.manuellVurdering || formReadOnly}
          onSlettVurdering={() => remove(index)}
          harTidligereVurderinger={grunnlag.sisteVedtatteVurderinger.length > 0 || index > 0}
          index={index}
          accordionsSignal={accordionsSignal}
          overstyrt={!vurdering.manuellVurdering && harManuellVurdering}
        >
          {vurdering.manuellVurdering ? (
            <VStack gap={'4'}>
              <DateInputWrapper
                name={`vurderinger.${index}.sluttdato`}
                control={form.control}
                label={'Sett ny dato for forkortet vedtaksperiode'}
                description={'Rammen kan ikke settes tilbake i tid fra dagens dato'}
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
          ) : (
            <VStack gap={'2'}>
              <SpørsmålOgSvar spørsmål={'Type'} svar={'Automatisk vurdering'} />
              <SpørsmålOgSvar spørsmål={'Sluttdato'} svar={form.watch(`vurderinger.${index}.sluttdato`)} />
              <SpørsmålOgSvar spørsmål={'Begrunnelse'} svar={form.watch(`vurderinger.${index}.begrunnelse`)} />
            </VStack>
          )}
        </NyVurderingExpandableCard>
      ))}
    </VilkårskortPeriodisert>
  );
};

const VedtakslengdeVurderingInnhold = ({ vurdering }: { vurdering: VedtakslengdeVurderingResponse }) => (
  <VStack gap={'2'}>
    <SpørsmålOgSvar
      spørsmål={'Type'}
      svar={vurdering.manuellVurdering ? 'Manuell vurdering' : 'Automatisk vurdering'}
    />
    <SpørsmålOgSvar spørsmål={'Sluttdato'} svar={formaterDatoForFrontend(vurdering.sluttdato)} />
    <SpørsmålOgSvar spørsmål={'Begrunnelse'} svar={vurdering.begrunnelse} />
  </VStack>
);

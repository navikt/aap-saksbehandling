'use client';

import { MellomlagretVurdering, OvergangUforeGrunnlag, VurdertAvAnsatt } from 'lib/types/types';
import { Behovstype, getJaNeiEllerUndefined, JaEllerNei } from 'lib/utils/form';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import React, { FormEvent } from 'react';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { formaterDatoForBackend, formaterDatoForFrontend, parseDatoFraDatePicker } from 'lib/utils/date';
import { gyldigDatoEllerNull } from 'lib/validation/dateValidation';
import { parse, parseISO } from 'date-fns';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { useFieldArray, useForm, UseFormReturn } from 'react-hook-form';
import { VilkårskortPeriodisert } from 'components/vilkårskort/vilkårskortperiodisert/VilkårskortPeriodisert';
import {
  NyVurderingExpandableCard,
  skalVæreInitiellEkspandert,
} from 'components/periodisering/nyvurderingexpandablecard/NyVurderingExpandableCard';
import { OvergangUforeVurderingFormInput } from 'components/behandlinger/sykdom/overgangufore/OvergangUforeVurderingFormInput';
import { finnesFeilForVurdering, mapPeriodiserteVurderingerErrorList } from 'lib/utils/formerrors';
import { TidligereVurderingExpandableCard } from 'components/periodisering/tidligerevurderingexpandablecard/TidligereVurderingExpandableCard';
import { OvergangUforeTidligereVurdering } from 'components/behandlinger/sykdom/overgangufore/OvergangUforeTidligereVurdering';
import { BodyLong, Link, VStack } from '@navikt/ds-react';
import { parseDatoFraDatePickerOgTrekkFra1Dag } from 'components/behandlinger/oppholdskrav/oppholdskrav-utils';
import { getFraDatoFraGrunnlagForFrontend, trengerTomPeriodisertVurdering } from 'lib/utils/periodisering';
import { useAccordionsSignal } from 'hooks/AccordionSignalHook';
import { getErOppfyltEllerIkkeStatus } from 'components/periodisering/VurderingStatusTag';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
  grunnlag: OvergangUforeGrunnlag;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

export interface OvergangUforeForm {
  vurderinger: Array<OvergangUforeVurderingForm>;
}
interface OvergangUforeVurderingForm {
  fraDato: string;
  begrunnelse: string;
  brukerHarSøktUføretrygd: JaEllerNei | undefined;
  brukerHarFåttVedtakOmUføretrygd: string;
  brukerRettPåAAP?: JaEllerNei | undefined;
  vurdertAv?: VurdertAvAnsatt;
  kvalitetssikretAv?: VurdertAvAnsatt;
  besluttetAv?: VurdertAvAnsatt;
  erNyVurdering?: boolean;
}

export const OvergangUforePeriodisert = ({
  behandlingVersjon,
  grunnlag,
  readOnly,
  initialMellomlagretVurdering,
}: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { løsPeriodisertBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('OVERGANG_UFORE');

  const { lagreMellomlagring, slettMellomlagring, mellomlagretVurdering, nullstillMellomlagretVurdering } =
    useMellomlagring(Behovstype.OVERGANG_UFORE, initialMellomlagretVurdering);

  const { accordionsSignal, closeAllAccordions } = useAccordionsSignal();

  const { visningActions, formReadOnly, visningModus, erAktivUtenAvbryt } = useVilkårskortVisning(
    readOnly,
    'OVERGANG_UFORE',
    mellomlagretVurdering
  );

  const defaultValues: OvergangUforeForm = mellomlagretVurdering
    ? JSON.parse(mellomlagretVurdering.data)
    : getDefaultValuesFromGrunnlag(grunnlag);

  const form = useForm<OvergangUforeForm>({ defaultValues });
  const { fields: nyeVurderingFields, remove, append } = useFieldArray({ name: 'vurderinger', control: form.control });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsPeriodisertBehovOgGåTilNesteSteg(
        {
          behandlingVersjon: behandlingVersjon,
          referanse: behandlingsReferanse,
          behov: {
            behovstype: Behovstype.OVERGANG_UFORE,
            løsningerForPerioder: data.vurderinger.map((vurdering, index) => {
              const isLast = index === data.vurderinger.length - 1;
              const tilDato = isLast
                ? undefined
                : parseDatoFraDatePickerOgTrekkFra1Dag(data.vurderinger[index + 1].fraDato);
              return {
                fom: formaterDatoForBackend(parse(vurdering.fraDato, 'dd.MM.yyyy', new Date())),
                tom: tilDato ? formaterDatoForBackend(tilDato) : undefined,
                begrunnelse: vurdering.begrunnelse,
                brukerHarSøktOmUføretrygd: vurdering.brukerHarSøktUføretrygd === JaEllerNei.Ja,
                brukerHarFåttVedtakOmUføretrygd: vurdering.brukerHarFåttVedtakOmUføretrygd,
                brukerRettPåAAP: vurdering.brukerRettPåAAP === JaEllerNei.Ja,
              };
            }),
          },
        },
        () => {
          closeAllAccordions();
          nullstillMellomlagretVurdering();
        }
      );
    })(event);
  };

  const tidligereVurderinger = grunnlag?.sisteVedtatteVurderinger ?? [];
  const foersteNyePeriode = nyeVurderingFields.length > 0 ? form.watch('vurderinger.0.fraDato') : null;
  const errorList = mapPeriodiserteVurderingerErrorList<OvergangUforeForm>(form.formState.errors);
  return (
    <VilkårskortPeriodisert
      heading={'§ 11-18 AAP under behandling av krav om uføretrygd'}
      steg={'OVERGANG_UFORE'}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      status={status}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      vilkårTilhørerNavKontor={true}
      onLagreMellomLagringClick={() => lagreMellomlagring(form.watch())}
      onDeleteMellomlagringClick={() => slettMellomlagring(() => form.reset(getDefaultValuesFromGrunnlag(grunnlag)))}
      mellomlagretVurdering={mellomlagretVurdering}
      visningModus={visningModus}
      visningActions={visningActions}
      formReset={() => form.reset(getDefaultValuesFromGrunnlag(grunnlag))}
      onLeggTilVurdering={() => append(emptyOvergangUføreVurdering())}
      errorList={errorList}
    >
      <VStack gap={'4'}>
        <BodyLong size={'small'}>
          <Link href="https://lovdata.no/pro/lov/1997-02-28-19/%C2%A711-18" target="_blank">
            Du kan lese om hvordan vilkåret skal vurderes i rundskrivet til § 11-18
          </Link>
        </BodyLong>

        {grunnlag.sisteVedtatteVurderinger.map((vurdering) => (
          <TidligereVurderingExpandableCard
            key={vurdering.fom}
            fom={parseISO(vurdering.fom)}
            tom={vurdering.tom != null ? parseISO(vurdering.tom) : null}
            foersteNyePeriodeFraDato={foersteNyePeriode != null ? parseDatoFraDatePicker(foersteNyePeriode) : null}
            vurderingStatus={getErOppfyltEllerIkkeStatus(!!vurdering.brukerRettPåAAP)}
          >
            <OvergangUforeTidligereVurdering
              fraDato={vurdering.fom}
              begrunnelse={vurdering.begrunnelse}
              brukerHarSøktOmUføretrygd={vurdering.brukerHarSøktUføretrygd}
              brukerHarFåttVedtakOmUføretrygd={vurdering.brukerHarFåttVedtakOmUføretrygd}
              brukerRettPåAAP={vurdering.brukerRettPåAAP}
            />
          </TidligereVurderingExpandableCard>
        ))}

        {nyeVurderingFields.map((vurdering, index) => {
          return (
            <NyVurderingExpandableCard
              key={vurdering.id}
              accordionsSignal={accordionsSignal}
              fraDato={gyldigDatoEllerNull(form.watch(`vurderinger.${index}.fraDato`))}
              vurderingStatus={getErOppfyltEllerIkkeStatus(erVurderingOppfylt(form, index))}
              nestePeriodeFraDato={gyldigDatoEllerNull(form.watch(`vurderinger.${index + 1}.fraDato`))}
              isLast={index === nyeVurderingFields.length - 1}
              vurdertAv={vurdering.vurdertAv}
              kvalitetssikretAv={vurdering.kvalitetssikretAv}
              besluttetAv={vurdering.besluttetAv}
              finnesFeil={finnesFeilForVurdering(index, errorList)}
              readonly={formReadOnly}
              onSlettVurdering={() => remove(index)}
              harTidligereVurderinger={tidligereVurderinger.length > 0}
              index={index}
              initiellEkspandert={skalVæreInitiellEkspandert(vurdering.erNyVurdering, erAktivUtenAvbryt)}
            >
              <OvergangUforeVurderingFormInput index={index} form={form} readonly={formReadOnly} />
            </NyVurderingExpandableCard>
          );
        })}
      </VStack>
    </VilkårskortPeriodisert>
  );

  function getDefaultValuesFromGrunnlag(grunnlag: OvergangUforeGrunnlag): OvergangUforeForm {
    if (trengerTomPeriodisertVurdering(grunnlag)) {
      return {
        vurderinger: [
          {
            ...emptyOvergangUføreVurdering(),
            fraDato: getFraDatoFraGrunnlagForFrontend(grunnlag),
          },
        ],
      };
    }
    return {
      vurderinger: grunnlag.nyeVurderinger.map((vurdering) => ({
        fraDato: formaterDatoForFrontend(vurdering.fom),
        begrunnelse: vurdering?.begrunnelse,
        brukerRettPåAAP: getJaNeiEllerUndefined(vurdering?.brukerRettPåAAP),
        brukerHarSøktUføretrygd: getJaNeiEllerUndefined(vurdering?.brukerHarSøktUføretrygd),
        brukerHarFåttVedtakOmUføretrygd: vurdering?.brukerHarFåttVedtakOmUføretrygd || '',
        vurdertAv: vurdering.vurdertAv,
        kvalitetssikretAv: vurdering.kvalitetssikretAv,
        besluttetAv: vurdering.besluttetAv,
      })),
    };
  }

  function emptyOvergangUføreVurdering(): OvergangUforeVurderingForm {
    return {
      fraDato: '',
      begrunnelse: '',
      brukerHarSøktUføretrygd: undefined,
      brukerHarFåttVedtakOmUføretrygd: '',
      brukerRettPåAAP: undefined,
    };
  }
};

function erVurderingOppfylt(form: UseFormReturn<OvergangUforeForm>, index: number) {
  const brukerRettPåAAP = form.watch(`vurderinger.${index}.brukerRettPåAAP`);
  const harSøktUføretrygd = form.watch(`vurderinger.${index}.brukerHarSøktUføretrygd`);
  const harFåttVedtakUføretrygd = form.watch(`vurderinger.${index}.brukerHarFåttVedtakOmUføretrygd`);

  if (brukerRettPåAAP) {
    return brukerRettPåAAP === JaEllerNei.Ja;
  }

  if (harSøktUføretrygd === JaEllerNei.Nei || harFåttVedtakUføretrygd === JaEllerNei.Nei) {
    return false;
  }

  return undefined;
}

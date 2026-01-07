'use client';

import { MellomlagretVurdering, OvergangUforeGrunnlag } from 'lib/types/types';
import { Behovstype, getJaNeiEllerUndefined, JaEllerNei } from 'lib/utils/form';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { FormEvent } from 'react';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { formaterDatoForBackend, formaterDatoForFrontend, parseDatoFraDatePicker } from 'lib/utils/date';
import { gyldigDatoEllerNull } from 'lib/validation/dateValidation';
import { parse, parseISO } from 'date-fns';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { useFieldArray, useForm } from 'react-hook-form';
import { VilkårskortPeriodisert } from 'components/vilkårskort/vilkårskortperiodisert/VilkårskortPeriodisert';
import { NyVurderingExpandableCard } from 'components/periodisering/nyvurderingexpandablecard/NyVurderingExpandableCard';
import { OvergangUforeVurderingFormInput } from 'components/behandlinger/sykdom/overgangufore/OvergangUforeVurderingFormInput';
import { finnesFeilForVurdering, mapPeriodiserteVurderingerErrorList } from 'lib/utils/formerrors';
import { TidligereVurderingExpandableCard } from 'components/periodisering/tidligerevurderingexpandablecard/TidligereVurderingExpandableCard';
import { OvergangUforeTidligereVurdering } from 'components/behandlinger/sykdom/overgangufore/OvergangUforeTidligereVurdering';

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

  const { visningActions, formReadOnly, visningModus } = useVilkårskortVisning(
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
            løsningerForPerioder: data.vurderinger.map((vurdering) => ({
              fom: formaterDatoForBackend(parse(vurdering.fraDato, 'dd.MM.yyyy', new Date())),
              begrunnelse: vurdering.begrunnelse,
              brukerHarSøktOmUføretrygd: vurdering.brukerHarSøktUføretrygd === JaEllerNei.Ja,
              brukerHarFåttVedtakOmUføretrygd: vurdering.brukerHarFåttVedtakOmUføretrygd,
              brukerRettPåAAP: vurdering.brukerRettPåAAP === JaEllerNei.Ja,
            })),
          },
        },
        () => nullstillMellomlagretVurdering()
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
      vurdertAvAnsatt={grunnlag?.vurdering?.vurdertAv}
      onLagreMellomLagringClick={() => lagreMellomlagring(form.watch())}
      onDeleteMellomlagringClick={() => slettMellomlagring(() => form.reset(getDefaultValuesFromGrunnlag(grunnlag)))}
      mellomlagretVurdering={mellomlagretVurdering}
      visningModus={visningModus}
      visningActions={visningActions}
      formReset={() => form.reset(mellomlagretVurdering ? JSON.parse(mellomlagretVurdering.data) : undefined)}
      onLeggTilVurdering={() => append(emptyOvergangUføreVurdering())}
      errorList={errorList}
    >
      {grunnlag.sisteVedtatteVurderinger.map((vurdering) => (
        <TidligereVurderingExpandableCard
          key={vurdering.fom}
          fom={parseISO(vurdering.fom)}
          tom={vurdering.tom != null ? parseISO(vurdering.tom) : null}
          foersteNyePeriodeFraDato={foersteNyePeriode != null ? parseDatoFraDatePicker(foersteNyePeriode) : null}
          oppfylt={!!vurdering.brukerRettPåAAP}
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
            fraDato={gyldigDatoEllerNull(form.watch(`vurderinger.${index}.fraDato`))}
            oppfylt={
              form.watch(`vurderinger.${index}.brukerRettPåAAP`)
                ? form.watch(`vurderinger.${index}.brukerRettPåAAP`) === JaEllerNei.Ja
                : form.watch(`vurderinger.${index}.brukerHarSøktUføretrygd`) === JaEllerNei.Nei ||
                    form.watch(`vurderinger.${index}.brukerHarFåttVedtakOmUføretrygd`) === 'NEI'
                  ? false
                  : undefined
            }
            nestePeriodeFraDato={gyldigDatoEllerNull(form.watch(`vurderinger.${index + 1}.fraDato`))}
            isLast={index === nyeVurderingFields.length - 1}
            vurdertAv={undefined} // TODO:
            finnesFeil={finnesFeilForVurdering(index, errorList)}
            readonly={formReadOnly}
            onRemove={() => remove(index)}
            harTidligereVurderinger={tidligereVurderinger.length > 0}
            index={index}
          >
            <OvergangUforeVurderingFormInput index={index} form={form} readonly={formReadOnly} />
          </NyVurderingExpandableCard>
        );
      })}
    </VilkårskortPeriodisert>
  );

  function getDefaultValuesFromGrunnlag(grunnlag: OvergangUforeGrunnlag): OvergangUforeForm {
    if (grunnlag == null || (grunnlag.nyeVurderinger.length === 0 && grunnlag.sisteVedtatteVurderinger.length === 0)) {
      // Vi har ingen tidligere vurderinger eller nye vurderinger, legg til en tom-default-periode
      return {
        vurderinger: [
          {
            ...emptyOvergangUføreVurdering(),
            //TODO: fraDato: dagens dato?
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

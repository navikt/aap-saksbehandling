'use client';

import { VilkårskortPeriodisert } from 'components/vilkårskort/vilkårskortperiodisert/VilkårskortPeriodisert';
import { BodyLong, HStack, Link, VStack } from '@navikt/ds-react';
import {
  NyVurderingExpandableCard,
  skalVæreInitiellEkspandert,
} from 'components/periodisering/nyvurderingexpandablecard/NyVurderingExpandableCard';
import { gyldigDatoEllerNull } from 'lib/validation/dateValidation';
import { finnesFeilForVurdering, mapPeriodiserteVurderingerErrorList } from 'lib/utils/formerrors';
import React, { FormEvent } from 'react';
import {
  EtableringEgenVirksomhetGrunnlagResponse,
  EtableringEierBrukerVirksomheten,
  MellomlagretVurdering,
  Periode,
  VurdertAvAnsatt,
} from 'lib/types/types';
import { useFieldArray, useForm } from 'react-hook-form';
import { TextFieldWrapper } from 'components/form/textfieldwrapper/TextFieldWrapper';
import { useAccordionsSignal } from 'hooks/AccordionSignalHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { Behovstype, JaEllerNei } from 'lib/utils/form';
import { EtableringAvEgenVirksomhetFormInput } from 'components/behandlinger/sykdom/etableringegenvirksomhet/EtableringAvEgenVirksomhetForm';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import {
  getDefaultValuesFromGrunnlag,
  mapEtableringEgenVirksomhetVurderingTilDto,
  tomEtableringAvEgenVirksomhetVurdering,
} from 'components/behandlinger/sykdom/etableringegenvirksomhet/etablering-av-egen-virksomhet-utils';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
  grunnlag: EtableringEgenVirksomhetGrunnlagResponse;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}
export interface EtableringAvEgenVirksomhetVurderingForm {
  fraDato: string | undefined;
  begrunnelse: string;
  foreliggerEnNæringsfagligVurdering: JaEllerNei | undefined;
  erVirksomhetenNy: JaEllerNei | undefined;
  eierBrukerVirksomheten: EtableringEierBrukerVirksomheten;
  antasDetAtEtableringenFørerTilSelvforsørgelse: JaEllerNei | undefined;
  utviklingsperioder: Periode[];
  oppstartsperioder: Periode[];
  vurdertAv?: VurdertAvAnsatt;
  kvalitetssikretAv?: VurdertAvAnsatt;
  besluttetAv?: VurdertAvAnsatt;
  erNyVurdering?: boolean;
}

export interface EtableringAvEgenVirksomhetForm {
  vurderinger: EtableringAvEgenVirksomhetVurderingForm[];
  virksomhetNavn: string | undefined;
}
export const EtableringAvEgenVirksomhet = ({
  readOnly,
  initialMellomlagretVurdering,
  grunnlag,
  behandlingVersjon,
}: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();

  const { accordionsSignal, closeAllAccordions } = useAccordionsSignal();

  const { løsPeriodisertBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('ETABLERING_EGEN_VIRKSOMHET');

  const { lagreMellomlagring, slettMellomlagring, mellomlagretVurdering, nullstillMellomlagretVurdering } =
    useMellomlagring(Behovstype.ETABLERING_EGEN_VIRKSOMHET_KODE, initialMellomlagretVurdering);

  const { visningActions, formReadOnly, visningModus, erAktivUtenAvbryt } = useVilkårskortVisning(
    readOnly,
    'ETABLERING_EGEN_VIRKSOMHET',
    mellomlagretVurdering
  );

  const form = useForm<EtableringAvEgenVirksomhetForm>({ shouldUnregister: true });
  const { fields: nyeVurderinger, append, remove } = useFieldArray({ control: form.control, name: 'vurderinger' });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsPeriodisertBehovOgGåTilNesteSteg(
        {
          behandlingVersjon: behandlingVersjon,
          behov: {
            behovstype: Behovstype.ETABLERING_EGEN_VIRKSOMHET_KODE,
            løsningerForPerioder: data.vurderinger.map((vurdering, index) => {
              const isLast = index === data.vurderinger.length - 1;
              const tilDato = isLast ? undefined : data.vurderinger[index + 1].fraDato;
              return mapEtableringEgenVirksomhetVurderingTilDto(vurdering, data.virksomhetNavn, tilDato);
            }),
          },
          referanse: behandlingsReferanse,
        },
        () => {
          nullstillMellomlagretVurdering();
          visningActions.onBekreftClick();
          closeAllAccordions();
        }
      );
    })(event);
  };

  function onAddPeriode() {
    append(tomEtableringAvEgenVirksomhetVurdering());
  }
  const vedtatteVurderinger = grunnlag?.sisteVedtatteVurderinger ?? [];
  const foersteNyePeriode = nyeVurderinger.length > 0 ? form.watch('vurderinger.0.fraDato') : null;
  const errorList = mapPeriodiserteVurderingerErrorList<EtableringAvEgenVirksomhetForm>(form.formState.errors);

  return (
    <VilkårskortPeriodisert
      heading={'§ 11-15 Etablering av egen virksomhet (valgfritt)'}
      steg={'ETABLERING_EGEN_VIRKSOMHET'}
      vilkårTilhørerNavKontor={true}
      onSubmit={handleSubmit}
      status={status}
      isLoading={isLoading}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
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
        <VStack paddingBlock={'4'} paddingInline={'5'} gap={'4'}>
          <BodyLong size={'small'}>
            <Link href={'https://lovdata.no/pro/rundskriv/r11-00/KAPITTEL_18'} target="_blank">
              Du kan lese hvordan vilkåret skal vurderes i rundskrivet til § 11-15 (lovdata.no)
            </Link>
          </BodyLong>
          {nyeVurderinger.length > 0 && (
            <HStack>
              <TextFieldWrapper
                name={'virksomhetNavn'}
                control={form.control}
                type={'text'}
                label={'Virksomheten det søkes for'}
              />
            </HStack>
          )}
        </VStack>
      )}
      {nyeVurderinger.map((vurdering, index) => (
        <NyVurderingExpandableCard
          key={vurdering.id}
          accordionsSignal={accordionsSignal}
          fraDato={gyldigDatoEllerNull(form.watch(`vurderinger.${index}.fraDato`))}
          vurderingStatus={undefined}
          nestePeriodeFraDato={gyldigDatoEllerNull(form.watch(`vurderinger.${index + 1}.fraDato`))}
          isLast={index === vedtatteVurderinger.length - 1}
          vurdertAv={vurdering.vurdertAv}
          kvalitetssikretAv={vurdering.kvalitetssikretAv}
          besluttetAv={vurdering.besluttetAv}
          finnesFeil={finnesFeilForVurdering(index, errorList)}
          readonly={formReadOnly}
          onSlettVurdering={() => remove(index)}
          // vilkåret er valgfritt, kan derfor slette vurderingen selv om det ikke finnes en tidligere vurdering
          harTidligereVurderinger={true}
          index={index}
          initiellEkspandert={skalVæreInitiellEkspandert(vurdering.erNyVurdering, erAktivUtenAvbryt)}
        >
          <EtableringAvEgenVirksomhetFormInput form={form} readOnly={formReadOnly} index={index} />
        </NyVurderingExpandableCard>
      ))}
    </VilkårskortPeriodisert>
  );
};

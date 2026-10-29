'use client';

import { VilkårskortPeriodisert } from 'components/vilkaarskort/vilkårskortperiodisert/VilkårskortPeriodisert';
import { InfoCard, VStack } from '@navikt/ds-react';
import {
  NyVurderingExpandableCard,
  skalVæreInitiellEkspandert,
} from 'components/periodisering/nyvurderingexpandablecard/NyVurderingExpandableCard';
import { gyldigDatoEllerNull } from 'lib/validation/dateValidation';
import { finnesFeilForVurdering, hentFeilmeldingerForForm } from 'lib/utils/formerrors';
import { SubmitEventHandler, useState } from 'react';
import {
  EtableringEgenVirksomhetGrunnlagResponse, EtableringEgenVirksomhetLøsningDto,
  EtableringEgenVirksomhetVurderingResponse,
  EtableringEierBrukerVirksomheten,
  MellomlagretVurdering,
  VurderingFormMeta,
} from 'lib/types/types';
import { useFieldArray, useForm } from 'react-hook-form';
import { TextFieldWrapper } from 'components/form/textfieldwrapper/TextFieldWrapper';
import { useAccordionsSignal } from 'hooks/AccordionSignalHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { Behovstype, JaEllerNei } from 'lib/utils/form';
import { loggUmamiVarighet, useUmamiStartTidspunkt } from 'lib/utils/umami/varighet';
import {
  getDefaultValuesFromGrunnlag,
  mapEtableringEgenVirksomhetVurderingTilDto,
  nyVurderingErOppfylt,
  tidligereVurderingErOppfylt,
  tomEtableringAvEgenVirksomhetVurdering,
} from 'components/behandlinger/sykdom/etableringegenvirksomhet/etablering-av-egen-virksomhet-utils-ny';
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';
import { getErOppfyltEllerIkkeStatus } from 'components/periodisering/VurderingStatusTag';
import { EtableringEgenVirksomhetTidligereVurdering } from 'components/behandlinger/sykdom/etableringegenvirksomhet/EtableringAvEgenVirksomhetTidligereVurdering';
import { TidligereVurderingExpandableCard } from 'components/periodisering/tidligerevurderingexpandablecard/TidligereVurderingExpandableCard';
import { parseISO } from 'date-fns';
import { parseDatoFraDatePicker } from 'lib/utils/date';
import { IkkeVurderbarPeriode } from 'components/periodisering/IkkeVurderbarPeriode';
import { validerPeriodiserteVurderingerMotIkkeRelevantePerioder } from 'lib/utils/validering';
import { EksterneLenkerIVilkårskort } from 'components/vilkaarskort/eksternelenkerivilkårskort/EksterneLenkerIVilkårskort';
import { Alert } from 'components/alert/Alert';
import { useLøsAvklaringsbehov } from 'hooks/saksbehandling/løsavklaringsbehov/useLøsAvklaringsbehov';
import { Buildings3Icon } from '@navikt/aksel-icons';
import { EtableringAvEgenVirksomhetFormInputNy } from './EtableringAvEgenVirksomhetFormNy';

export type EtableringFase = EtableringEgenVirksomhetVurderingResponse['fase'];

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
  grunnlag: EtableringEgenVirksomhetGrunnlagResponse;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}
export interface EtableringAvEgenVirksomhetVurderingForm extends VurderingFormMeta {
  fraDato: string;
  begrunnelse: string;
  foreliggerEnNæringsfagligVurdering: JaEllerNei | undefined;
  erVirksomhetenNy: JaEllerNei | undefined;
  eierBrukerVirksomheten: EtableringEierBrukerVirksomheten;
  antasDetAtEtableringenFørerTilSelvforsørgelse: JaEllerNei | undefined;
  fase: EtableringFase | undefined;
  erRegistrertINødvendigeOffentligeRegister: JaEllerNei | undefined;
  jobberBrukerAktivMedVirksomheten: JaEllerNei | undefined;
  versjon?: Versjon;
}

type Versjon = EtableringEgenVirksomhetLøsningDto['versjon'];

const versjonerFra = (form: EtableringAvEgenVirksomhetForm): Versjon[] =>
  form.vurderinger.map((vurdering) => vurdering.versjon ?? 'V1');

export interface EtableringAvEgenVirksomhetForm {
  vurderinger: EtableringAvEgenVirksomhetVurderingForm[];
  virksomhetNavn: string | undefined;
}
export const EtableringAvEgenVirksomhetNy = ({
  readOnly,
  initialMellomlagretVurdering,
  grunnlag,
  behandlingVersjon,
}: Props) => {
  const { behandlingsreferanse } = useParamsMedType();

  const { accordionsSignal, closeAllAccordions } = useAccordionsSignal();

  const {
    løsPeriodisertAvklaringsbehov,
    løsAvklaringsbehovIsLoading,
    løsAvklaringsbehovStatus,
    løsAvklaringsbehovError,
  } = useLøsAvklaringsbehov('ETABLERING_EGEN_VIRKSOMHET');

  const defaultValues: EtableringAvEgenVirksomhetForm = initialMellomlagretVurdering
    ? JSON.parse(initialMellomlagretVurdering.data)
    : getDefaultValuesFromGrunnlag(grunnlag);

  const { visningActions, formReadOnly, visningModus, erAktivUtenAvbryt } = useVilkårskortVisning(
    readOnly,
    'ETABLERING_EGEN_VIRKSOMHET',
    initialMellomlagretVurdering
  );
  const umamiStartTidspunkt = useUmamiStartTidspunkt(visningModus);

  const form = useForm<EtableringAvEgenVirksomhetForm>({ defaultValues, shouldUnregister: true });
  const { fields: nyeVurderinger, append, remove } = useFieldArray({ control: form.control, name: 'vurderinger' });
  const [versjoner, setVersjoner] = useState<Versjon[]>(versjonerFra(defaultValues));

  const { slettMellomlagring, mellomlagretVurdering, nullstillMellomlagretVurdering } = useMellomlagring(
    Behovstype.ETABLERING_EGEN_VIRKSOMHET_KODE,
    initialMellomlagretVurdering,
    form
  );

  const handleSubmit: SubmitEventHandler = (event) => {
    form.handleSubmit((data) => {
      // Må finnes minst en oppstart eller utviklingsperiode hvis vilkår er oppfylt
      let validerTidsplan = true;
      data.vurderinger.forEach((vurdering) => {
        const erOppfylt = nyVurderingErOppfylt(vurdering);
        if (erOppfylt) {
          if (vurdering.fraDato == undefined && vurdering.fase == undefined) {
            validerTidsplan = false;
            form.setError('root', {
              type: 'custom',
              message: 'Det må være minst en periode lagt i oppstartperiode eller uviklingsperiode.',
            });
          }
        }
      });

      if (!validerTidsplan) {
        form.setError(`root`, {
          type: 'custom',
          message: 'Vurderingen overlapper med en ikke-relevant periode',
        });
      }
      if (!validerTidsplan) {
        return;
      }
      const validering = validerPeriodiserteVurderingerMotIkkeRelevantePerioder({
        nyeVurderinger: data.vurderinger,
        form,
        grunnlag,
      });
      if (!validering) {
        return;
      }
      løsPeriodisertAvklaringsbehov(
        {
          behandlingVersjon: behandlingVersjon,
          behov: {
            behovstype: Behovstype.ETABLERING_EGEN_VIRKSOMHET_KODE,
            løsningerForPerioder: data.vurderinger.map((vurdering, index) => {
              const sisteVurdering = index === data.vurderinger.length - 1;
              const tilDato = sisteVurdering ? undefined : data.vurderinger[index + 1].fraDato;
              return mapEtableringEgenVirksomhetVurderingTilDto(vurdering, data.virksomhetNavn!, tilDato,
                versjoner[index] ?? 'V0');
            }),
          },
          referanse: behandlingsreferanse,
        },
        () => {
          loggUmamiVarighet('STEG_ETABLERING_EGEN_VIRKSOMHET_VARIGHET', umamiStartTidspunkt, Date.now());
          nullstillMellomlagretVurdering();
          visningActions.onBekreftClick();
          closeAllAccordions();
        }
      );
    })(event);
  };

  function leggTilVurdering() {
    append(tomEtableringAvEgenVirksomhetVurdering());
    setVersjoner((nåværende) => [...nåværende, 'V0']);
  }
  const vedtatteVurderinger = grunnlag?.sisteVedtatteVurderinger ?? [];
  const foersteNyePeriode = nyeVurderinger.length > 0 ? form.watch('vurderinger.0.fraDato') : null;
  const errorList = hentFeilmeldingerForForm(form.formState.errors);

  return (
    <VilkårskortPeriodisert
      heading={'§ 11-15 Etablering av egen virksomhet (valgfritt)'}
      steg={'ETABLERING_EGEN_VIRKSOMHET'}
      vilkårTilhørerNavKontor={true}
      onSubmit={handleSubmit}
      status={løsAvklaringsbehovStatus}
      isLoading={løsAvklaringsbehovIsLoading}
      løsBehovOgGåTilNesteStegError={løsAvklaringsbehovError}
      mellomlagretVurdering={mellomlagretVurdering}
      onDeleteMellomlagringClick={() => slettMellomlagring(() => form.reset(getDefaultValuesFromGrunnlag(grunnlag)))}
      visningModus={visningModus}
      visningActions={visningActions}
      formReset={() => form.reset(getDefaultValuesFromGrunnlag(grunnlag))}
      onLeggTilVurdering={leggTilVurdering}
      errorList={errorList}
    >
      <VStack gap={'space-16'}>
        <EksterneLenkerIVilkårskort steg={'ETABLERING_EGEN_VIRKSOMHET'} />
        {grunnlag.ikkeRelevantePerioder.map((vurdering) => (
          <IkkeVurderbarPeriode
            key={crypto.randomUUID()}
            fom={parseISO(vurdering.fom)}
            tom={vurdering.tom != null ? parseISO(vurdering.tom) : null}
            alertMelding={'Vilkåret kan ikke vurderes for denne perioden.'}
            foersteNyePeriodeFraDato={undefined}
          ></IkkeVurderbarPeriode>
        ))}
        {vedtatteVurderinger.map((vurdering) => (
          <TidligereVurderingExpandableCard
            key={crypto.randomUUID()}
            fom={parseISO(vurdering.fom)}
            tom={vurdering.tom != null ? parseISO(vurdering.tom) : null}
            førsteNyePeriodeFraDato={foersteNyePeriode != null ? parseDatoFraDatePicker(foersteNyePeriode) : null}
            vurderingStatus={getErOppfyltEllerIkkeStatus(tidligereVurderingErOppfylt(vurdering))}
            vurderingerMeta={vurdering.vurderingerMeta}
          >
            <EtableringEgenVirksomhetTidligereVurdering vurdering={vurdering} />
          </TidligereVurderingExpandableCard>
        ))}
        {nyeVurderinger.length > 0 && (
          <InfoCard data-color="neutral">
            <InfoCard.Header icon={<Buildings3Icon aria-hidden />}>
              <InfoCard.Title>
                <TextFieldWrapper
                  name={'virksomhetNavn'}
                  control={form.control}
                  type={'text'}
                  label={'Virksomheten det søkes for'}
                  readOnly={formReadOnly}
                />
              </InfoCard.Title>
            </InfoCard.Header>
            <InfoCard.Content>
              {nyeVurderinger.map((vurdering, index) => (
                <NyVurderingExpandableCard
                  key={vurdering.id}
                  accordionsSignal={accordionsSignal}
                  fraDato={gyldigDatoEllerNull(form.watch(`vurderinger.${index}.fraDato`))}
                  vurderingStatus={getErOppfyltEllerIkkeStatus(
                    nyVurderingErOppfylt(form.watch(`vurderinger.${index}`))
                  )}
                  nestePeriodeFraDato={gyldigDatoEllerNull(form.watch(`vurderinger.${index + 1}.fraDato`))}
                  isLast={index === vedtatteVurderinger.length - 1}
                  vurdering={vurdering}
                  finnesFeil={finnesFeilForVurdering(index, errorList)}
                  readonly={formReadOnly}
                  onSlettVurdering={() => remove(index)}
                  // vilkåret er valgfritt, kan derfor slette vurderingen selv om det ikke finnes en tidligere vurdering
                  harTidligereVurderinger={true}
                  index={index}
                  initiellEkspandert={skalVæreInitiellEkspandert(vurdering.erNyVurdering, erAktivUtenAvbryt)}
                >
                  <EtableringAvEgenVirksomhetFormInputNy
                    form={form}
                    readOnly={formReadOnly}
                    index={index}
                    vurderinger={grunnlag.nyeVurderinger}
                  />
                </NyVurderingExpandableCard>
              ))}
            </InfoCard.Content>
          </InfoCard>
        )}

        {form.formState.errors.root && <Alert variant={'error'}>{form.formState.errors.root.message}</Alert>}
      </VStack>
    </VilkårskortPeriodisert>
  );
};

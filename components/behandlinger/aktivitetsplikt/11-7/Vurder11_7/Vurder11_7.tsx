'use client';

import { useConfigForm } from 'components/form/FormHook';
import { Behovstype, getJaNeiEllerUndefined, JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { validerDato } from 'lib/validation/dateValidation';
import { addDays, isBefore, parse, startOfDay } from 'date-fns';
import { formaterDatoForBackend, formaterDatoForFrontend, stringToDate } from 'lib/utils/date';
import { useSak } from 'hooks/SakHook';
import { VilkårskortMedFormOgMellomlagring } from 'components/vilkårskort/vilkårskortmedformogmellomlagring/VilkårskortMedFormOgMellomlagring';
import { FormField, ValuePair } from 'components/form/FormField';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { FormEvent } from 'react';
import { Aktivitetsplikt11_7Grunnlag, Aktivitetsplikt11_7Vurdering, MellomlagretVurdering } from 'lib/types/types';
import { TidligereVurderinger } from 'components/tidligerevurderinger/TidligereVurderinger';
import { deepEqual } from 'components/tidligerevurderinger/TidligereVurderingerUtils';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
  grunnlag: Aktivitetsplikt11_7Grunnlag;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

interface FormFields {
  erOppfylt: string;
  utfall: Utfall;
  begrunnelse: string;
  gjelderFra: string;
  skalIgnorereVarselFrist: string;
}

type Utfall = 'STANS' | 'OPPHØR';

type DraftFormFields = Partial<FormFields>;

export const Vurder11_7 = ({ grunnlag, behandlingVersjon, readOnly, initialMellomlagretVurdering }: Props) => {
  const { sak } = useSak();
  const behandlingsreferanse = useBehandlingsReferanse();
  const vedtatteVurderinger = grunnlag?.vedtatteVurderinger;

  const { løsBehovOgGåTilNesteSteg, status, isLoading, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('VURDER_AKTIVITETSPLIKT_11_7');

  const { mellomlagretVurdering, nullstillMellomlagretVurdering, lagreMellomlagring, slettMellomlagring } =
    useMellomlagring(Behovstype.VURDER_BRUDD_11_7_KODE, initialMellomlagretVurdering);

  const defaultValue: DraftFormFields = initialMellomlagretVurdering
    ? JSON.parse(initialMellomlagretVurdering.data)
    : mapVurderingToDraftFormFields(grunnlag.vurdering);

  const harPassertVarselFrist = grunnlag.varsel?.svarfrist
    ? isBefore(grunnlag.varsel.svarfrist, startOfDay(new Date()))
    : null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg(
        {
          referanse: behandlingsreferanse,
          behandlingVersjon: behandlingVersjon,
          behov: {
            behovstype: Behovstype.VURDER_BRUDD_11_7_KODE,
            aktivitetsplikt11_7Vurdering: {
              erOppfylt: data.erOppfylt === JaEllerNei.Ja,
              utfall: data.erOppfylt === JaEllerNei.Ja ? null : data.utfall,
              begrunnelse: data.begrunnelse,
              gjelderFra: formaterDatoForBackend(parse(data.gjelderFra, 'dd.MM.yyyy', new Date())),
              skalIgnorereVarselFrist:
                data.erOppfylt === JaEllerNei.Nei ? data.skalIgnorereVarselFrist === JaEllerNei.Ja : false,
            },
          },
        },
        () => nullstillMellomlagretVurdering()
      );
    })(event);
  };

  const { formFields, form } = useConfigForm<FormFields>(
    {
      erOppfylt: {
        type: 'radio',
        label: 'Oppfyller brukeren aktivitetsplikten sin etter § 11-7?',
        rules: { required: 'Du må svare på om aktivitetsplikten er oppfylt' },
        defaultValue: defaultValue.erOppfylt,
        options: JaEllerNeiOptions,
      },
      utfall: {
        type: 'radio',
        label: 'Skal ytelsen stanses eller opphøres?',
        description:
          'Det er kun ved gjentatte brudd på aktivitetsplikten at AAP skal opphøre. Ved brudd av mindre omfang bør AAP stanses.',
        rules: { required: 'Du må svare på om ytelsen skal stanses eller opphøres' },
        defaultValue: defaultValue.utfall,
        options: [
          { label: 'Stans', value: 'STANS' },
          { label: 'Opphør', value: 'OPPHØR' },
        ],
      },
      begrunnelse: {
        type: 'textarea',
        label: 'Vilkårsvurdering',
        defaultValue: defaultValue.begrunnelse,
        rules: { required: 'Du må begrunne' },
      },
      gjelderFra: {
        type: 'date_input',
        label: 'Vurderingen gjelder fra',
        description:
          'Hvis § 11-7 ikke er oppfylt, bør dato settes 3 uker fram i tid for å gi bruker tid til å svare på forhåndsvarsel',
        defaultValue: defaultValue.gjelderFra,
        rules: {
          required: 'Du må velge når vurderingen gjelder fra',
          validate: {
            gyldigDato: (v) => validerDato(v as string),
            kanIkkeVaereFoerSoeknadstidspunkt: (v) => {
              const starttidspunkt = startOfDay(new Date(sak.periode.fom));
              const vurderingGjelderFra = stringToDate(v as string, 'dd.MM.yyyy');
              if (vurderingGjelderFra && isBefore(startOfDay(vurderingGjelderFra), starttidspunkt)) {
                return 'Vurderingen kan ikke gjelde fra før starttidspunktet';
              }
            },
          },
        },
      },
      skalIgnorereVarselFrist: {
        type: 'radio',
        label: 'Gå videre selv om fristen for svar fra bruker ikke er utløpt?',
        description: 'Dersom bruker har svart i løpet av fristen kan du velge Ja her og komme videre i prosessen.',
        rules: { required: 'Du må svare' },
        defaultValue: defaultValue.skalIgnorereVarselFrist,
        options: JaEllerNeiOptions,
      },
    },
    { readOnly }
  );

  const knapptekst = () => {
    if (
      grunnlag.harSendtForhåndsvarsel &&
      harPassertVarselFrist === false &&
      form.watch('skalIgnorereVarselFrist') === JaEllerNei.Nei
    ) {
      return 'Sett på vent';
    } else if (
      grunnlag.harSendtForhåndsvarsel ||
      form.watch('erOppfylt') === JaEllerNei.Ja ||
      form.watch('skalIgnorereVarselFrist') === JaEllerNei.Ja
    ) {
      return 'Send til beslutter';
    } else {
      return 'Opprett forhåndsvarsel';
    }
  };

  return (
    <VilkårskortMedFormOgMellomlagring
      heading="§ 11-7 Medlemmets aktivitetsplikt"
      steg={'VURDER_AKTIVITETSPLIKT_11_7'}
      onSubmit={handleSubmit}
      visBekreftKnapp={!readOnly}
      isLoading={isLoading}
      status={status}
      knappTekst={knapptekst()}
      vilkårTilhørerNavKontor={true}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      mellomlagretVurdering={mellomlagretVurdering}
      onLagreMellomLagringClick={() => lagreMellomlagring(form.watch())}
      onDeleteMellomlagringClick={() =>
        slettMellomlagring(() =>
          form.reset(grunnlag.vurdering ? mapVurderingToDraftFormFields(grunnlag.vurdering) : emptyDraftFormFields())
        )
      }
      readOnly={readOnly}
    >
      {!!vedtatteVurderinger?.length && (
        <TidligereVurderinger
          data={vedtatteVurderinger}
          buildFelter={byggFelter}
          getErGjeldende={(v) =>
            grunnlag?.vedtatteVurderinger.some((gjeldendeVurdering) => deepEqual(v, gjeldendeVurdering, ['dato']))
          }
          getFomDato={(v) => v.gjelderFra ?? v.vurdertAv.dato}
          getVurdertAvIdent={(v) => v.vurdertAv.ident}
          getVurdertDato={(v) => v.vurdertAv.dato}
        />
      )}
      <FormField form={form} formField={formFields.begrunnelse} />
      <FormField form={form} formField={formFields.erOppfylt} />
      {form.watch('erOppfylt') === JaEllerNei.Nei && <FormField form={form} formField={formFields.utfall} />}
      <FormField form={form} formField={formFields.gjelderFra} />
      {form.watch('erOppfylt') === JaEllerNei.Nei &&
        grunnlag.harSendtForhåndsvarsel &&
        harPassertVarselFrist === false && <FormField form={form} formField={formFields.skalIgnorereVarselFrist} />}
    </VilkårskortMedFormOgMellomlagring>
  );
};

function mapVurderingToDraftFormFields(vurdering?: Aktivitetsplikt11_7Vurdering): DraftFormFields {
  return {
    erOppfylt: getJaNeiEllerUndefined(vurdering?.erOppfylt),
    utfall: vurdering?.utfall || undefined,
    begrunnelse: vurdering?.begrunnelse || undefined,
    gjelderFra: vurdering?.gjelderFra
      ? formaterDatoForFrontend(vurdering?.gjelderFra)
      : formaterDatoForFrontend(addDays(new Date(), 21)),
    skalIgnorereVarselFrist: getJaNeiEllerUndefined(vurdering?.skalIgnorereVarselFrist),
  };
}

function emptyDraftFormFields(): DraftFormFields {
  return {
    erOppfylt: '',
    gjelderFra: '',
    begrunnelse: '',
    utfall: '' as Utfall, // Vi caster denne da vi ikke ønsker å ødelegge typen på den i løs-behov
    skalIgnorereVarselFrist: '',
  };
}

const byggFelter = (vurdering: Aktivitetsplikt11_7Vurdering): ValuePair[] => [
  {
    label: 'Vilkårsvurdering',
    value: vurdering.begrunnelse,
  },
  {
    label: 'Er aktivitetsplikten oppfylt i henhold til § 11-7 i perioden?',
    value: vurdering.erOppfylt ? 'Ja' : 'Nei',
  },
  {
    label: 'Konsekvens for ytelse',
    value: vurdering.utfall || '-',
  },
];

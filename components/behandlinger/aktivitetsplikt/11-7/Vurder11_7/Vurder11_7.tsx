'use client';

import { useConfigForm } from 'components/form/FormHook';
import { Behovstype, getJaNeiEllerUndefined, JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { validerDato } from 'lib/validation/dateValidation';
import { isBefore, parse, startOfDay } from 'date-fns';
import { formaterDatoForBackend, formaterDatoForFrontend, stringToDate } from 'lib/utils/date';
import { useSak } from 'hooks/SakHook';
import { VilkårsKortMedForm } from 'components/vilkårskort/vilkårskortmedform/VilkårsKortMedForm';
import { FormField, ValuePair } from 'components/form/FormField';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { FormEvent } from 'react';
import { Aktivitetsplikt11_7Grunnlag, Aktivitetsplikt11_7Vurdering } from 'lib/types/types';
import { TidligereVurderinger } from '../../../../tidligerevurderinger/TidligereVurderinger';
import { deepEqual } from 'components/tidligerevurderinger/TidligereVurderingerUtils';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
  grunnlag: Aktivitetsplikt11_7Grunnlag;
}

interface FormFields {
  erOppfylt: JaEllerNei;
  utfall: 'STANS' | 'OPPHØR';
  begrunnelse: string;
  gjelderFra: string;
}

export const Vurder11_7 = ({ grunnlag, behandlingVersjon, readOnly }: Props) => {
  const { sak } = useSak();
  const behandlingsreferanse = useBehandlingsReferanse();
  const historiskeVurderinger = grunnlag?.historiskeVurderinger;

  const { løsBehovOgGåTilNesteSteg, status, isLoading, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('VURDER_AKTIVITETSPLIKT_11_7');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg({
        referanse: behandlingsreferanse,
        behandlingVersjon: behandlingVersjon,
        behov: {
          behovstype: Behovstype.VURDER_BRUDD_11_7_KODE,
          aktivitetsplikt11_7Vurdering: {
            erOppfylt: data.erOppfylt === JaEllerNei.Ja,
            utfall: data.erOppfylt === JaEllerNei.Ja ? null : data.utfall,
            begrunnelse: data.begrunnelse,
            gjelderFra: formaterDatoForBackend(parse(data.gjelderFra, 'dd.MM.yyyy', new Date())),
          },
        },
      });
    })(event);
  };

  const { formFields, form } = useConfigForm<FormFields>(
    {
      erOppfylt: {
        type: 'radio',
        label: 'Oppfyller brukeren aktivitetsplikten sin etter § 11-7?',
        rules: { required: 'Du må svare på om aktivitetsplikten er oppfylt' },
        defaultValue: getJaNeiEllerUndefined(grunnlag.vurdering?.erOppfylt),
        options: JaEllerNeiOptions,
      },
      utfall: {
        type: 'radio',
        label: 'Skal ytelsen stanses eller opphøres?',
        rules: { required: 'Du må svare på om ytelsen skal stanses eller opphøres' },
        defaultValue: grunnlag.vurdering?.utfall ?? undefined,
        options: [
          { label: 'Stans', value: 'STANS' },
          { label: 'Opphør', value: 'OPPHØR' },
        ],
      },
      begrunnelse: {
        type: 'textarea',
        label: 'Vilkårsvurdering',
        description: 'Teksten benyttes i vedtaksbrevet',
        defaultValue: grunnlag.vurdering?.begrunnelse ?? undefined,
        rules: { required: 'Du må begrunne' },
      },
      gjelderFra: {
        type: 'date_input',
        label: 'Vurderingen gjelder fra',
        description:
          'Hvis § 11-7 ikke er oppfylt, bør dato settes 3 uker fram i tid for å gi bruker tid til å svare på forhåndsvarsel',
        defaultValue: grunnlag.vurdering?.gjelderFra
          ? formaterDatoForFrontend(grunnlag.vurdering?.gjelderFra)
          : undefined,
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
    },
    { readOnly }
  );

  return (
    <VilkårsKortMedForm
      heading="§ 11-7 Medlemmets aktivitetsplikt"
      steg={'VURDER_AKTIVITETSPLIKT_11_7'}
      onSubmit={handleSubmit}
      visBekreftKnapp={!readOnly}
      isLoading={isLoading}
      status={status}
      vilkårTilhørerNavKontor={true}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
    >
      {!!historiskeVurderinger?.length && (
        <TidligereVurderinger
          data={historiskeVurderinger}
          buildFelter={byggFelter}
          getErGjeldende={(v) => deepEqual(v, historiskeVurderinger[historiskeVurderinger.length - 1])}
          getFomDato={(v) => v.vurderingenGjelderFra ?? v.vurdertAv.dato}
          getVurdertAvIdent={(v) => v.vurdertAv.ident}
          getVurdertDato={(v) => v.vurdertAv.dato}
        />
      )}
      <FormField form={form} formField={formFields.begrunnelse} />
      <FormField form={form} formField={formFields.erOppfylt} />
      {form.watch('erOppfylt') === JaEllerNei.Nei && <FormField form={form} formField={formFields.utfall} />}
      <FormField form={form} formField={formFields.gjelderFra} />
    </VilkårsKortMedForm>
  );
};

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

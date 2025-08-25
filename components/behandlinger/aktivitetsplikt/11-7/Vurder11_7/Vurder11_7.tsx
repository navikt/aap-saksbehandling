'use client';

import { useConfigForm } from 'components/form/FormHook';
import { JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { validerDato } from 'lib/validation/dateValidation';
import { isBefore, startOfDay } from 'date-fns';
import { stringToDate } from 'lib/utils/date';
import { useSak } from 'hooks/SakHook';
import { VilkårsKortMedForm } from 'components/vilkårskort/vilkårskortmedform/VilkårsKortMedForm';
import { FormField } from 'components/form/FormField';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
}

interface FormFields {
  erOppfylt: JaEllerNei;
  stansEllerOpphør: 'STANS' | 'OPPHØR';
  begrunnelse: string;
  gjelderFra: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const Vurder11_7 = ({ behandlingVersjon, readOnly }: Props) => {
  const { sak } = useSak();

  const { formFields, form } = useConfigForm<FormFields>({
    erOppfylt: {
      type: 'radio',
      label: 'Oppfyller brukeren aktivitetsplikten sin etter § 11-7?',
      rules: { required: 'Du må svare på om aktivitetsplikten er oppfylt' },
      defaultValue: undefined, // TODO: hent fra grunnlag
      options: JaEllerNeiOptions,
    },
    stansEllerOpphør: {
      type: 'radio',
      label: 'Skal ytelsen stanses eller opphøres?',
      rules: { required: 'Du må svare på om ytelsen skal stanses eller opphøres' },
      defaultValue: undefined, // TODO: hent fra grunnlag
      options: [
        { label: 'Stans', value: 'STANS' },
        { label: 'Opphør', value: 'OPPHØR' },
      ],
    },
    begrunnelse: {
      type: 'textarea',
      label: 'Vilkårsvurdering',
      description: 'Teksten benyttes i vedtaksbrevet',
      defaultValue: undefined, // TODO: hent fra grunnlag
      rules: { required: 'Du må begrunne' },
    },
    gjelderFra: {
      type: 'date_input',
      label: 'Vurderingen gjelder fra',
      description:
        'Hvis § 11-7 ikke er oppfylt, bør dato settes 3 uker fram i tid for å gi bruker tid til å svare på forhåndsvarsel',
      defaultValue: undefined, // TODO: hent fra grunnlag
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
  });

  return (
    <VilkårsKortMedForm
      heading="§ 11-7 Medlemmets aktivitetsplikt"
      steg={'VURDER_AKTIVITETSPLIKT_11_7'}
      onSubmit={() => {}} // TODO: Send inn løsning
      visBekreftKnapp={false}
      isLoading={false}
      status={undefined}
      vilkårTilhørerNavKontor={true}
    >
      <FormField form={form} formField={formFields.begrunnelse} />
      <FormField form={form} formField={formFields.erOppfylt} />
      {form.watch('erOppfylt') === JaEllerNei.Nei && <FormField form={form} formField={formFields.stansEllerOpphør} />}
      <FormField form={form} formField={formFields.gjelderFra} />
    </VilkårsKortMedForm>
  );
};

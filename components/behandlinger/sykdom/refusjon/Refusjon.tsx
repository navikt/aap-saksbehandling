'use client';

import { Form } from 'components/form/Form';
import { FormField } from 'components/form/FormField';
import { useConfigForm } from 'components/form/FormHook';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { /*isBefore,*/ parse /*startOfDay*/ } from 'date-fns';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { RefusjonskravGrunnlag } from 'lib/types/types';
import { formaterDatoForBackend /*, stringToDate*/ } from 'lib/utils/date';
import { Behovstype, getJaNeiEllerUndefined, JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
//import { validerDato } from 'lib/validation/dateValidation';
import { FormEvent } from 'react';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
  søknadstidspunkt: string;
  grunnlag: RefusjonskravGrunnlag;
}

interface FormFields {
  harKrav: string;
  vurderingenGjelderFra?: string;
  vurderingenGjelderTil?: string;
}

export const Refusjon = ({ behandlingVersjon, /*søknadstidspunkt, */ grunnlag, readOnly }: Props) => {
  const { løsBehovOgGåTilNesteSteg, isLoading, status, resetStatus } = useLøsBehovOgGåTilNesteSteg('REFUSJON_KRAV');
  const behandlingsreferanse = useBehandlingsReferanse();

  const { formFields, form } = useConfigForm<FormFields>({
    harKrav: {
      type: 'radio',
      label: 'Har Nav-kontoret refusjonskrav?',
      defaultValue: getJaNeiEllerUndefined(grunnlag.gjeldendeVurdering?.harKrav),
      rules: { required: 'Du må svare på om Nav-kontoret har refusjonskrav' },
      options: JaEllerNeiOptions,
    },
    vurderingenGjelderFra: {
      type: 'date_input',
      label: 'Refusjon fra (valgfritt)',
      defaultValue: undefined, // TODO ta inn data fra grunnlag
      /*rules: {
        validate: {
          gyldigDato: (v) => validerDato(v as string),
          kanIkkeVaereFoerSoeknadstidspunkt: (v) => {
            const soknadstidspunkt = startOfDay(new Date(søknadstidspunkt));
            const vurderingGjelderFra = stringToDate(v as string, 'dd.MM.yyyy');
            if (vurderingGjelderFra && isBefore(startOfDay(vurderingGjelderFra), soknadstidspunkt)) {
              return 'Vurderingen kan ikke gjelde fra før søknadstidspunkt';
            }
          },
        },
      },*/
    },
    vurderingenGjelderTil: {
      type: 'date_input',
      label: 'til og med (valgfritt)',
      defaultValue: undefined, // TODO ta inn data fra grunnlag
      /*rules: {
        validate: {
          gyldigDato: (v) => validerDato(v as string),
          kanIkkeVaereFoerSoeknadstidspunkt: (v) => {
            const soknadstidspunkt = startOfDay(new Date(søknadstidspunkt));
            const vurderingenGjelderTil = stringToDate(v as string, 'dd.MM.yyyy');
            if (vurderingenGjelderTil && isBefore(startOfDay(vurderingenGjelderTil), soknadstidspunkt)) {
              return 'Vurderingen kan ikke gjelde fra før søknadstidspunkt';
            }
          },
        },
      },*/
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingVersjon,
        behov: {
          behovstype: Behovstype.REFUSJON_KRAV_KODE,
          refusjonkravVurdering: {
            harKrav: data.harKrav === JaEllerNei.Ja,
            fom: data.vurderingenGjelderFra
              ? formaterDatoForBackend(parse(data.vurderingenGjelderFra, 'dd.MM.yyyy', new Date()))
              : null,
            tom: data.vurderingenGjelderTil
              ? formaterDatoForBackend(parse(data.vurderingenGjelderTil, 'dd.MM.yyyy', new Date()))
              : null,
          },
        },
        referanse: behandlingsreferanse,
      });
    })(event);
  };

  return (
    <VilkårsKort heading={'Refusjonskrav'} steg="REFUSJON_KRAV" vilkårTilhørerNavKontor={true}>
      <Form
        onSubmit={handleSubmit}
        status={status}
        resetStatus={resetStatus}
        isLoading={isLoading}
        steg={'REFUSJON_KRAV'}
        visBekreftKnapp={!readOnly}
      >
        <FormField form={form} formField={formFields.harKrav} horizontalRadio />
        {form.watch('harKrav') === JaEllerNei.Ja && (
          <>
            <FormField form={form} formField={formFields.vurderingenGjelderFra} />
            <FormField form={form} formField={formFields.vurderingenGjelderTil} />
          </>
        )}
      </Form>
    </VilkårsKort>
  );
};

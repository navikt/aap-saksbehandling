'use client';

import { FormField } from 'components/form/FormField';
import { useConfigForm } from 'components/form/FormHook';
import { isBefore, parse, startOfDay } from 'date-fns';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { RefusjonskravGrunnlag } from 'lib/types/types';
import { formaterDatoForBackend, formaterDatoForFrontend, stringToDate } from 'lib/utils/date';
import { Behovstype, getJaNeiEllerUndefined, JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { validerDato } from 'lib/validation/dateValidation';
import { FormEvent } from 'react';
import { useSak } from 'hooks/SakHook';
import { VilkårsKortMedForm } from 'components/vilkårskort/vilkårskortmedform/VilkårsKortMedForm';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
  grunnlag: RefusjonskravGrunnlag;
}

interface FormFields {
  harKrav: string;
  vurderingenGjelderFra: string;
  vurderingenGjelderTil?: string;
}

export const Refusjon = ({ behandlingVersjon, grunnlag, readOnly }: Props) => {
  const { løsBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('REFUSJON_KRAV');
  const { sak } = useSak();
  const behandlingsreferanse = useBehandlingsReferanse();

  const { formFields, form } = useConfigForm<FormFields>(
    {
      harKrav: {
        type: 'radio',
        label: 'Har Nav-kontoret refusjonskrav?',
        defaultValue: getJaNeiEllerUndefined(grunnlag.gjeldendeVurdering?.harKrav),
        rules: { required: 'Du må svare på om Nav-kontoret har refusjonskrav' },
        options: JaEllerNeiOptions,
      },
      vurderingenGjelderFra: {
        type: 'date_input',
        label: 'Refusjon fra',
        defaultValue: grunnlag.gjeldendeVurdering?.fom
          ? formaterDatoForFrontend(grunnlag.gjeldendeVurdering?.fom)
          : formaterDatoForFrontend(sak.periode.fom),
        rules: {
          validate: {
            gyldigDato: (v?) => validerDato(v as string),
            kanIkkeVaereFoerSoeknadstidspunkt: (v) => {
              const soknadstidspunkt = startOfDay(new Date(sak.periode.fom));
              const vurderingGjelderFra = stringToDate(v as string, 'dd.MM.yyyy');
              if (vurderingGjelderFra && isBefore(startOfDay(vurderingGjelderFra), soknadstidspunkt)) {
                return 'Vurderingen kan ikke gjelde fra før søknadstidspunkt';
              }
            },
          },
        },
      },
      vurderingenGjelderTil: {
        type: 'date_input',
        label: 'Til og med (valgfritt)',
        defaultValue: grunnlag.gjeldendeVurdering?.tom
          ? formaterDatoForFrontend(grunnlag.gjeldendeVurdering?.tom)
          : undefined,
        rules: {
          validate: {
            gyldigDato: (v?) => (v ? validerDato(v as string) : true),
            kanIkkeVaereFoerSoeknadstidspunkt: (v) => {
              const soknadstidspunkt = startOfDay(new Date(sak.periode.fom));
              const vurderingenGjelderTil = stringToDate(v as string, 'dd.MM.yyyy');
              if (vurderingenGjelderTil && isBefore(startOfDay(vurderingenGjelderTil), soknadstidspunkt)) {
                return 'Vurderingen kan ikke gjelde fra før søknadstidspunkt';
              }
            },
          },
        },
      },
    },
    { shouldUnregister: true, readOnly: readOnly }
  );

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
    <VilkårsKortMedForm
      heading={'Refusjonskrav sosialstønad'}
      steg="REFUSJON_KRAV"
      vilkårTilhørerNavKontor={true}
      onSubmit={handleSubmit}
      status={status}
      isLoading={isLoading}
      visBekreftKnapp={!readOnly}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      vurdertAvAnsatt={grunnlag.gjeldendeVurdering?.vurdertAv}
    >
      <FormField form={form} formField={formFields.harKrav} horizontalRadio />
      {form.watch('harKrav') === JaEllerNei.Ja && (
        <>
          <FormField form={form} formField={formFields.vurderingenGjelderFra} />
          <FormField form={form} formField={formFields.vurderingenGjelderTil} />
        </>
      )}
    </VilkårsKortMedForm>
  );
};

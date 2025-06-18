'use client';

import { FormField, ValuePair } from 'components/form/FormField';
import { useConfigForm } from 'components/form/FormHook';
import { isBefore, parse, startOfDay } from 'date-fns';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { RefusjonskravGrunnlag } from 'lib/types/types';
import { formaterDatoForBackend, formaterDatoForFrontend, stringToDate } from 'lib/utils/date';
import { Behovstype, getJaNeiEllerUndefined, JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { validerDato } from 'lib/validation/dateValidation';
import { FormEvent, useState } from 'react';
import { useSak } from 'hooks/SakHook';
import { VilkårsKortMedForm } from 'components/vilkårskort/vilkårskortmedform/VilkårsKortMedForm';
import { AsyncComboSearch } from 'components/form/asynccombosearch/AsyncComboSearch';
import { Enhet } from 'lib/types/oppgaveTypes';
import { isLocal, isProd } from 'lib/utils/environment';
import { isError } from 'lib/utils/api';
import { clientHentAlleNavenheter } from 'lib/clientApi';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
  grunnlag: RefusjonskravGrunnlag;
}

interface FormFields {
  harKrav: string;
  vurderingenGjelderFra: string;
  vurderingenGjelderTil?: string;
  navKontor?: string;
}

export const Refusjon = ({ behandlingVersjon, grunnlag, readOnly }: Props) => {
  const { løsBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('REFUSJON_KRAV');
  const { sak } = useSak();
  const [defaultOptions, setDefaultOptions] = useState<ValuePair[]>([]);
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
      navKontor: {
        type: 'textarea',
        label: 'Har Nav-kontoret refusjonskrav?',
        defaultValue: '',
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

  const testdata: Enhet[] = [
    {
      navn: 'Nav Løten',
      enhetNr: '0415',
    },
    {
      navn: 'Nav Asker',
      enhetNr: '0220',
    },
    {
      navn: 'Nav Grorud',
      enhetNr: '0328',
    },
  ];

  const kontorSøk = async (input: string) => {
    if (isLocal()) {
      const res: ValuePair[] = testdata.map((kontor) => ({
        label: `${kontor.navn} - ${kontor.enhetNr}`,
        value: `${kontor.navn} - ${kontor.enhetNr}`,
      }));

      setDefaultOptions(res);
      return res;
    }

    if (input.length <= 2) {
      return [];
    }
    const response = await clientHentAlleNavenheter(behandlingsreferanse, { navn: input });
    if (isError(response)) {
      return [];
    }

    const res = response.data.map((kontor) => ({
      label: `${kontor.enhetsnummer} - ${kontor.navn}`,
      value: `${kontor.enhetsnummer} - ${kontor.navn}`,
    }));
    setDefaultOptions(res);
    return res;
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
      {!isProd() && (
        <AsyncComboSearch
          label={'Velg Nav-kontor (test, lagres ikke)'}
          form={form}
          name={`navKontor`}
          fetcher={kontorSøk}
          size={'small'}
          defaultOptions={defaultOptions}
        />
      )}
    </VilkårsKortMedForm>
  );
};

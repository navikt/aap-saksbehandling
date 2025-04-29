'use client';

import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { useConfigForm } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';
import { FormEvent } from 'react';
import { Behovstype, getJaNeiEllerUndefined, JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { validerDato } from 'lib/validation/dateValidation';
import { formaterDatoForBackend, formaterDatoForFrontend } from 'lib/utils/date';
import { parse } from 'date-fns';
import { RettighetsperiodeGrunnlag } from 'lib/types/types';
import { BodyShort, VStack } from '@navikt/ds-react';
import { VilkårsKortMedForm } from 'components/vilkårskort/vilkårskortmedform/VilkårsKortMedForm';

interface Props {
  readOnly: boolean;
  behandlingVersjon: number;
  grunnlag?: RettighetsperiodeGrunnlag;
}

interface FormFields {
  begrunnelse: string;
  startDato: string;
  harRettUtoverSøknadsdato: string;
  harKravPåRenter: string;
}

export const VurderRettighetsperiode = ({ grunnlag, readOnly, behandlingVersjon }: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('VURDER_RETTIGHETSPERIODE');
  const { form, formFields } = useConfigForm<FormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: 'Begrunnelse',
        rules: { required: 'Du må begrunne hvorfor starttidspunktet for saken skal endres' },
        defaultValue: grunnlag?.vurdering?.begrunnelse || '',
      },
      harRettUtoverSøknadsdato: {
        type: 'radio',
        label: 'Har brukeren rett på AAP fra en annen dato enn søknadsdatoen?',
        rules: { required: 'Du må ta stilling til om brukeren har rett på AAP fra en annen dato enn søknadsdatoen' },
        options: JaEllerNeiOptions,
        defaultValue: getJaNeiEllerUndefined(grunnlag?.vurdering?.harRettUtoverSøknadsdato),
      },
      harKravPåRenter: {
        type: 'radio',
        label: 'Har brukeren krav på renter etter § 22-17?',
        rules: { required: 'Du må ta stilling til om brukeren har rett på renter' },
        options: JaEllerNeiOptions,
        defaultValue: getJaNeiEllerUndefined(grunnlag?.vurdering?.harKravPåRenter),
      },
      startDato: {
        type: 'date_input',
        label: 'Sett ny startdato for saken',
        rules: {
          required: 'Du må sette en dato for behandlingen',
          validate: {
            gyldigDato: (v) => validerDato(v as string),
          },
        },
        defaultValue:
          (grunnlag?.vurdering?.startDato && formaterDatoForFrontend(grunnlag.vurdering?.startDato)) || undefined,
      },
    },
    { readOnly: readOnly }
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingVersjon,
        behov: {
          behovstype: Behovstype.VURDER_RETTIGHETSPERIODE,
          rettighetsperiodeVurdering: {
            begrunnelse: data.begrunnelse,
            startDato:
              data.harRettUtoverSøknadsdato === JaEllerNei.Ja
                ? formaterDatoForBackend(parse(data.startDato, 'dd.MM.yyyy', new Date()))
                : null,
            harRettUtoverSøknadsdato: data.harRettUtoverSøknadsdato === JaEllerNei.Ja,
            harKravPåRenter:
              data.harRettUtoverSøknadsdato === JaEllerNei.Ja ? data.harKravPåRenter === JaEllerNei.Ja : null,
          },
        },
        referanse: behandlingsReferanse,
      });
    })(event);
  };

  return (
    <VilkårsKortMedForm
      heading={'Starttidspunkt'}
      steg={'VURDER_RETTIGHETSPERIODE'}
      onSubmit={handleSubmit}
      status={status}
      isLoading={isLoading}
      visBekreftKnapp={!readOnly}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      vilkårTilhørerNavKontor={false}
      erAktivtSteg={true}
    >
      <VStack gap={'1'}>
        <BodyShort size={'small'} weight={'semibold'}>
          Søknadsdato
        </BodyShort>
        <BodyShort size={'small'}>{grunnlag?.søknadsdato && formaterDatoForFrontend(grunnlag.søknadsdato)}</BodyShort>
      </VStack>
      <FormField form={form} formField={formFields.begrunnelse} className={'begrunnelse'} />
      <FormField form={form} formField={formFields.harRettUtoverSøknadsdato} horizontalRadio />
      {form.watch('harRettUtoverSøknadsdato') === JaEllerNei.Ja && (
        <FormField form={form} formField={formFields.startDato} />
      )}
      {form.watch('harRettUtoverSøknadsdato') === JaEllerNei.Ja && (
        <FormField form={form} formField={formFields.harKravPåRenter} horizontalRadio />
      )}
    </VilkårsKortMedForm>
  );
};

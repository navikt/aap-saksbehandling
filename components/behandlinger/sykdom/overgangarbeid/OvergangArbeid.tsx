'use client';

import { OvergangArbeidGrunnlag, TypeBehandling } from 'lib/types/types';
import { Behovstype, getJaNeiEllerUndefined, JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { Veiledning } from 'components/veiledning/Veiledning';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { FormEvent } from 'react';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { BodyShort, Heading, Link, VStack } from '@navikt/ds-react';
import { useConfigForm } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';
import { formaterDatoForBackend, formaterDatoForFrontend } from 'lib/utils/date';
import { useSak } from 'hooks/SakHook';
import { VilkårsKortMedForm } from 'components/vilkårskort/vilkårskortmedform/VilkårsKortMedForm';
import { TidligereVurderinger } from 'components/behandlinger/sykdom/overgangarbeid/TidligereVurderinger';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { validerNullableDato } from 'lib/validation/dateValidation';
import { parse } from 'date-fns';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
  typeBehandling: TypeBehandling;
  grunnlag?: OvergangArbeidGrunnlag;
}

interface FormFields {
  begrunnelse: string;
  brukerRettPåAAP?: string;
  virkningsdato: string;
}

export const OvergangArbeid = ({ behandlingVersjon, grunnlag, readOnly, typeBehandling }: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { sak } = useSak();
  const { løsBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('OVERGANG_ARBEID');

  const { formFields, form } = useConfigForm<FormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: 'Vilkårsvurdering',
        defaultValue: grunnlag?.vurdering?.begrunnelse,
        rules: { required: 'Du må gi en begrunnelse om brukeren har krav på AAP' },
      },
      brukerRettPåAAP: {
        type: 'radio',
        label: 'Har brukeren rett på AAP i perioden som arbeidssøker etter § 11-17?',
        options: JaEllerNeiOptions,
        defaultValue: getJaNeiEllerUndefined(grunnlag?.vurdering?.brukerRettPaaAAP),
        rules: { required: 'Du må svare på om brukeren har krav på AAP i perioden som arbeidssøker etter § 11-17' },
      },
      virkningsdato: {
        type: 'textarea',
        label: 'Virkningsdato for vurderingen',
        defaultValue: grunnlag?.vurdering?.virkningsDato || undefined,
        description: 'Bruker får AAP etter § 11-17 fra til',
        rules: { required: 'Du må velge virkningsdato for vurderingen' },
      },
    },
    { readOnly: readOnly, shouldUnregister: true }
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingVersjon,
        behov: {
          behovstype: Behovstype.OVERGANG_ARBEID,
          overgangArbeidVurdering: {
            begrunnelse: data.begrunnelse,
            brukerRettPaaAAP: data.brukerRettPåAAP === JaEllerNei.Ja,
            virkningsDato: formaterDatoForBackend(parse(data.virkningsdato, 'dd.MM.yyyy', new Date())),
          },
        },
        referanse: behandlingsReferanse,
      });
    })(event);
  };

  const gjeldendeSykdomsvurdering = grunnlag?.gjeldendeSykdsomsvurderinger.at(-1);
  const vurderingenGjelderFra = gjeldendeSykdomsvurdering?.vurderingenGjelderFra;

  return (
    <VilkårsKortMedForm
      heading={'§ 11-17 AAP i perioden som arbeidssøker'}
      steg={'OVERGANG_ARBEID'}
      onSubmit={handleSubmit}
      visBekreftKnapp={!readOnly}
      isLoading={isLoading}
      status={status}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      vilkårTilhørerNavKontor={true}
      vurdertAvAnsatt={grunnlag?.vurdering?.vurdertAv}
    >
      {typeBehandling === 'Revurdering' && (
        <TidligereVurderinger
          historiskeVurderinger={grunnlag?.historiskeVurderinger.toReversed() ?? []}
          gjeldendeVurderinger={grunnlag?.gjeldendeVedtatteVurderinger ?? []}
          søknadstidspunkt={sak.periode.fom}
        />
      )}
      <Veiledning
        defaultOpen={false}
        tekst={
          <div>
            Vilkårene i § 11-17 blabla.{' '}
            <Link href="https://lovdata.no/pro/lov/1997-02-28-19/%C2%A711-17">
              Du kan lese om hvordan vilkåret skal vurderes i rundskrivet til § 11-17
            </Link>
            <span> </span>
            <Link href="https://lovdata.no"> (lovdata.no)</Link>
          </div>
        }
      />
      {typeBehandling === 'Revurdering' && (
        <BodyShort>
          Vurderingen gjelder fra {vurderingenGjelderFra && formaterDatoForFrontend(vurderingenGjelderFra)}
        </BodyShort>
      )}
      <FormField form={form} formField={formFields.begrunnelse} className="begrunnelse" />
      <FormField form={form} formField={formFields.brukerRettPåAAP} horizontalRadio />
      <VStack gap={'4'} as={'section'}>
        <Heading level={'3'} size="small">
          § 11-17 Arbeidsavklaringspenger i perioden som arbeidssøker
        </Heading>
        <DateInputWrapper
          name={`virkningsdato`}
          control={form.control}
          label={'Virkningsdato for vurderingen'}
          rules={{
            validate: {
              gyldigDato: (value) => validerNullableDato(value as string),
            },
          }}
          readOnly={readOnly}
        />
      </VStack>
    </VilkårsKortMedForm>
  );
};

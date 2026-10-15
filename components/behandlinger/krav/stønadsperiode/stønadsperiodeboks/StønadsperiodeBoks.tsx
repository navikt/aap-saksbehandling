import { TasklistIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Button, Detail, HStack, Radio, VStack } from '@navikt/ds-react';
import { StansOpphørÅrsak, StønadsperiodeVurdering } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { useFormContext } from 'react-hook-form';
import { StønadsperiodeFormFields } from 'components/behandlinger/krav/utils/stønadsperiodeutils';
import { JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { validerDato } from 'lib/validation/dateValidation';
import { TextAreaWrapper } from 'components/form/textareawrapper/TextAreaWrapper';
import { RadioGroupWrapper } from 'components/form/radiogroupwrapper/RadioGroupWrapper';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { MultipleComboboxWrapper } from 'components/form/multiplecomboboxwrapper/MultipleComboboxWrapper';
import { mapÅrsakTilTekst } from 'components/behandlinger/vedtak/foreslåvedtak/StansOpphørTabell';

interface Props {
  vurdering: StønadsperiodeVurdering;
  onLukk: () => void;
}

export const StønadsperiodeBoks = ({ vurdering, onLukk }: Props) => {
  const form = useFormContext<StønadsperiodeFormFields>();

  const brukerenHarHattOrdinærAAPInnen52UkerValue = form.watch(
    `vurderinger.${vurdering.referanse}.harHattOrdinærSiste52Uker`
  );

  const harGjenværendeKvoteValue = form.watch(`vurderinger.${vurdering.referanse}.harGjenværendeKvote`);

  const stansEllerOpphørValue = form.watch(`vurderinger.${vurdering.referanse}.stansOpphørType`);

  const skalViseStansEllerOpphørFelt =
    brukerenHarHattOrdinærAAPInnen52UkerValue === JaEllerNei.Ja && harGjenværendeKvoteValue === JaEllerNei.Ja;
  const skalViseStansÅrsaker = stansEllerOpphørValue === 'STANS';

  return (
    <Box
      role="group"
      aria-label={`Vurder krav ${vurdering.referanse}`}
      borderWidth="1"
      borderRadius="12"
      borderColor="neutral-subtle"
    >
      <Box padding="space-8" background="neutral-moderate" borderRadius="12 12 0 0">
        <HStack align="center" justify="space-between" gap="space-12" padding="space-8">
          <HStack align="center" gap="space-12">
            <TasklistIcon aria-hidden fontSize="2rem" />
            <VStack>
              <Detail>Søknadsdato: {formaterDatoForFrontend(vurdering.startDato)}</Detail>
              <BodyShort weight="semibold" size="small">
                Vurder krav {vurdering.referanse}
              </BodyShort>
            </VStack>
          </HStack>
        </HStack>
      </Box>
      <Box padding="space-16">
        <VStack gap="space-16">
          <HStack justify="end">
            <Button type="button" size="small" variant="tertiary" onClick={onLukk}>
              Lukk
            </Button>
          </HStack>
          <TextAreaWrapper
            name={`vurderinger.${vurdering.referanse}.begrunnelse`}
            control={form.control}
            label={'Begrunnelse'}
            rules={{ required: 'Du må skrive en begrunnelse.' }}
          />
          <RadioGroupWrapper
            name={`vurderinger.${vurdering.referanse}.harHattOrdinærSiste52Uker`}
            control={form.control}
            size={'small'}
            label={'Har brukeren hatt ordinær AAP innen 52 uker?'}
            rules={{ required: 'Du må svare på om brukeren har hatt ordinær AAP innen 52 uker.' }}
            horisontal={true}
          >
            {JaEllerNeiOptions.map((option) => (
              <Radio key={option.value} value={option.value}>
                {option.label}
              </Radio>
            ))}
          </RadioGroupWrapper>

          <RadioGroupWrapper
            name={`vurderinger.${vurdering.referanse}.harGjenværendeKvote`}
            control={form.control}
            size={'small'}
            label={'Har brukeren gjenværende kvote?'}
            rules={{ required: 'Du må svare på om brukeren har gjenværende kvote.' }}
            horisontal={true}
          >
            {JaEllerNeiOptions.map((option) => (
              <Radio key={option.value} value={option.value}>
                {option.label}
              </Radio>
            ))}
          </RadioGroupWrapper>

          {skalViseStansEllerOpphørFelt && (
            <RadioGroupWrapper
              name={`vurderinger.${vurdering.referanse}.stansOpphørType`}
              control={form.control}
              label={'Er det stans eller opphør?'}
              rules={{ required: 'Du må velge stans eller opphør.' }}
            >
              <Radio value={'STANS'}>Stans</Radio>
              <Radio value={'OPPHØR'}>Opphør</Radio>
            </RadioGroupWrapper>
          )}

          {skalViseStansÅrsaker && (
            <MultipleComboboxWrapper
              name={`vurderinger.${vurdering.referanse}.stansÅrsaker`}
              control={form.control}
              label={'Stansårsak'}
              rules={{ required: 'Du må velge minst én stansårsak.' }}
              options={stansÅrsaker.map((årsak) => {
                return { value: årsak, label: mapStansÅrsakerTilTekst(årsak) };
              })}
            />
          )}
          <DateInputWrapper
            name={`vurderinger.${vurdering.referanse}.datoKravetSkalVurderesFra`}
            control={form.control}
            size={'small'}
            label={'Dato kravet skal vurderes fra'}
            rules={{
              required: 'Du må sette en dato kravet skal vurderes fra.',
              validate: (value) => validerDato(value as string),
            }}
          />
        </VStack>
      </Box>
    </Box>
  );
};

function mapStansÅrsakerTilTekst(stansårsak: StansOpphørÅrsak): string {
  return mapÅrsakTilTekst(stansårsak);
}

export const stansÅrsaker = [
  'ANNEN_FULL_YTELSE',
  'ANNEN_FULL_YTELSE_AVSLAG',
  'BRUDD_PÅ_AKTIVITETSPLIKT_OPPHØR',
  'BRUDD_PÅ_AKTIVITETSPLIKT_STANS',
  'BRUDD_PÅ_OPPHOLDSKRAV_OPPHØR',
  'BRUDD_PÅ_OPPHOLDSKRAV_STANS',
  'BRUKER_OVER_67',
  'BRUKER_UNDER_18',
  'HAR_RETT_TIL_FULLT_UTTAK_ALDERSPENSJON',
  'IKKE_BEHOV_FOR_OPPFOLGING',
  'IKKE_MEDLEM',
  'IKKE_MEDLEM_FORUTGÅENDE',
  'IKKE_NOK_REDUSERT_ARBEIDSEVNE',
  'IKKE_OPPFYLT_OPPHOLDSKRAV_EØS',
  'IKKE_RETT_PA_AAP_I_PERIODE_SOM_ARBEIDSSOKER',
  'IKKE_RETT_PA_AAP_UNDER_BEHANDLING_AV_UFORE',
  'IKKE_RETT_PA_STUDENT',
  'IKKE_RETT_PA_SYKEPENGEERSTATNING',
  'IKKE_RETT_UNDER_STRAFFEGJENNOMFØRING',
  'IKKE_SYKDOM_AV_VISS_VARIGHET',
  'IKKE_SYKDOM_SKADE_LYTE',
  'IKKE_SYKDOM_SKADE_LYTE_VESENTLIGDEL',
  'INNTEKTSTAP_DEKKES_ETTER_ANNEN_LOVGIVNING',
  'MANGLENDE_DOKUMENTASJON',
  'NORGE_IKKE_KOMPETENT_STAT',
  'ORDINÆRKVOTE_BRUKT_OPP',
  'SYKEPENGEERSTATNINGKVOTE_BRUKT_OPP',
  'VARIGHET_OVERSKREDET_ARBEIDSSØKER',
  'VARIGHET_OVERSKREDET_OVERGANG_UFORE',
  'VARIGHET_OVERSKREDET_STUDENT',
] as const satisfies readonly StansOpphørÅrsak[number][];

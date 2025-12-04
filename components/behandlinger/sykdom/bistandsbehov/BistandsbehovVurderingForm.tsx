'use client';

import { JaEllerNei } from 'lib/utils/form';
import { DateInputWrapperOnBlur } from 'components/form/dateinputwrapper/DateInputWrapperOnBlur';
import { validerDato } from 'lib/validation/dateValidation';
import { Alert, Button, Heading, HStack, Link, VStack } from '@navikt/ds-react';
import { UseFormReturn } from 'react-hook-form';
import { TrashFillIcon } from '@navikt/aksel-icons';
import { TextAreaWrapper } from 'components/form/textareawrapper/TextAreaWrapper';
import { RadioGroupJaNei } from 'components/form/radiogroupjanei/RadioGroupJaNei';
import { BistandForm } from 'components/behandlinger/sykdom/bistandsbehov/BistandsbehovPeriodisert';
import { BistandsGrunnlag, TypeBehandling } from 'lib/types/types';
import { Veiledning } from 'components/veiledning/Veiledning';

type Props = {
  form: UseFormReturn<BistandForm>;
  readOnly: boolean;
  index: number;
  harTidligereVurderinger: boolean;
  onRemove: () => void;
  grunnlag?: BistandsGrunnlag;
  overgangArbeidEnabled: Boolean;
  typeBehandling: TypeBehandling;
};
export const BistandsbehovVurderingForm = ({
  form,
  index,
  readOnly,
  onRemove,
  overgangArbeidEnabled,
  grunnlag,
  typeBehandling,
}: Props) => {
  const vilkårsvurderingLabel = 'Vilkårsvurdering';
  const erBehovForAktivBehandlingLabel = 'a: Har brukeren behov for aktiv behandling?';
  const erBehovForArbeidsrettetTiltakLabel = 'b: Har brukeren behov for arbeidsrettet tiltak?';
  const erBehovForAnnenOppfølgingLabel =
    'c: Kan brukeren anses for å ha en viss mulighet for å komme i arbeid, ved å få annen oppfølging fra Nav?';
  const vurderAAPIOvergangTilArbeidLabel = 'Har brukeren rett til AAP i perioden som arbeidssøker?';

  const erBehovForAktivBehandling = form.watch(`vurderinger.${index}.erBehovForAktivBehandling`) === JaEllerNei.Nei;
  const erBehovForArbeidsrettetTiltak =
    form.watch(`vurderinger.${index}.erBehovForArbeidsrettetTiltak`) === JaEllerNei.Nei;
  const erBehovForAnnenOppfølging = form.watch(`vurderinger.${index}.erBehovForAnnenOppfølging`) === JaEllerNei.Nei;

  const bistandsbehovErIkkeOppfylt =
    erBehovForAktivBehandling && erBehovForArbeidsrettetTiltak && erBehovForAnnenOppfølging;
  return (
    <VStack gap={'4'}>
      <Veiledning
        defaultOpen={false}
        tekst={
          <div>
            Vilkårene i § 11-6 første ledd bokstav a til c er tre alternative vilkår. Det vil si at det er nok at
            brukeren oppfyller ett av dem for å fylle vilkåret i § 11-6.Først skal du vurdere om vilkårene i bokstav a
            (aktiv behandling) og bokstav b (arbeidsrettet tiltak) er oppfylte. Hvis du svarer ja på ett eller begge
            vilkårene, er § 11-6 oppfylt. Hvis du svarer nei på a og b, må du vurdere om bokstav c er oppfylt. Hvis du
            svarer nei på alle tre vilkårene, er § 11-6 ikke oppfylt.{' '}
            <Link href="https://lovdata.no/nav/rundskriv/r11-00#KAPITTEL_8" target="_blank">
              Du kan lese om hvordan vilkåret skal vurderes i rundskrivet til § 11-6 (lovdata.no)
            </Link>
          </div>
        }
      />
      <HStack justify={'space-between'}>
        <DateInputWrapperOnBlur
          name={`vurderinger.${index}.fraDato`}
          label="Vurderingen gjelder fra"
          control={form.control}
          rules={{
            required: 'Du må velge fra hvilken dato vurderingen gjelder fra',
            validate: (value) => validerDato(value as string),
          }}
          readOnly={readOnly}
        />
        <HStack>
          <VStack justify={'end'}>
            <Button
              aria-label="Fjern vurdering"
              variant="tertiary"
              size="small"
              icon={<TrashFillIcon />}
              onClick={() => onRemove()}
              type="button"
            ></Button>
          </VStack>
        </HStack>
      </HStack>
      <TextAreaWrapper
        name={`vurderinger.${index}.begrunnelse`}
        control={form.control}
        label={vilkårsvurderingLabel}
        rules={{
          required: 'Du må gi en begrunnelse om brukeren har behov for oppfølging',
        }}
        readOnly={readOnly}
        className={'begrunnelse'}
      />
      <RadioGroupJaNei
        name={`vurderinger.${index}.erBehovForAktivBehandling`}
        control={form.control}
        label={erBehovForAktivBehandlingLabel}
        horisontal={true}
        rules={{ required: 'Du må svare på om brukeren har behov for aktiv behandling' }}
        readOnly={readOnly}
      />
      <RadioGroupJaNei
        name={`vurderinger.${index}.erBehovForArbeidsrettetTiltak`}
        control={form.control}
        label={erBehovForArbeidsrettetTiltakLabel}
        horisontal={true}
        rules={{ required: 'Du må svare på om brukeren har behov for arbeidsrettet tiltak' }}
        readOnly={readOnly}
      />
      {form.watch(`vurderinger.${index}.erBehovForAktivBehandling`) !== JaEllerNei.Ja &&
        form.watch(`vurderinger.${index}.erBehovForArbeidsrettetTiltak`) !== JaEllerNei.Ja && (
          <RadioGroupJaNei
            name={`vurderinger.${index}.erBehovForAnnenOppfølging`}
            control={form.control}
            label={erBehovForAnnenOppfølgingLabel}
            horisontal={true}
            rules={{ required: 'Du må svare på om brukeren anses for å ha en viss mulighet til å komme i arbeid' }}
            readOnly={readOnly}
          />
        )}
      {!overgangArbeidEnabled &&
        typeBehandling === 'Revurdering' &&
        !grunnlag?.harOppfylt11_5 &&
        bistandsbehovErIkkeOppfylt && (
          <VStack gap={'4'} as={'section'}>
            <Heading level={'3'} size="small">
              § 11-17 Arbeidsavklaringspenger i perioden som arbeidssøker
            </Heading>
            <TextAreaWrapper
              name={`vurderinger.${index}.overgangBegrunnelse`}
              control={form.control}
              label={vilkårsvurderingLabel}
              rules={{
                required: 'Du må gjøre en vilkårsvurdering',
              }}
              readOnly={readOnly}
              className={'begrunnelse'}
            />
            <RadioGroupJaNei
              name={`vurderinger.${index}.skalVurdereAapIOvergangTilArbeid`}
              control={form.control}
              label={vurderAAPIOvergangTilArbeidLabel}
              horisontal={true}
              rules={{
                required: 'Du må svare på om brukeren har rett på AAP i overgang til arbeid',
                validate: (value) =>
                  value === JaEllerNei.Ja ? 'AAP i overgang til arbeid er ikke støttet enda' : undefined,
              }}
              readOnly={readOnly}
            />
            {form.watch(`vurderinger.${index}.skalVurdereAapIOvergangTilArbeid`) === JaEllerNei.Ja && (
              <Alert variant="warning">
                Sett saken på vent og meld i fra til Team AAP at du har fått en § 11-17-sak.
              </Alert>
            )}
          </VStack>
        )}
    </VStack>
  );
};

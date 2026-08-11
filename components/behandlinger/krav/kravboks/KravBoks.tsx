import { KravVurdering, SøknadUtenKrav } from 'lib/types/types';
import {
  finnSøknadsdato,
  formaterKravtype,
  kravVurderingTilFormFields,
} from 'components/behandlinger/krav/kravutils';
import { BodyShort, Box, Button, Detail, HStack, Label, VStack } from '@navikt/ds-react';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { TasklistIcon } from '@navikt/aksel-icons';
import { useFormContext } from 'react-hook-form';
import { KravFormFields } from 'components/behandlinger/krav/vurderkrav/VurderKravV2';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { KravType } from 'components/opprettsak/OpprettSakLocal';
import { ReactNode, useMemo, useState } from 'react';
import { SelectWrapper } from 'components/form/selectwrapper/SelectWrapper';
import { TextAreaWrapper } from 'components/form/textareawrapper/TextAreaWrapper';

const ALLE_KRAVTYPER: KravType[] = ['RELEVANT_KRAV', 'TILLEGGSOPPLYSNING', 'KLAGE', 'TRUKKET_SØKNAD'];

interface Props {
  krav: KravVurdering;
  erVedtatt: boolean;
  søknaderUtenKravvurdering: SøknadUtenKrav[];
  onLukk: () => void;
}

export const KravBoks = ({ krav, onLukk }: Props) => {
  const [visVurderOmKravErRelevantFelt, setVisVurderOmKravErRelevantFelt] = useState<boolean>(false);
  const [visEndreSøknadsdatoFelt, setVisEndreSøknadsdatoFelt] = useState<boolean>(false);
  const [visMuligRettFraFelt, setVisMuligRettFraFelt] = useState<boolean>(false);

  const form = useFormContext<KravFormFields>();

  const søknadsdato = finnSøknadsdato(krav);

  // Opprinnelige verdier fra grunnlaget, brukt til å nullstille feltene i en bolk når den lukkes.
  const originaleVerdier = useMemo(() => kravVurderingTilFormFields(krav), [krav]);

  const toggleVurderOmKravErRelevantFelt = () => {
    if (visVurderOmKravErRelevantFelt) {
      form.setValue(`vurderinger.${krav.referanse}.kravtype`, originaleVerdier.kravtype);
    }
    setVisVurderOmKravErRelevantFelt(!visVurderOmKravErRelevantFelt);
  };

  const toggleEndreSøknadsdatoFelt = () => {
    if (visEndreSøknadsdatoFelt) {
      form.setValue(`vurderinger.${krav.referanse}.søknadsdatoDato`, originaleVerdier.søknadsdatoDato);
      form.setValue(`vurderinger.${krav.referanse}.søknadsdatoÅrsak`, originaleVerdier.søknadsdatoÅrsak);
      form.setValue(`vurderinger.${krav.referanse}.overstyrÅrsak`, originaleVerdier.overstyrÅrsak);
    }
    setVisEndreSøknadsdatoFelt(!visEndreSøknadsdatoFelt);
  };

  const toggleMuligRettFraFelt = () => {
    if (visMuligRettFraFelt) {
      form.setValue(`vurderinger.${krav.referanse}.overstyrDato`, originaleVerdier.overstyrDato);
    }
    setVisMuligRettFraFelt(!visMuligRettFraFelt);
  };

  // const kravtype = useWatch({ control: form.control, name: `vurderinger.${krav.referanse}.kravtype` });

  return (
    <Box borderWidth="1" borderRadius="12" borderColor="neutral-subtle">
      <Box padding="space-8" background="neutral-moderate" borderRadius="12 12 0 0">
        <HStack align={'center'} gap={'space-12'} padding={'space-8'}>
          <TasklistIcon title="a11y-title" fontSize="2rem" />
          <VStack>
            <Detail>Søknadsdato: {søknadsdato ? formaterDatoForFrontend(søknadsdato.dato) : '-'}</Detail>
            <BodyShort weight={'semibold'} size={'small'}>
              Vurder krav {krav.referanse}
            </BodyShort>
          </VStack>
        </HStack>
      </Box>
      <Box padding="space-16">
        <VStack gap="space-16">
          <HStack justify="space-between">
            <BodyShort weight={'semibold'}>{formaterKravtype(krav.type)}</BodyShort>
            <Button type="button" size="small" variant="tertiary" onClick={onLukk}>
              Lukk
            </Button>
          </HStack>
          <Bolk
            label={'Type krav'}
            value={formaterKravtype(krav.type)}
            buttonTekst={
              visVurderOmKravErRelevantFelt ? 'Avbryt vurder om krav er relevant' : 'Vurder om krav er relevant'
            }
            onClick={toggleVurderOmKravErRelevantFelt}
            isOpen={visVurderOmKravErRelevantFelt}
          >
            <SelectWrapper
              control={form.control}
              name={`vurderinger.${krav.referanse}.kravtype`}
              label="Kravtype"
              size="small"
            >
              {ALLE_KRAVTYPER.map((type) => (
                <option key={type} value={type}>
                  {formaterKravtype(type)}
                </option>
              ))}
            </SelectWrapper>
          </Bolk>
          {/*{!erVedtatt && journalpostOptions.length > 0 && (*/}
          {/*  <Select label="Journalpost" size="small" {...register(`vurderinger.${krav.referanse}.journalpostId`)}>*/}
          {/*    {journalpostOptions.map((j) => (*/}
          {/*      <option key={j.id} value={j.id}>*/}
          {/*        {j.id}*/}
          {/*      </option>*/}
          {/*    ))}*/}
          {/*  </Select>*/}
          {/*)}*/}
          <Bolk
            label={'Søknadsdato'}
            value={søknadsdato ? formaterDatoForFrontend(søknadsdato.dato) : '-'}
            buttonTekst={visEndreSøknadsdatoFelt ? 'Avbryt Vurder §22-13 5.ledd' : 'Vurder §22-13 5.ledd'}
            onClick={toggleEndreSøknadsdatoFelt}
            isOpen={visEndreSøknadsdatoFelt}
          >
            <VStack gap={'space-16'}>
              <DateInputWrapper
                name={`vurderinger.${krav.referanse}.søknadsdatoDato`}
                control={form.control}
                label="Søknadsdato"
                size={'small'}
                rules={{ required: 'Du må fylle inn søknadsdato.' }}
              />
              <SelectWrapper
                control={form.control}
                name={`vurderinger.${krav.referanse}.søknadsdatoÅrsak`}
                label="Årsak for søknadsdato"
                size="small"
                rules={{ required: 'Du må velge årsak for søknadsdato.' }}
              >
                <option value="">Velg årsak</option>
                <option value="SøknadMottatt">Søknad mottatt</option>
                <option value="BrukerHarSøktTidligere">Bruker har søkt tidligere</option>
                <option value="FeilregistrertSøknadsdato">Feilregistrert søknadsdato</option>
              </SelectWrapper>
              <SelectWrapper
                control={form.control}
                name={`vurderinger.${krav.referanse}.overstyrÅrsak`}
                label="Årsak for overstyring (valgfri)"
                size="small"
              >
                <option value="">Ingen overstyring</option>
                <option value="IkkeIStandTilÅSøkeTidligere">Ikke i stand til å søke tidligere</option>
                <option value="MisvisendeOpplysninger">Misvisende opplysninger</option>
              </SelectWrapper>
            </VStack>
          </Bolk>

          <Bolk
            label={'Mulig rett fra'}
            value={'muligRettFra' in krav ? formaterDatoForFrontend(krav.muligRettFra) : '-'}
            buttonTekst={visMuligRettFraFelt ? 'Avbryt vurder §22-13 7.ledd' : 'Vurder §22-13 7.ledd'}
            onClick={toggleMuligRettFraFelt}
            isOpen={visMuligRettFraFelt}
          >
            <DateInputWrapper
              name={`vurderinger.${krav.referanse}.overstyrDato`}
              control={form.control}
              label="Overstyr mulig rett fra"
            />
          </Bolk>

          <TextAreaWrapper
            control={form.control}
            name={`vurderinger.${krav.referanse}.begrunnelse`}
            label="Begrunnelse"
            size="small"
            rules={{ required: 'Du må skrive inn en begrunnelse.' }}
          />
        </VStack>
      </Box>
    </Box>
  );
};

function Bolk({
  label,
  value,
  onClick,
  buttonTekst,
  isOpen,
  children,
}: {
  label: string;
  value: string;
  buttonTekst: string;
  onClick: () => void;
  isOpen: boolean;
  children: ReactNode;
}) {
  return (
    <Box
      background={isOpen ? 'accent-soft' : 'neutral-soft'}
      borderRadius="8"
      borderWidth="1"
      borderColor={isOpen ? 'accent-subtle' : 'neutral-subtle'}
      padding="space-16"
    >
      <VStack gap="space-4">
        <Label size={'small'}>{label}</Label>
        <HStack align={'center'} justify={'space-between'} gap={'space-4'}>
          <BodyShort size={'small'}>{value}</BodyShort>
          <Button type="button" size={'small'} variant={'tertiary'} onClick={onClick}>
            {buttonTekst}
          </Button>
        </HStack>
      </VStack>
      {isOpen && (
        <Box
          paddingBlock="space-16 space-0"
          marginBlock="space-16 space-0"
          borderWidth="1 0 0 0"
          borderColor="neutral-subtle"
        >
          <Box paddingBlock="space-16 space-0">{children}</Box>
        </Box>
      )}
    </Box>
  );
}

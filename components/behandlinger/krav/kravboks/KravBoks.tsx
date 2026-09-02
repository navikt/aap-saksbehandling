import { KravVurdering, SøknadUtenKrav } from 'lib/types/types';
import {
  finnSøknadsdato,
  formaterKravtype,
  kravVurderingTilFormFields,
  søknadUtenKravTilFormFields,
} from 'components/behandlinger/krav/kravutils';
import { BodyShort, Box, Button, Detail, HStack, Label, Radio, Tag, VStack } from '@navikt/ds-react';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { TasklistIcon } from '@navikt/aksel-icons';
import { useFormContext } from 'react-hook-form';
import { KravFormFields } from 'components/behandlinger/krav/vurderkrav/VurderKrav';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { ReactNode, useMemo, useState } from 'react';
import { TextAreaWrapper } from 'components/form/textareawrapper/TextAreaWrapper';
import {
  JaEllerNei,
  JaEllerNeiOptions,
  MuligRettFraTilbakedateresOptions,
  MuligRettFraTilbakedateresValg,
  SøknadsdatoEndresOptions,
  SøknadsdatoEndresValg,
} from 'lib/utils/form';
import { RadioGroupWrapper } from 'components/form/radiogroupwrapper/RadioGroupWrapper';
import { Alert } from 'components/alert/Alert';

export type KravBoksInnhold =
  | { kilde: 'EKSISTERENDE'; krav: KravVurdering }
  | { kilde: 'NY_SØKNAD'; søknad: SøknadUtenKrav };

interface Props {
  innhold: KravBoksInnhold;
  erVedtatt: boolean;
  onLukk: () => void;
}

export const KravBoks = ({ innhold, onLukk }: Props) => {
  const erNySøknad = innhold.kilde === 'NY_SØKNAD';
  const referanse =
    innhold.kilde === 'EKSISTERENDE' ? innhold.krav.referanse : innhold.søknad.journalpostId.identifikator;

  const [visVurderOmKravErRelevantFelt, setVisVurderOmKravErRelevantFelt] = useState<boolean>(erNySøknad);
  const [visEndreSøknadsdatoFelt, setVisEndreSøknadsdatoFelt] = useState<boolean>(false);
  const [visMuligRettFraFelt, setVisMuligRettFraFelt] = useState<boolean>(false);

  const form = useFormContext<KravFormFields>();

  const kravTypeErRelevantKrav =
    form.watch(`vurderinger.${referanse}.skalVurderesForNyEllerGjenopptattAAPRettighet`) === JaEllerNei.Ja;

  const søknadsdatoEndres = form.watch(`vurderinger.${referanse}.søknadsdatoEndres`);
  const visNySøknadsdatoFelt =
    søknadsdatoEndres === SøknadsdatoEndresValg.BrukerHarSøktTidligere ||
    søknadsdatoEndres === SøknadsdatoEndresValg.FeilregistrertSøknadsdato;

  const muligRettFraTilbakedateres = form.watch(`vurderinger.${referanse}.muligRettFraTilbakedateres`);
  const visMuligRettFraDatoFelt =
    muligRettFraTilbakedateres === MuligRettFraTilbakedateresValg.IkkeIStandTilÅSøkeTidligere ||
    muligRettFraTilbakedateres === MuligRettFraTilbakedateresValg.MisvisendeOpplysninger;

  const kravtypeVisning = innhold.kilde === 'EKSISTERENDE' ? innhold.krav.type : 'RELEVANT_KRAV';
  const søknadsdato =
    innhold.kilde === 'EKSISTERENDE' ? finnSøknadsdato(innhold.krav) : { dato: innhold.søknad.mottattTidspunkt };
  const muligRettFra =
    innhold.kilde === 'EKSISTERENDE' && 'muligRettFra' in innhold.krav ? innhold.krav.muligRettFra : null;

  // Opprinnelige verdier, brukt til å nullstille feltene i en bolk når den lukkes.
  const originaleVerdier = useMemo(
    () =>
      innhold.kilde === 'EKSISTERENDE'
        ? kravVurderingTilFormFields(innhold.krav)
        : søknadUtenKravTilFormFields(innhold.søknad),
    [innhold]
  );

  const toggleVurderOmKravErRelevantFelt = () => {
    if (visVurderOmKravErRelevantFelt) {
      form.setValue(
        `vurderinger.${referanse}.skalVurderesForNyEllerGjenopptattAAPRettighet`,
        originaleVerdier.skalVurderesForNyEllerGjenopptattAAPRettighet
      );
    }
    setVisVurderOmKravErRelevantFelt(!visVurderOmKravErRelevantFelt);
  };

  const toggleEndreSøknadsdatoFelt = () => {
    if (visEndreSøknadsdatoFelt) {
      form.setValue(`vurderinger.${referanse}.søknadsdatoDato`, originaleVerdier.søknadsdatoDato);
      form.setValue(`vurderinger.${referanse}.søknadsdatoEndres`, originaleVerdier.søknadsdatoEndres);
      form.setValue(`vurderinger.${referanse}.søknadsdatoBegrunnelse`, originaleVerdier.søknadsdatoBegrunnelse);
    }
    setVisEndreSøknadsdatoFelt(!visEndreSøknadsdatoFelt);
  };

  const toggleMuligRettFraFelt = () => {
    if (visMuligRettFraFelt) {
      form.setValue(`vurderinger.${referanse}.overstyrDato`, originaleVerdier.overstyrDato);
      form.setValue(`vurderinger.${referanse}.muligRettFraTilbakedateres`, originaleVerdier.muligRettFraTilbakedateres);
      form.setValue(`vurderinger.${referanse}.muligRettFraBegrunnelse`, originaleVerdier.muligRettFraBegrunnelse);
    }
    setVisMuligRettFraFelt(!visMuligRettFraFelt);
  };

  return (
    <Box borderWidth="1" borderRadius="12" borderColor={erNySøknad ? 'accent-subtle' : 'neutral-subtle'}>
      <Box padding="space-8" background={erNySøknad ? 'accent-moderate' : 'neutral-moderate'} borderRadius="12 12 0 0">
        <HStack align={'center'} justify={'space-between'} gap={'space-12'} padding={'space-8'}>
          <HStack align={'center'} gap={'space-12'}>
            <TasklistIcon title="a11y-title" fontSize="2rem" />
            <VStack>
              <Detail>Søknadsdato: {søknadsdato ? formaterDatoForFrontend(søknadsdato.dato) : '-'}</Detail>
              <BodyShort weight={'semibold'} size={'small'}>
                {erNySøknad ? `Ny søknad ${referanse}` : `Vurder krav ${referanse}`}
              </BodyShort>
            </VStack>
          </HStack>
          {erNySøknad && (
            <Tag variant="warning" size="small">
              Må vurderes
            </Tag>
          )}
        </HStack>
      </Box>

      <Box padding="space-16">
        <VStack gap="space-16">
          <HStack justify="space-between">
            <BodyShort weight={'semibold'}>{formaterKravtype(kravtypeVisning)}</BodyShort>
            {!erNySøknad && (
              <Button type="button" size="small" variant="tertiary" onClick={onLukk}>
                Lukk
              </Button>
            )}
          </HStack>

          <Bolk
            label={'Type krav'}
            value={formaterKravtype(kravtypeVisning)}
            buttonTekst={
              visVurderOmKravErRelevantFelt ? 'Avbryt vurder om krav er relevant' : 'Vurder om krav er relevant'
            }
            visKnapp={!erNySøknad}
            onClick={toggleVurderOmKravErRelevantFelt}
            isOpen={visVurderOmKravErRelevantFelt}
          >
            <VStack gap={'space-16'}>
              <TextAreaWrapper
                control={form.control}
                name={`vurderinger.${referanse}.begrunnelse`}
                label="Vurdering"
                size="small"
                rules={{ required: 'Du må skrive inn en vurdering.' }}
              />

              <RadioGroupWrapper
                control={form.control}
                name={`vurderinger.${referanse}.skalVurderesForNyEllerGjenopptattAAPRettighet`}
                size="small"
                label="Skal brukeren vurderes for ny eller gjenopptatt AAP rettighet på bakgrunn av denne søknaden?"
                description={
                  'Svar nei hvis søknaden er tilleggsopplysninger, eller det ikke er relevant å vurdere ny eller gjenopptatt rettighet '
                }
                horisontal
                rules={{ required: 'Du må svare ja eller nei.' }}
              >
                {JaEllerNeiOptions.map((option) => (
                  <Radio value={option.value} key={option.value}>
                    {option.label}
                  </Radio>
                ))}
              </RadioGroupWrapper>
            </VStack>
          </Bolk>

          {kravTypeErRelevantKrav && (
            <Bolk
              label={'Søknadsdato'}
              value={søknadsdato ? formaterDatoForFrontend(søknadsdato.dato) : '-'}
              buttonTekst={visEndreSøknadsdatoFelt ? 'Avbryt Vurder § 22-13 femte ledd' : 'Vurder § 22-13 femte ledd'}
              onClick={toggleEndreSøknadsdatoFelt}
              isOpen={visEndreSøknadsdatoFelt}
            >
              <VStack gap={'space-16'}>
                <TextAreaWrapper
                  control={form.control}
                  name={`vurderinger.${referanse}.søknadsdatoBegrunnelse`}
                  label="Begrunnelse"
                  size="small"
                  rules={{ required: 'Du må skrive inn en begrunnelse.' }}
                />

                <RadioGroupWrapper
                  control={form.control}
                  name={`vurderinger.${referanse}.søknadsdatoEndres`}
                  size="small"
                  label="Skal brukerens søknadsdato endres?"
                  rules={{ required: 'Du må svare på om søknadsdatoen skal endres.' }}
                >
                  {SøknadsdatoEndresOptions.map((option) => (
                    <Radio value={option.value} key={option.value}>
                      {option.label}
                    </Radio>
                  ))}
                </RadioGroupWrapper>

                {visNySøknadsdatoFelt && (
                  <>
                    <DateInputWrapper
                      name={`vurderinger.${referanse}.søknadsdatoDato`}
                      control={form.control}
                      label="Ny søknadsdato"
                      size={'small'}
                      rules={{ required: 'Du må fylle inn ny søknadsdato.' }}
                    />
                    <Alert variant="info">
                      Husk å journalføre relevant dokument som dokumenterer riktig søknadsdato til AAP-saken. Endret
                      søknadsdato gir ikke krav på renter.
                    </Alert>
                  </>
                )}
              </VStack>
            </Bolk>
          )}

          {kravTypeErRelevantKrav && (
            <Bolk
              label={'Mulig rett fra'}
              value={muligRettFra ? formaterDatoForFrontend(muligRettFra) : '-'}
              buttonTekst={visMuligRettFraFelt ? 'Avbryt vurder § 22-13 syvende ledd' : 'Vurder § 22-13 syvende ledd'}
              onClick={toggleMuligRettFraFelt}
              isOpen={visMuligRettFraFelt}
            >
              <VStack gap={'space-16'}>
                <TextAreaWrapper
                  control={form.control}
                  name={`vurderinger.${referanse}.muligRettFraBegrunnelse`}
                  label="Begrunnelse"
                  size="small"
                  rules={{ required: 'Du må skrive inn en begrunnelse.' }}
                />

                <RadioGroupWrapper
                  control={form.control}
                  name={`vurderinger.${referanse}.muligRettFraTilbakedateres`}
                  size="small"
                  label="Skal brukerens rett på ytelse tilbakedateres før søknadstidspunktet?"
                  rules={{ required: 'Du må svare på om retten på ytelse skal tilbakedateres.' }}
                >
                  {MuligRettFraTilbakedateresOptions.map((option) => (
                    <Radio value={option.value} key={option.value}>
                      {option.label}
                    </Radio>
                  ))}
                </RadioGroupWrapper>

                {visMuligRettFraDatoFelt && (
                  <>
                    <DateInputWrapper
                      name={`vurderinger.${referanse}.overstyrDato`}
                      control={form.control}
                      label="Brukeren har tidligst rett på AAP fra"
                      size={'small'}
                      rules={{ required: 'Du må fylle inn dato bruker har tidligst rett på AAP fra.' }}
                    />
                    <Alert variant="warning">
                      Det er ikke støtte for beregning av renter i Kelvin ennå. Følg samme rutine som brukes på
                      Arena-saker (via Gosys).
                    </Alert>
                  </>
                )}
              </VStack>
            </Bolk>
          )}
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
  visKnapp = true,
}: {
  label: string;
  value: string;
  buttonTekst: string;
  visKnapp?: boolean;
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
          {visKnapp && (
            <Button type="button" size={'small'} variant={'tertiary'} onClick={onClick}>
              {buttonTekst}
            </Button>
          )}
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

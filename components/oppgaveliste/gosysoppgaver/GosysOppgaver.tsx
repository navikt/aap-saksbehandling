'use client';

import { BodyShort, Box, Button, HStack, Label, VStack } from '@navikt/ds-react';
import { Alert } from 'components/alert/Alert';
import { Spinner } from 'components/felles/Spinner';
import { Enhet } from 'lib/types/oppgaveTypes';
import { useGosysOppgaver } from 'hooks/oppgave/GosysOppgaverHook';
import { GosysTabell } from 'components/oppgaveliste/gosysoppgaver/gosystabell/GosysTabell';
import { useConfigForm } from 'components/form/FormHook';
import { FormField, ValuePair } from 'components/form/FormField';
import { useLagreAktiveEnheter } from 'hooks/oppgave/aktiveEnheterHook';

interface Props {
  enheter: Enhet[];
  gosysUrl?: string;
}

interface FormFields {
  enhet: string;
  gjelder: GjelderTyper;
  visKunTildelteOppgaver: boolean;
}

// ae0292 og ae0294 er behandlingstyper, mens ab0269 og ab0570 er behandlingstema
type GjelderTyper = 'ae0292' | 'ae0294' | 'ab0269' | 'ab0570';

const gjelderOptions: ValuePair<GjelderTyper>[] = [
  {
    value: 'ae0292',
    label: 'Kelvin',
  },
  { value: 'ae0294', label: 'Klage - Kelvin' },
  { value: 'ab0269', label: 'Medlemskap | Kelvin ' },
  { value: 'ab0570', label: 'Avbryt revurdering | Kelvin ' },
];

export const GosysOppgaver = ({ enheter, gosysUrl }: Props) => {
  const { hentLagredeAktiveEnheter } = useLagreAktiveEnheter();

  const { form, formFields } = useConfigForm<FormFields>({
    enhet: {
      type: 'select',
      label: 'Velg enhet',
      defaultValue: hentLagredeAktiveEnheter()?.[0]?.value ?? enheter[0].enhetNr,
      options: enheter.map((enhet) => {
        return { label: enhet.navn, value: enhet.enhetNr };
      }),
    },
    gjelder: {
      type: 'select',
      label: 'Gjelder',
      defaultValue: 'ae0292',
      options: gjelderOptions,
    },
    visKunTildelteOppgaver: {
      type: 'switch',
      defaultValue: false,
      label: 'Vis kun tildelte oppgaver',
    },
  });

  const gjelder = form.watch('gjelder');
  const behandlingstema = gjelder === 'ab0269' || gjelder === 'ab0570' ? gjelder : undefined;
  const behandlingstype = behandlingstema ? 'ae0292' : gjelder;

  const { oppgaver, kanLasteFlere, isLoading, isValidating, error, harLastetOppgaver, antallTreff, lastInnFlere } =
    useGosysOppgaver(form.watch('enhet'), behandlingstype, behandlingstema);

  const visBareOppgaverSomErTildelt = form.watch('visKunTildelteOppgaver');
  const oppgaverSomSkalVises = visBareOppgaverSomErTildelt
    ? oppgaver.filter((oppgave) => oppgave.tilordnetRessurs)
    : oppgaver;

  return (
    <VStack gap="space-16">
      <Box borderColor="neutral-subtle" background={'default'} borderWidth="1" borderRadius={'12'}>
        <VStack>
          <HStack
            align={'end'}
            paddingInline={'space-16'}
            paddingBlock={'space-8'}
            gap={'space-16'}
            style={{ borderBottom: '1px solid #071A3636' }}
          >
            <FormField form={form} formField={formFields.enhet} />
            <FormField form={form} formField={formFields.gjelder} />
            <FormField form={form} formField={formFields.visKunTildelteOppgaver} />
          </HStack>
          <HStack justify={'space-between'} paddingInline={'space-16'} paddingBlock={'space-8'}>
            <HStack gap={'space-8'}>
              <Label as="p" size={'small'}>
                Beskrivelse av køen:
              </Label>
              <BodyShort size={'small'}>{lagBeskrivelseAvKøen(gjelder)}</BodyShort>
            </HStack>
            <BodyShort size={'small'}>
              {visBareOppgaverSomErTildelt
                ? `Antall oppgaver: ${oppgaverSomSkalVises.length}`
                : `Viser ${oppgaverSomSkalVises.length} av ${antallTreff} oppgaver`}
            </BodyShort>
          </HStack>
        </VStack>
      </Box>
      <RenderOppgaveMedStatus />
      {error && <Alert variant="error">Kunne ikke hente flere Gosys-oppgaver. Prøv igjen.</Alert>}
      {kanLasteFlere && (
        <HStack justify={'center'}>
          <Button
            variant="secondary"
            size="small"
            loading={isValidating}
            disabled={isValidating}
            onClick={() => lastInnFlere()}
            className={'fit-content'}
          >
            Last inn flere oppgaver
          </Button>
        </HStack>
      )}
    </VStack>
  );

  function RenderOppgaveMedStatus() {
    if (isLoading) {
      return <Spinner label="Henter Gosys-oppgaver" />;
    } else if (error && !harLastetOppgaver) {
      return <Alert variant="error">Kunne ikke hente Gosys-oppgaver.</Alert>;
    } else {
      return <GosysTabell oppgaver={oppgaverSomSkalVises} gosysUrl={gosysUrl} />;
    }
  }
};

function lagBeskrivelseAvKøen(gjelder: GjelderTyper): string {
  switch (gjelder) {
    case 'ae0292': // Kelvin
      return 'Alle oppgaver med behandlingstype Kelvin.';
    case 'ae0294': // 'Klage - Kelvin'
      return 'Alle oppgaver med behandlingstype Klage i Kelvin.';
    case 'ab0269': // Medlemskap | Kelvin
      return 'Alle oppgaver med behandlingstype Kelvin og behandlingstema Medlemskap.';
    case 'ab0570': // Avbryt revurdering | Kelvin
      return 'Alle oppgaver med behandlingstype Kelvin og behandlingstema Avbryt revurdering';
  }
}

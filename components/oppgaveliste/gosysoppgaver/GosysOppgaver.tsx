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

// ae0292 og ae0294 er behandlingstyper, mens ab0269 og ae0012 er behandlingstema
type GjelderTyper = 'ae0292' | 'ae0294' | 'ab0269' | 'ae0012';

const gjelderOptions: ValuePair<GjelderTyper>[] = [
  {
    value: 'ae0292',
    label: 'Kelvin',
  },
  { value: 'ae0294', label: 'Klage - Kelvin' },
  { value: 'ab0269', label: 'Medlemskap | Kelvin ' },
  { value: 'ae0012', label: 'Avbryt revurdering | Kelvin ' },
];

export const GosysOppgaver = ({ enheter, gosysUrl }: Props) => {
  const { hentLagredeAktiveEnheter } = useLagreAktiveEnheter();

  const { form, formFields } = useConfigForm<FormFields>({
    enhet: {
      type: 'select',
      label: 'Velg enhet',
      defaultValue: hentLagredeAktiveEnheter()?.[0].value ?? enheter[0].enhetNr,
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
  const behandlingstema = gjelder === 'ab0269' || gjelder === 'ae0012' ? gjelder : undefined;
  const behandlingstype = behandlingstema ? 'ae0292' : gjelder;

  const { oppgaver, kanLasteFlere, isLoading, isValidating, error, harLastetOppgaver, lastInnFlere } = useGosysOppgaver(
    form.watch('enhet'),
    behandlingstype,
    behandlingstema
  );

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
          <HStack gap={'space-8'} paddingInline={'space-16'} paddingBlock={'space-8'}>
            <Label as="p" size={'small'}>
              Beskrivelse av køen:
            </Label>
            <BodyShort size={'small'}>Her må vi få inn noe beskrivende</BodyShort>
          </HStack>
        </VStack>
      </Box>
      {isLoading ? (
        <Spinner label="Henter Gosys-oppgaver" />
      ) : error && !harLastetOppgaver ? (
        <Alert variant="error">Kunne ikke hente Gosys-oppgaver.</Alert>
      ) : (
        <>
          <GosysTabell oppgaver={oppgaverSomSkalVises} gosysUrl={gosysUrl} />
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
        </>
      )}
    </VStack>
  );
};

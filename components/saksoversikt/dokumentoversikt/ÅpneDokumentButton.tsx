import { Journalpost } from 'lib/types/types';
import { Alert, Box, Button, Dropdown, HStack } from '@navikt/ds-react';
import { ChevronDownIcon, ExternalLinkIcon } from '@navikt/aksel-icons';
import Link from 'next/link';

export const ÅpneDokumentButton = ({ journalpost }: { journalpost: Journalpost }) => {
  if (journalpost.dokumenter.length > 1) {
    return (
      <Dropdown>
        <Button icon={<ChevronDownIcon aria-hidden />} size="small" as={Dropdown.Toggle} variant="secondary">
          Åpne
        </Button>
        <Dropdown.Menu>
          <Dropdown.Menu.GroupedList>
            <Dropdown.Menu.GroupedList.Heading>Velg dokument</Dropdown.Menu.GroupedList.Heading>
            <Dropdown.Menu.Divider />
            {journalpost.dokumenter.map((dok, index) => (
              <HStack key={index} gap="4">
                <Dropdown.Menu.GroupedList.Item
                  key={dok.dokumentInfoId}
                  disabled={!dok.dokumentvarianter[0]?.saksbehandlerHarTilgang}
                >
                  <Link
                    href={`/saksbehandling/api/dokumenter/${journalpost.journalpostId}/${dok.dokumentInfoId}`}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {dok.tittel}
                    <ExternalLinkIcon aria-hidden title={dok.tittel || journalpost.tittel || 'Mangler tittel'} />
                  </Link>
                </Dropdown.Menu.GroupedList.Item>

                {!dok.dokumentvarianter[0]?.saksbehandlerHarTilgang && (
                  <Box padding="4">
                    <Alert variant="warning" size="small">
                      Ikke Tilgang
                    </Alert>
                  </Box>
                )}
              </HStack>
            ))}
          </Dropdown.Menu.GroupedList>
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  return (
    <Button
      as="a"
      href={`/saksbehandling/api/dokumenter/${journalpost.journalpostId}/${journalpost.dokumenter[0].dokumentInfoId}`}
      target="_blank"
      rel="noreferrer noopener"
      size="small"
      variant="secondary"
      icon={<ExternalLinkIcon aria-hidden />}
      title={journalpost.dokumenter[0].tittel || journalpost.tittel || 'Mangler tittel'}
    >
      Åpne
    </Button>
  );
};

import { BodyShort, Label, List } from '@navikt/ds-react';
import { DokumentInfo } from 'lib/types/types';

interface Props {
  valgteDokumenter?: string[];
  tilknyttedeDokumenterPåBehandling: DokumentInfo[];
}

export const TilknyttedeDokumenter = ({ valgteDokumenter, tilknyttedeDokumenterPåBehandling }: Props) => {
  return (
    <section>
      <Label size={'small'}>Tilknyttede dokumenter</Label>
      <List as={'ul'} size={'small'}>
        {valgteDokumenter && valgteDokumenter.length > 0 ? (
          valgteDokumenter?.map((journalpostId) => (
            <List.Item key={journalpostId}>
              {tilknyttedeDokumenterPåBehandling.find((dokument) => dokument.journalpostId === journalpostId)?.tittel}
            </List.Item>
          ))
        ) : (
          <BodyShort as={'p'} size={'small'}>
            Ingen dokumenter er valgt
          </BodyShort>
        )}
      </List>
    </section>
  );
};

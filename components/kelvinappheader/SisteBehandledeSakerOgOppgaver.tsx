import { ActionMenu, BodyShort, Detail, HStack, Loader, Spacer } from '@navikt/ds-react';
import { ExternalLinkIcon } from '@navikt/aksel-icons';
import { useState } from 'react';
import { isSuccess } from 'lib/utils/api';
import { Behovstype, mapBehovskodeTilBehovstype } from 'lib/utils/form';
import { clientHentMineSisteOppgaver } from 'lib/oppgaveClientApi';

export interface SakOgAvklaringsbehov {
  saksnummer: string;
  avklaringsbehovKode: string;
}

export const SisteBehandledeSakerOgOppgaver = () => {
  const [saker, setSaker] = useState<SakOgAvklaringsbehov[] | undefined>(undefined);
  const [laster, settLaster] = useState(false);

  const hentSaker = async () => {
    if (saker !== undefined || laster) return;

    settLaster(true);
    const res = await clientHentMineSisteOppgaver();
    setSaker(isSuccess(res) ? res.data : []);
    settLaster(false);
  };

  return (
    <ActionMenu.Sub onOpenChange={(open) => open && hentSaker()}>
      <ActionMenu.SubTrigger>Sist behandlede oppgaver</ActionMenu.SubTrigger>
      <ActionMenu.SubContent>
        <Detail>De siste oppgavene du har behandlet og tilhørende sak.</Detail>

        <ActionMenu.Divider />

        {laster && (
          <ActionMenu.Label>
            <Loader size="xsmall" /> Laster...
          </ActionMenu.Label>
        )}

        {!laster && !saker?.length && <ActionMenu.Label>Ingen saker</ActionMenu.Label>}

        {saker?.map((sak) => (
          <ActionMenu.Item key={`siste-sak-${sak.saksnummer}`} as="a" href={`/saksbehandling/sak/${sak.saksnummer}`}>
            <HStack gap="space-16" justify="space-between" width="100%">
              <BodyShort size="small">{sak.saksnummer}</BodyShort>
              <BodyShort size="small">
                {sak.avklaringsbehovKode && mapBehovskodeTilBehovstype(sak.avklaringsbehovKode as Behovstype)}
              </BodyShort>
            </HStack>
            <Spacer />
            <ExternalLinkIcon aria-hidden fontSize="1.5rem" />
          </ActionMenu.Item>
        ))}
      </ActionMenu.SubContent>
    </ActionMenu.Sub>
  );
};

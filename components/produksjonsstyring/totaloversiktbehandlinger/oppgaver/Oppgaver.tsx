import { Box, Heading, UNSAFE_Combobox, VStack } from '@navikt/ds-react';
import styles from 'components/produksjonsstyring/totaloversiktbehandlinger/TotaloversiktBehandlinger.module.css';
import { isSuccess } from 'lib/utils/api';
import { BehandlingerPerSteggruppe } from 'components/produksjonsstyring/behandlingerpersteggruppe/BehandlingerPerSteggruppe';
import { OppgaverInnUt } from 'components/produksjonsstyring/oppgaverinnut/OppgaverInnUt';
import useSWR from 'swr';
import { behandlingerPerSteggruppeClient } from 'lib/oppgaveClientApi';
import { useProduksjonsstyringFilter } from 'hooks/produksjonsstyring/ProduksjonsstyringFilterHook';
import { oppgaveAvklaringsbehov } from 'lib/utils/avklaringsbehov';
import { mapBehovskodeTilBehovstype } from 'lib/utils/oversettelser';
import { useMemo } from 'react';
import { statistikkQueryparams } from 'lib/utils/request';

interface Props {
  listeVisning: boolean;
}

export const Oppgaver = ({ listeVisning }: Props) => {
  const { setFilter, filter } = useProduksjonsstyringFilter();

  const behandlingstyperQuery = useMemo(
    () => statistikkQueryparams({ behandlingstyper: filter.behandlingstyper, oppgaveTyper: filter.oppgaveType }),
    [filter]
  );

  const oppgaveTyperQuery = useMemo(() => statistikkQueryparams({ oppgaveTyper: filter.oppgaveType }), [filter]);

  const behandlingerPerSteggruppe = useSWR(
    `/oppgave/api/statistikk/behandling-per-steggruppe?${behandlingstyperQuery}`,
    behandlingerPerSteggruppeClient
  ).data;

  const førstegangsBehandlingerPerSteggruppe = useSWR(
    `/oppgave/api/statistikk/behandling-per-steggruppe?behandlingstyper=Førstegangsbehandling&${oppgaveTyperQuery}`,
    behandlingerPerSteggruppeClient
  ).data;

  const klageBehandlingerPerSteggruppe = useSWR(
    `/oppgave/api/statistikk/behandling-per-steggruppe?behandlingstyper=Klage&${oppgaveTyperQuery}`,
    behandlingerPerSteggruppeClient
  ).data;

  const revurderingBehandlingerPerSteggruppe = useSWR(
    `/oppgave/api/statistikk/behandling-per-steggruppe?behandlingstyper=Revurdering&${oppgaveTyperQuery}`,
    behandlingerPerSteggruppeClient
  ).data;

  const onToggleSelected = (option: string, isSelected: boolean) => {
    if (isSelected) {
      setFilter({ ...filter, oppgaveType: [...filter.oppgaveType, option] });
    } else {
      setFilter({ ...filter, oppgaveType: filter.oppgaveType.filter((o) => o !== option) });
    }
  };

  return (
    <Box
      background={'bg-default'}
      borderColor={'border-subtle'}
      borderWidth={'1'}
      padding={'8'}
      borderRadius={'medium'}
    >
      <VStack gap={'4'}>
        <Heading size={'large'}>Oppgaver</Heading>

        <UNSAFE_Combobox
          label={'Type oppgave'}
          options={oppgaveAvklaringsbehov}
          size={'small'}
          isMultiSelect
          onToggleSelected={onToggleSelected}
          selectedOptions={filter.oppgaveType.map((option) => {
            return {
              label: mapBehovskodeTilBehovstype(option),
              value: option,
            };
          })}
        />

        {isSuccess(behandlingerPerSteggruppe) && (
          <BehandlingerPerSteggruppe
            data={behandlingerPerSteggruppe.data || []}
            title={'Stegfordeling behandling og revurdering'}
          />
        )}
        <div className={listeVisning ? styles.plotList : styles.plotGrid}>
          {isSuccess(førstegangsBehandlingerPerSteggruppe) &&
            filter.behandlingstyper.includes('Førstegangsbehandling') && (
              <BehandlingerPerSteggruppe
                data={førstegangsBehandlingerPerSteggruppe.data || []}
                title={'Stegfordeling førstegangsbehandling'}
              />
            )}
          {isSuccess(klageBehandlingerPerSteggruppe) && (
            <BehandlingerPerSteggruppe
              data={klageBehandlingerPerSteggruppe.data || []}
              title={'Stegfordeling klagebehandlinger'}
            />
          )}
          {isSuccess(revurderingBehandlingerPerSteggruppe) && (
            <BehandlingerPerSteggruppe
              data={revurderingBehandlingerPerSteggruppe.data || []}
              title={'Stegfordeling revurderingbehandlinger'}
            />
          )}
          <OppgaverInnUt behandlingstyperQuery={behandlingstyperQuery} />
        </div>
      </VStack>
    </Box>
  );
};

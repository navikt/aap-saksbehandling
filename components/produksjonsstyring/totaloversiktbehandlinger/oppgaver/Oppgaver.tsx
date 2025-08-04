import { Box, Heading, VStack } from '@navikt/ds-react';
import { oppgaveAvklaringsbehov } from 'lib/utils/avklaringsbehov';
import styles from 'components/produksjonsstyring/totaloversiktbehandlinger/TotaloversiktBehandlinger.module.css';
import { isSuccess } from 'lib/utils/api';
import { BehandlingerPerSteggruppe } from 'components/produksjonsstyring/behandlingerpersteggruppe/BehandlingerPerSteggruppe';
import { OppgaverInnUt } from 'components/produksjonsstyring/oppgaverinnut/OppgaverInnUt';
import useSWR from 'swr';
import { behandlingerPerSteggruppeClient } from 'lib/oppgaveClientApi';
import { useConfigForm } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';

interface Props {
  behandlingstyperQuery: string;
  listeVisning: boolean;
}

interface FormField {
  oppgaveType: string;
}

export const Oppgaver = ({ behandlingstyperQuery, listeVisning }: Props) => {
  const { form, formFields } = useConfigForm<FormField>({
    oppgaveType: {
      type: 'combobox_multiple',
      options: oppgaveAvklaringsbehov,
      label: 'Filtrer på oppgavetype',
    },
  });

  const behandlingerPerSteggruppe = useSWR(
    `/oppgave/api/statistikk/behandling-per-steggruppe?${behandlingstyperQuery}`,
    behandlingerPerSteggruppeClient
  ).data;

  const førstegangsBehandlingerPerSteggruppe = useSWR(
    `/oppgave/api/statistikk/behandling-per-steggruppe?behandlingstyper=Førstegangsbehandling`,
    behandlingerPerSteggruppeClient
  ).data;

  const klageBehandlingerPerSteggruppe = useSWR(
    `/oppgave/api/statistikk/behandling-per-steggruppe?behandlingstyper=Klage`,
    behandlingerPerSteggruppeClient
  ).data;

  const revurderingBehandlingerPerSteggruppe = useSWR(
    `/oppgave/api/statistikk/behandling-per-steggruppe?behandlingstyper=Revurdering`,
    behandlingerPerSteggruppeClient
  ).data;

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
        <FormField form={form} formField={formFields.oppgaveType} />

        <div className={listeVisning ? styles.plotList : styles.plotGrid}>
          {isSuccess(behandlingerPerSteggruppe) && (
            <BehandlingerPerSteggruppe
              data={behandlingerPerSteggruppe.data || []}
              title={'Stegfordeling behandling og revurdering'}
            />
          )}
          {isSuccess(førstegangsBehandlingerPerSteggruppe) && (
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

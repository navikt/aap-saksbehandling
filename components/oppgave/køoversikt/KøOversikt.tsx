'use client';

import { useContext, useEffect, useMemo, useState } from 'react';
import { Heading, HStack, VStack } from '@navikt/ds-react';
import useSWR from 'swr';
import { OppgaveTabell } from 'components/oppgave/oppgavetabell/OppgaveTabell';
import { KøSelect } from 'components/oppgave/køselect/KøSelect';
import { oppgaveBehandlingstyper } from 'lib/utils/behandlingstyper';
import { ComboboxOption } from '@navikt/ds-react/cjs/form/combobox/types';
import { Kø, OppgaveBehandlingstype } from 'lib/types/oppgaveTypes';
import { oppgaveAvklaringsbehov } from 'lib/utils/avklaringsbehov';
import { ValgteEnheterContext } from 'components/oppgave/valgteenheterprovider/ValgteEnheterProvider';
import { AvklaringsbehovKode } from 'lib/types/types';
import { ComboboxControlled } from '../comboboxcontrolled/ComboboxControlled';
import { oppgavesokClient } from 'lib/oppgaveClientApi';

interface Props {
  køer: Array<Kø>;
}
export const KøOversikt = ({ køer }: Props) => {
  const [aktivKøId, setAktivKøId] = useState<number>(køer[0]?.id ?? 0);
  const valgtKø = useMemo(() => køer.find((kø) => kø.id === aktivKøId), [køer, aktivKøId]);
  const behandlingstyperFraValgtKø = (valgtKø?.behandlingstyper || [])
    .map((val: string) => oppgaveBehandlingstyper.find((e) => e.value === val))
    .filter((e) => e !== undefined);
  const avklaringsbehovFraValgtKø = (valgtKø?.avklaringsbehovKoder || [])
    .map((val: string) => oppgaveAvklaringsbehov.find((e) => e.value === val))
    .filter((e) => e !== undefined);
  const [selectedBehandlingstyper, setSelectedBehandlingstyper] =
    useState<ComboboxOption[]>(behandlingstyperFraValgtKø);
  const [selectedAvklaringsbehov, setSelectedAvklaringsbehov] = useState<ComboboxOption[]>(avklaringsbehovFraValgtKø);
  const valgteEnheter = useContext(ValgteEnheterContext);
  function oppgavesokFetcher({
    args,
  }: {
    url: string;
    args: { behandlingstyper: ComboboxOption[]; avklaringsbehov: ComboboxOption[] };
  }) {
    return oppgavesokClient(
      args.avklaringsbehov.map((behov) => behov.value as AvklaringsbehovKode),
      args.behandlingstyper.map((type) => type.value as OppgaveBehandlingstype),
      valgteEnheter
    );
  }
  const oppgavesok = useSWR(
    {
      url: `api/oppgave/oppgavesok`,
      args: { behandlingstyper: selectedBehandlingstyper, avklaringsbehov: selectedAvklaringsbehov },
    },
    oppgavesokFetcher
  ).data;
  useEffect(() => {
    const behandlingstyperOptions = (valgtKø?.behandlingstyper || [])
      .map((behandlingstype: string) => oppgaveBehandlingstyper.find((e) => e.value === behandlingstype))
      .filter((e) => e !== undefined);
    const avklaringsbehovOptions = (valgtKø?.avklaringsbehovKoder || [])
      .map((avklaringsKode: string) => oppgaveAvklaringsbehov.find((e) => e.value === avklaringsKode))
      .filter((e) => e !== undefined);
    setSelectedBehandlingstyper(behandlingstyperOptions);
    setSelectedAvklaringsbehov(avklaringsbehovOptions);
  }, [valgtKø]);
  return (
    <VStack gap={'5'}>
      <Heading size={'large'} level={'1'}>
        Oppgavesøk
      </Heading>
      <HStack gap={'3'} wrap>
        <KøSelect label={'Velg kø'} køer={køer} valgtKøListener={setAktivKøId} />
        <ComboboxControlled
          label={'Behandlingstype'}
          options={oppgaveBehandlingstyper}
          selectedOptions={selectedBehandlingstyper}
          setSelectedOptions={setSelectedBehandlingstyper}
        />
        <ComboboxControlled
          label={'Avklaringsbehov'}
          options={oppgaveAvklaringsbehov}
          selectedOptions={selectedAvklaringsbehov}
          setSelectedOptions={setSelectedAvklaringsbehov}
        />
      </HStack>
      {oppgavesok?.type === 'success' && (
        <OppgaveTabell oppgaver={oppgavesok.data || []} heading={'Oppgaver'} showDropdownActions />
      )}
    </VStack>
  );
};

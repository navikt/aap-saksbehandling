'use client';

import { OppgaveTabell } from 'components/oppgave/oppgavetabell/OppgaveTabell';
import { oppgaveBehandlingstyper } from 'lib/utils/behandlingstyper';
import { Button, Heading, HStack, VStack } from '@navikt/ds-react';
import { useContext, useEffect, useMemo, useState } from 'react';
import { oppgaveAvklaringsbehov } from 'lib/utils/avklaringsbehov';
import useSWR from 'swr';
import { useSearchParams } from 'next/navigation';
import { ComboboxOption } from '@navikt/ds-react/cjs/form/combobox/types';
import { KøSelect } from 'components/oppgave/køselect/KøSelect';
import { Kø, OppgaveAvklaringsbehovKode, OppgaveBehandlingstype } from 'lib/types/oppgaveTypes';
import { ValgteEnheterContext } from 'components/oppgave/valgteenheterprovider/ValgteEnheterProvider';
import { oppgavesokClient } from 'lib/oppgaveClientApi';
import { ComboboxControlled } from 'components/oppgave/comboboxcontrolled/ComboboxControlled';

interface Props {
  køer: Array<Kø>;
}
export const OppgaveAdministrasjon = ({ køer }: Props) => {
  const [aktivKøId, setAktivKøId] = useState<number>(køer[0]?.id ?? 0);
  const valgtKø = useMemo(() => køer.find((kø) => kø.id === aktivKøId), [køer, aktivKøId]);
  const searchParams = useSearchParams();
  const behandlingstyperFraUrl = searchParams
    .getAll('behandlingstype')
    .map((val: string) => oppgaveBehandlingstyper.find((e) => e.value === val))
    .filter((e) => e !== undefined);
  const avklaringsbehovFraUrl = searchParams
    .getAll('avklaringsbehov')
    .map((val: string) => oppgaveAvklaringsbehov.find((e) => e.value === val))
    .filter((e) => e !== undefined);
  const [selectedBehandlingstyper, setSelectedBehandlingstyper] = useState<ComboboxOption[]>(behandlingstyperFraUrl);
  const [selectedAvklaringsbehov, setSelectedAvklaringsbehov] = useState<ComboboxOption[]>(avklaringsbehovFraUrl);
  const valgteEnheter = useContext(ValgteEnheterContext);

  function oppgavesokFetcher({
    args,
  }: {
    url: string;
    args: { behandlingstyper: ComboboxOption[]; avklaringsbehov: ComboboxOption[] };
  }) {
    return oppgavesokClient(
      args.avklaringsbehov.map((behov) => behov.value as OppgaveAvklaringsbehovKode),
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
  const isValgtKøEndret = useMemo(() => {
    const behandlingstyperFraKø = valgtKø?.behandlingstyper || [];
    const avklaringsbehovkoderFraKø = valgtKø?.avklaringsbehovKoder || [];
    const behandlingstyperMatch =
      behandlingstyperFraKø.length === selectedBehandlingstyper.length &&
      behandlingstyperFraKø.every((behandlingstype) =>
        selectedBehandlingstyper.find((e) => e.value === behandlingstype)
      );
    const avklaringsbehovMatch =
      avklaringsbehovkoderFraKø.length === selectedAvklaringsbehov.length &&
      avklaringsbehovkoderFraKø.every((avklaringskode) =>
        selectedAvklaringsbehov.find((e) => e.value === avklaringskode)
      );
    return !behandlingstyperMatch || !avklaringsbehovMatch;
  }, [valgtKø, selectedBehandlingstyper, selectedAvklaringsbehov]);

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
      <HStack gap={'5'}>
        {isValgtKøEndret && <Button size={'small'}>Lagre endringer i kø</Button>}
        <Button size={'small'}>Lagre som ny kø</Button>
      </HStack>
      {oppgavesok?.type === 'success' && (
        <OppgaveTabell
          oppgaver={oppgavesok.data || []}
          heading={'Oppgaver'}
          includeColumns={['reservertAv']}
          showDropdownActions
        />
      )}
    </VStack>
  );
};

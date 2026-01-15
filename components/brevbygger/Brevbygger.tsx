'use client';

import { Alert, Box, Button, HGrid } from '@navikt/ds-react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { Delmal } from 'components/brevbygger/Delmal';
import {
  delmalErObligatorisk,
  delmalSkalVises,
  erValgtIdFritekst,
  finnParentIdForValgtAlternativ,
  mapDelmalerFraSanity,
} from 'components/brevbygger/brevmalMapping';
import { BrevmalType } from 'components/brevbygger/brevmodellTypes';
import { BrevdataDto, BrevMottaker, FritekstDto, Mottaker } from 'lib/types/types';
import { ForhåndsvisBrev } from 'components/brevbygger/ForhåndsvisBrev';
import { clientKanDistribuereBrev, clientOppdaterBrevdata, clientOppdaterBrevmal } from 'lib/clientApi';
import { useRouter } from 'next/navigation';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { Behovstype } from 'lib/utils/form';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { useCallback, useEffect, useState } from 'react';
import { isSuccess } from 'lib/utils/api';
import { revalidateFlyt } from 'lib/actions/actions';
import { VelgeMottakere } from 'components/brevbygger/VelgeMottakere';
import { IkkeSendBrevModal } from 'components/behandlinger/brev/skriveBrev/IkkeSendBrevModal';
import { Brevbyggermeny } from 'components/brevbygger/Brevbyggermeny';
import { useDebounce } from 'hooks/DebounceHook';

export interface AlternativFormField {
  verdi: string;
}

export interface ValgFormField {
  noekkel: string;
  alternativer: AlternativFormField[];
  valgtAlternativ: string;
  fritekst?: string;
}

export interface DelmalFormField {
  noekkel: string;
  valgt: boolean;
  valg?: ValgFormField[];
}

export interface BrevdataFormFields {
  delmaler: DelmalFormField[];
}

interface BrevbyggerProps {
  referanse: string;
  behovstype: Behovstype;
  mottaker: BrevMottaker;
  behandlingVersjon: number;
  readOnly: boolean;
  visAvbryt?: boolean;
  fullmektigMottaker?: Mottaker;
  brukerMottaker?: Mottaker;
  brevmal?: string | null;
  brevdata?: BrevdataDto;
}

const hentDokument = async (
  brevbestillingReferanse: string,
  setDataUri: (uri: string | undefined) => void,
  setIsLoading: (status: boolean) => void
) => {
  let objectURL: string | undefined;
  const blob = await fetch(`/saksbehandling/api/brev/${brevbestillingReferanse}/forhandsvis/`, {
    method: 'GET',
  }).then((res) => res.blob());

  objectURL = URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
  setDataUri(objectURL);

  setIsLoading(false);
};

export const Brevbygger = ({
  referanse,
  brevmal,
  brevdata,
  behovstype,
  mottaker,
  fullmektigMottaker,
  brukerMottaker,
  behandlingVersjon,
  readOnly,
  visAvbryt = true,
}: BrevbyggerProps) => {
  const parsedBrevmal: BrevmalType = JSON.parse(brevmal || '');
  const { control, handleSubmit, watch } = useForm<BrevdataFormFields>({
    values: {
      delmaler: mapDelmalerFraSanity(parsedBrevmal.delmaler, brevdata),
    },
  });

  const router = useRouter();
  const [valgteMottakere, setMottakere] = useState<Mottaker[]>([]);
  const [visKanIkkeDistribuereAdvarsel, setVisKanIkkeDistribuereAdvarsel] = useState(false);
  const [ikkeSendBrevModalOpen, settIkkeSendBrevModalOpen] = useState(false);
  const behandlingsReferanse = useBehandlingsReferanse();
  const { fields } = useFieldArray({ control, name: 'delmaler' });
  const { løsBehovOgGåTilNesteSteg, isLoading } = useLøsBehovOgGåTilNesteSteg('BREV');

  const [dataUri, setDataUri] = useState<string>();
  const [pdfIsLoading, setPdfIsLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (dataUri) {
        URL.revokeObjectURL(dataUri);
      }
    };
  });

  const kanDistribuereBrevRequest = useCallback(async () => {
    const brukerIdent = brukerMottaker?.ident;

    if (brukerIdent) {
      const valgteMottakereIdentListe = valgteMottakere
        .map((mottaker) => mottaker.ident)
        .filter((ident) => typeof ident === 'string');
      const mottakerIdentListe = valgteMottakereIdentListe.length > 0 ? valgteMottakereIdentListe : [brukerIdent];
      const response = await clientKanDistribuereBrev(referanse, {
        brukerIdent,
        mottakerIdentListe,
      });

      if (isSuccess(response)) {
        const kanDistribuereTilAlleMottakere = !response.data.mottakereDistStatus.some(
          (distStatus: { mottakerIdent: String; kanDistribuere: boolean }) => !distStatus.kanDistribuere
        );
        setVisKanIkkeDistribuereAdvarsel(!kanDistribuereTilAlleMottakere);
      }
    }
  }, [brukerMottaker?.ident, referanse, valgteMottakere]);

  useEffect(() => {
    kanDistribuereBrevRequest();
  }, [kanDistribuereBrevRequest]);

  const onSubmit = async (formData: BrevdataFormFields) => {
    const obligatoriskeDelmaler = formData.delmaler
      .filter((delmal) => delmalErObligatorisk(delmal.noekkel, parsedBrevmal))
      .map((delmal) => ({
        id: delmal.noekkel,
      }));

    const valgteDelmaler = formData.delmaler.filter((delmal) => delmal.valgt).map((delmal) => ({ id: delmal.noekkel }));
    const valgteValg = formData.delmaler
      .flatMap((delmal) => delmal.valg?.filter((v) => v.valgtAlternativ !== ''))
      .filter((v) => !!v)
      .map((valg) => ({
        id: finnParentIdForValgtAlternativ(valg.valgtAlternativ, parsedBrevmal),
        key: valg.valgtAlternativ,
      }));

    const fritekst: FritekstDto[] = formData.delmaler
      .filter((delmal) => delmal.valgt)
      .flatMap((delmal) => {
        const fritekstValg = delmal.valg
          ?.filter((alternativ) => alternativ.valgtAlternativ !== '')
          .filter((alternativ) => erValgtIdFritekst(alternativ.valgtAlternativ, parsedBrevmal));

        if (fritekstValg) {
          return fritekstValg.map((fritekst) => ({
            fritekst: JSON.stringify({ tekst: fritekst.fritekst || '' }),
            key: fritekst.valgtAlternativ,
            parentId: finnParentIdForValgtAlternativ(fritekst.valgtAlternativ, parsedBrevmal),
          }));
        }
      })
      .filter((v) => !!v);

    return await clientOppdaterBrevdata(referanse, {
      delmaler: [...obligatoriskeDelmaler, ...valgteDelmaler],
      valg: valgteValg,
      betingetTekst: brevdata?.betingetTekst || [],
      faktagrunnlag: brevdata?.faktagrunnlag || [],
      fritekster: fritekst,
      periodetekster: brevdata?.periodetekster || [],
    });
  };

  const formValues = useWatch({ control });
  const debouncedFormData = useDebounce(formValues);

  useEffect(() => {
    const oppdaterBrevdataOgForhåndsvisning = async () => {
      const res = await onSubmit(debouncedFormData as BrevdataFormFields);
      if (isSuccess(res)) {
        await hentDokument(referanse, setDataUri, setPdfIsLoading);
      }
    };
    oppdaterBrevdataOgForhåndsvisning();
  }, [debouncedFormData]);

  const oppdaterBrevmal = async () => {
    await clientOppdaterBrevmal(referanse);
    router.refresh();
  };

  const sendBrev = async () => {
    løsBehovOgGåTilNesteSteg({
      behandlingVersjon: behandlingVersjon,
      behov: {
        behovstype: behovstype,
        brevbestillingReferanse: referanse,
        mottakere: valgteMottakere,
        handling: 'FERDIGSTILL',
      },
      referanse: behandlingsReferanse,
    });
  };

  const slettBrev = async () => {
    løsBehovOgGåTilNesteSteg({
      behandlingVersjon: behandlingVersjon,
      behov: {
        behovstype: behovstype,
        brevbestillingReferanse: referanse,
        handling: 'AVBRYT',
      },
      referanse: behandlingsReferanse,
    });
    await revalidateFlyt(behandlingsReferanse);
  };

  return (
    <HGrid columns={2} gap={'2'} minWidth={'1280px'}>
      <Box>
        <Brevbyggermeny
          visAvbryt={visAvbryt}
          oppdaterBrevmal={oppdaterBrevmal}
          settIkkeSendBrevModalOpen={settIkkeSendBrevModalOpen}
        />
        {fullmektigMottaker && brukerMottaker && (
          <VelgeMottakere
            setMottakere={setMottakere}
            readOnly={readOnly}
            brukerNavn={mottaker.navn}
            bruker={brukerMottaker}
            fullmektig={fullmektigMottaker}
          />
        )}
        {visKanIkkeDistribuereAdvarsel && (
          <Alert variant={'warning'} size={'small'} className={'fit-content'}>
            Brevet kan ikke distribueres til alle mottakere. Se rutinebeskrivelse for manuell håndtering.
          </Alert>
        )}
        <form
          onSubmit={handleSubmit((data) => {
            onSubmit(data);
          })}
        >
          {fields
            .filter((feltet) => delmalSkalVises(feltet.noekkel, parsedBrevmal))
            .map((feltet, index) => (
              <Delmal
                delmalFelt={feltet}
                index={index}
                control={control}
                key={feltet.id}
                watch={watch}
                brevmal={parsedBrevmal}
              />
            ))}
        </form>
        <Button type="button" onClick={() => sendBrev()} loading={isLoading}>
          Send brev
        </Button>
      </Box>
      <ForhåndsvisBrev isLoading={pdfIsLoading} dataUri={dataUri} />

      <IkkeSendBrevModal
        isOpen={ikkeSendBrevModalOpen}
        onClose={() => {
          settIkkeSendBrevModalOpen(false);
        }}
        onDelete={() => {
          slettBrev();
        }}
      />
    </HGrid>
  );
};

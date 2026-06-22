'use client';

import { Button, Modal, Select, Textarea, VStack } from '@navikt/ds-react';
import { useForm } from 'react-hook-form';
import {
  Gjenopptak,
  GjenopptakKravLøsning,
  KlageKravLøsning,
  KravVurdering,
  KravVurderingLøsning,
  NyttKrav,
  NyttKravLøsning,
  TilleggsopplysningKravLøsning,
  TrukketSøknadKravLøsning,
} from 'lib/types/types';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { formaterDatoForFrontend, formaterDatoForBackend, parseDatoFraDatePicker } from 'lib/utils/date';
import {
  finnOverstyrMuligRettFraFraLøsning,
  finnSøknadsdatoFraLøsning,
  formaterKravtype,
} from 'components/behandlinger/krav/kravutils';

type KomplekstKravFormFields = {
  begrunnelse: string;
  søknadsdatoDato: string;
  søknadsdatoÅrsak: string;
  overstyrDato: string;
  overstyrÅrsak: string;
};

type EnkeltKravFormFields = {
  begrunnelse: string;
};

interface Props {
  krav: KravVurdering;
  erVedtatt: boolean;
  initialLøsning?: KravVurderingLøsning;
  onLagre: (løsning: KravVurderingLøsning) => void;
  onTilbakestill?: () => void;
  onAvbryt: () => void;
}

export const KravVurderingModal = ({ krav, erVedtatt, initialLøsning, onLagre, onTilbakestill, onAvbryt }: Props) => {
  const erKompleksType = krav.type === 'NYTT_KRAV_AAP' || krav.type === 'GJENOPPTAK';

  return (
    <Modal
      open
      header={{ heading: `${erVedtatt ? 'Endre' : 'Rediger'} ${formaterKravtype(krav.type)}` }}
      onClose={onAvbryt}
      width="medium"
    >
      {erKompleksType ? (
        <KomplekstKravSkjema krav={krav} erVedtatt={erVedtatt} initialLøsning={initialLøsning} onLagre={onLagre} onTilbakestill={onTilbakestill} onAvbryt={onAvbryt} />
      ) : (
        <EnkeltKravSkjema krav={krav} erVedtatt={erVedtatt} initialLøsning={initialLøsning} onLagre={onLagre} onTilbakestill={onTilbakestill} onAvbryt={onAvbryt} />
      )}
    </Modal>
  );
};

const KomplekstKravSkjema = ({ krav, erVedtatt, initialLøsning, onLagre, onTilbakestill, onAvbryt }: Props) => {
  const søknadsdato = initialLøsning
    ? finnSøknadsdatoFraLøsning(initialLøsning)
    : krav.type === 'NYTT_KRAV_AAP'
      ? (krav as NyttKrav).søknadsdato
      : (krav as Gjenopptak).søknadsdato;

  const overstyr = initialLøsning
    ? finnOverstyrMuligRettFraFraLøsning(initialLøsning)
    : krav.type === 'NYTT_KRAV_AAP'
      ? (krav as NyttKrav).overstyrMuligRettFra
      : (krav as Gjenopptak).overstyrMuligRettFra;

  const begrunnelse = initialLøsning?.begrunnelse ?? krav.begrunnelse;

  const { register, control, handleSubmit, formState: { errors } } = useForm<KomplekstKravFormFields>({
    defaultValues: {
      begrunnelse,
      søknadsdatoDato: søknadsdato ? formaterDatoForFrontend(søknadsdato.dato) : '',
      søknadsdatoÅrsak: søknadsdato?.årsak ?? '',
      overstyrDato: overstyr ? formaterDatoForFrontend(overstyr.dato) : '',
      overstyrÅrsak: overstyr?.årsak ?? '',
    },
  });

  const onSubmit = handleSubmit((data) => {
    const søknadsdatoDatoParsed = parseDatoFraDatePicker(data.søknadsdatoDato);
    const overstyrDatoParsed = data.overstyrDato ? parseDatoFraDatePicker(data.overstyrDato) : undefined;

    if (!søknadsdatoDatoParsed) return;

    const nySøknadsdato = {
      dato: formaterDatoForBackend(søknadsdatoDatoParsed),
      årsak: data.søknadsdatoÅrsak as 'BrukerHarSøktTidligere' | 'FeilregistrertSøknadsdato' | 'SøknadMottatt',
    };

    const nyOverstyr =
      overstyrDatoParsed && data.overstyrÅrsak
        ? {
            dato: formaterDatoForBackend(overstyrDatoParsed),
            årsak: data.overstyrÅrsak as 'IkkeIStandTilÅSøkeTidligere' | 'MisvisendeOpplysninger',
          }
        : undefined;

    const referanse = erVedtatt ? krav.referanse : undefined;

    let løsning: KravVurderingLøsning;
    if (krav.type === 'NYTT_KRAV_AAP') {
      løsning = {
        kravType: 'NYTT_KRAV_AAP',
        journalpostId: krav.journalpostId,
        begrunnelse: data.begrunnelse,
        søknadsdato: nySøknadsdato,
        overstyrMuligRettFra: nyOverstyr,
        referanse,
      } satisfies NyttKravLøsning;
    } else {
      løsning = {
        kravType: 'GJENOPPTAK',
        journalpostId: krav.journalpostId,
        begrunnelse: data.begrunnelse,
        søknadsdato: nySøknadsdato,
        muligRettFra: nyOverstyr,
        referanse,
      } satisfies GjenopptakKravLøsning;
    }

    onLagre(løsning);
  });

  return (
    <form id="krav-vurdering-skjema" onSubmit={onSubmit} autoComplete="off">
      <Modal.Body>
        <VStack gap="space-16">
          <DateInputWrapper
            name="søknadsdatoDato"
            control={control}
            label="Søknadsdato"
            rules={{ required: 'Du må fylle inn søknadsdato.' }}
          />
          <Select
            label="Årsak for søknadsdato"
            {...register('søknadsdatoÅrsak', { required: 'Du må velge årsak for søknadsdato.' })}
            error={errors.søknadsdatoÅrsak?.message}
            size="small"
          >
            <option value="">Velg årsak</option>
            <option value="SøknadMottatt">Søknad mottatt</option>
            <option value="BrukerHarSøktTidligere">Bruker har søkt tidligere</option>
            <option value="FeilregistrertSøknadsdato">Feilregistrert søknadsdato</option>
          </Select>
          <DateInputWrapper
            name="overstyrDato"
            control={control}
            label="Overstyr mulig rett fra (valgfri)"
          />
          <Select
            label="Årsak for overstyring (valgfri)"
            {...register('overstyrÅrsak')}
            size="small"
          >
            <option value="">Ingen overstyring</option>
            <option value="IkkeIStandTilÅSøkeTidligere">Ikke i stand til å søke tidligere</option>
            <option value="MisvisendeOpplysninger">Misvisende opplysninger</option>
          </Select>
          <Textarea
            label="Begrunnelse"
            {...register('begrunnelse', { required: 'Du må skrive inn en begrunnelse.' })}
            error={errors.begrunnelse?.message}
            size="small"
          />
        </VStack>
      </Modal.Body>
      <Modal.Footer>
        <Button type="submit" variant="primary" form="krav-vurdering-skjema" className="fit-content">
          Lagre
        </Button>
        <Button type="button" variant="secondary" className="fit-content" onClick={onAvbryt}>
          Avbryt
        </Button>
        {initialLøsning && onTilbakestill && (
          <Button type="button" variant="tertiary" className="fit-content" onClick={onTilbakestill}>
            Tilbakestill
          </Button>
        )}
      </Modal.Footer>
    </form>
  );
};

const EnkeltKravSkjema = ({ krav, erVedtatt, initialLøsning, onLagre, onTilbakestill, onAvbryt }: Props) => {
  const { register, handleSubmit, formState: { errors } } = useForm<EnkeltKravFormFields>({
    defaultValues: { begrunnelse: initialLøsning?.begrunnelse ?? krav.begrunnelse },
  });

  const onSubmit = handleSubmit((data) => {
    const referanse = erVedtatt ? krav.referanse : undefined;

    let løsning: KravVurderingLøsning;
    switch (krav.type) {
      case 'KLAGE':
        løsning = { kravType: 'KLAGE', journalpostId: krav.journalpostId, begrunnelse: data.begrunnelse, referanse } satisfies KlageKravLøsning;
        break;
      case 'TILLEGGSOPPLYSNING':
        løsning = { kravType: 'TILLEGGSOPPLYSNING', journalpostId: krav.journalpostId, begrunnelse: data.begrunnelse, referanse } satisfies TilleggsopplysningKravLøsning;
        break;
      case 'TRUKKET_SØKNAD':
        løsning = { kravType: 'TRUKKET_SØKNAD', journalpostId: krav.journalpostId, begrunnelse: data.begrunnelse, referanse } satisfies TrukketSøknadKravLøsning;
        break;
      default:
        return;
    }

    onLagre(løsning);
  });

  return (
    <form id="krav-vurdering-skjema" onSubmit={onSubmit} autoComplete="off">
      <Modal.Body>
        <Textarea
          label="Begrunnelse"
          {...register('begrunnelse', { required: 'Du må skrive inn en begrunnelse.' })}
          error={errors.begrunnelse?.message}
          size="small"
        />
      </Modal.Body>
      <Modal.Footer>
        <Button type="submit" variant="primary" form="krav-vurdering-skjema" className="fit-content">
          Lagre
        </Button>
        <Button type="button" variant="secondary" className="fit-content" onClick={onAvbryt}>
          Avbryt
        </Button>
        {initialLøsning && onTilbakestill && (
          <Button type="button" variant="tertiary" className="fit-content" onClick={onTilbakestill}>
            Tilbakestill
          </Button>
        )}
      </Modal.Footer>
    </form>
  );
};

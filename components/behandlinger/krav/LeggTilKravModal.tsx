'use client';

import { useEffect } from 'react';
import { Button, Modal, Select, Textarea, TextField, VStack } from '@navikt/ds-react';
import { useForm, useWatch } from 'react-hook-form';
import {
  KlageKravLøsning,
  KravVurderingLøsning,
  RelevantKravLøsning,
  SøknadUtenKrav,
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
import { KravType } from 'components/opprettsak/OpprettSakLocal';

type LeggTilKravFormFields = {
  kravtype: KravType;
  journalpostId: string;
  begrunnelse: string;
  søknadsdatoDato: string;
  søknadsdatoÅrsak: string;
  overstyrDato: string;
  overstyrÅrsak: string;
};

const ALLE_KRAVTYPER: KravType[] = ['RELEVANT_KRAV', 'TILLEGGSOPPLYSNING', 'KLAGE', 'TRUKKET_SØKNAD'];

const KOMPLEKSE_TYPER: KravType[] = ['RELEVANT_KRAV'];

interface Props {
  søknaderUtenKravvurdering: SøknadUtenKrav[];
  initialLøsning?: KravVurderingLøsning;
  onLagre: (løsning: KravVurderingLøsning) => void;
  onAvbryt: () => void;
}

export const LeggTilKravModal = ({ søknaderUtenKravvurdering, initialLøsning, onLagre, onAvbryt }: Props) => {
  const erRedigering = initialLøsning !== undefined;
  const eksisterendeSøknadsdato = initialLøsning ? finnSøknadsdatoFraLøsning(initialLøsning) : null;
  const eksisterendeOverstyr = initialLøsning ? finnOverstyrMuligRettFraFraLøsning(initialLøsning) : null;

  const {
    register,
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<LeggTilKravFormFields>({
    shouldUnregister: true,
    defaultValues: {
      kravtype: (initialLøsning?.kravType as KravType) ?? 'RELEVANT_KRAV',
      journalpostId: initialLøsning?.journalpostId.identifikator ?? '',
      begrunnelse: initialLøsning?.begrunnelse ?? '',
      søknadsdatoDato: eksisterendeSøknadsdato ? formaterDatoForFrontend(eksisterendeSøknadsdato.dato) : '',
      søknadsdatoÅrsak: eksisterendeSøknadsdato?.årsak ?? '',
      overstyrDato: eksisterendeOverstyr ? formaterDatoForFrontend(eksisterendeOverstyr.dato) : '',
      overstyrÅrsak: eksisterendeOverstyr?.årsak ?? '',
    },
  });

  const journalpostOptions = søknaderUtenKravvurdering.map((s) => s.journalpostId.identifikator);

  const valgtType = useWatch({ control, name: 'kravtype' }) as KravType;
  const valgtJournalpostId = useWatch({ control, name: 'journalpostId' });
  const erKompleksType = KOMPLEKSE_TYPER.includes(valgtType);

  useEffect(() => {
    if (valgtType !== 'RELEVANT_KRAV') return;
    if (!valgtJournalpostId) return;

    const søknad = søknaderUtenKravvurdering.find((s) => s.journalpostId.identifikator === valgtJournalpostId);
    if (!søknad) return;

    if (getValues('søknadsdatoDato')) return;

    setValue('søknadsdatoDato', formaterDatoForFrontend(søknad.mottattTidspunkt));
    setValue('søknadsdatoÅrsak', 'SøknadMottatt');
  }, [valgtJournalpostId]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = handleSubmit((data) => {
    const journalpostId = { identifikator: data.journalpostId };

    if (erKompleksType) {
      const søknadsdatoParsed = parseDatoFraDatePicker(data.søknadsdatoDato);
      if (!søknadsdatoParsed) return;

      const søknadsdato = {
        dato: formaterDatoForBackend(søknadsdatoParsed),
        årsak: data.søknadsdatoÅrsak as 'BrukerHarSøktTidligere' | 'FeilregistrertSøknadsdato' | 'SøknadMottatt',
      };
      const overstyrParsed = data.overstyrDato ? parseDatoFraDatePicker(data.overstyrDato) : undefined;
      const overstyrMuligRettFra =
        overstyrParsed && data.overstyrÅrsak
          ? {
              dato: formaterDatoForBackend(overstyrParsed),
              årsak: data.overstyrÅrsak as 'IkkeIStandTilÅSøkeTidligere' | 'MisvisendeOpplysninger',
            }
          : undefined;

      if (data.kravtype === 'RELEVANT_KRAV') {
        onLagre({
          kravType: 'RELEVANT_KRAV',
          journalpostId,
          begrunnelse: data.begrunnelse,
          søknadsdato,
          overstyrMuligRettFra,
          referanse: undefined,
        } satisfies RelevantKravLøsning);
      }
    } else {
      switch (data.kravtype) {
        case 'TILLEGGSOPPLYSNING':
          onLagre({
            kravType: 'TILLEGGSOPPLYSNING',
            journalpostId,
            begrunnelse: data.begrunnelse,
            referanse: undefined,
          } satisfies TilleggsopplysningKravLøsning);
          break;
        case 'KLAGE':
          onLagre({
            kravType: 'KLAGE',
            journalpostId,
            begrunnelse: data.begrunnelse,
            referanse: undefined,
          } satisfies KlageKravLøsning);
          break;
        case 'TRUKKET_SØKNAD':
          onLagre({
            kravType: 'TRUKKET_SØKNAD',
            journalpostId,
            begrunnelse: data.begrunnelse,
            referanse: undefined,
          } satisfies TrukketSøknadKravLøsning);
          break;
      }
    }
  });

  return (
    <Modal
      open
      header={{ heading: erRedigering ? 'Rediger vurdering' : 'Legg til ny vurdering' }}
      onClose={onAvbryt}
      width="medium"
    >
      <form id="legg-til-krav-skjema" onSubmit={onSubmit} autoComplete="off">
        <Modal.Body>
          <VStack gap="space-16">
            <Select
              label="Kravtype"
              {...register('kravtype', { required: 'Du må velge kravtype.' })}
              error={errors.kravtype?.message}
              size="small"
              disabled={erRedigering}
            >
              {ALLE_KRAVTYPER.map((type) => (
                <option key={type} value={type}>
                  {formaterKravtype(type)}
                </option>
              ))}
            </Select>

            {journalpostOptions.length > 0 && (
              <datalist id="journalpost-options">
                {journalpostOptions.map((id) => (
                  <option key={id} value={id} />
                ))}
              </datalist>
            )}
            <TextField
              label="Journalpost-id"
              list={journalpostOptions.length > 0 ? 'journalpost-options' : undefined}
              {...register('journalpostId', { required: 'Du må skrive inn journalpost-id.' })}
              error={errors.journalpostId?.message}
              size="small"
              disabled={erRedigering}
            />

            {erKompleksType && (
              <>
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
                <DateInputWrapper name="overstyrDato" control={control} label="Overstyr mulig rett fra (valgfri)" />
                <Select label="Årsak for overstyring (valgfri)" {...register('overstyrÅrsak')} size="small">
                  <option value="">Ingen overstyring</option>
                  <option value="IkkeIStandTilÅSøkeTidligere">Ikke i stand til å søke tidligere</option>
                  <option value="MisvisendeOpplysninger">Misvisende opplysninger</option>
                </Select>
              </>
            )}

            <Textarea
              label="Begrunnelse"
              {...register('begrunnelse', { required: 'Du må skrive inn en begrunnelse.' })}
              error={errors.begrunnelse?.message}
              size="small"
            />
          </VStack>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" variant="primary" form="legg-til-krav-skjema" className="fit-content">
            Lagre
          </Button>
          <Button type="button" variant="secondary" className="fit-content" onClick={onAvbryt}>
            Avbryt
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

'use client';

import { Button, Modal, Select, Textarea, VStack } from '@navikt/ds-react';
import { useForm, useWatch } from 'react-hook-form';
import {
  GjenopptakKravLøsning,
  KlageKravLøsning,
  KravVurderingLøsning,
  NyttKravLøsning,
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

const ALLE_KRAVTYPER: KravType[] = ['NYTT_KRAV_AAP', 'GJENOPPTAK', 'TILLEGGSOPPLYSNING', 'KLAGE', 'TRUKKET_SØKNAD'];

const KOMPLEKSE_TYPER: KravType[] = ['NYTT_KRAV_AAP', 'GJENOPPTAK'];

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
    formState: { errors },
  } = useForm<LeggTilKravFormFields>({
    shouldUnregister: true,
    defaultValues: {
      kravtype: (initialLøsning?.kravType as KravType) ?? 'NYTT_KRAV_AAP',
      journalpostId: initialLøsning?.journalpostId.identifikator ?? '',
      begrunnelse: initialLøsning?.begrunnelse ?? '',
      søknadsdatoDato: eksisterendeSøknadsdato ? formaterDatoForFrontend(eksisterendeSøknadsdato.dato) : '',
      søknadsdatoÅrsak: eksisterendeSøknadsdato?.årsak ?? '',
      overstyrDato: eksisterendeOverstyr ? formaterDatoForFrontend(eksisterendeOverstyr.dato) : '',
      overstyrÅrsak: eksisterendeOverstyr?.årsak ?? '',
    },
  });

  const valgtType = useWatch({ control, name: 'kravtype' }) as KravType;
  const erKompleksType = KOMPLEKSE_TYPER.includes(valgtType);

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

      if (data.kravtype === 'NYTT_KRAV_AAP') {
        onLagre({
          kravType: 'NYTT_KRAV_AAP',
          journalpostId,
          begrunnelse: data.begrunnelse,
          søknadsdato,
          overstyrMuligRettFra,
          referanse: undefined,
        } satisfies NyttKravLøsning);
      } else {
        onLagre({
          kravType: 'GJENOPPTAK',
          journalpostId,
          begrunnelse: data.begrunnelse,
          søknadsdato,
          muligRettFra: overstyrMuligRettFra,
          referanse: undefined,
        } satisfies GjenopptakKravLøsning);
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

            {søknaderUtenKravvurdering.length > 0 && !erRedigering ? (
              <Select
                label="Journalpost"
                {...register('journalpostId', { required: 'Du må velge journalpost.' })}
                error={errors.journalpostId?.message}
                size="small"
              >
                <option value="">Velg journalpost</option>
                {søknaderUtenKravvurdering.map((s) => (
                  <option key={s.journalpostId.identifikator} value={s.journalpostId.identifikator}>
                    {s.journalpostId.identifikator}
                  </option>
                ))}
              </Select>
            ) : (
              <Select
                label="Journalpost"
                {...register('journalpostId', { required: 'Du må fylle inn journalpost-id.' })}
                error={errors.journalpostId?.message}
                size="small"
                disabled={erRedigering}
              >
                {erRedigering && (
                  <option value={initialLøsning?.journalpostId.identifikator}>
                    {initialLøsning?.journalpostId.identifikator}
                  </option>
                )}
                {!erRedigering && <option value="">Ingen søknader uten vurdering</option>}
              </Select>
            )}

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

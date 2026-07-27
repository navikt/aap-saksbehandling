'use client';

import { Button, Modal, Select, Textarea, VStack } from '@navikt/ds-react';
import { useForm, useWatch } from 'react-hook-form';
import {
  KlageKravLøsning,
  KravVurdering,
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

const ALLE_KRAVTYPER: KravType[] = ['RELEVANT_KRAV', 'TILLEGGSOPPLYSNING', 'KLAGE', 'TRUKKET_SØKNAD'];

const KRAV_MED_DATO: KravType[] = ['RELEVANT_KRAV'];

type KravVurderingFormFields = {
  kravtype: KravType;
  journalpostId: string;
  begrunnelse: string;
  søknadsdatoDato: string;
  søknadsdatoÅrsak: string;
  overstyrDato: string;
  overstyrÅrsak: string;
};

interface Props {
  krav: KravVurdering;
  erVedtatt: boolean;
  initialLøsning?: KravVurderingLøsning;
  søknaderUtenKravvurdering?: SøknadUtenKrav[];
  onLagre: (løsning: KravVurderingLøsning) => void;
  onTilbakestill?: () => void;
  onAvbryt: () => void;
}

export const KravVurderingModal = ({
  krav,
  erVedtatt,
  initialLøsning,
  søknaderUtenKravvurdering,
  onLagre,
  onTilbakestill,
  onAvbryt,
}: Props) => {
  const initialKravtype = (initialLøsning?.kravType as KravType | undefined) ?? krav.type;
  const eksisterendeSøknadsdato = initialLøsning ? finnSøknadsdatoFraLøsning(initialLøsning) : null;
  const eksisterendeOverstyr = initialLøsning ? finnOverstyrMuligRettFraFraLøsning(initialLøsning) : null;

  const gjeldendJournalpostId = initialLøsning?.journalpostId.identifikator ?? krav.journalpostId.identifikator;

  const journalpostOptions: { id: string }[] = erVedtatt
    ? []
    : [
        { id: krav.journalpostId.identifikator },
        ...(søknaderUtenKravvurdering ?? [])
          .map((s) => ({ id: s.journalpostId.identifikator }))
          .filter((s) => s.id !== krav.journalpostId.identifikator),
      ];

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<KravVurderingFormFields>({
    shouldUnregister: true,
    defaultValues: {
      kravtype: initialKravtype,
      journalpostId: gjeldendJournalpostId,
      begrunnelse: initialLøsning?.begrunnelse ?? krav.begrunnelse,
      søknadsdatoDato: eksisterendeSøknadsdato ? formaterDatoForFrontend(eksisterendeSøknadsdato.dato) : '',
      søknadsdatoÅrsak: eksisterendeSøknadsdato?.årsak ?? '',
      overstyrDato: eksisterendeOverstyr ? formaterDatoForFrontend(eksisterendeOverstyr.dato) : '',
      overstyrÅrsak: eksisterendeOverstyr?.årsak ?? '',
    },
  });

  const valgtType = useWatch({ control, name: 'kravtype' }) as KravType;
  const erKravtypeMedDato = KRAV_MED_DATO.includes(valgtType);

  const onSubmit = handleSubmit((data) => {
    const referanse = erVedtatt ? krav.referanse : undefined;
    const journalpostId = { identifikator: data.journalpostId };

    if (erKravtypeMedDato) {
      const søknadsdatoParsed = parseDatoFraDatePicker(data.søknadsdatoDato);
      if (!søknadsdatoParsed) return;

      const søknadsdato = {
        dato: formaterDatoForBackend(søknadsdatoParsed),
        årsak: data.søknadsdatoÅrsak as 'BrukerHarSøktTidligere' | 'FeilregistrertSøknadsdato' | 'SøknadMottatt',
      };

      const overstyrParsed = data.overstyrDato ? parseDatoFraDatePicker(data.overstyrDato) : undefined;
      const overstyr =
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
          overstyrMuligRettFra: overstyr,
          referanse,
        } satisfies RelevantKravLøsning);
      }
    } else {
      switch (data.kravtype) {
        case 'TILLEGGSOPPLYSNING':
          onLagre({
            kravType: 'TILLEGGSOPPLYSNING',
            journalpostId,
            begrunnelse: data.begrunnelse,
            referanse,
          } satisfies TilleggsopplysningKravLøsning);
          break;
        case 'KLAGE':
          onLagre({
            kravType: 'KLAGE',
            journalpostId,
            begrunnelse: data.begrunnelse,
            referanse,
          } satisfies KlageKravLøsning);
          break;
        case 'TRUKKET_SØKNAD':
          onLagre({
            kravType: 'TRUKKET_SØKNAD',
            journalpostId,
            begrunnelse: data.begrunnelse,
            referanse,
          } satisfies TrukketSøknadKravLøsning);
          break;
      }
    }
  });

  return (
    <Modal
      open
      header={{ heading: `${erVedtatt ? 'Endre' : 'Rediger'} kravvurdering` }}
      onClose={onAvbryt}
      width="medium"
    >
      <form id="krav-vurdering-skjema" onSubmit={onSubmit} autoComplete="off">
        <Modal.Body>
          <VStack gap="space-16">
            <Select
              label="Kravtype"
              {...register('kravtype', { required: 'Du må velge kravtype.' })}
              error={errors.kravtype?.message}
              size="small"
            >
              {ALLE_KRAVTYPER.map((type) => (
                <option key={type} value={type}>
                  {formaterKravtype(type)}
                </option>
              ))}
            </Select>

            {!erVedtatt && journalpostOptions.length > 0 && (
              <Select
                label="Journalpost"
                {...register('journalpostId', { required: 'Du må velge journalpost.' })}
                error={errors.journalpostId?.message}
                size="small"
              >
                {journalpostOptions.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.id}
                  </option>
                ))}
              </Select>
            )}

            {erKravtypeMedDato && (
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
    </Modal>
  );
};

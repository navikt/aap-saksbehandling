'use client';

import { InboxDownIcon, InboxUpIcon, PencilIcon, PlusIcon, TrashIcon } from '@navikt/aksel-icons';
import {
  BodyShort,
  Button,
  Checkbox,
  Heading,
  HStack,
  Link,
  Modal,
  Switch,
  Table,
  TextField,
  UNSAFE_Combobox,
  VStack,
} from '@navikt/ds-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { Dokumentreferanse, mockDokumentreferanser } from './mockDokumentreferanser';
import styles from './Dokumentreferanser.module.css';

interface Props {
  valgteDokumentIder: string[];
  dokumentnavn: Record<string, string>;
  onChange: (dokumentIder: string[]) => void;
  onEndreNavn: (dokumentId: string, navn: string) => void;
  readOnly: boolean;
}

export const Dokumentreferanser = ({ valgteDokumentIder, dokumentnavn, onChange, onEndreNavn, readOnly }: Props) => {
  const [visDokumentvelger, setVisDokumentvelger] = useState(false);
  const [forhåndsvisning, setForhåndsvisning] = useState<Dokumentreferanse>();
  const [dokumentTilRedigering, setDokumentTilRedigering] = useState<Dokumentreferanse>();
  const valgteDokumenter = mockDokumentreferanser.filter((dokument) => valgteDokumentIder.includes(dokument.id));

  return (
    <VStack gap="space-8">
      <Heading size="xsmall" level="3">
        Dokumenter brukt i vurderingen
      </Heading>
      <BodyShort size="small">
        Demovisning med eksempeldata. Dokumentvalget lagres kun lokalt mens siden er åpen, og blir ikke lagret i saken
        eller tatt med i brevet.
      </BodyShort>
      {valgteDokumenter.length > 0 && (
        <ul>
          {valgteDokumenter.map((dokument) => {
            const navn = dokumentnavn[dokument.id] ?? dokument.tittel;
            return (
              <li key={dokument.id}>
                <HStack gap="space-8" align="center">
                  <Link
                    as="button"
                    type="button"
                    className={styles.dokumentnavn}
                    onClick={() => setForhåndsvisning(dokument)}
                  >
                    {navn}
                  </Link>
                  <BodyShort size="small">{formaterDatoForFrontend(dokument.journalført)}</BodyShort>
                  {!readOnly && (
                    <>
                      <Button
                        type="button"
                        variant="tertiary"
                        size="small"
                        icon={<PencilIcon aria-hidden />}
                        aria-label={`Rediger navn på ${navn}`}
                        onClick={() => setDokumentTilRedigering(dokument)}
                      />
                      <Button
                        type="button"
                        variant="tertiary"
                        size="small"
                        icon={<TrashIcon aria-hidden />}
                        aria-label={`Fjern ${navn}`}
                        onClick={() => onChange(valgteDokumentIder.filter((id) => id !== dokument.id))}
                      />
                    </>
                  )}
                </HStack>
              </li>
            );
          })}
        </ul>
      )}
      {!readOnly && (
        <HStack>
          <Button
            type="button"
            variant="tertiary"
            size="small"
            icon={<PlusIcon aria-hidden />}
            onClick={() => setVisDokumentvelger(true)}
          >
            Legg til
          </Button>
        </HStack>
      )}
      {visDokumentvelger && !readOnly && (
        <VelgDokumenterModal
          valgteDokumentIder={valgteDokumentIder}
          onClose={() => setVisDokumentvelger(false)}
          onBekreft={(dokumentIder) => {
            onChange(dokumentIder);
            setVisDokumentvelger(false);
          }}
          onForhåndsvis={setForhåndsvisning}
        />
      )}
      {dokumentTilRedigering && !readOnly && (
        <RedigerDokumentnavnModal
          navn={dokumentnavn[dokumentTilRedigering.id] ?? dokumentTilRedigering.tittel}
          opprinneligTittel={dokumentTilRedigering.tittel}
          onClose={() => setDokumentTilRedigering(undefined)}
          onLagre={(navn) => {
            onEndreNavn(dokumentTilRedigering.id, navn);
            setDokumentTilRedigering(undefined);
          }}
        />
      )}
      {forhåndsvisning && (
        <Modal open onClose={() => setForhåndsvisning(undefined)} header={{ heading: forhåndsvisning.tittel }}>
          <Modal.Body>
            <VStack gap="space-16">
              <BodyShort>
                Dette er et eksempeldokument. Forhåndsvisning av faktiske dokumenter er ikke tilgjengelig i
                demovisningen.
              </BodyShort>
              <BodyShort>Type: {forhåndsvisning.type}</BodyShort>
              <BodyShort>Brevkode: {forhåndsvisning.brevkode || 'Ikke oppgitt'}</BodyShort>
              <BodyShort>Journalført: {formaterDatoForFrontend(forhåndsvisning.journalført)}</BodyShort>
            </VStack>
          </Modal.Body>
          <Modal.Footer>
            <Button type="button" onClick={() => setForhåndsvisning(undefined)}>
              Lukk forhåndsvisning
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </VStack>
  );
};

interface RedigerDokumentnavnModalProps {
  navn: string;
  opprinneligTittel: string;
  onClose: () => void;
  onLagre: (navn: string) => void;
}

const RedigerDokumentnavnModal = ({ navn, opprinneligTittel, onClose, onLagre }: RedigerDokumentnavnModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ navn: string }>({ defaultValues: { navn } });
  const lagre = handleSubmit((data) => onLagre(data.navn.trim()));

  return (
    <Modal open onClose={onClose} header={{ heading: 'Rediger dokumentnavn' }} width="small">
      <Modal.Body>
        <TextField
          label="Dokumentnavn"
          description={`Opprinnelig tittel: ${opprinneligTittel}. Endringen gjelder bare navnet i listen.`}
          {...register('navn', { validate: (value) => value.trim().length > 0 || 'Du må oppgi et dokumentnavn' })}
          error={errors.navn?.message}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              event.stopPropagation();
              void lagre();
            }
          }}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button type="button" onClick={() => lagre()}>
          Lagre navn
        </Button>
        <Button type="button" variant="secondary" onClick={onClose}>
          Avbryt
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

interface ModalProps {
  valgteDokumentIder: string[];
  onClose: () => void;
  onBekreft: (dokumentIder: string[]) => void;
  onForhåndsvis: (dokument: Dokumentreferanse) => void;
}

const typeAlternativer = [
  { value: 'Inngående', label: 'Innkommende' },
  { value: 'Utgående', label: 'Utgående' },
];

const VelgDokumenterModal = ({ valgteDokumentIder, onClose, onBekreft, onForhåndsvis }: ModalProps) => {
  const [utvalg, setUtvalg] = useState(valgteDokumentIder);
  const [typer, setTyper] = useState(['Inngående']);
  const [visMeldekort, setVisMeldekort] = useState(false);
  const dokumenter = mockDokumentreferanser
    .filter(
      (dokument) => (typer.length === 0 || typer.includes(dokument.type)) && (visMeldekort || !dokument.erMeldekort)
    )
    .toSorted((a, b) => b.journalført.localeCompare(a.journalført));

  return (
    <Modal open onClose={onClose} header={{ heading: 'Velg dokumenter' }} width="900px">
      <Modal.Body>
        <VStack gap="space-16">
          <HStack gap="space-16" align="end">
            <UNSAFE_Combobox
              label="Innkommende/utgående"
              options={typeAlternativer}
              selectedOptions={typeAlternativer.filter((type) => typer.includes(type.value))}
              isMultiSelect
              shouldAutocomplete={false}
              className={styles.filter}
              onToggleSelected={(type, isSelected) =>
                setTyper((gjeldende) => (isSelected ? [...gjeldende, type] : gjeldende.filter((t) => t !== type)))
              }
            />
            <Switch checked={visMeldekort} onChange={(event) => setVisMeldekort(event.target.checked)}>
              Vis meldekort
            </Switch>
          </HStack>
          <div className={styles.tabell}>
            <Table size="small">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>
                    <span className="aksel-sr-only">Velg dokument</span>
                  </Table.HeaderCell>
                  <Table.HeaderCell>Dokument</Table.HeaderCell>
                  <Table.HeaderCell>Brevkode</Table.HeaderCell>
                  <Table.HeaderCell>Journalført</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {dokumenter.map((dokument) => (
                  <Table.Row key={dokument.id} selected={utvalg.includes(dokument.id)}>
                    <Table.DataCell>
                      <Checkbox
                        hideLabel
                        checked={utvalg.includes(dokument.id)}
                        onChange={(event) =>
                          setUtvalg((gjeldende) =>
                            event.target.checked
                              ? [...gjeldende, dokument.id]
                              : gjeldende.filter((id) => id !== dokument.id)
                          )
                        }
                      >
                        Velg {dokument.tittel}
                      </Checkbox>
                    </Table.DataCell>
                    <Table.DataCell>
                      <HStack gap="space-16" align="center" wrap={false}>
                        {dokument.type === 'Inngående' ? (
                          <InboxDownIcon
                            title="Innkommende"
                            className={`${styles.dokumenttype} ${styles.inngaaende}`}
                          />
                        ) : (
                          <InboxUpIcon title="Utgående" className={`${styles.dokumenttype} ${styles.utgaaende}`} />
                        )}
                        <Link
                          as="button"
                          type="button"
                          className={styles.dokumentnavn}
                          onClick={() => onForhåndsvis(dokument)}
                        >
                          {dokument.tittel}
                        </Link>
                      </HStack>
                    </Table.DataCell>
                    <Table.DataCell>{dokument.brevkode}</Table.DataCell>
                    <Table.DataCell>{formaterDatoForFrontend(dokument.journalført)}</Table.DataCell>
                  </Table.Row>
                ))}
                {dokumenter.length === 0 && (
                  <Table.Row>
                    <Table.DataCell colSpan={4}>Ingen dokumenter passer med de valgte filtrene.</Table.DataCell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          </div>
        </VStack>
      </Modal.Body>
      <Modal.Footer className={styles.footer}>
        <Button type="button" variant="secondary" onClick={onClose}>
          Avbryt
        </Button>
        <Button type="button" onClick={() => onBekreft(utvalg)}>
          Bekreft
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

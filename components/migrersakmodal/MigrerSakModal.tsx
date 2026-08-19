import { MigrationIcon } from '@navikt/aksel-icons';
import {
  BodyLong,
  BodyShort,
  Button,
  HStack,
  InlineMessage,
  Label,
  Modal,
  Search,
  Tag,
  VStack,
} from '@navikt/ds-react';
import { ArenaSakMedVedtakResponse } from 'lib/services/apiinternservice/apiInternServiceDTOs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Spinner } from 'components/felles/Spinner';
import styles from 'components/saksinfobanner/avbrytrevurderingmodal/AvbrytRevurderingModal.module.css';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const MigrerSakModal = ({ isOpen, onClose }: Props) => {
  const [arenasak, setArenasak] = useState<ArenaSakMedVedtakResponse | null>(null);
  const [saksnummer, setSaksnummer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();

  const handleClose = () => {
    setArenasak(null);
    setSaksnummer('');
    setIsLoading(false);
    setIsSubmitting(false);
    setError(null);
    setSubmitError(null);
    onClose();
  };

  const handleSubmit = async () => {
    if (arenasak == null) {
      setError('Du må søke opp en gyldig arenasak før du kan migrere');
    } else if (arenasak.statuskode !== 'AKTIV') {
      setError('Du kan kun migrere saker som har status Aktiv');
    } else {
      setError(null);
      setSubmitError(null);
      setIsSubmitting(true);
      const res = await fetch('/api/arena/sak/migrer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          saksnummerArena: `${arenasak.opprettetAar}-${arenasak.lopenr}`,
          ident: arenasak.person.fodselsnummer,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        handleClose();
        router.push(`/saksbehandling/sak/${data.saksnummer}/`);
      } else {
        setIsSubmitting(false);
        setSubmitError('Noe gikk galt ved migrering av saken.');
      }
    }
  };

  const handleSearch = async (value: string) => {
    if (value === '' || value === arenasak?.sakId) {
      if (value === '') setArenasak(null);
      return;
    }

    setIsLoading(true);
    setArenasak(null);
    setError(null);

    const res = await fetch(`/api/arena/sak/${value}/`);
    if (res.ok) {
      const data: ArenaSakMedVedtakResponse = await res.json();
      setArenasak(data);
    } else if (res.status === 404) {
      setError('Fant ingen Arena-sak med dette saksnummeret');
    } else {
      setError('Noe gikk galt ved henting av Arena-sak');
    }

    setIsLoading(false);
  };

  return (
    <Modal
      header={{
        heading: 'Migrer sak fra Arena',
        icon: <MigrationIcon />,
      }}
      open={isOpen}
      onClose={handleClose}
      className={styles.modal}
    >
      <Modal.Body>
        <VStack gap="space-24">
          <InlineMessage status="info">Det skal kun migreres saker med status &quot;Aktiv&quot; i Arena</InlineMessage>
          <form role="search" onSubmit={(e) => e.preventDefault()}>
            <Search
              id="search"
              label="Sak du ønsker å migrere"
              description="Oppgi saksnummer fra Arena"
              variant="primary"
              placeholder="xxxx-xxxxxx"
              value={saksnummer}
              onSearchClick={handleSearch}
              onChange={(val) => {
                setSaksnummer(val);
                setError(null);
                setSubmitError(null);
                setArenasak(null);
              }}
              error={error}
            />
          </form>
          {isLoading && <Spinner label="Henter arenasak..." size="small" />}
          {submitError != null && <InlineMessage status="error">{submitError}</InlineMessage>}
          {arenasak != null && (
            <VStack gap="space-16">
              <HStack gap="space-12">
                <BodyLong>
                  Saksnr. {arenasak.opprettetAar}-{arenasak.lopenr}
                </BodyLong>
                <Tag
                  variant="moderate"
                  data-color={arenasak.statuskode === 'AKTIV' ? 'success' : 'neutral'}
                  size="small"
                >
                  {arenasak.statusnavn}
                </Tag>
              </HStack>
              <HStack gap="space-8">
                <Label>
                  {arenasak.person.fornavn} {arenasak.person.etternavn},
                </Label>
                <BodyShort>fnr: {arenasak.person.fodselsnummer}</BodyShort>
              </HStack>
            </VStack>
          )}
        </VStack>
      </Modal.Body>
      <Modal.Footer>
        <Button type={'button'} className={'fit-content'} onClick={handleSubmit} loading={isLoading || isSubmitting}>
          Migrer saken
        </Button>
        <Button type="button" variant="secondary" onClick={handleClose}>
          Avbryt
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

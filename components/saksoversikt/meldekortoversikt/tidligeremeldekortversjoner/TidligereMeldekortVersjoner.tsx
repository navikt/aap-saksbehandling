import { BodyShort, Detail, HStack, Link, VStack } from '@navikt/ds-react';
import { ExternalLinkIcon } from '@navikt/aksel-icons';
import { MeldeperiodeMedMeldekortDto, SakPersoninfo } from 'lib/types/types';
import { Journalpost } from 'lib/types/journalpost';
import { useAlleDokumenterPåSak } from 'hooks/saksbehandling/DokumenterHook';
import { useSakPersonInformasjon } from 'hooks/saksbehandling/SakPersoninformasjonHook';
import { hentUkeNummerForPeriode } from 'components/saksoversikt/meldekortoversikt/meldekorttabell/MeldekortTabell';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { utledOppdatertAv } from 'components/saksoversikt/meldekortoversikt/meldekorttabell/meldekorttabellrow/MeldekortTabellRow';
import { Dato } from 'lib/types/Dato';

interface Props {
  meldekort: MeldeperiodeMedMeldekortDto;
}

export const TidligereMeldekortVersjoner = ({ meldekort }: Props) => {
  const { dokumenter } = useAlleDokumenterPåSak();
  const { personInformasjon } = useSakPersonInformasjon();

  const fom = new Dato(meldekort.meldeperiode.fom);
  const tom = new Dato(meldekort.meldeperiode.tom);
  const tidligereVersjoner = kobleDokumentInfoTilTidligereMeldekort(meldekort, personInformasjon, dokumenter);

  if (tidligereVersjoner.length === 0) {
    return null;
  }

  return (
    <VStack gap={'space-8'}>
      <BodyShort weight={'semibold'} size={"small"}>Tidligere versjoner av meldekortet:</BodyShort>
      <VStack gap={'space-2'}>
        {tidligereVersjoner.map((tidligereMeldekort, index) => (
          <HStack key={index} gap={'space-4'} align={'baseline'}>
            {tidligereMeldekort.dokumentId && (
              <Link
                href={`/saksbehandling/api/dokumenter/${tidligereMeldekort.journalpostId}/${tidligereMeldekort.dokumentId}`}
                target="_blank"
              >
                <BodyShort size={"small"}>Meldekort for uke {hentUkeNummerForPeriode(fom.dato, tom.dato)}</BodyShort>
                <ExternalLinkIcon />
              </Link>
            )}
            <Detail>
              {formaterDatoForFrontend(tidligereMeldekort.mottatTidspunkt)} {tidligereMeldekort.oppdatertAv}
            </Detail>
          </HStack>
        ))}
      </VStack>
    </VStack>
  );
};

function kobleDokumentInfoTilTidligereMeldekort(
  meldeperiodeMedMeldekort: MeldeperiodeMedMeldekortDto,
  personInformasjon: SakPersoninfo,
  dokumenter?: Journalpost[]
) {
  return meldeperiodeMedMeldekort.tidligereMeldekort.map((tidligereMeldekort) => {
    const dokument = dokumenter?.find((doku) => doku.journalpostId === tidligereMeldekort.journalpostId);
    const journalpostId = tidligereMeldekort.journalpostId;
    const dokumentId = dokument?.dokumenter[0]?.dokumentInfoId;
    const mottatTidspunkt = tidligereMeldekort.mottattTidspunkt;
    const oppdatertAv = utledOppdatertAv(meldeperiodeMedMeldekort.meldekort, personInformasjon.navn);

    return {
      journalpostId,
      dokumentId,
      mottatTidspunkt,
      oppdatertAv,
    };
  });
}

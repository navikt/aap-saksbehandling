import { BodyShort, Button, Table, Tag } from '@navikt/ds-react';
import { KravGrunnlag, KravVurdering, KravVurderingLøsning } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';

import {
  finnOverstyrMuligRettFra,
  finnOverstyrMuligRettFraFraLøsning,
  finnSøknadsdato,
  finnSøknadsdatoFraLøsning,
  formaterKravtype,
} from 'components/behandlinger/krav/kravutils';
import { TableStyled } from 'components/tablestyled/TableStyled';

type Props = {
  readOnly?: boolean;
  grunnlag?: KravGrunnlag;
  endredeVedtatte: Record<string, KravVurderingLøsning>;
  endredeNye: Record<string, KravVurderingLøsning>;
  slettedeNyeReferanser: string[];
  lokaleNyeKrav: Record<string, KravVurderingLøsning>;
  onEndreKrav: (krav: KravVurdering, erVedtatt: boolean) => void;
  onSlettNyVurdering: (referanse: string) => void;
  onEndreLokalNy: (key: string) => void;
  onSlettLokalNy: (key: string) => void;
  onLeggTilNy: () => void;
};

export const KravTabell = ({
  readOnly,
  grunnlag,
  endredeVedtatte,
  endredeNye,
  slettedeNyeReferanser,
  lokaleNyeKrav,
  onEndreKrav,
  onSlettNyVurdering,
  onEndreLokalNy,
  onSlettLokalNy,
  onLeggTilNy,
}: Props) => {
  const harRader =
    grunnlag &&
    (grunnlag.vedtatteVurderinger.length > 0 ||
      grunnlag.nyeVurderinger.length > 0 ||
      Object.keys(lokaleNyeKrav).length > 0);

  if (!harRader) {
    return (
      <>
        <BodyShort>Det finnes ingen vurderinger.</BodyShort>
        {!readOnly && (
          <Button type="button" size="small" variant="secondary" onClick={onLeggTilNy} className="fit-content">
            + Legg til vurdering
          </Button>
        )}
      </>
    );
  }

  return (
    <>
      <TableStyled size="medium">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell>JournalpostId</Table.HeaderCell>
            <Table.HeaderCell>Journalpost mottatt</Table.HeaderCell>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Søknadsdato</Table.HeaderCell>
            <Table.HeaderCell>Mulig rett fra</Table.HeaderCell>
            <Table.HeaderCell>Vurdert av</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Valg</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {grunnlag?.nyeVurderinger
            .filter((v) => !slettedeNyeReferanser.includes(v.referanse))
            .map((vurdering) => {
              const aktivLøsning = endredeNye[vurdering.referanse];
              const journalpostMottatt = grunnlag.søknader.find((s) => s.journalpostId === vurdering.journalpostId);

              return (
                <Table.ExpandableRow
                  content={aktivLøsning?.begrunnelse ?? vurdering.begrunnelse}
                  key={vurdering.referanse}
                >
                  <Table.DataCell>{vurdering.journalpostId.identifikator}</Table.DataCell>
                  <Table.DataCell>{journalpostMottatt?.mottattTidspunkt ?? '-'}</Table.DataCell>
                  <Table.DataCell>{formaterKravtype(vurdering.type)}</Table.DataCell>
                  <Table.DataCell>{formaterSøknadsdatoRad(vurdering, aktivLøsning)}</Table.DataCell>
                  <Table.DataCell>{formaterOverstyrMuligRettFraRad(vurdering, aktivLøsning)}</Table.DataCell>
                  <Table.DataCell>{vurdering.vurdertAv}</Table.DataCell>
                  <Table.DataCell>
                    {aktivLøsning ? (
                      <Tag variant="warning" size="small">
                        Endret
                      </Tag>
                    ) : (
                      <Tag variant="alt1" size="small">
                        Ny
                      </Tag>
                    )}
                  </Table.DataCell>
                  <Table.DataCell>
                    <Button
                      type="button"
                      size="small"
                      variant="secondary"
                      disabled={readOnly}
                      onClick={() => onEndreKrav(vurdering, false)}
                    >
                      Endre
                    </Button>
                    <Button
                      type="button"
                      size="small"
                      variant="tertiary"
                      disabled={readOnly}
                      onClick={() => onSlettNyVurdering(vurdering.referanse)}
                    >
                      Slett
                    </Button>
                  </Table.DataCell>
                </Table.ExpandableRow>
              );
            })}

          {Object.entries(lokaleNyeKrav).map(([key, løsning]) => (
            <Table.ExpandableRow content={løsning.begrunnelse} key={key}>
              <Table.DataCell>{løsning.journalpostId.identifikator}</Table.DataCell>
              <Table.DataCell>{formaterKravtype(løsning.kravType)}</Table.DataCell>
              <Table.DataCell>{formaterSøknadsdatoFraLøsningRad(løsning)}</Table.DataCell>
              <Table.DataCell>{formaterOverstyrFraLøsningRad(løsning)}</Table.DataCell>
              <Table.DataCell>—</Table.DataCell>
              <Table.DataCell>
                <Tag variant="alt3" size="small">
                  Lagt til
                </Tag>
              </Table.DataCell>
              <Table.DataCell>
                <Button
                  type="button"
                  size="small"
                  variant="secondary"
                  disabled={readOnly}
                  onClick={() => onEndreLokalNy(key)}
                >
                  Endre
                </Button>
                <Button
                  type="button"
                  size="small"
                  variant="tertiary"
                  disabled={readOnly}
                  onClick={() => onSlettLokalNy(key)}
                >
                  Slett
                </Button>
              </Table.DataCell>
            </Table.ExpandableRow>
          ))}

          {grunnlag?.vedtatteVurderinger.map((vurdering) => {
            const aktivLøsning = endredeVedtatte[vurdering.referanse];
            return (
              <Table.ExpandableRow
                content={aktivLøsning?.begrunnelse ?? vurdering.begrunnelse}
                key={vurdering.referanse}
              >
                <Table.DataCell>{vurdering.journalpostId.identifikator}</Table.DataCell>
                <Table.DataCell>{formaterKravtype(vurdering.type)}</Table.DataCell>
                <Table.DataCell>{formaterSøknadsdatoRad(vurdering, aktivLøsning)}</Table.DataCell>
                <Table.DataCell>{formaterOverstyrMuligRettFraRad(vurdering, aktivLøsning)}</Table.DataCell>
                <Table.DataCell>{vurdering.vurdertAv}</Table.DataCell>
                <Table.DataCell>
                  {aktivLøsning ? (
                    <Tag variant="warning" size="small">
                      Endret
                    </Tag>
                  ) : (
                    <Tag variant="success" size="small">
                      Vedtatt
                    </Tag>
                  )}
                </Table.DataCell>
                <Table.DataCell>
                  <Button
                    type="button"
                    size="small"
                    variant="secondary"
                    disabled={readOnly}
                    onClick={() => onEndreKrav(vurdering, true)}
                  >
                    Endre
                  </Button>
                </Table.DataCell>
              </Table.ExpandableRow>
            );
          })}
        </Table.Body>
      </TableStyled>
      {!readOnly && (
        <Button type="button" size="small" variant="secondary" onClick={onLeggTilNy} className="fit-content">
          + Legg til vurdering
        </Button>
      )}
    </>
  );
};

function formaterSøknadsdatoRad(vurdering: KravVurdering, løsning?: KravVurderingLøsning) {
  const dato = løsning ? finnSøknadsdatoFraLøsning(løsning)?.dato : finnSøknadsdato(vurdering)?.dato;
  return dato ? formaterDatoForFrontend(dato) : '-';
}

function formaterOverstyrMuligRettFraRad(vurdering: KravVurdering, løsning?: KravVurderingLøsning) {
  const dato = løsning ? finnOverstyrMuligRettFraFraLøsning(løsning)?.dato : finnOverstyrMuligRettFra(vurdering)?.dato;
  return dato ? formaterDatoForFrontend(dato) : '-';
}

function formaterSøknadsdatoFraLøsningRad(løsning: KravVurderingLøsning) {
  const dato = finnSøknadsdatoFraLøsning(løsning)?.dato;
  return dato ? formaterDatoForFrontend(dato) : '-';
}

function formaterOverstyrFraLøsningRad(løsning: KravVurderingLøsning) {
  const dato = finnOverstyrMuligRettFraFraLøsning(løsning)?.dato;
  return dato ? formaterDatoForFrontend(dato) : '-';
}

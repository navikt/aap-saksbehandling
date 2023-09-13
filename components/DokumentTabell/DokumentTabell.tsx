'use client'

import { Checkbox, Link, Table } from "@navikt/ds-react"
import { formaterDato } from "lib/utils/date";
import { DokumentTabellRow } from "./DokumentTabellRow";

export interface Dokument {
    journalpostId: string;
        dokumentId: string;
        tittel: string;
        åpnet?: Date;
        erTilknyttet: boolean;
}

export interface Props {
    dokumenter: Dokument[];
    onVedleggClick: (journalpostId: string, dokumentId: string) => void;
    onTilknyttetClick: (journalpostId: string, dokumentId: string) => void;
}

export const DokumentTabell = ({dokumenter, onVedleggClick, onTilknyttetClick}: Props) => {


    return (<Table>
        <Table.Header>
            <Table.Row>
                <Table.HeaderCell>Dokument</Table.HeaderCell>
                <Table.HeaderCell>Journalpost ID</Table.HeaderCell>
                <Table.HeaderCell>Åpnet</Table.HeaderCell>
                <Table.HeaderCell>Tilknytt dokument til vurdering</Table.HeaderCell>
            </Table.Row>
        </Table.Header>
        {dokumenter.length > 0 && (<Table.Body>
            {dokumenter.map((dokument) => (
                <DokumentTabellRow key={`${dokument.journalpostId}-${dokument.dokumentId}`} dokument={dokument} onVedleggClick={onVedleggClick} onTilknyttetClick={onTilknyttetClick} />
            ))}
            </Table.Body>)}
    </Table>)
}
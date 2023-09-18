import { render, screen } from "@testing-library/react"
import { Dokument, DokumentTabell } from "./DokumentTabell"
import { DokumentTabellRow } from "./DokumentTabellRow"
import { formaterDato } from "lib/utils/date"

const dokumenter: Dokument[] = [{
    journalpostId: '123',
    dokumentId: '123',
    tittel: 'Tittel',
    åpnet: new Date(),
    erTilknyttet: false
}]

describe('DokumentTabell', () => {
    it('Skal rendre en tabell', () => {
        render(<DokumentTabell dokumenter={dokumenter} onTilknyttetClick={() => {}} onVedleggClick={() => {}} />)
        const headers = ['Dokument', 'Journalpost ID', 'Åpnet', 'Tilknytt dokument til vurdering']
        headers.forEach((header) => {
            expect(screen.getByRole('columnheader', {name: new RegExp(`^${header}$`)})).toBeVisible()
        })
    })
    it('Skal rendre en rad per dokument', () => {
        render(<DokumentTabell dokumenter={dokumenter} onTilknyttetClick={() => {}} onVedleggClick={() => {}} />)
        expect(screen.getAllByRole('row')).toHaveLength(2); // Inkluderer table header row
    })
})

describe('DokumentTabellRow', () => {
    it('Skal rendre en rad med dokument', () => {
        const dokument = dokumenter[0];
        render(<table><tbody><DokumentTabellRow dokument={dokument} onTilknyttetClick={() => {}} onVedleggClick={() => {}} /></tbody></table>)
        expect(screen.getByRole('row')).toBeVisible();
        expect(screen.getByRole('link', {name: dokument.tittel})).toBeVisible();
        expect(screen.getByRole('cell', {name: dokument.journalpostId})).toBeVisible();
        expect(screen.getByRole('cell', {name: formaterDato(dokument.åpnet ?? new Date())})).toBeVisible();
        expect(screen.getByRole('checkbox', {name: 'Tilknytt dokument til vurdering'})).toBeVisible();
    });
})
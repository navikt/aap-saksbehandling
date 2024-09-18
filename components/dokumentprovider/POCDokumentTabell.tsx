'use client'

import {DokumentDispatchContext} from './DokumentProvider';
import {Dokument} from "../dokumenttabell/DokumentTabell";
import { useContext } from 'react';

const defaultDokumenter: Dokument[] = [
    {
        dokumentId: '123',
        erTilknyttet: false,
        journalpostId: '123',
        tittel: 'Legeerklæring 02.05.2023',
    },
    {
        dokumentId: '456',
        erTilknyttet: false,
        journalpostId: '456',
        tittel: 'Melding om vedtak: yrkesskade',
    },
    {
        dokumentId: '789',
        erTilknyttet: false,
        journalpostId: '789',
        tittel: 'Sykemelding',
    },
];

export function POCDokumentTabell() {
    const dispatch = useContext(DokumentDispatchContext);
    return (<ul>{defaultDokumenter.map(dokument => <li>
        <p>{dokument.tittel}</p>
        <button onClick={() => dispatch && dispatch({type: 'ADD', payload: dokument}) }>
            Tilknytt
        </button>
    </li>)}</ul>)
}
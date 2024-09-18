'use client'

import { Dokument } from 'components/dokumenttabell/DokumentTabell'
import { createContext, Dispatch, useReducer } from 'react'

export const DokumentContext = createContext<Dokument[]>([])
export const DokumentDispatchContext = createContext<Dispatch<any> | null>(null)
interface Props {
    children: React.ReactNode
}

// An enum with all the types of actions to use in our reducer
enum DokumentActionTypes {
    ADD = 'ADD',
    REMOVE = 'REMOVE',
}

// An interface for our actions
interface DokumentAction {
    type: DokumentActionTypes;
    payload: Dokument;
}
type DokumentState = Dokument[];

export const DokumentProvider = ({children}: Props) => {
    const [dokumenter, dokumentDispatch] = useReducer(dokumentReducer, []);
    return (
        <DokumentContext.Provider value={dokumenter}>
            <DokumentDispatchContext.Provider value={dokumentDispatch}>
                {children}
            </DokumentDispatchContext.Provider>
        </DokumentContext.Provider>
    );
}
function dokumentReducer(dokumenter: DokumentState, action: DokumentAction) {
    switch (action.type) {
        case 'ADD': {
            return [...dokumenter, action.payload];
        }
        case 'REMOVE': {
            //TODO:
            return [...dokumenter, action];
        }
    }
}
import {
    hentVirkningsTidspunkt,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { BodyShort } from "@navikt/ds-react";
import { formaterDatoForFrontend } from "../../lib/utils/date";

type Props = {
    behandlingsreferanse: string;
    opprettetDato: string;
};

export const BehandlingsinfoDataMedDataFetching = async ({
                                                             behandlingsreferanse, opprettetDato
                                                         }: Props) => {

    const behandlingsInfo = await hentVirkningsTidspunkt(behandlingsreferanse);

    return (
        behandlingsInfo.virkningstidspunkt == null ? (
            <BodyShort size={'small'}>{formaterDatoForFrontend(opprettetDato)}</BodyShort>
        ) : (
            <BodyShort size={'small'}>{formaterDatoForFrontend(behandlingsInfo.virkningstidspunkt)}</BodyShort>
        )
    );
};

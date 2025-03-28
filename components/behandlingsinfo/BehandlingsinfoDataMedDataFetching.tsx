import {
    hentVirkningsTidspunkt,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { BodyShort } from "@navikt/ds-react";
import { formaterDatoForFrontend } from "../../lib/utils/date";

type Props = {
    behandlingsreferanse: string;
};

export const BehandlingsinfoDataMedDataFetching = async ({
                                                             behandlingsreferanse,
                                                         }: Props) => {

    const behandlingsInfo = await hentVirkningsTidspunkt(behandlingsreferanse);

    return (
        behandlingsInfo.virkningstidspunkt == null ? (
            <BodyShort size={'small'}>Ikke bestemt</BodyShort>
        ) : (
            <BodyShort size={'small'}>{formaterDatoForFrontend(behandlingsInfo.virkningstidspunkt)}</BodyShort>
        )
    );
};

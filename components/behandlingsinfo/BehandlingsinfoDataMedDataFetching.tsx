import {
    hentVirkningsTidspunkt,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { BodyShort, Label } from "@navikt/ds-react";

type Props = {
    behandlingsreferanse: string;
};

export const BehandlingsinfoDataMedDataFetching = async ({
                                                             behandlingsreferanse,
                                                         }: Props) => {

    const behandlingsInfo = await hentVirkningsTidspunkt(behandlingsreferanse);

    return (
            <BodyShort size={'small'}>{behandlingsInfo.virkningstidspunkt}</BodyShort>

    )
};

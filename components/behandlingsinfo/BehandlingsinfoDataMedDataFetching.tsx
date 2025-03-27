import {
    hentVirkningsTidspunkt,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import {BodyShort, Label} from "@navikt/ds-react";

type Props = {
    behandlingsreferanse: string;
};

export const BehandlingsinfoDataMedDataFetching = async ({
                                                             behandlingsreferanse,
                                                         }: Props) => {

    const virkningstidspunkt = await hentVirkningsTidspunkt(behandlingsreferanse);

    return (
        <>
            <BodyShort size={'small'}>{virkningstidspunkt}</BodyShort>
            <Label as="p" size={'small'}>
                Virkningstidspunkt:
            </Label>
        </>
    )
};

import {NextApiRequest, NextApiResponse} from "next";
import {logger} from "@navikt/aap-felles-utils";
import {validerToken} from "./auth/azuread";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const {authorization} = req.headers;

    try {
        const token = authorization?.split(" ")[1];
        if (token) {
            const JWTVerifyResult = await validerToken(token);
            res.json({name: JWTVerifyResult.payload.name});
        } else{
            res.status(403)
        }
    } catch (e) {
        logger.warn("azureUserInfo", e);
        res.status(500);
    }
}

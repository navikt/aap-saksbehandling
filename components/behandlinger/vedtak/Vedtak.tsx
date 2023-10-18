import { ForeslåVedtakMedDataFetching } from 'components/behandlinger/vedtak/foreslåVedtak/ForeslåVedtakMedDataFetching';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { getToken } from 'lib/auth/authentication';
import { hentFlyt2 } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { getStegSomSkalVises } from 'lib/utils/steg';
import { headers } from 'next/headers';

interface Props {
  behandlingsReferanse: string;
}

export const Vedtak = async ({ behandlingsReferanse }: Props) => {
  const flyt = await hentFlyt2(behandlingsReferanse, getToken(headers()));

  const stegSomSkalVises = getStegSomSkalVises('VEDTAK', flyt);

  return (
    <>
      {stegSomSkalVises.map((steg) => {
        if (steg === 'FORESLÅ_VEDTAK') {
          return (
            <StegSuspense key={steg}>
              <ForeslåVedtakMedDataFetching behandlingsReferanse={behandlingsReferanse} />
            </StegSuspense>
          );
        }
      })}
    </>
  );
};

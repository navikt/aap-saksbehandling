import { components } from './postmottakSchema';

export type DetaljertBehandlingDto = components['schemas']['no.nav.aap.postmottak.api.flyt.DetaljertBehandlingDto'];
export type BehandlingFlytOgTilstand =
  components['schemas']['no.nav.aap.postmottak.api.flyt.BehandlingFlytOgTilstandDto'];

export type FlytGruppe = components['schemas']['no.nav.aap.postmottak.api.flyt.FlytGruppe'];
export type FlytProsessering = components['schemas']['no.nav.aap.postmottak.api.flyt.Prosessering'];

export type StegGruppe = components['schemas']['no.nav.aap.postmottak.api.flyt.FlytGruppe']['stegGruppe'];

export type StegType = components['schemas']['no.nav.aap.postmottak.api.flyt.FlytSteg']['stegType'];

export type LøsAvklaringsbehovPåBehandling =
  components['schemas']['no.nav.aap.postmottak.api.flyt.L\u00F8sAvklaringsbehovP\u00E5Behandling'];

export type SettPåVentRequest = components['schemas']['no.nav.aap.postmottak.api.flyt.SettP\u00E5VentRequest'];
export type PostmottakSettPåVentÅrsaker =
  components['schemas']['no.nav.aap.postmottak.api.flyt.SettP\u00E5VentRequest']['grunn'];
export type Venteinformasjon = components['schemas']['no.nav.aap.postmottak.api.flyt.Venteinformasjon'];
export type DigitaliseringsGrunnlag =
  components['schemas']['no.nav.aap.postmottak.api.faktagrunnlag.strukturering.DigitaliseringGrunnlagDto'];
export type KategoriserDokumentKategori =
  components['schemas']['no.nav.aap.postmottak.api.faktagrunnlag.strukturering.DigitaliseringvurderingDto']['kategori'];
export type JournalpostInfo =
  components['schemas']['no.nav.aap.postmottak.api.faktagrunnlag.dokument.DokumentInfoResponsDTO'];
export type Dokument = components['schemas']['no.nav.aap.postmottak.api.faktagrunnlag.dokument.DokumentDto'];

export type AvklarTemaGrunnlag =
  components['schemas']['no.nav.aap.postmottak.api.faktagrunnlag.tema.AvklarTemaGrunnlagDto'];
export type FinnSakGrunnlag = components['schemas']['no.nav.aap.postmottak.api.faktagrunnlag.sak.AvklarSakGrunnlagDto'];

export type OverleveringGrunnlag =
  components['schemas']['no.nav.aap.postmottak.api.faktagrunnlag.overlevering.OverleveringGrunnlagDto'];

export type AvsenderMottakerIdType =
  components['schemas']['no.nav.aap.postmottak.gateway.AvsenderMottakerDto']['idType'];

export type FinnBehandlingerRespons =
  components['schemas']['no.nav.aap.postmottak.api.faktagrunnlag.sak.FinnBehandlingerResponse'];

export type PostmottakBehandlingInfo = FinnBehandlingerRespons['behandlinger'][number];

export type PostmottakTypeBehandling = PostmottakBehandlingInfo['typeBehandling'];

export type UbehandletJournalpost = components['schemas']['no.nav.aap.postmottak.joarkavstemmer.UavstemtJournalpost'];

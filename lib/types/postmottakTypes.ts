import { components as postmottak } from '@navikt/aap-postmottak-backend-typescript-types';

export type DetaljertBehandlingDto = postmottak['schemas']['no.nav.aap.postmottak.api.flyt.DetaljertBehandlingDTO'];
export type BehandlingFlytOgTilstand =
  postmottak['schemas']['no.nav.aap.postmottak.api.flyt.BehandlingFlytOgTilstandDto'];

export type FlytGruppe = postmottak['schemas']['no.nav.aap.postmottak.api.flyt.FlytGruppe'];
export type FlytProsessering = postmottak['schemas']['no.nav.aap.postmottak.api.flyt.Prosessering'];

export type StegGruppe = postmottak['schemas']['no.nav.aap.postmottak.api.flyt.FlytGruppe']['stegGruppe'];

export type StegType = postmottak['schemas']['no.nav.aap.postmottak.api.flyt.FlytSteg']['stegType'];

export type LøsAvklaringsbehovPåBehandling =
  postmottak['schemas']['no.nav.aap.postmottak.avklaringsbehov.flate.L\u00F8sAvklaringsbehovP\u00E5Behandling'];

export type SettPåVentRequest = postmottak['schemas']['no.nav.aap.postmottak.api.flyt.SettP\u00E5VentRequest'];
export type SettPåVentÅrsaker = postmottak['schemas']['no.nav.aap.postmottak.api.flyt.SettP\u00E5VentRequest']['grunn'];
export type Venteinformasjon = postmottak['schemas']['no.nav.aap.postmottak.api.flyt.Venteinformasjon'];
export type DigitaliseringsGrunnlag =
  postmottak['schemas']['no.nav.aap.postmottak.api.faktagrunnlag.strukturering.DigitaliseringGrunnlagDto'];
export type KategoriserDokumentKategori =
  postmottak['schemas']['no.nav.aap.postmottak.api.faktagrunnlag.strukturering.DigitaliseringvurderingDto']['kategori'];
export type JournalpostInfo =
  postmottak['schemas']['no.nav.aap.postmottak.api.faktagrunnlag.dokument.DokumentInfoResponsDTO'];
export type Dokument = postmottak['schemas']['no.nav.aap.postmottak.api.faktagrunnlag.dokument.DokumentDto'];

export type AvklarTemaGrunnlag =
  postmottak['schemas']['no.nav.aap.postmottak.api.faktagrunnlag.tema.AvklarTemaGrunnlagDto'];
export type FinnSakGrunnlag = postmottak['schemas']['no.nav.aap.postmottak.api.faktagrunnlag.sak.AvklarSakGrunnlagDto'];
export type Saksinfo = postmottak['schemas']['no.nav.aap.postmottak.api.faktagrunnlag.sak.SaksInfoDto'];
export type OverleveringGrunnlag =
  postmottak['schemas']['no.nav.aap.postmottak.api.faktagrunnlag.overlevering.OverleveringGrunnlagDto'];

export type AvsenderMottakerIdType =
  postmottak['schemas']['no.nav.aap.postmottak.gateway.AvsenderMottakerDto']['idType'];

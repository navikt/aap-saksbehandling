import {
  ArbeidsopptrappingLøsningDto,
  AvklarOppholdkravLøsning,
  AvklarPeriodisertForutgåendeMedlemskapLøsning,
  AvklarPeriodisertLovvalgMedlemskapLøsning,
  BistandsbehovLøsning,
  EtableringEgenVirksomhetLøsningDto,
  LøsPeriodisertBehovPåBehandling,
  OvergangArbeidLøsning,
  OvergangUforeLøsning,
  PeriodisertArbeidsevneVurderingDto,
  PeriodisertFritaksvurderingDto,
  SykdomsvurderingLøsningDto,
  SykepengererstatningPeriodeLøsning,
} from 'lib/types/types';
import { Behovstype } from 'lib/utils/form';

type BaseLøsPeriodisertBehovPåBehandling = Omit<LøsPeriodisertBehovPåBehandling, 'behov'>;

export interface LøsningerForPerioder extends BaseLøsPeriodisertBehovPåBehandling {
  behov: Behov;
}

interface LovvalgOgMedlemskapBehov {
  behovstype: Behovstype.AVKLAR_LOVVALG_MEDLEMSKAP | Behovstype.MANUELL_OVERSTYRING_LOVVALG;
  løsningerForPerioder: AvklarPeriodisertLovvalgMedlemskapLøsning[];
}

interface SykdomsvurderingBehov {
  behovstype: Behovstype.AVKLAR_SYKDOM_KODE;
  løsningerForPerioder: SykdomsvurderingLøsningDto[]; // typen fra types.ts
}

interface Bistandsbehov {
  behovstype: Behovstype.AVKLAR_BISTANDSBEHOV_KODE;
  løsningerForPerioder: BistandsbehovLøsning[];
}

interface FastsettArbeidsevne {
  behovstype: Behovstype.FASTSETT_ARBEIDSEVNE_KODE;
  løsningerForPerioder: PeriodisertArbeidsevneVurderingDto[];
}

interface FritakMeldeplikt {
  behovstype: Behovstype.FRITAK_MELDEPLIKT_KODE;
  løsningerForPerioder: PeriodisertFritaksvurderingDto[];
}

interface EtableringEgenVirksomhet {
  behovstype: Behovstype.ETABLERING_EGEN_VIRKSOMHET_KODE;
  løsningerForPerioder: EtableringEgenVirksomhetLøsningDto[];
}

interface Sykepengeerstatning {
  behovstype: Behovstype.VURDER_SYKEPENGEERSTATNING_KODE;
  løsningerForPerioder: SykepengererstatningPeriodeLøsning[];
}

interface OvergangArbeid {
  behovstype: Behovstype.OVERGANG_ARBEID;
  løsningerForPerioder: OvergangArbeidLøsning[];
}

interface Arbeidsopptrapping {
  behovstype: Behovstype.ARBEIDSOPPTRAPPING_KODE;
  løsningerForPerioder: ArbeidsopptrappingLøsningDto[];
}

interface OvergangUføre {
  behovstype: Behovstype.OVERGANG_UFORE;
  løsningerForPerioder: OvergangUforeLøsning[];
}

interface OppholdskravvurderingBehov {
  behovstype: Behovstype.OPPHOLDSKRAV_KODE;
  løsningerForPerioder: AvklarOppholdkravLøsning[]; // typen fra types.ts
}

interface ForutgåendeMedlemskapMedOverstyring {
  behovstype: Behovstype.MANUELL_OVERSTYRING_MEDLEMSKAP | Behovstype.AVKLAR_FORUTGÅENDE_MEDLEMSKAP;
  løsningerForPerioder: AvklarPeriodisertForutgåendeMedlemskapLøsning[];
}

type Behov =
  | LovvalgOgMedlemskapBehov
  | SykdomsvurderingBehov
  | Bistandsbehov
  | FastsettArbeidsevne
  | FritakMeldeplikt
  | EtableringEgenVirksomhet
  | Sykepengeerstatning
  | OvergangArbeid
  | Arbeidsopptrapping
  | OvergangUføre
  | OppholdskravvurderingBehov
  | ForutgåendeMedlemskapMedOverstyring;

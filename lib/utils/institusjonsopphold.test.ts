import { describe, expect, it } from 'vitest';

import { Dato } from 'lib/types/Dato';
import { HelseInstiusjonVurdering } from 'lib/types/types';
import {
  beregnEffektivTidligsteReduksjonsdatoFraSkjema,
  beregnReduksjonskjede,
  beregnStandardTidligsteReduksjonsdato,
  erNyttOppholdInnenfor3MaanederEtterSistOpphold,
  erReduksjonMuligForOpphold,
  erReduksjonUtIFraVurdering,
  erVurderingHistorisk,
  forrigeOppholdHarIngenReduksjonLengre,
  lagReduksjonBeskrivelseNyttOpphold,
  lagReduksjonsBeskrivelse,
  manglerKorrigertReduksjonsdato,
  validerDatoErInnenforOpphold,
  validerErIKronologiskRekkeFølge,
} from 'lib/utils/institusjonopphold';
import {
  OppholdMedVurderinger,
  OppholdVurdering,
} from 'components/behandlinger/institusjonsopphold/helseinstitusjon/Helseinstitusjon';
import { JaEllerNei } from 'lib/utils/form';
import { getReduksjonsstatus, VurderingStatus } from 'components/periodisering/VurderingStatusTag';

describe('validerDatoErInnenforOppholdReduksjon', () => {
  const oppholdFra = new Dato('2025-01-01').formaterForFrontend();
  const avsluttetDato = new Dato('2025-08-01').formaterForFrontend();

  it('skal vise en feilmelding dersom reduksjonsdato er før oppholdFra dato', () => {
    const inputValue = new Dato('2024-12-31').formaterForFrontend();
    const value = validerDatoErInnenforOpphold(inputValue, oppholdFra, avsluttetDato);
    expect(value).toBe('Dato kan ikke være før innleggelsesdato: 01.01.2025');
  });

  it('skal vise en feilmelding dersom reduksjonsdato er etter oppholdTil dato', () => {
    const inputValue = new Dato('2025-10-01').formaterForFrontend();
    const value = validerDatoErInnenforOpphold(inputValue, oppholdFra, avsluttetDato);
    expect(value).toBe('Dato kan ikke være etter oppholdets sluttdato: 01.08.2025');
  });

  it('skal returnere true dersom reduksjonsdato er innenfor perioden', () => {
    const inputValue = new Dato('2025-06-01').formaterForFrontend();
    const value = validerDatoErInnenforOpphold(inputValue, oppholdFra, avsluttetDato);
    expect(value).toBeTruthy();
  });
});

describe('validerErIKronologiskRekkefølge', () => {
  const forrigevurderingFom = new Dato('2025-02-01').formaterForFrontend();

  it('skal vise en feilmelding dersom input value er tidligere enn forrige vurdering fom', () => {
    const inputValue = new Dato('2025-01-01').formaterForFrontend();
    const value = validerErIKronologiskRekkeFølge(inputValue, forrigevurderingFom);
    expect(value).toBe('Dato kan ikke være tidligere eller samme dato som forrige vurdering: 01.02.2025');
  });

  it('skal vise en feilmelding dersom input value er samme dato som forrige vurdering fom', () => {
    const inputValue = new Dato('2025-02-01').formaterForFrontend();
    const value = validerErIKronologiskRekkeFølge(inputValue, forrigevurderingFom);
    expect(value).toBe('Dato kan ikke være tidligere eller samme dato som forrige vurdering: 01.02.2025');
  });

  it('skal returnere true dersom input value er etter forrige vurdering fom', () => {
    const inputValue = new Dato('2025-06-01').formaterForFrontend();
    const value = validerErIKronologiskRekkeFølge(inputValue, forrigevurderingFom);
    expect(value).toBeTruthy();
  });
});

describe('erReduksjon', () => {
  const defaultVurdering: HelseInstiusjonVurdering = {
    begrunnelse: 'Hello Pello',
    faarFriKostOgLosji: false,
    oppholdId: '123',
    periode: {
      fom: '2025-01-01',
      tom: '2025-08-01',
    },
    vurderingerMeta: {},
    erHistoriskUtenReduksjonsberegning: false,
  };

  it('returnerer true når faarFriKostOgLosji er true og de andre er false', () => {
    expect(
      erReduksjonUtIFraVurdering({
        ...defaultVurdering,
        faarFriKostOgLosji: true,
        forsoergerEktefelle: false,
        harFasteUtgifter: false,
      })
    ).toBe(true);
  });

  it('returnerer false når faarFriKostOgLosji er false', () => {
    expect(
      erReduksjonUtIFraVurdering({
        ...defaultVurdering,
        faarFriKostOgLosji: false,
        forsoergerEktefelle: false,
        harFasteUtgifter: false,
      })
    ).toBe(false);
  });

  it('returnerer false når forsoergerEktefelle er true', () => {
    expect(
      erReduksjonUtIFraVurdering({
        ...defaultVurdering,
        faarFriKostOgLosji: true,
        forsoergerEktefelle: true,
        harFasteUtgifter: false,
      })
    ).toBe(false);
  });

  it('returnerer false når harFasteUtgifter er true', () => {
    expect(
      erReduksjonUtIFraVurdering({
        ...defaultVurdering,
        faarFriKostOgLosji: true,
        forsoergerEktefelle: false,
        harFasteUtgifter: true,
      })
    ).toBe(false);
  });
});

describe('erNyttOppholdInnenfor3MaanederEtterSistOpphold', () => {
  it('returnerer true når nytt opphold er innen 3 måneder etter utskrivelse', () => {
    const resultat = erNyttOppholdInnenfor3MaanederEtterSistOpphold('01.01.2025', '15.03.2025');

    expect(resultat).toBe(true);
  });

  it('returnerer true når nytt opphold starter nøyaktig 3 måneder etter utskrivelse', () => {
    const resultat = erNyttOppholdInnenfor3MaanederEtterSistOpphold('01.01.2025', '01.04.2025');

    expect(resultat).toBe(true);
  });

  it('returnerer false når nytt opphold starter etter 3 måneder', () => {
    const resultat = erNyttOppholdInnenfor3MaanederEtterSistOpphold('01.01.2025', '02.04.2025');

    expect(resultat).toBe(false);
  });

  it('returnerer true når nytt opphold er samme dag som utskrivelse', () => {
    const resultat = erNyttOppholdInnenfor3MaanederEtterSistOpphold('10.02.2025', '10.02.2025');

    expect(resultat).toBe(true);
  });

  it('håndterer månedsskifte korrekt', () => {
    const resultat = erNyttOppholdInnenfor3MaanederEtterSistOpphold('31.01.2025', '30.04.2025');

    expect(resultat).toBe(true);
  });
});

describe('lagReduksjonBeskrivelseNyttOpphold', () => {
  it('bruker standard regel når forrigeOppholdSisteVurderingVarRedukjson er undefined', () => {
    const resultat = lagReduksjonBeskrivelseNyttOpphold('01.07.2026', '01.12.2026');

    expect(resultat).toBe(
      'Innleggelsesmåned: juli 2026. Reduksjonen bør som regel starte 1. august 2026 ved reduksjon i forrige opphold, ellers 1. november 2026. Det finnes likevel unntak.'
    );
  });

  it('utelater fire-månedersdato når oppholdet slutter før den', () => {
    expect(lagReduksjonBeskrivelseNyttOpphold('01.11.2025', '01.02.2026')).toBe(
      'Innleggelsesmåned: november 2025. Reduksjonen bør som regel starte 1. desember 2025 ved reduksjon i forrige opphold. Det finnes likevel unntak.'
    );
  });

  it('tar med fire-månedersdato når oppholdet slutter samme dag eller etter', () => {
    expect(lagReduksjonBeskrivelseNyttOpphold('01.11.2025', '01.03.2026')).toBe(
      'Innleggelsesmåned: november 2025. Reduksjonen bør som regel starte 1. desember 2025 ved reduksjon i forrige opphold, ellers 1. mars 2026. Det finnes likevel unntak.'
    );
  });
});

describe('beregnReduksjonskjede - forrige opphold uten vurderinger i skjemaet', () => {
  const lagOpphold = (
    oppholdId: string,
    fom: string,
    tom: string,
    vurderinger: OppholdVurdering[],
    tidligsteReduksjonsdato?: string
  ): OppholdMedVurderinger => ({ oppholdId, periode: { fom, tom }, tidligsteReduksjonsdato, vurderinger });

  const opphold = [
    lagOpphold('kysthaven', '01.02.2025', '01.09.2025', []),
    lagOpphold('solglott', '01.11.2025', '01.02.2026', [reduksjon('01.12.2025')], '2025-12-01'),
  ];

  it('vedtatt reduksjon i forrige opphold gir 1-månedsregel og ingen historikk', () => {
    const kjede = beregnReduksjonskjede(opphold, { kysthaven: [vedtattReduksjon] }, true, 1);

    expect(kjede[0].girReduksjon).toBe(true);
    expect(kjede[1].bruker1Månedsregelen).toBe(true);
    expect(kjede[1].reduksjonErMulig).toBe(true);
    expect(kjede[1].girReduksjon).toBe(true);
  });

  it('uten vedtatt reduksjon i forrige opphold gir 3-månedersregel og historikk', () => {
    const kjede = beregnReduksjonskjede(opphold, {}, true, 1);

    expect(kjede[0].girReduksjon).toBe(false);
    expect(kjede[1].reduksjonErMulig).toBe(false);
    expect(kjede[1].girReduksjon).toBe(false);
  });
});

const lagFormVurdering = (overrides: Partial<OppholdVurdering> = {}): OppholdVurdering => ({
  oppholdId: 'kysthaven',
  begrunnelse: 'begrunnelse',
  periode: { fom: '', tom: '' },
  erNyVurdering: true,
  behøverVurdering: false,
  ...overrides,
});

const reduksjon = (fom = ''): OppholdVurdering =>
  lagFormVurdering({
    faarFriKostOgLosji: JaEllerNei.Ja,
    forsoergerEktefelle: JaEllerNei.Nei,
    harFasteUtgifter: JaEllerNei.Nei,
    periode: { fom, tom: '' },
  });

const ikkeReduksjon = (fom = ''): OppholdVurdering =>
  lagFormVurdering({ faarFriKostOgLosji: JaEllerNei.Nei, periode: { fom, tom: '' } });

const vedtattReduksjon: HelseInstiusjonVurdering = {
  oppholdId: 'kysthaven',
  begrunnelse: 'vedtatt',
  faarFriKostOgLosji: true,
  forsoergerEktefelle: false,
  harFasteUtgifter: false,
  periode: { fom: '2025-08-01', tom: '2025-10-01' },
  vurderingerMeta: {},
  erHistoriskUtenReduksjonsberegning: false,
};

describe('beregnStandardTidligsteReduksjonsdato', () => {
  it('returnerer første dag i måneden fire måneder etter innleggelse', () => {
    expect(beregnStandardTidligsteReduksjonsdato('2025-11-01')).toBe('2026-03-01');
    expect(beregnStandardTidligsteReduksjonsdato('2025-12-15')).toBe('2026-04-01');
  });
});

describe('erReduksjonMuligForOpphold', () => {
  it('returnerer false når tidligste reduksjonsdato er etter oppholdets slutt', () => {
    expect(erReduksjonMuligForOpphold('2026-02-01', '2026-04-01')).toBe(false);
  });

  it('returnerer true når tidligste reduksjonsdato er samme dag som oppholdets slutt', () => {
    expect(erReduksjonMuligForOpphold('2026-04-01', '2026-04-01')).toBe(true);
  });

  it('returnerer true når tidligste reduksjonsdato er før oppholdets slutt', () => {
    expect(erReduksjonMuligForOpphold('2026-06-01', '2026-04-01')).toBe(true);
  });

  it('returnerer true når tidligste reduksjonsdato mangler', () => {
    expect(erReduksjonMuligForOpphold('2026-06-01', undefined)).toBe(true);
    expect(erReduksjonMuligForOpphold('2026-06-01', null)).toBe(true);
  });
});

describe('forrigeOppholdHarIngenReduksjonLengre', () => {
  it('returnerer false uten vurderinger', () => {
    expect(forrigeOppholdHarIngenReduksjonLengre(undefined, [vedtattReduksjon])).toBe(false);
    expect(forrigeOppholdHarIngenReduksjonLengre([], [vedtattReduksjon])).toBe(false);
  });

  it('returnerer false når forrige opphold ikke er besvart', () => {
    expect(forrigeOppholdHarIngenReduksjonLengre([lagFormVurdering()], [vedtattReduksjon])).toBe(false);
  });

  it('returnerer false når en live vurdering fortsatt gir reduksjon', () => {
    expect(forrigeOppholdHarIngenReduksjonLengre([reduksjon('01.08.2025')], [vedtattReduksjon])).toBe(false);
  });

  it('returnerer false når det ikke finnes vedtatt reduksjon', () => {
    expect(forrigeOppholdHarIngenReduksjonLengre([ikkeReduksjon('01.08.2025')], [])).toBe(false);
    expect(forrigeOppholdHarIngenReduksjonLengre([ikkeReduksjon('01.08.2025')], null)).toBe(false);
  });

  it('returnerer false når ingen dato er fylt ut ennå', () => {
    expect(forrigeOppholdHarIngenReduksjonLengre([ikkeReduksjon('')], [vedtattReduksjon])).toBe(false);
  });

  it('returnerer true når reduksjonen stoppes samme dag som vedtatt reduksjon startet', () => {
    expect(forrigeOppholdHarIngenReduksjonLengre([ikkeReduksjon('01.08.2025')], [vedtattReduksjon])).toBe(true);
  });

  it('returnerer false når reduksjonen stoppes etter at vedtatt reduksjon startet', () => {
    expect(forrigeOppholdHarIngenReduksjonLengre([ikkeReduksjon('01.09.2025')], [vedtattReduksjon])).toBe(false);
  });
});

describe('manglerKorrigertReduksjonsdato', () => {
  const forrigeUtenReduksjon = [ikkeReduksjon('01.08.2025')];

  it('returnerer false når forrige opphold fortsatt har reduksjon', () => {
    expect(
      manglerKorrigertReduksjonsdato(
        '01.12.2025',
        [reduksjon('01.01.2026')],
        [reduksjon('01.08.2025')],
        [vedtattReduksjon]
      )
    ).toBe(false);
  });

  it('returnerer true når oppholdet ikke er besvart', () => {
    expect(
      manglerKorrigertReduksjonsdato('01.12.2025', [lagFormVurdering()], forrigeUtenReduksjon, [vedtattReduksjon])
    ).toBe(true);
  });

  it('returnerer false når oppholdet er besvart uten reduksjon', () => {
    expect(
      manglerKorrigertReduksjonsdato('01.12.2025', [ikkeReduksjon('')], forrigeUtenReduksjon, [vedtattReduksjon])
    ).toBe(false);
  });

  it('returnerer false når oppholdet er besvart uten reduksjon med dato før standard tidligste dato', () => {
    expect(
      manglerKorrigertReduksjonsdato(
        '01.10.2026',
        [ikkeReduksjon('15.11.2026')],
        [ikkeReduksjon('26.01.2026')],
        [{ ...vedtattReduksjon, periode: { fom: '2026-05-01', tom: '2026-07-31' } }]
      )
    ).toBe(false);
  });

  it('returnerer true når reduksjonsdato er før standard tidligste dato', () => {
    expect(
      manglerKorrigertReduksjonsdato('01.12.2025', [reduksjon('01.03.2026')], forrigeUtenReduksjon, [vedtattReduksjon])
    ).toBe(true);
  });

  it('returnerer false når reduksjonsdato er lik standard tidligste dato', () => {
    expect(
      manglerKorrigertReduksjonsdato('01.12.2025', [reduksjon('01.04.2026')], forrigeUtenReduksjon, [vedtattReduksjon])
    ).toBe(false);
  });
});

describe('lagReduksjonsBeskrivelse', () => {
  it('viser tidligste reduksjonsdato', () => {
    expect(lagReduksjonsBeskrivelse('2025-11-01', '2026-03-01')).toBe(
      'Innleggelsesmåned: november 2025. Reduksjon kan tidligst starte: 1. mars 2026'
    );
  });
});

describe('getReduksjonsstatus', () => {
  it('prioriterer historikk over reduksjon', () => {
    expect(getReduksjonsstatus(true, true)).toBe(VurderingStatus.HistoriskUtenReduksjonsberegning);
  });

  it('faller tilbake til reduksjon / ikke reduksjon', () => {
    expect(getReduksjonsstatus(true, false)).toBe(VurderingStatus.Reduksjon);
    expect(getReduksjonsstatus(false, false)).toBe(VurderingStatus.IkkeReduksjon);
  });
});

describe('beregnEffektivTidligsteReduksjonsdatoFraSkjema', () => {
  const base = {
    oppholdFra: '2025-11-01',
    tidligsteReduksjonsdato: '2026-03-01',
    forrigeOppholdAvsluttetDato: '2025-09-01',
  };

  it('toggle av: bruker 1-månedsregel når oppholdet er innen 3 måneder, uavhengig av reduksjon', () => {
    const res = beregnEffektivTidligsteReduksjonsdatoFraSkjema({
      ...base,
      forrigeOppholdVurderinger: [ikkeReduksjon('01.08.2025')],
      enManedsregelEnabled: false,
    });
    expect(res).toEqual({ bruker1Månedsregelen: true, effektivTidligsteReduksjonsdato: '2025-12-01' });
  });

  it('toggle på: bruker 1-månedsregel når forrige opphold gir reduksjon', () => {
    const res = beregnEffektivTidligsteReduksjonsdatoFraSkjema({
      ...base,
      forrigeOppholdVurderinger: [reduksjon('01.08.2025')],
      enManedsregelEnabled: true,
    });
    expect(res).toEqual({ bruker1Månedsregelen: true, effektivTidligsteReduksjonsdato: '2025-12-01' });
  });

  it('toggle på: bruker standard dato når forrige opphold har mistet reduksjon', () => {
    const res = beregnEffektivTidligsteReduksjonsdatoFraSkjema({
      ...base,
      forrigeOppholdVurderinger: [ikkeReduksjon('01.08.2025')],
      forrigeOppholdVedtatteVurderinger: [vedtattReduksjon],
      enManedsregelEnabled: true,
    });
    expect(res).toEqual({ bruker1Månedsregelen: false, effektivTidligsteReduksjonsdato: '2026-03-01' });
  });

  it('toggle på: bruker standard dato i stedet for backend-dato når 1-månedsregel ikke gjelder', () => {
    const res = beregnEffektivTidligsteReduksjonsdatoFraSkjema({
      ...base,
      forrigeOppholdAvsluttetDato: '2025-01-01',
      enManedsregelEnabled: true,
    });
    expect(res).toEqual({ bruker1Månedsregelen: false, effektivTidligsteReduksjonsdato: '2026-03-01' });
  });

  it('toggle på: ignorerer utdatert backend-dato', () => {
    const res = beregnEffektivTidligsteReduksjonsdatoFraSkjema({
      oppholdFra: '2026-02-01',
      tidligsteReduksjonsdato: '2026-03-01',
      forrigeOppholdAvsluttetDato: '2026-01-15',
      forrigeGirReduksjon: false,
      enManedsregelEnabled: true,
    });
    expect(res).toEqual({ bruker1Månedsregelen: false, effektivTidligsteReduksjonsdato: '2026-06-01' });
  });

  it('toggle av: bruker backend-dato', () => {
    const res = beregnEffektivTidligsteReduksjonsdatoFraSkjema({
      oppholdFra: '2026-02-01',
      tidligsteReduksjonsdato: '2026-03-01',
      forrigeOppholdAvsluttetDato: '2025-01-01',
      enManedsregelEnabled: false,
    });
    expect(res.effektivTidligsteReduksjonsdato).toBe('2026-03-01');
  });
});

describe('erVurderingHistorisk', () => {
  const lagret = (overrides: Partial<OppholdVurdering> = {}): OppholdVurdering => ({
    ...reduksjon('01.04.2026'),
    erNyVurdering: false,
    ...overrides,
  });

  it('returnerer false når toggle er av', () => {
    expect(erVurderingHistorisk(reduksjon('01.04.2026'), false, false)).toBe(false);
  });

  it('returnerer true for ny reduksjon når reduksjon ikke er mulig', () => {
    expect(erVurderingHistorisk(reduksjon('01.04.2026'), false, true)).toBe(true);
  });

  it('returnerer true for lagret reduksjon når reduksjon ikke er mulig', () => {
    expect(erVurderingHistorisk(lagret(), false, true)).toBe(true);
  });

  it('returnerer false for lagret historisk vurdering når reduksjon blir mulig igjen', () => {
    expect(erVurderingHistorisk(lagret({ erHistoriskUtenReduksjonsberegning: true }), true, true)).toBe(false);
  });

  it('returnerer false for vurdering uten reduksjon', () => {
    expect(erVurderingHistorisk(ikkeReduksjon('01.04.2026'), false, true)).toBe(false);
  });
});

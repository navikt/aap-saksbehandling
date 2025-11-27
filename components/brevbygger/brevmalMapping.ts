import {
  AlternativType,
  BrevdataDto,
  DelmalDto,
  DelmalFormField,
  ValgDto,
  ValgFormField,
} from 'components/brevbygger/Brevbygger';
import { BrevmalType, DelmalReferanse, ValgType } from 'components/brevbygger/brevmodellTypes';

export function erDelmalValgt(delmalId: string, valgteDelmaler?: DelmalDto[]) {
  if (!valgteDelmaler) {
    return false;
  }
  return !!valgteDelmaler.find((delmal) => delmal.id === delmalId);
}

export function erValgValgt(valgNoekkel: string, valgKey: string, valgteValg?: ValgDto[]) {
  if (!valgteValg) {
    return false;
  }
  return !!valgteValg.find((valg) => valg.key === valgKey && valg.id === valgNoekkel);
}

export function mapDelmalerFraSanity(delmaler: DelmalReferanse[], brevdata?: BrevdataDto): DelmalFormField[] {
  return delmaler.map((delmal) => {
    return {
      noekkel: delmal.delmal._id,
      valgt: erDelmalValgt(delmal.delmal._id, brevdata?.delmaler),
      valg: mapValg(delmal, brevdata),
    };
  });
}

function mapValg(delmal: DelmalReferanse, brevdata?: BrevdataDto): ValgFormField[] {
  return delmal.delmal.teksteditor
    .filter((teksteditor) => teksteditor._type === 'valgRef')
    .map((teksteditor) => ({
      noekkel: teksteditor.valg._id,
      key: teksteditor._key,
      alternativer: mapAlternativer(teksteditor.valg),
      valgtAlternativ: erValgValgt(teksteditor.valg._id, teksteditor._key, brevdata?.valg)
        ? `${teksteditor.valg._id};${teksteditor._key}`
        : '',
    }));
}

function mapAlternativer(valg: ValgType): AlternativType[] {
  return valg.alternativer.map((alternativ) => {
    if (alternativ._type === 'fritekst') {
      return { beskrivelse: 'Fritekst', verdi: alternativ._key };
    }
    return { beskrivelse: alternativ.tekst.beskrivelse, verdi: alternativ._key };
  });
}

export function finnParentIdForValgtAlternativ(valgKey: string, brevmal: BrevmalType): string {
  const valgRefs = brevmal.delmaler.flatMap((delmal) =>
    delmal.delmal.teksteditor.filter((teksteditor) => teksteditor._type === 'valgRef')
  );

  const parentId = valgRefs
    .map((valg) => {
      const valget = valg.valg.alternativer.find((alternativ) => alternativ._key === valgKey);
      if (!valget) {
        return null;
      }
      return valg.valg._id;
    })
    .filter((v) => !!v)
    .at(0);

  // iom at vi jobber igjennom eksisterende data skal det alltid være noe her
  return parentId || 'MISSING_ID';
}

export function finnBeskrivelseForDelmal(noekkel: string, brevmal: BrevmalType): string {
  return (
    brevmal.delmaler.find((delmal) => delmal.delmal._id === noekkel)?.delmal.beskrivelse ||
    `Fant ikke beskrivelse for ${noekkel}`
  );
}

export function delmalErObligatorisk(noekkel: string, brevmal: BrevmalType): boolean {
  return !!brevmal.delmaler.find((delmal) => delmal.delmal._id === noekkel)?.obligatorisk;
}

export function finnBeskrivelseForValg(noekkel: string, brevmal: BrevmalType): string {
  const valgRefs = brevmal.delmaler.flatMap((delmal) =>
    delmal.delmal.teksteditor.filter((teksteditor) => teksteditor._type === 'valgRef')
  );

  const beskrivelse = valgRefs.find((valg) => valg.valg._id === noekkel)?.valg.beskrivelse;

  return beskrivelse || `Fant ikke beskrivelse for valg med id ${noekkel}`;
}

export function finnBeskrivelseForAlternativ(noekkel: string, brevmal: BrevmalType): string {
  const valgRefs = brevmal.delmaler.flatMap((delmal) =>
    delmal.delmal.teksteditor.filter((teksteditor) => teksteditor._type === 'valgRef')
  );

  const beskrivelse = valgRefs
    .flatMap((valg) => valg.valg.alternativer.find((alternativ) => alternativ._key === noekkel))
    .filter((v) => !!v)
    .map((valg) => {
      if (valg._type === 'fritekst') {
        return 'Fritekst';
      }
      return valg.tekst.beskrivelse;
    })
    .at(0);

  return beskrivelse || `Fant ikke beskrivelse for alternativ ${noekkel}`;
}

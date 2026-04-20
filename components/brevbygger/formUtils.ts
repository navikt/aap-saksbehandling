import { BrevmalType } from 'components/brevbygger/brevmodellTypes';
import { BrevdataDto, FritekstDto } from 'lib/types/types';
import { BrevFormVerdier } from 'components/brevbygger/types';

export function initialiserFormVerdier(brevmal: BrevmalType, brevdata: BrevdataDto | undefined): BrevFormVerdier {
  const delmaler: Record<string, boolean> = {};
  const valg: Record<string, string> = {};
  const fritekster: Record<string, string> = {};

  for (const delmalRef of brevmal.delmaler) {
    const delmalId = delmalRef.delmal._id;

    delmaler[delmalId] = brevdata?.delmaler.some((delmal) => delmal.id === delmalId) ?? false;

    for (const node of delmalRef.delmal.teksteditor) {
      if (node._type === 'fritekst') {
        const lagretDelmalFritekst = brevdata?.fritekster.find(
          (f) => f.parentId === delmalId && f.key === node._key
        )?.fritekst;

        fritekster[node._key] = lagretDelmalFritekst ? (JSON.parse(lagretDelmalFritekst).tekst ?? '') : '';
      } else if (node._type === 'valgRef') {
        const valgId = node.valg._id;

        valg[valgId] = brevdata?.valg.find((v) => v.id === valgId)?.key ?? '';

        const lagretFritekst = brevdata?.fritekster.find((f) => f.parentId === valgId)?.fritekst;
        fritekster[valgId] = lagretFritekst ? (JSON.parse(lagretFritekst).tekst ?? '') : '';
      }
    }
  }

  return { delmaler, valg, fritekster };
}

export function byggBrevdataPayload(
  formVerdier: BrevFormVerdier,
  brevmal: BrevmalType,
  brevdata: BrevdataDto | undefined
) {
  const valgteDelmaler: { id: string }[] = [];
  const valgteValg: { id: string; key: string }[] = [];
  const fritekster: FritekstDto[] = [];

  for (const delmalRef of brevmal.delmaler) {
    const delmalId = delmalRef.delmal._id;
    const erValgt = formVerdier.delmaler[delmalId] || delmalRef.obligatorisk;

    if (erValgt) {
      valgteDelmaler.push({ id: delmalId });
    }

    for (const node of delmalRef.delmal.teksteditor) {
      if (node._type === 'fritekst') {
        fritekster.push({
          fritekst: JSON.stringify({ tekst: formVerdier.fritekster[node._key] ?? '' }),
          key: node._key,
          parentId: delmalId,
        });
      } else if (node._type === 'valgRef') {
        const valgId = node.valg._id;
        const valgtAlternativKey = formVerdier.valg[valgId];

        if (!valgtAlternativKey) continue;

        valgteValg.push({ id: valgId, key: valgtAlternativKey });

        const valgtAlternativ = node.valg.alternativer.find((a) => a._key === valgtAlternativKey);
        if (valgtAlternativ?._type === 'fritekst') {
          fritekster.push({
            fritekst: JSON.stringify({ tekst: formVerdier.fritekster[valgId] ?? '' }),
            key: valgtAlternativKey,
            parentId: valgId,
          });
        }
      }
    }
  }

  return {
    delmaler: valgteDelmaler,
    valg: valgteValg,
    fritekster,
    betingetTekst: brevdata?.betingetTekst ?? [],
    faktagrunnlag: brevdata?.faktagrunnlag ?? [],
  };
}

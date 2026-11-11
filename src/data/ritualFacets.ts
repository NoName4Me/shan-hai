import type { MountainRitual } from './mountainRituals';

export type RitualFacetKind = '牲与毛' | '玉帛' | '糈米' | '祭法' | '其他';

export function getRitualFacets(ritual: MountainRitual): { kind: RitualFacetKind; text: string }[] {
  const fragments = ritual.ritualText
    .split(/[；;。]/)
    .map((text) => text.trim())
    .filter(Boolean);
  const facets: { kind: RitualFacetKind; text: string }[] = [];
  for (const text of fragments) {
    let assigned = false;
    if (/毛|牲|羊|鸡|犬|彘|豕|牛|太牢|少牢|牺/.test(text)) {
      facets.push({ kind: '牲与毛', text });
      assigned = true;
    }
    if (/玉|璧|珪|圭|璋|瑜/.test(text)) {
      facets.push({ kind: '玉帛', text });
      assigned = true;
    }
    if (/糈|稌|稷|米|五种之精/.test(text)) {
      facets.push({ kind: '糈米', text });
      assigned = true;
    }
    if (/瘗|祈|投|倒祠|羞|舞|巫祝|婴|钤|席/.test(text)) {
      facets.push({ kind: '祭法', text });
      assigned = true;
    }
    if (!assigned) facets.push({ kind: '其他', text });
  }
  return facets;
}

interface PdlInformasjon {
  navn: string;
}

export const hentPersonInformasjonForIdent = (ident: string): PdlInformasjon => {
  console.log(ident);
  return { navn: 'Peder Ås' };
};

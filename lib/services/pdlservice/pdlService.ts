interface PdlInformasjon {
  navn: string;
}

export const hentPersonInformasjonForIdent = async (ident: string): Promise<PdlInformasjon> => {
  console.log(ident);
  return Promise.resolve({ navn: 'Peder Ås' });
};

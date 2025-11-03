import { BrevmalType } from 'components/brevbygger/brevmodellTypes';

export const innvilgelse_brev: BrevmalType = {
  _createdAt: '2025-10-09T12:32:38Z',
  _id: '6b229785-4514-4506-8988-8ac81af51503',
  _originalId: '6b229785-4514-4506-8988-8ac81af51503',
  _rev: 'Nl8fzebt92K0IIEg52UA9t',
  _system: {
    base: {
      id: '6b229785-4514-4506-8988-8ac81af51503',
      rev: '7LgAz0R7ZoY2boRIhQkJqO',
    },
  },
  _type: 'mal',
  _updatedAt: '2025-11-03T13:04:40Z',
  beskrivelse: 'Du får AAP § 11-5 og § 11-6',
  delmaler: [
    {
      _key: '367ca81d44ec',
      _type: 'delmalRef',
      delmal: {
        _createdAt: '2025-10-21T10:58:57Z',
        _id: '8c3fd4d1-7303-4fff-b16f-0006427573c7',
        _originalId: 'drafts.8c3fd4d1-7303-4fff-b16f-0006427573c7',
        _rev: 'a2735741-f0d1-4bbd-a715-97061d9d8c04',
        _system: {
          base: {
            id: '8c3fd4d1-7303-4fff-b16f-0006427573c7',
            rev: 'NmnPDcJ6Ow5wm0UcJxQRUz',
          },
        },
        _type: 'delmal',
        _updatedAt: '2025-10-24T07:02:29Z',
        beskrivelse: '11-5 og 11-6 Vedtak',
        overskrift: null,
        paragraf: '11-5',
        teksteditor: [
          {
            _key: 'cf2acc72cbd2',
            _type: 'block',
            children: [
              {
                _key: '7522d1d3e179',
                _type: 'span',
                marks: [],
                text: 'Du får arbeidsavklaringspenger fra og med og til og med <TOMDATO>',
              },
            ],
            markDefs: [],
            style: 'normal',
          },
          {
            _key: '04538609a816',
            _type: 'block',
            children: [
              {
                _key: 'd54b71512cb6',
                _type: 'span',
                marks: [],
                text: 'Din dagsats er på kroner, som du får 5 dager per uke før skatt.',
              },
            ],
            markDefs: [],
            style: 'normal',
          },
          {
            _key: '38f0e56ac9de',
            _type: 'block',
            children: [
              {
                _key: '65d082d28225',
                _type: 'span',
                marks: [],
                text: 'I dagsatsen er barnetillegg for barn tatt med. Barnetillegget er på kroner per barn, fem dager i uken.',
              },
            ],
            markDefs: [],
            style: 'normal',
          },
          {
            _key: '6a91860c6691',
            _type: 'block',
            children: [
              {
                _key: 'aae4c28991cd',
                _type: 'span',
                marks: [],
                text: '',
              },
            ],
            markDefs: [],
            style: 'normal',
          },
        ],
      },
      obligatorisk: true,
    },
    {
      _key: '2bef4a23605c',
      _type: 'delmalRef',
      delmal: {
        _createdAt: '2025-10-22T05:16:20Z',
        _id: 'd0dfc958-022d-47b5-a2a6-8ba25b4263e5',
        _originalId: 'd0dfc958-022d-47b5-a2a6-8ba25b4263e5',
        _rev: 'Nl8fzebt92K0IIEg52OMTX',
        _system: {
          base: {
            id: 'd0dfc958-022d-47b5-a2a6-8ba25b4263e5',
            rev: '8jAv54VtX60Zp2eNQKielQ',
          },
        },
        _type: 'delmal',
        _updatedAt: '2025-11-03T12:45:53Z',
        beskrivelse: 'A versjon Virkningstidspunkt etter sykepenger ',
        overskrift: null,
        teksteditor: [
          {
            _key: 'da0923dbd633',
            _type: 'valgRef',
            obligatorisk: false,
            valg: {
              _createdAt: '2025-10-22T06:06:02Z',
              _id: '428f1d7f-42be-479d-b52a-0b86a9a620c9',
              _originalId: '428f1d7f-42be-479d-b52a-0b86a9a620c9',
              _rev: 'Nl8fzebt92K0IIEg52JacQ',
              _system: {
                base: {
                  id: '428f1d7f-42be-479d-b52a-0b86a9a620c9',
                  rev: 'kmx5YUkUi70yACXomrEbzJ',
                },
              },
              _type: 'valg',
              _updatedAt: '2025-11-03T12:36:50Z',
              alternativer: [
                {
                  _key: 'da5f41f88ae1',
                  _type: 'kategorisertTekstRef',
                  kategori: null,
                  tekst: {
                    _createdAt: '2025-10-22T06:06:39Z',
                    _id: '8374ddfd-1381-44c7-9e94-040d8f711000',
                    _originalId: '8374ddfd-1381-44c7-9e94-040d8f711000',
                    _rev: 'kmx5YUkUi70yACXomrDQq9',
                    _type: 'tekst',
                    _updatedAt: '2025-10-22T06:07:09Z',
                    beskrivelse: 'Sykepenger under 2G - AAP høyeste ytelse',
                    teksteditor: [
                      {
                        _id: null,
                        _key: 'a59b9b6b4d79',
                        _type: 'block',
                        children: [
                          {
                            _key: 'e3e588f90fca',
                            _type: 'span',
                            marks: [],
                            text: 'Du får arbeidsavklaringspenger fra den dagen du søkte.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                      {
                        _id: null,
                        _key: 'f6046fb2dcbb',
                        _type: 'block',
                        children: [
                          {
                            _key: 'd2353fed3d26',
                            _type: 'span',
                            marks: [],
                            text: 'Du kan velge om du vil motta arbeidsavklaringspenger eller sykepenger, men siden arbeidsavklaringspenger gir deg en høyere utbetaling enn sykepenger, har vi stanset sykepengene dine fra DATO.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                      {
                        _id: null,
                        _key: 'a01c05902c8c',
                        _type: 'block',
                        children: [
                          {
                            _key: 'dc5644c35a78',
                            _type: 'span',
                            marks: [],
                            text: 'Sykepenger som er utbetalt i perioden X til X vil bli trukket fra utbetaling av arbeidsavklaringspenger for samme periode. Hvis du heller ønsker å få sykepenger, må du gi oss beskjed.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                    ],
                  },
                },
                {
                  _key: '07ea1b050e46',
                  _type: 'kategorisertTekstRef',
                  kategori: null,
                  tekst: {
                    _createdAt: '2025-10-22T06:07:44Z',
                    _id: '91bd686a-19f5-46af-950d-8c172fc3d960',
                    _originalId: '91bd686a-19f5-46af-950d-8c172fc3d960',
                    _rev: 'kmx5YUkUi70yACXomrDTpE',
                    _type: 'tekst',
                    _updatedAt: '2025-10-22T06:08:08Z',
                    beskrivelse: 'Sykepenger 2G eller mer/etter maksdato sykepenger',
                    teksteditor: [
                      {
                        _id: null,
                        _key: 'd794b0a4ff36',
                        _type: 'block',
                        children: [
                          {
                            _key: '0340d238f2f6',
                            _type: 'span',
                            marks: [],
                            text: '\nDu får arbeidsavklaringspenger etter den siste dagen din med sykepenger.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                      {
                        _id: null,
                        _key: 'a0d8ca853e31',
                        _type: 'block',
                        children: [
                          {
                            _key: '2caef488ffcb',
                            _type: 'span',
                            marks: [],
                            text: 'Du kan velge om du vil motta arbeidsavklaringspenger eller sykepenger. Arbeidsavklaringspenger vil gi deg en høyere utbetaling enn sykepenger, men fordi du får sykepengene dine utbetalt fra arbeidsgiveren din, kan du først få arbeidsavklaringspenger fra den dagen arbeidsgiveren din stanser utbetalingen av sykepenger til deg.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                      {
                        _id: null,
                        _key: '3f9dc07642e7',
                        _type: 'block',
                        children: [
                          {
                            _key: '7920cc62fb87',
                            _type: 'span',
                            marks: [],
                            text: 'Hvis du heller ønsker arbeidsavklaringspenger enn sykepenger, må du sende oss dokumentasjon på hvilken dag arbeidsgiveren din stanser utbetalingen til deg, og/eller om du skal betale tilbake sykepengene til arbeidsgiveren din.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                      {
                        _id: null,
                        _key: 'd803730019c3',
                        _type: 'block',
                        children: [
                          {
                            _key: '83223ff01101',
                            _type: 'span',
                            marks: [],
                            text: 'Du må gi oss beskjed hvis du skal ta ut mer ferie. Ferien forskyver både sykepengene dine og den første dagen du får arbeidsavklaringspenger fra.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                    ],
                  },
                },
                {
                  _key: '592144cd7ea6',
                  _type: 'kategorisertTekstRef',
                  kategori: null,
                  tekst: {
                    _createdAt: '2025-10-22T06:11:19Z',
                    _id: '0c8ae21e-adc6-47d2-b2c4-f69ddce7ede7',
                    _originalId: '0c8ae21e-adc6-47d2-b2c4-f69ddce7ede7',
                    _rev: 'Ne0hT7HyW88EPVoynS51EP',
                    _type: 'tekst',
                    _updatedAt: '2025-10-22T06:11:29Z',
                    beskrivelse: 'Sykepenger under 2G /AAP høyeste ytelse, men refusjon til arbeidsgiver',
                    teksteditor: [
                      {
                        _id: null,
                        _key: '29df7449de1b',
                        _type: 'block',
                        children: [
                          {
                            _key: 'b2d3ebb0eb6b',
                            _type: 'span',
                            marks: [],
                            text: 'Du får arbeidsavklaringspenger etter den siste dagen din med sykepenger.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                      {
                        _id: null,
                        _key: 'e61dc47e8b52',
                        _type: 'block',
                        children: [
                          {
                            _key: '39f36f5ece64',
                            _type: 'span',
                            marks: [],
                            text: '',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                      {
                        _id: null,
                        _key: 'eac8f9da6075',
                        _type: 'block',
                        children: [
                          {
                            _key: '6bd2680861fe',
                            _type: 'span',
                            marks: [],
                            text: 'Du kan velge om du vil motta arbeidsavklaringspenger eller sykepenger. Arbeidsavklaringspenger vil gi deg en høyere utbetaling enn sykepenger, men fordi du får sykepengene dine utbetalt fra arbeidsgiveren din, kan du først få arbeidsavklaringspenger fra den dagen arbeidsgiveren din stanser utbetalingen av sykepenger til deg.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                      {
                        _id: null,
                        _key: '68f8eab1c7a3',
                        _type: 'block',
                        children: [
                          {
                            _key: '13584bb4be97',
                            _type: 'span',
                            marks: [],
                            text: '',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                      {
                        _id: null,
                        _key: 'c97f33df8c8b',
                        _type: 'block',
                        children: [
                          {
                            _key: '6d46472ddf4c',
                            _type: 'span',
                            marks: [],
                            text: 'Hvis du heller ønsker arbeidsavklaringspenger enn sykepenger, må du sende oss dokumentasjon på hvilken dag arbeidsgiveren din stanser utbetalingen til deg, og/eller om du skal betale tilbake sykepengene til arbeidsgiveren din.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                      {
                        _id: null,
                        _key: '6f4fe64e88f5',
                        _type: 'block',
                        children: [
                          {
                            _key: '4e98fb3bd784',
                            _type: 'span',
                            marks: [],
                            text: '',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                      {
                        _id: null,
                        _key: '18e2af4c0dfa',
                        _type: 'block',
                        children: [
                          {
                            _key: '38e527aa02b3',
                            _type: 'span',
                            marks: [],
                            text: 'Du må gi oss beskjed hvis du skal ta ut mer ferie. Ferien forskyver både sykepengene dine og den første dagen du får arbeidsavklaringspenger fra.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                    ],
                  },
                },
                {
                  _key: '2e923955b9f4',
                  _type: 'kategorisertTekstRef',
                  kategori: null,
                  tekst: {
                    _createdAt: '2025-10-22T06:11:53Z',
                    _id: '9ed8e313-356a-47e0-ac01-540e8f8122e7',
                    _originalId: '9ed8e313-356a-47e0-ac01-540e8f8122e7',
                    _rev: 'kmx5YUkUi70yACXomrEaOb',
                    _system: {
                      base: {
                        id: '9ed8e313-356a-47e0-ac01-540e8f8122e7',
                        rev: 'kmx5YUkUi70yACXomrEL1m',
                      },
                    },
                    _type: 'tekst',
                    _updatedAt: '2025-10-22T06:15:38Z',
                    beskrivelse: 'Sykepenger under 2G /Sykepenger høyeste ytelse',
                    teksteditor: [
                      {
                        _id: null,
                        _key: '50dfede38c1c',
                        _type: 'block',
                        children: [
                          {
                            _key: '1f0b4e7bf72c',
                            _type: 'span',
                            marks: [],
                            text: 'Du får arbeidsavklaringspenger etter den siste dagen din med sykepenger, fordi sykepenger gir deg en høyere utbetaling enn arbeidsavklaringspenger.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                      {
                        _id: null,
                        _key: '56511b75560b',
                        _type: 'block',
                        children: [
                          {
                            _key: 'ad3fc49bb927',
                            _type: 'span',
                            marks: [],
                            text: 'Du kan velge om du heller vil motta arbeidsavklaringspenger, men da må du gi oss beskjed om dette.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                      {
                        _id: null,
                        _key: '54e4fbd772d1',
                        _type: 'block',
                        children: [
                          {
                            _key: 'd6ee128b304f',
                            _type: 'span',
                            marks: [],
                            text: 'Du må også gi oss beskjed hvis du skal ta ut mer ferie. Ferien forskyver både sykepengene dine, og den første dagen du får arbeidsavklaringspenger fra.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                    ],
                  },
                },
              ],
              beskrivelse: 'Sykepenger ',
            },
          },
        ],
      },
      obligatorisk: false,
    },
    {
      _key: 'b9baeac087f7',
      _type: 'delmalRef',
      delmal: {
        _createdAt: '2025-10-16T12:52:25Z',
        _id: '1953d7af-1dff-4dcc-b23d-d682fdbc4bee',
        _originalId: '1953d7af-1dff-4dcc-b23d-d682fdbc4bee',
        _rev: 'Nl8fzebt92K0IIEg52ONVQ',
        _system: {
          base: {
            id: '1953d7af-1dff-4dcc-b23d-d682fdbc4bee',
            rev: 'kmx5YUkUi70yACXomr9cOO',
          },
        },
        _type: 'delmal',
        _updatedAt: '2025-11-03T12:46:16Z',
        beskrivelse: 'A versjon Virkningstidspunkt fra kravdato og bak i tid',
        overskrift: null,
        paragraf: '22',
        teksteditor: [
          {
            _key: 'f31a45033cd6',
            _type: 'block',
            children: [
              {
                _key: 'd526fdbb9ce9',
                _type: 'span',
                marks: [],
                text: 'Som hovedregel kan du få AAP tidligst fra og med den dagen du søkte.',
              },
            ],
            markDefs: [],
            style: 'normal',
          },
          {
            _key: 'efd92138d195',
            _type: 'valgRef',
            obligatorisk: true,
            valg: {
              _createdAt: '2025-10-16T12:53:10Z',
              _id: '230aab21-9aca-44f8-9ce8-35b97cf321ae', // DETTE ER NOEKKEL
              _originalId: 'drafts.230aab21-9aca-44f8-9ce8-35b97cf321ae',
              _rev: 'aebc2965-5857-4b44-8d32-a43f2f9d4a79',
              _system: {
                base: {
                  id: '230aab21-9aca-44f8-9ce8-35b97cf321ae',
                  rev: 'NmnPDcJ6Ow5wm0UcJormMx',
                },
              },
              _type: 'valg',
              _updatedAt: '2025-11-03T12:36:41Z',
              alternativer: [
                {
                  _key: '685707aebd9d', // DETTE ER KEY
                  _type: 'kategorisertTekstRef',
                  kategori: null,
                  tekst: {
                    _createdAt: '2025-10-17T05:13:16Z',
                    _id: 'c26c4804-72ca-4243-8a97-93d72549325b',
                    _originalId: 'c26c4804-72ca-4243-8a97-93d72549325b',
                    _rev: 'NmnPDcJ6Ow5wm0UcJUee0s',
                    _system: {
                      base: {
                        id: 'c26c4804-72ca-4243-8a97-93d72549325b',
                        rev: 'NmnPDcJ6Ow5wm0UcJUePoR',
                      },
                    },
                    _type: 'tekst',
                    _updatedAt: '2025-10-17T05:14:27Z',
                    beskrivelse: 'Virkningstidspunkt - fra søknadsdato',
                    teksteditor: [
                      {
                        _id: null,
                        _key: '19cfd298447c',
                        _type: 'block',
                        children: [
                          {
                            _key: '71f0ddca30b0',
                            _type: 'span',
                            marks: [],
                            text: 'Du får arbeidsavklaringspenger fra den dagen du søkte. Dette er det tidligste tidspunktet vi kan innvilge arbeidsavklaringspenger fra.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                    ],
                  },
                },
                {
                  _key: '11a68ff3786e',
                  _type: 'kategorisertTekstRef',
                  kategori: null,
                  tekst: {
                    _createdAt: '2025-10-16T12:53:38Z',
                    _id: 'e08afb12-9ebb-4526-bca0-68d25ca3c2a7',
                    _originalId: 'e08afb12-9ebb-4526-bca0-68d25ca3c2a7',
                    _rev: 'NmnPDcJ6Ow5wm0UcJPQCmC',
                    _system: {
                      base: {
                        id: 'e08afb12-9ebb-4526-bca0-68d25ca3c2a7',
                        rev: 'Sj0Xul44GrxyX70TXbaBUo',
                      },
                    },
                    _type: 'tekst',
                    _updatedAt: '2025-10-16T13:19:52Z',
                    beskrivelse: 'Virkningstidspunkt - burde blitt informert',
                    teksteditor: [
                      {
                        _id: null,
                        _key: 'ab1e94f6472f',
                        _type: 'block',
                        children: [
                          {
                            _key: '4f867e9a3a33',
                            _type: 'span',
                            marks: [],
                            text: 'Du får arbeidsavklaringspenger fra <VIRKNINGSTIDSPUNKT>, fordi du burde blitt informert om muligheten til å søke om arbeidsavklaringspenger denne dagen.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                    ],
                  },
                },
                {
                  _key: '3c86e34ceab1',
                  _type: 'kategorisertTekstRef',
                  kategori: null,
                  tekst: {
                    _createdAt: '2025-10-16T13:20:17Z',
                    _id: 'f9d69bfb-8694-421a-afbd-20a11f5141ca',
                    _originalId: 'f9d69bfb-8694-421a-afbd-20a11f5141ca',
                    _rev: 'hdi3vzKUcAFbVK5d3xJvH5',
                    _type: 'tekst',
                    _updatedAt: '2025-10-16T13:20:52Z',
                    beskrivelse: 'Virkningstidspunkt - ikke har vært i stand ',
                    teksteditor: [
                      {
                        _id: null,
                        _key: '5047852e74f5',
                        _type: 'block',
                        children: [
                          {
                            _key: 'c5ceb7ed46a9',
                            _type: 'span',
                            marks: [],
                            text: 'Du får arbeidsavklaringspenger fra <VIRKNINGSTIDSPUNKT>, fordi du åpenbart ikke har vært i stand til å søke om arbeidsavklaringspenger fra denne dagen.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                    ],
                  },
                },
              ],
              beskrivelse: 'Virkningstidspunkt fra kravdato/bak i tid',
            },
          },
        ],
      },
      obligatorisk: false,
    },
    {
      _key: '1dde526a4073',
      _type: 'delmalRef',
      delmal: {
        _createdAt: '2025-11-03T12:35:22Z',
        _id: '713c8f1d-cbd3-47bf-ba61-8366653b5572',
        _originalId: '713c8f1d-cbd3-47bf-ba61-8366653b5572',
        _rev: '52NDUzRzX75RWMcJDBAKoz',
        _system: {
          base: {
            id: '713c8f1d-cbd3-47bf-ba61-8366653b5572',
            rev: '7LgAz0R7ZoY2boRIhQg7ub',
          },
        },
        _type: 'delmal',
        _updatedAt: '2025-11-03T12:50:24Z',
        beskrivelse: 'B versjon: Virkningstidspunkt',
        overskrift: null,
        teksteditor: [
          {
            _key: '0723c272f015',
            _type: 'valgRef',
            obligatorisk: false,
            valg: {
              _createdAt: '2025-10-22T06:06:02Z',
              _id: '428f1d7f-42be-479d-b52a-0b86a9a620c9',
              _originalId: '428f1d7f-42be-479d-b52a-0b86a9a620c9',
              _rev: 'Nl8fzebt92K0IIEg52JacQ',
              _system: {
                base: {
                  id: '428f1d7f-42be-479d-b52a-0b86a9a620c9',
                  rev: 'kmx5YUkUi70yACXomrEbzJ',
                },
              },
              _type: 'valg',
              _updatedAt: '2025-11-03T12:36:50Z',
              alternativer: [
                {
                  _key: 'da5f41f88ae1',
                  _type: 'kategorisertTekstRef',
                  kategori: null,
                  tekst: {
                    _createdAt: '2025-10-22T06:06:39Z',
                    _id: '8374ddfd-1381-44c7-9e94-040d8f711000',
                    _originalId: '8374ddfd-1381-44c7-9e94-040d8f711000',
                    _rev: 'kmx5YUkUi70yACXomrDQq9',
                    _type: 'tekst',
                    _updatedAt: '2025-10-22T06:07:09Z',
                    beskrivelse: 'Sykepenger under 2G - AAP høyeste ytelse',
                    teksteditor: [
                      {
                        _id: null,
                        _key: 'a59b9b6b4d79',
                        _type: 'block',
                        children: [
                          {
                            _key: 'e3e588f90fca',
                            _type: 'span',
                            marks: [],
                            text: 'Du får arbeidsavklaringspenger fra den dagen du søkte.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                      {
                        _id: null,
                        _key: 'f6046fb2dcbb',
                        _type: 'block',
                        children: [
                          {
                            _key: 'd2353fed3d26',
                            _type: 'span',
                            marks: [],
                            text: 'Du kan velge om du vil motta arbeidsavklaringspenger eller sykepenger, men siden arbeidsavklaringspenger gir deg en høyere utbetaling enn sykepenger, har vi stanset sykepengene dine fra DATO.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                      {
                        _id: null,
                        _key: 'a01c05902c8c',
                        _type: 'block',
                        children: [
                          {
                            _key: 'dc5644c35a78',
                            _type: 'span',
                            marks: [],
                            text: 'Sykepenger som er utbetalt i perioden X til X vil bli trukket fra utbetaling av arbeidsavklaringspenger for samme periode. Hvis du heller ønsker å få sykepenger, må du gi oss beskjed.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                    ],
                  },
                },
                {
                  _key: '07ea1b050e46',
                  _type: 'kategorisertTekstRef',
                  kategori: null,
                  tekst: {
                    _createdAt: '2025-10-22T06:07:44Z',
                    _id: '91bd686a-19f5-46af-950d-8c172fc3d960',
                    _originalId: '91bd686a-19f5-46af-950d-8c172fc3d960',
                    _rev: 'kmx5YUkUi70yACXomrDTpE',
                    _type: 'tekst',
                    _updatedAt: '2025-10-22T06:08:08Z',
                    beskrivelse: 'Sykepenger 2G eller mer/etter maksdato sykepenger',
                    teksteditor: [
                      {
                        _id: null,
                        _key: 'd794b0a4ff36',
                        _type: 'block',
                        children: [
                          {
                            _key: '0340d238f2f6',
                            _type: 'span',
                            marks: [],
                            text: '\nDu får arbeidsavklaringspenger etter den siste dagen din med sykepenger.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                      {
                        _id: null,
                        _key: 'a0d8ca853e31',
                        _type: 'block',
                        children: [
                          {
                            _key: '2caef488ffcb',
                            _type: 'span',
                            marks: [],
                            text: 'Du kan velge om du vil motta arbeidsavklaringspenger eller sykepenger. Arbeidsavklaringspenger vil gi deg en høyere utbetaling enn sykepenger, men fordi du får sykepengene dine utbetalt fra arbeidsgiveren din, kan du først få arbeidsavklaringspenger fra den dagen arbeidsgiveren din stanser utbetalingen av sykepenger til deg.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                      {
                        _id: null,
                        _key: '3f9dc07642e7',
                        _type: 'block',
                        children: [
                          {
                            _key: '7920cc62fb87',
                            _type: 'span',
                            marks: [],
                            text: 'Hvis du heller ønsker arbeidsavklaringspenger enn sykepenger, må du sende oss dokumentasjon på hvilken dag arbeidsgiveren din stanser utbetalingen til deg, og/eller om du skal betale tilbake sykepengene til arbeidsgiveren din.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                      {
                        _id: null,
                        _key: 'd803730019c3',
                        _type: 'block',
                        children: [
                          {
                            _key: '83223ff01101',
                            _type: 'span',
                            marks: [],
                            text: 'Du må gi oss beskjed hvis du skal ta ut mer ferie. Ferien forskyver både sykepengene dine og den første dagen du får arbeidsavklaringspenger fra.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                    ],
                  },
                },
                {
                  _key: '592144cd7ea6',
                  _type: 'kategorisertTekstRef',
                  kategori: null,
                  tekst: {
                    _createdAt: '2025-10-22T06:11:19Z',
                    _id: '0c8ae21e-adc6-47d2-b2c4-f69ddce7ede7',
                    _originalId: '0c8ae21e-adc6-47d2-b2c4-f69ddce7ede7',
                    _rev: 'Ne0hT7HyW88EPVoynS51EP',
                    _type: 'tekst',
                    _updatedAt: '2025-10-22T06:11:29Z',
                    beskrivelse: 'Sykepenger under 2G /AAP høyeste ytelse, men refusjon til arbeidsgiver',
                    teksteditor: [
                      {
                        _id: null,
                        _key: '29df7449de1b',
                        _type: 'block',
                        children: [
                          {
                            _key: 'b2d3ebb0eb6b',
                            _type: 'span',
                            marks: [],
                            text: 'Du får arbeidsavklaringspenger etter den siste dagen din med sykepenger.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                      {
                        _id: null,
                        _key: 'e61dc47e8b52',
                        _type: 'block',
                        children: [
                          {
                            _key: '39f36f5ece64',
                            _type: 'span',
                            marks: [],
                            text: '',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                      {
                        _id: null,
                        _key: 'eac8f9da6075',
                        _type: 'block',
                        children: [
                          {
                            _key: '6bd2680861fe',
                            _type: 'span',
                            marks: [],
                            text: 'Du kan velge om du vil motta arbeidsavklaringspenger eller sykepenger. Arbeidsavklaringspenger vil gi deg en høyere utbetaling enn sykepenger, men fordi du får sykepengene dine utbetalt fra arbeidsgiveren din, kan du først få arbeidsavklaringspenger fra den dagen arbeidsgiveren din stanser utbetalingen av sykepenger til deg.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                      {
                        _id: null,
                        _key: '68f8eab1c7a3',
                        _type: 'block',
                        children: [
                          {
                            _key: '13584bb4be97',
                            _type: 'span',
                            marks: [],
                            text: '',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                      {
                        _id: null,
                        _key: 'c97f33df8c8b',
                        _type: 'block',
                        children: [
                          {
                            _key: '6d46472ddf4c',
                            _type: 'span',
                            marks: [],
                            text: 'Hvis du heller ønsker arbeidsavklaringspenger enn sykepenger, må du sende oss dokumentasjon på hvilken dag arbeidsgiveren din stanser utbetalingen til deg, og/eller om du skal betale tilbake sykepengene til arbeidsgiveren din.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                      {
                        _id: null,
                        _key: '6f4fe64e88f5',
                        _type: 'block',
                        children: [
                          {
                            _key: '4e98fb3bd784',
                            _type: 'span',
                            marks: [],
                            text: '',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                      {
                        _id: null,
                        _key: '18e2af4c0dfa',
                        _type: 'block',
                        children: [
                          {
                            _key: '38e527aa02b3',
                            _type: 'span',
                            marks: [],
                            text: 'Du må gi oss beskjed hvis du skal ta ut mer ferie. Ferien forskyver både sykepengene dine og den første dagen du får arbeidsavklaringspenger fra.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                    ],
                  },
                },
                {
                  _key: '2e923955b9f4',
                  _type: 'kategorisertTekstRef',
                  kategori: null,
                  tekst: {
                    _createdAt: '2025-10-22T06:11:53Z',
                    _id: '9ed8e313-356a-47e0-ac01-540e8f8122e7',
                    _originalId: '9ed8e313-356a-47e0-ac01-540e8f8122e7',
                    _rev: 'kmx5YUkUi70yACXomrEaOb',
                    _system: {
                      base: {
                        id: '9ed8e313-356a-47e0-ac01-540e8f8122e7',
                        rev: 'kmx5YUkUi70yACXomrEL1m',
                      },
                    },
                    _type: 'tekst',
                    _updatedAt: '2025-10-22T06:15:38Z',
                    beskrivelse: 'Sykepenger under 2G /Sykepenger høyeste ytelse',
                    teksteditor: [
                      {
                        _id: null,
                        _key: '50dfede38c1c',
                        _type: 'block',
                        children: [
                          {
                            _key: '1f0b4e7bf72c',
                            _type: 'span',
                            marks: [],
                            text: 'Du får arbeidsavklaringspenger etter den siste dagen din med sykepenger, fordi sykepenger gir deg en høyere utbetaling enn arbeidsavklaringspenger.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                      {
                        _id: null,
                        _key: '56511b75560b',
                        _type: 'block',
                        children: [
                          {
                            _key: 'ad3fc49bb927',
                            _type: 'span',
                            marks: [],
                            text: 'Du kan velge om du heller vil motta arbeidsavklaringspenger, men da må du gi oss beskjed om dette.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                      {
                        _id: null,
                        _key: '54e4fbd772d1',
                        _type: 'block',
                        children: [
                          {
                            _key: 'd6ee128b304f',
                            _type: 'span',
                            marks: [],
                            text: 'Du må også gi oss beskjed hvis du skal ta ut mer ferie. Ferien forskyver både sykepengene dine, og den første dagen du får arbeidsavklaringspenger fra.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                    ],
                  },
                },
              ],
              beskrivelse: 'Sykepenger ',
            },
          },
          {
            _key: '434d3c04205e',
            _type: 'valgRef',
            obligatorisk: false,
            valg: {
              _createdAt: '2025-10-16T12:53:10Z',
              _id: '230aab21-9aca-44f8-9ce8-35b97cf321ae',
              _originalId: 'drafts.230aab21-9aca-44f8-9ce8-35b97cf321ae',
              _rev: 'aebc2965-5857-4b44-8d32-a43f2f9d4a79',
              _system: {
                base: {
                  id: '230aab21-9aca-44f8-9ce8-35b97cf321ae',
                  rev: 'NmnPDcJ6Ow5wm0UcJormMx',
                },
              },
              _type: 'valg',
              _updatedAt: '2025-11-03T12:36:41Z',
              alternativer: [
                {
                  _key: '685707aebd9d',
                  _type: 'kategorisertTekstRef',
                  kategori: null,
                  tekst: {
                    _createdAt: '2025-10-17T05:13:16Z',
                    _id: 'c26c4804-72ca-4243-8a97-93d72549325b',
                    _originalId: 'c26c4804-72ca-4243-8a97-93d72549325b',
                    _rev: 'NmnPDcJ6Ow5wm0UcJUee0s',
                    _system: {
                      base: {
                        id: 'c26c4804-72ca-4243-8a97-93d72549325b',
                        rev: 'NmnPDcJ6Ow5wm0UcJUePoR',
                      },
                    },
                    _type: 'tekst',
                    _updatedAt: '2025-10-17T05:14:27Z',
                    beskrivelse: 'Virkningstidspunkt - fra søknadsdato',
                    teksteditor: [
                      {
                        _id: null,
                        _key: '19cfd298447c',
                        _type: 'block',
                        children: [
                          {
                            _key: '71f0ddca30b0',
                            _type: 'span',
                            marks: [],
                            text: 'Du får arbeidsavklaringspenger fra den dagen du søkte. Dette er det tidligste tidspunktet vi kan innvilge arbeidsavklaringspenger fra.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                    ],
                  },
                },
                {
                  _key: '11a68ff3786e',
                  _type: 'kategorisertTekstRef',
                  kategori: null,
                  tekst: {
                    _createdAt: '2025-10-16T12:53:38Z',
                    _id: 'e08afb12-9ebb-4526-bca0-68d25ca3c2a7',
                    _originalId: 'e08afb12-9ebb-4526-bca0-68d25ca3c2a7',
                    _rev: 'NmnPDcJ6Ow5wm0UcJPQCmC',
                    _system: {
                      base: {
                        id: 'e08afb12-9ebb-4526-bca0-68d25ca3c2a7',
                        rev: 'Sj0Xul44GrxyX70TXbaBUo',
                      },
                    },
                    _type: 'tekst',
                    _updatedAt: '2025-10-16T13:19:52Z',
                    beskrivelse: 'Virkningstidspunkt - burde blitt informert',
                    teksteditor: [
                      {
                        _id: null,
                        _key: 'ab1e94f6472f',
                        _type: 'block',
                        children: [
                          {
                            _key: '4f867e9a3a33',
                            _type: 'span',
                            marks: [],
                            text: 'Du får arbeidsavklaringspenger fra <VIRKNINGSTIDSPUNKT>, fordi du burde blitt informert om muligheten til å søke om arbeidsavklaringspenger denne dagen.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                    ],
                  },
                },
                {
                  _key: '3c86e34ceab1',
                  _type: 'kategorisertTekstRef',
                  kategori: null,
                  tekst: {
                    _createdAt: '2025-10-16T13:20:17Z',
                    _id: 'f9d69bfb-8694-421a-afbd-20a11f5141ca',
                    _originalId: 'f9d69bfb-8694-421a-afbd-20a11f5141ca',
                    _rev: 'hdi3vzKUcAFbVK5d3xJvH5',
                    _type: 'tekst',
                    _updatedAt: '2025-10-16T13:20:52Z',
                    beskrivelse: 'Virkningstidspunkt - ikke har vært i stand ',
                    teksteditor: [
                      {
                        _id: null,
                        _key: '5047852e74f5',
                        _type: 'block',
                        children: [
                          {
                            _key: 'c5ceb7ed46a9',
                            _type: 'span',
                            marks: [],
                            text: 'Du får arbeidsavklaringspenger fra <VIRKNINGSTIDSPUNKT>, fordi du åpenbart ikke har vært i stand til å søke om arbeidsavklaringspenger fra denne dagen.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                    ],
                  },
                },
              ],
              beskrivelse: 'Virkningstidspunkt fra kravdato/bak i tid',
            },
          },
          {
            _key: 'e430432601ba',
            _type: 'block',
            children: [
              {
                _key: '1d6aab4f81c3',
                _type: 'span',
                marks: [],
                text: '',
              },
            ],
            markDefs: [],
            style: 'normal',
          },
        ],
      },
      obligatorisk: false,
    },
    {
      _key: 'f2d4ddc472a6',
      _type: 'delmalRef',
      delmal: {
        _createdAt: '2025-11-03T12:38:17Z',
        _id: '6c1cb811-0473-4f4a-9fd6-bb1aae5c3039',
        _originalId: '6c1cb811-0473-4f4a-9fd6-bb1aae5c3039',
        _rev: 'mVrFSmxQgD36mnavq3mLwd',
        _system: {
          base: {
            id: '6c1cb811-0473-4f4a-9fd6-bb1aae5c3039',
            rev: '174eKF9wLgGSPSClIFOPKC',
          },
        },
        _type: 'delmal',
        _updatedAt: '2025-11-03T12:45:25Z',
        beskrivelse: 'C versjon virkningstidspunkt',
        overskrift: null,
        teksteditor: [
          {
            _key: 'f632539f7d1a',
            _type: 'block',
            children: [
              {
                _key: '211a309f034d',
                _type: 'span',
                marks: [],
                text: 'Som hovedregel får du ...',
              },
            ],
            markDefs: [],
            style: 'normal',
          },
          {
            _key: '8eb437955d8e',
            _type: 'valgRef',
            obligatorisk: false,
            valg: {
              _createdAt: '2025-11-03T12:41:01Z',
              _id: '1e973eda-933b-4f76-8468-c964482f0bd1',
              _originalId: '1e973eda-933b-4f76-8468-c964482f0bd1',
              _rev: 'R42yQy42ppXvMy9ZaPwuy1',
              _type: 'valg',
              _updatedAt: '2025-11-03T12:44:39Z',
              alternativer: [
                {
                  _key: '20e5a62902fe',
                  _type: 'kategorisertTekstRef',
                  kategori: null,
                  tekst: {
                    _createdAt: '2025-10-22T06:06:39Z',
                    _id: '8374ddfd-1381-44c7-9e94-040d8f711000',
                    _originalId: '8374ddfd-1381-44c7-9e94-040d8f711000',
                    _rev: 'kmx5YUkUi70yACXomrDQq9',
                    _type: 'tekst',
                    _updatedAt: '2025-10-22T06:07:09Z',
                    beskrivelse: 'Sykepenger under 2G - AAP høyeste ytelse',
                    teksteditor: [
                      {
                        _id: null,
                        _key: 'a59b9b6b4d79',
                        _type: 'block',
                        children: [
                          {
                            _key: 'e3e588f90fca',
                            _type: 'span',
                            marks: [],
                            text: 'Du får arbeidsavklaringspenger fra den dagen du søkte.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                      {
                        _id: null,
                        _key: 'f6046fb2dcbb',
                        _type: 'block',
                        children: [
                          {
                            _key: 'd2353fed3d26',
                            _type: 'span',
                            marks: [],
                            text: 'Du kan velge om du vil motta arbeidsavklaringspenger eller sykepenger, men siden arbeidsavklaringspenger gir deg en høyere utbetaling enn sykepenger, har vi stanset sykepengene dine fra DATO.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                      {
                        _id: null,
                        _key: 'a01c05902c8c',
                        _type: 'block',
                        children: [
                          {
                            _key: 'dc5644c35a78',
                            _type: 'span',
                            marks: [],
                            text: 'Sykepenger som er utbetalt i perioden X til X vil bli trukket fra utbetaling av arbeidsavklaringspenger for samme periode. Hvis du heller ønsker å få sykepenger, må du gi oss beskjed.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                    ],
                  },
                },
                {
                  _key: '5c7aaca4fd4a',
                  _type: 'kategorisertTekstRef',
                  kategori: null,
                  tekst: {
                    _createdAt: '2025-10-22T06:07:44Z',
                    _id: '91bd686a-19f5-46af-950d-8c172fc3d960',
                    _originalId: '91bd686a-19f5-46af-950d-8c172fc3d960',
                    _rev: 'kmx5YUkUi70yACXomrDTpE',
                    _type: 'tekst',
                    _updatedAt: '2025-10-22T06:08:08Z',
                    beskrivelse: 'Sykepenger 2G eller mer/etter maksdato sykepenger',
                    teksteditor: [
                      {
                        _id: null,
                        _key: 'd794b0a4ff36',
                        _type: 'block',
                        children: [
                          {
                            _key: '0340d238f2f6',
                            _type: 'span',
                            marks: [],
                            text: '\nDu får arbeidsavklaringspenger etter den siste dagen din med sykepenger.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                      {
                        _id: null,
                        _key: 'a0d8ca853e31',
                        _type: 'block',
                        children: [
                          {
                            _key: '2caef488ffcb',
                            _type: 'span',
                            marks: [],
                            text: 'Du kan velge om du vil motta arbeidsavklaringspenger eller sykepenger. Arbeidsavklaringspenger vil gi deg en høyere utbetaling enn sykepenger, men fordi du får sykepengene dine utbetalt fra arbeidsgiveren din, kan du først få arbeidsavklaringspenger fra den dagen arbeidsgiveren din stanser utbetalingen av sykepenger til deg.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                      {
                        _id: null,
                        _key: '3f9dc07642e7',
                        _type: 'block',
                        children: [
                          {
                            _key: '7920cc62fb87',
                            _type: 'span',
                            marks: [],
                            text: 'Hvis du heller ønsker arbeidsavklaringspenger enn sykepenger, må du sende oss dokumentasjon på hvilken dag arbeidsgiveren din stanser utbetalingen til deg, og/eller om du skal betale tilbake sykepengene til arbeidsgiveren din.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                      {
                        _id: null,
                        _key: 'd803730019c3',
                        _type: 'block',
                        children: [
                          {
                            _key: '83223ff01101',
                            _type: 'span',
                            marks: [],
                            text: 'Du må gi oss beskjed hvis du skal ta ut mer ferie. Ferien forskyver både sykepengene dine og den første dagen du får arbeidsavklaringspenger fra.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                    ],
                  },
                },
                {
                  _key: '28e40cfd6ca8',
                  _type: 'kategorisertTekstRef',
                  kategori: null,
                  tekst: {
                    _createdAt: '2025-10-22T06:11:19Z',
                    _id: '0c8ae21e-adc6-47d2-b2c4-f69ddce7ede7',
                    _originalId: '0c8ae21e-adc6-47d2-b2c4-f69ddce7ede7',
                    _rev: 'Ne0hT7HyW88EPVoynS51EP',
                    _type: 'tekst',
                    _updatedAt: '2025-10-22T06:11:29Z',
                    beskrivelse: 'Sykepenger under 2G /AAP høyeste ytelse, men refusjon til arbeidsgiver',
                    teksteditor: [
                      {
                        _id: null,
                        _key: '29df7449de1b',
                        _type: 'block',
                        children: [
                          {
                            _key: 'b2d3ebb0eb6b',
                            _type: 'span',
                            marks: [],
                            text: 'Du får arbeidsavklaringspenger etter den siste dagen din med sykepenger.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                      {
                        _id: null,
                        _key: 'e61dc47e8b52',
                        _type: 'block',
                        children: [
                          {
                            _key: '39f36f5ece64',
                            _type: 'span',
                            marks: [],
                            text: '',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                      {
                        _id: null,
                        _key: 'eac8f9da6075',
                        _type: 'block',
                        children: [
                          {
                            _key: '6bd2680861fe',
                            _type: 'span',
                            marks: [],
                            text: 'Du kan velge om du vil motta arbeidsavklaringspenger eller sykepenger. Arbeidsavklaringspenger vil gi deg en høyere utbetaling enn sykepenger, men fordi du får sykepengene dine utbetalt fra arbeidsgiveren din, kan du først få arbeidsavklaringspenger fra den dagen arbeidsgiveren din stanser utbetalingen av sykepenger til deg.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                      {
                        _id: null,
                        _key: '68f8eab1c7a3',
                        _type: 'block',
                        children: [
                          {
                            _key: '13584bb4be97',
                            _type: 'span',
                            marks: [],
                            text: '',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                      {
                        _id: null,
                        _key: 'c97f33df8c8b',
                        _type: 'block',
                        children: [
                          {
                            _key: '6d46472ddf4c',
                            _type: 'span',
                            marks: [],
                            text: 'Hvis du heller ønsker arbeidsavklaringspenger enn sykepenger, må du sende oss dokumentasjon på hvilken dag arbeidsgiveren din stanser utbetalingen til deg, og/eller om du skal betale tilbake sykepengene til arbeidsgiveren din.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                      {
                        _id: null,
                        _key: '6f4fe64e88f5',
                        _type: 'block',
                        children: [
                          {
                            _key: '4e98fb3bd784',
                            _type: 'span',
                            marks: [],
                            text: '',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                      {
                        _id: null,
                        _key: '18e2af4c0dfa',
                        _type: 'block',
                        children: [
                          {
                            _key: '38e527aa02b3',
                            _type: 'span',
                            marks: [],
                            text: 'Du må gi oss beskjed hvis du skal ta ut mer ferie. Ferien forskyver både sykepengene dine og den første dagen du får arbeidsavklaringspenger fra.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                    ],
                  },
                },
                {
                  _key: '9f220c407a98',
                  _type: 'kategorisertTekstRef',
                  kategori: null,
                  tekst: {
                    _createdAt: '2025-10-22T06:11:53Z',
                    _id: '9ed8e313-356a-47e0-ac01-540e8f8122e7',
                    _originalId: '9ed8e313-356a-47e0-ac01-540e8f8122e7',
                    _rev: 'kmx5YUkUi70yACXomrEaOb',
                    _system: {
                      base: {
                        id: '9ed8e313-356a-47e0-ac01-540e8f8122e7',
                        rev: 'kmx5YUkUi70yACXomrEL1m',
                      },
                    },
                    _type: 'tekst',
                    _updatedAt: '2025-10-22T06:15:38Z',
                    beskrivelse: 'Sykepenger under 2G /Sykepenger høyeste ytelse',
                    teksteditor: [
                      {
                        _id: null,
                        _key: '50dfede38c1c',
                        _type: 'block',
                        children: [
                          {
                            _key: '1f0b4e7bf72c',
                            _type: 'span',
                            marks: [],
                            text: 'Du får arbeidsavklaringspenger etter den siste dagen din med sykepenger, fordi sykepenger gir deg en høyere utbetaling enn arbeidsavklaringspenger.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                      {
                        _id: null,
                        _key: '56511b75560b',
                        _type: 'block',
                        children: [
                          {
                            _key: 'ad3fc49bb927',
                            _type: 'span',
                            marks: [],
                            text: 'Du kan velge om du heller vil motta arbeidsavklaringspenger, men da må du gi oss beskjed om dette.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                      {
                        _id: null,
                        _key: '54e4fbd772d1',
                        _type: 'block',
                        children: [
                          {
                            _key: 'd6ee128b304f',
                            _type: 'span',
                            marks: [],
                            text: 'Du må også gi oss beskjed hvis du skal ta ut mer ferie. Ferien forskyver både sykepengene dine, og den første dagen du får arbeidsavklaringspenger fra.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                    ],
                  },
                },
                {
                  _key: '110d45cb0133',
                  _type: 'kategorisertTekstRef',
                  kategori: null,
                  tekst: {
                    _createdAt: '2025-10-17T05:13:16Z',
                    _id: 'c26c4804-72ca-4243-8a97-93d72549325b',
                    _originalId: 'c26c4804-72ca-4243-8a97-93d72549325b',
                    _rev: 'NmnPDcJ6Ow5wm0UcJUee0s',
                    _system: {
                      base: {
                        id: 'c26c4804-72ca-4243-8a97-93d72549325b',
                        rev: 'NmnPDcJ6Ow5wm0UcJUePoR',
                      },
                    },
                    _type: 'tekst',
                    _updatedAt: '2025-10-17T05:14:27Z',
                    beskrivelse: 'Virkningstidspunkt - fra søknadsdato',
                    teksteditor: [
                      {
                        _id: null,
                        _key: '19cfd298447c',
                        _type: 'block',
                        children: [
                          {
                            _key: '71f0ddca30b0',
                            _type: 'span',
                            marks: [],
                            text: 'Du får arbeidsavklaringspenger fra den dagen du søkte. Dette er det tidligste tidspunktet vi kan innvilge arbeidsavklaringspenger fra.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                    ],
                  },
                },
                {
                  _key: '8541c454b860',
                  _type: 'kategorisertTekstRef',
                  kategori: null,
                  tekst: {
                    _createdAt: '2025-10-16T12:53:38Z',
                    _id: 'e08afb12-9ebb-4526-bca0-68d25ca3c2a7',
                    _originalId: 'e08afb12-9ebb-4526-bca0-68d25ca3c2a7',
                    _rev: 'NmnPDcJ6Ow5wm0UcJPQCmC',
                    _system: {
                      base: {
                        id: 'e08afb12-9ebb-4526-bca0-68d25ca3c2a7',
                        rev: 'Sj0Xul44GrxyX70TXbaBUo',
                      },
                    },
                    _type: 'tekst',
                    _updatedAt: '2025-10-16T13:19:52Z',
                    beskrivelse: 'Virkningstidspunkt - burde blitt informert',
                    teksteditor: [
                      {
                        _id: null,
                        _key: 'ab1e94f6472f',
                        _type: 'block',
                        children: [
                          {
                            _key: '4f867e9a3a33',
                            _type: 'span',
                            marks: [],
                            text: 'Du får arbeidsavklaringspenger fra <VIRKNINGSTIDSPUNKT>, fordi du burde blitt informert om muligheten til å søke om arbeidsavklaringspenger denne dagen.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                    ],
                  },
                },
                {
                  _key: 'f14c94115e34',
                  _type: 'kategorisertTekstRef',
                  kategori: null,
                  tekst: {
                    _createdAt: '2025-10-16T13:20:17Z',
                    _id: 'f9d69bfb-8694-421a-afbd-20a11f5141ca',
                    _originalId: 'f9d69bfb-8694-421a-afbd-20a11f5141ca',
                    _rev: 'hdi3vzKUcAFbVK5d3xJvH5',
                    _type: 'tekst',
                    _updatedAt: '2025-10-16T13:20:52Z',
                    beskrivelse: 'Virkningstidspunkt - ikke har vært i stand ',
                    teksteditor: [
                      {
                        _id: null,
                        _key: '5047852e74f5',
                        _type: 'block',
                        children: [
                          {
                            _key: 'c5ceb7ed46a9',
                            _type: 'span',
                            marks: [],
                            text: 'Du får arbeidsavklaringspenger fra <VIRKNINGSTIDSPUNKT>, fordi du åpenbart ikke har vært i stand til å søke om arbeidsavklaringspenger fra denne dagen.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                    ],
                  },
                },
              ],
              beskrivelse: 'C versjon virkningstidspunkt',
            },
          },
          {
            _key: 'b3a00f723211',
            _type: 'block',
            children: [
              {
                _key: '8112401acbdb',
                _type: 'span',
                marks: [],
                text: '',
              },
            ],
            markDefs: [],
            style: 'normal',
          },
        ],
      },
      obligatorisk: false,
    },
    {
      _key: '03ff59cd0cb6',
      _type: 'delmalRef',
      delmal: {
        _createdAt: '2025-10-20T10:13:19Z',
        _id: 'a6e9489f-c632-4f24-a87b-0a4b9e669759',
        _originalId: 'drafts.a6e9489f-c632-4f24-a87b-0a4b9e669759',
        _rev: 'f0f3fe2e-6dfd-49eb-a860-c796948967fb',
        _system: {
          base: {
            id: 'a6e9489f-c632-4f24-a87b-0a4b9e669759',
            rev: 'NmnPDcJ6Ow5wm0UcJqScXw',
          },
        },
        _type: 'delmal',
        _updatedAt: '2025-11-04T14:23:08Z',
        beskrivelse: 'Refusjonskrav',
        overskrift: null,
        teksteditor: [
          {
            _key: 'b2fdce2c2ae1',
            _type: 'block',
            children: [
              {
                _key: '633d8aa6aee7',
                _type: 'span',
                marks: [],
                text: 'Vi har opplysninger om at du har fått utbetalt andre ytelser fra Nav i samme periode som du nå får arbeidsavklaringspenger.',
              },
            ],
            markDefs: [],
            style: 'normal',
          },
          {
            _key: '7cef68828971',
            _type: 'block',
            children: [
              {
                _key: '8669cce72683',
                _type: 'span',
                marks: [],
                text: 'Betinget tekst',
              },
            ],
            markDefs: [],
            style: 'normal',
          },
          {
            _key: '4e7fad83eaf0',
            _type: 'betingetTekstRef',
            kategorier: null,
            tekst: {
              _createdAt: '2025-10-20T13:22:26Z',
              _id: '7845af1d-66d4-48ef-9205-80c76c1c8e37',
              _originalId: '7845af1d-66d4-48ef-9205-80c76c1c8e37',
              _rev: 'NmnPDcJ6Ow5wm0UcJqIIQc',
              _type: 'tekst',
              _updatedAt: '2025-10-20T13:24:07Z',
              beskrivelse: 'Sosialstønad ',
              teksteditor: [
                {
                  _key: '43833d8cd630',
                  _type: 'block',
                  children: [
                    {
                      _key: 'f568ea5cba1b',
                      _type: 'span',
                      marks: [],
                      text: 'Du har mottatt i sosialstønad i perioden fra DATO til og med DATO.',
                    },
                  ],
                  markDefs: [],
                  style: 'normal',
                },
              ],
            },
          },
          {
            _key: '8f72b4272d28',
            _type: 'betingetTekstRef',
            kategorier: null,
            tekst: {
              _createdAt: '2025-10-20T13:30:17Z',
              _id: 'd0dafe90-b6e8-459d-a84c-98e682970824',
              _originalId: 'd0dafe90-b6e8-459d-a84c-98e682970824',
              _rev: 'hdi3vzKUcAFbVK5d4GIQvR',
              _type: 'tekst',
              _updatedAt: '2025-10-20T13:30:33Z',
              beskrivelse: 'Introduksjonsstønad',
              teksteditor: [
                {
                  _key: 'f9b01a218608',
                  _type: 'block',
                  children: [
                    {
                      _key: '205cc61d00f0',
                      _type: 'span',
                      marks: [],
                      text: 'Du har mottatt i introduksjonsstønad i perioden fra DATO til og med DATO.',
                    },
                  ],
                  markDefs: [],
                  style: 'normal',
                },
              ],
            },
          },
          {
            _key: '685203b9aef2',
            _type: 'fritekst',
            fritekst: 'fritekst',
          },
          {
            _key: '22a6316bf1fc',
            _type: 'block',
            children: [
              {
                _key: '98b5a2e464e3',
                _type: 'span',
                marks: [],
                text: 'Det du har mottatt av andre ytelser kan trekkes fra i etterbetalingen av arbeidsavklaringspengene dine. Du får utbetalt arbeidsavklaringspengene for denne perioden',
              },
              {
                _key: 'a048dd1d293d',
                _type: 'span',
                marks: ['em'],
                text: ' senest innen tre uker fra hva?',
              },
            ],
            markDefs: [],
            style: 'normal',
          },
        ],
      },
      obligatorisk: false,
    },
    {
      _key: '8303aa62e2eb',
      _type: 'delmalRef',
      delmal: {
        _createdAt: '2025-10-21T12:04:31Z',
        _id: '5bde3b07-e39a-4205-85f7-f4c56e4ae46b',
        _originalId: '5bde3b07-e39a-4205-85f7-f4c56e4ae46b',
        _rev: 'fUnypQWkwSwiyCaTjian2M',
        _system: {
          base: {
            id: '5bde3b07-e39a-4205-85f7-f4c56e4ae46b',
            rev: 'O8b3YIqWeCViTwqI0CLMzz',
          },
        },
        _type: 'delmal',
        _updatedAt: '2025-10-21T12:29:29Z',
        beskrivelse: 'Reduksjon på grunn av ytelser fra en arbeidsgiver',
        overskrift: null,
        paragraf: '11-24',
        teksteditor: [
          {
            _key: 'fb550646b4b0',
            _type: 'valgRef',
            obligatorisk: false,
            valg: {
              _createdAt: '2025-10-21T12:22:59Z',
              _id: 'b35bba50-16d8-4be0-a041-3ee85ee3c815',
              _originalId: 'b35bba50-16d8-4be0-a041-3ee85ee3c815',
              _rev: 'fUnypQWkwSwiyCaTjiaTZd',
              _system: {
                base: {
                  id: 'b35bba50-16d8-4be0-a041-3ee85ee3c815',
                  rev: 'O8b3YIqWeCViTwqI0CL7wN',
                },
              },
              _type: 'valg',
              _updatedAt: '2025-10-21T12:27:02Z',
              alternativer: [
                {
                  _key: '3c4ae9153afd',
                  _type: 'kategorisertTekstRef',
                  kategori: null,
                  tekst: {
                    _createdAt: '2025-10-21T12:23:33Z',
                    _id: '494d763b-afb8-45ff-b21d-12dfdda39cc7',
                    _originalId: '494d763b-afb8-45ff-b21d-12dfdda39cc7',
                    _rev: '4CfZI4RsRcecEk9ANEUwi5',
                    _type: 'tekst',
                    _updatedAt: '2025-10-21T12:24:03Z',
                    beskrivelse: 'Sluttpakke full stilling',
                    teksteditor: [
                      {
                        _id: null,
                        _key: '4233586b9f90',
                        _type: 'block',
                        children: [
                          {
                            _key: '5cd0ecb48a61',
                            _type: 'span',
                            marks: [],
                            text: 'Du får en sluttpakke eller et sluttvederlag fra arbeidsgiveren din, som tilsvarer 100 prosent lønn i perioden DATO til DATO. ',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                      {
                        _id: null,
                        _key: '33c410875e57',
                        _type: 'block',
                        children: [
                          {
                            _key: '5cd0ecb48a61',
                            _type: 'span',
                            marks: [],
                            text: 'Du får derfor får du ikke utbetalt arbeidsavklaringspenger i denne perioden.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                    ],
                  },
                },
                {
                  _key: 'a73b170613e3',
                  _type: 'kategorisertTekstRef',
                  kategori: null,
                  tekst: {
                    _createdAt: '2025-10-21T12:24:52Z',
                    _id: 'f8395588-99ac-46b1-99f0-c80dc47cc34d',
                    _originalId: 'f8395588-99ac-46b1-99f0-c80dc47cc34d',
                    _rev: 'fUnypQWkwSwiyCaTjiaNno',
                    _type: 'tekst',
                    _updatedAt: '2025-10-21T12:26:19Z',
                    beskrivelse: 'Sluttpakke deltidsstilling',
                    teksteditor: [
                      {
                        _id: null,
                        _key: '410c6cb970c3',
                        _type: 'block',
                        children: [
                          {
                            _key: 'f7551e26ff4d',
                            _type: 'span',
                            marks: [],
                            text: 'Du får en sluttpakke eller et sluttvederlag fra arbeidsgiveren din på BELØP kroner. Vi har regnet ut hva månedslønnen din ville vært i full stilling, og deretter hvor lang periode med full lønn sluttpakken din tilsvarer. ',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                      {
                        _id: null,
                        _key: '03f1d7bfe341',
                        _type: 'block',
                        children: [
                          {
                            _key: 'f7551e26ff4d',
                            _type: 'span',
                            marks: [],
                            text: 'Vi har kommet frem til at du ikke skal få utbetalt arbeidsavklaringspenger i perioden fra DATO til DATO, fordi du er dekket av 100 prosent lønn i denne perioden.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                    ],
                  },
                },
              ],
              beskrivelse: '11-24: Reduksjon på grunn av ytelser fra en arbeidsgiver',
            },
          },
          {
            _key: 'e81ef6a1b34b',
            _type: 'block',
            children: [
              {
                _key: '63fa1b5e11fc',
                _type: 'span',
                marks: [],
                text: '',
              },
            ],
            markDefs: [],
            style: 'normal',
          },
        ],
      },
      obligatorisk: false,
    },
    {
      _key: '72122345c90d',
      _type: 'delmalRef',
      delmal: {
        _createdAt: '2025-10-09T12:02:01Z',
        _id: '4f014c07-ed1e-41d5-842d-8c7f389cc489',
        _originalId: '4f014c07-ed1e-41d5-842d-8c7f389cc489',
        _rev: '5gPw1BcnJ1mY3wboHLNj5Z',
        _system: {
          base: {
            id: '4f014c07-ed1e-41d5-842d-8c7f389cc489',
            rev: 'O8b3YIqWeCViTwqI0CaMkV',
          },
        },
        _type: 'delmal',
        _updatedAt: '2025-10-21T14:04:22Z',
        beskrivelse: 'Beregning',
        overskrift: null,
        paragraf: '11-19',
        teksteditor: [
          {
            _key: '0e7b9b7b6e25',
            _type: 'block',
            children: [
              {
                _key: '9588cc5a43b2',
                _type: 'span',
                marks: [],
                text: 'Vi har vurdert at arbeidsevnen din ble nedsatt med minst halvparten fra <BEREGNINGSTIDSPUNKT>. ',
              },
            ],
            markDefs: [],
            style: 'normal',
          },
          {
            _key: '9e576bf5770e',
            _type: 'valgRef',
            obligatorisk: false,
            valg: {
              _createdAt: '2025-10-21T12:55:12Z',
              _id: 'd67fa5a8-b93e-48c6-9923-630de1143b9e',
              _originalId: 'd67fa5a8-b93e-48c6-9923-630de1143b9e',
              _rev: 'O8b3YIqWeCViTwqI0CY85P',
              _system: {
                base: {
                  id: 'd67fa5a8-b93e-48c6-9923-630de1143b9e',
                  rev: 'fUnypQWkwSwiyCaTjiiYbZ',
                },
              },
              _type: 'valg',
              _updatedAt: '2025-10-21T13:53:09Z',
              alternativer: [
                {
                  _key: '7f5d19fdfd58',
                  _type: 'kategorisertTekstRef',
                  kategori: null,
                  tekst: {
                    _createdAt: '2025-10-21T12:59:42Z',
                    _id: '6c34e83b-1d92-4a50-92c0-d7bad279fab5',
                    _originalId: '6c34e83b-1d92-4a50-92c0-d7bad279fab5',
                    _rev: 'FqnTM2SfT3iE5RnAc43FEc',
                    _type: 'tekst',
                    _updatedAt: '2025-10-21T13:00:00Z',
                    beskrivelse: 'Sykmeldingsdato',
                    teksteditor: [
                      {
                        _id: null,
                        _key: '0b9a95519f72',
                        _type: 'block',
                        children: [
                          {
                            _key: '74429588a083',
                            _type: 'span',
                            marks: [],
                            text: 'Vi har vurdert at arbeidsevnen din ble nedsatt med minst halvparten fra DATO, som er da du ble minst 50 prosent sykmeldt. Derfor har vi satt beregningstidspunktet ditt til denne dagen.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                    ],
                  },
                },
                {
                  _key: 'a395c2657705',
                  _type: 'kategorisertTekstRef',
                  kategori: null,
                  tekst: {
                    _createdAt: '2025-10-21T13:47:30Z',
                    _id: 'd2bd2ab0-4849-45db-b09a-29ba22a0d726',
                    _originalId: 'd2bd2ab0-4849-45db-b09a-29ba22a0d726',
                    _rev: '5gPw1BcnJ1mY3wboHLMU5n',
                    _system: {
                      base: {
                        id: 'd2bd2ab0-4849-45db-b09a-29ba22a0d726',
                        rev: 'fUnypQWkwSwiyCaTjiqXT0',
                      },
                    },
                    _type: 'tekst',
                    _updatedAt: '2025-10-21T13:51:20Z',
                    beskrivelse: 'Kravdato – uten betydning for dagsats',
                    teksteditor: [
                      {
                        _id: null,
                        _key: '87470efd55d2',
                        _type: 'block',
                        children: [
                          {
                            _key: 'b1c9b27f9190',
                            _type: 'span',
                            marks: [],
                            text: 'Siden det ikke kommer klart fram fra opplysningene i saken din når arbeidsevnen din ble nedsatt med minst halvparten har vi satt beregningstidspunktet ditt til dagen du søkte om arbeidsavklaringspenger. Dagsatsen din ville blitt den samme uansett hvilket tidspunkt vi hadde satt.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                    ],
                  },
                },
                {
                  _key: '7076ded2837e',
                  _type: 'kategorisertTekstRef',
                  kategori: null,
                  tekst: {
                    _createdAt: '2025-10-21T13:49:59Z',
                    _id: 'edcd09c8-972e-4cdb-a53a-54ff43bea713',
                    _originalId: 'edcd09c8-972e-4cdb-a53a-54ff43bea713',
                    _rev: 'O8b3YIqWeCViTwqI0CY4cF',
                    _type: 'tekst',
                    _updatedAt: '2025-10-21T13:52:23Z',
                    beskrivelse: 'Kravdato – med betydning for dagsats',
                    teksteditor: [
                      {
                        _id: null,
                        _key: '9b1501c4a770',
                        _type: 'block',
                        children: [
                          {
                            _key: '4185fba11de7',
                            _type: 'span',
                            marks: [],
                            text: 'Siden det kommer ikke klart fram fra opplysningene i saken din når arbeidsevnen din ble nedsatt med minst halvparten, har vi satt beregningstidspunktet ditt til dagen du søkte om arbeidsavklaringspenger.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                    ],
                  },
                },
                {
                  _key: '639e37715b89',
                  _type: 'kategorisertTekstRef',
                  kategori: null,
                  tekst: {
                    _createdAt: '2025-10-21T13:52:34Z',
                    _id: 'b0b6139c-3440-405e-85f2-e0a8572fea05',
                    _originalId: 'b0b6139c-3440-405e-85f2-e0a8572fea05',
                    _rev: '5gPw1BcnJ1mY3wboHLMWwb',
                    _type: 'tekst',
                    _updatedAt: '2025-10-21T13:52:51Z',
                    beskrivelse: 'Legeerklæring',
                    teksteditor: [
                      {
                        _id: null,
                        _key: '624f0f63b894',
                        _type: 'block',
                        children: [
                          {
                            _key: '13b785e2c985',
                            _type: 'span',
                            marks: [],
                            text: 'Siden det ikke kommer ikke klart fram fra opplysningene i saken din når arbeidsevnen din ble nedsatt med minst halvparten, har vi satt beregningstidspunktet ditt til dagen vi fikk opplysninger fra legen din.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                    ],
                  },
                },
                {
                  _key: '7e156d393480',
                  _type: 'fritekst',
                  fritekst: 'fritekst',
                },
              ],
              beskrivelse: 'Beregningstidspunkt',
            },
          },
          {
            _key: '578cf1cf7f80',
            _type: 'valgRef',
            obligatorisk: false,
            valg: {
              _createdAt: '2025-10-21T13:59:28Z',
              _id: '36735622-6d62-4f8b-b409-5587edb88431',
              _originalId: '36735622-6d62-4f8b-b409-5587edb88431',
              _rev: '5gPw1BcnJ1mY3wboHLNh2L',
              _system: {
                base: {
                  id: '36735622-6d62-4f8b-b409-5587edb88431',
                  rev: '5gPw1BcnJ1mY3wboHLNIhP',
                },
              },
              _type: 'valg',
              _updatedAt: '2025-10-21T14:04:06Z',
              alternativer: [
                {
                  _key: '9d7270f03cc0',
                  _type: 'kategorisertTekstRef',
                  kategori: null,
                  tekst: {
                    _createdAt: '2025-10-21T13:59:49Z',
                    _id: '58ee0aa6-be52-43ef-8ebf-f6721004d2ec',
                    _originalId: '58ee0aa6-be52-43ef-8ebf-f6721004d2ec',
                    _rev: 'fUnypQWkwSwiyCaTjitVuW',
                    _type: 'tekst',
                    _updatedAt: '2025-10-21T14:00:22Z',
                    beskrivelse: 'Uføretidspunktet',
                    teksteditor: [
                      {
                        _id: null,
                        _key: '185d34d58291',
                        _type: 'block',
                        children: [
                          {
                            _key: 'bdcbcf5fd8c0',
                            _type: 'span',
                            marks: [],
                            text: 'Fordi du får uføretrygd velger vi beregningstidspunktet som gir deg høyest dagsats. Det er enten tidspunktet arbeidsevnen din ble nedsatt med minst halvparten eller tidspunktet arbeidsevnen din ble ytterligere nedsatt. ',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                      {
                        _id: null,
                        _key: 'b909f497eae0',
                        _type: 'block',
                        children: [
                          {
                            _key: 'bdcbcf5fd8c0',
                            _type: 'span',
                            marks: [],
                            text: 'For deg lønner det seg med tidspunktet arbeidsevnen din ble nedsatt med minst halvparten. Beregningstidspunktet ditt er derfor det samme som i uføresaken din.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                    ],
                  },
                },
                {
                  _key: 'b553ed145a08',
                  _type: 'kategorisertTekstRef',
                  kategori: null,
                  tekst: {
                    _createdAt: '2025-10-21T14:00:42Z',
                    _id: '53d2fdd2-36c2-48af-86ea-9a2949167aed',
                    _originalId: '53d2fdd2-36c2-48af-86ea-9a2949167aed',
                    _rev: 'kmx5YUkUi70yACXomrEl69',
                    _system: {
                      base: {
                        id: '53d2fdd2-36c2-48af-86ea-9a2949167aed',
                        rev: '5gPw1BcnJ1mY3wboHLNWth',
                      },
                    },
                    _type: 'tekst',
                    _updatedAt: '2025-10-22T06:18:35Z',
                    beskrivelse: 'Uføre ytterligere nedsatt',
                    teksteditor: [
                      {
                        _id: null,
                        _key: 'b1daf0dcb190',
                        _type: 'block',
                        children: [
                          {
                            _key: '161c61e08a6f',
                            _type: 'span',
                            marks: [],
                            text: 'Fordi du får uføretrygd velger vi beregningstidspunktet som gir deg høyest dagsats. Det er enten tidspunktet arbeidsevnen din ble nedsatt med minst halvparten eller tidspunktet arbeidsevnen din ble ytterligere nedsatt. ',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                      {
                        _id: null,
                        _key: '9a788ece1e5d',
                        _type: 'block',
                        children: [
                          {
                            _key: '161c61e08a6f',
                            _type: 'span',
                            marks: [],
                            text: 'For deg lønner det seg med tidspunktet arbeidsevnen din ble ytterligere nedsatt. Det vil si dagen du ble sykmeldt/dagen du søkte om arbeidsavklaringspenger.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                    ],
                  },
                },
                {
                  _key: 'bd59c94f85fd',
                  _type: 'kategorisertTekstRef',
                  kategori: null,
                  tekst: {
                    _createdAt: '2025-10-21T14:02:23Z',
                    _id: '05dec005-f851-43a3-b39e-7327880971d5',
                    _originalId: '05dec005-f851-43a3-b39e-7327880971d5',
                    _rev: 'fUnypQWkwSwiyCaTjiu2d0',
                    _type: 'tekst',
                    _updatedAt: '2025-10-21T14:02:37Z',
                    beskrivelse: 'Ytterligere nedsatt – økt uføregrad',
                    teksteditor: [
                      {
                        _id: null,
                        _key: 'c87e56026279',
                        _type: 'block',
                        children: [
                          {
                            _key: 'c59f7209586d',
                            _type: 'span',
                            marks: [],
                            text: 'Fordi du får uføretrygd velger vi beregningstidspunktet som gir deg høyest dagsats. Det er enten tidspunktet arbeidsevnen din ble nedsatt med minst halvparten eller tidspunktet arbeidsevnen din ble ytterligere nedsatt. ',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                      {
                        _id: null,
                        _key: 'e0f2eb567459',
                        _type: 'block',
                        children: [
                          {
                            _key: 'c59f7209586d',
                            _type: 'span',
                            marks: [],
                            text: 'For deg lønner det seg med tidspunktet arbeidsevnen din ble ytterligere nedsatt. Det vil si da du fikk økt uføregraden din.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                    ],
                  },
                },
                {
                  _key: 'e02c01ffa469',
                  _type: 'kategorisertTekstRef',
                  kategori: null,
                  tekst: {
                    _createdAt: '2025-10-21T14:03:01Z',
                    _id: '5e32a030-3196-42ee-a161-fd423043d018',
                    _originalId: '5e32a030-3196-42ee-a161-fd423043d018',
                    _rev: 'Ne0hT7HyW88EPVoynS68CO',
                    _system: {
                      base: {
                        id: '5e32a030-3196-42ee-a161-fd423043d018',
                        rev: '5gPw1BcnJ1mY3wboHLNfdL',
                      },
                    },
                    _type: 'tekst',
                    _updatedAt: '2025-10-22T06:18:10Z',
                    beskrivelse: 'Beregningstidspunkt uføre, uten betydning for beregningsgrunnlag',
                    teksteditor: [
                      {
                        _id: null,
                        _key: '5f8f7c4ffe64',
                        _type: 'block',
                        children: [
                          {
                            _key: '82e33763db72',
                            _type: 'span',
                            marks: [],
                            text: 'Fordi du får uføretrygd velger vi beregningstidspunktet som gir deg høyest dagsats. Det er enten tidspunktet arbeidsevnen din ble nedsatt med minst halvparten eller tidspunktet arbeidsevnen din ble ytterligere nedsatt.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                      {
                        _id: null,
                        _key: '87b6e9f5bd45',
                        _type: 'block',
                        children: [
                          {
                            _key: '7e4087d8f943',
                            _type: 'span',
                            marks: [],
                            text: 'For deg vil beregningsgrunnlaget ditt bli det samme uansett hvilket av tidspunktene vi velger. Beregningstidspunktet ditt er derfor det samme som i uføresaken din.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                    ],
                  },
                },
              ],
              beskrivelse: 'Beregningstidspunkt hvis minst 50 prosent gradert uføretrygd',
            },
          },
          {
            _key: 'df65d50a31a4',
            _type: 'valgRef',
            obligatorisk: false,
            valg: {
              _createdAt: '2025-10-09T12:25:35Z',
              _id: '49b7a8fa-3131-432a-bd91-3be04e9e74a1',
              _originalId: '49b7a8fa-3131-432a-bd91-3be04e9e74a1',
              _rev: 'aIEg779bzu4S7KTVIqlmQQ',
              _system: {
                base: {
                  id: '49b7a8fa-3131-432a-bd91-3be04e9e74a1',
                  rev: 'X1xlmecZbVOgR2GsFsxVXe',
                },
              },
              _type: 'valg',
              _updatedAt: '2025-10-14T08:53:37Z',
              alternativer: [
                {
                  _key: '08bc08f7fa79',
                  _type: 'kategorisertTekstRef',
                  kategori: null,
                  tekst: {
                    _createdAt: '2025-10-14T08:49:58Z',
                    _id: 'a8e97608-8e34-4f09-a2a2-3bc8560aac67',
                    _originalId: 'a8e97608-8e34-4f09-a2a2-3bc8560aac67',
                    _rev: 'lwRNRb67H3oIxYaIJ8ErXQ',
                    _type: 'tekst',
                    _updatedAt: '2025-10-14T08:50:48Z',
                    beskrivelse: 'Delvis yrkesskade',
                    teksteditor: [
                      {
                        _id: null,
                        _key: 'e282bbe40c29',
                        _type: 'block',
                        children: [
                          {
                            _key: 'cd4daf5a0d98',
                            _type: 'span',
                            marks: [],
                            text: '<PROSENTYRKESSKADE> av din nedsatte arbeidsevne skyldes en yrkesskade. Du får derfor beregnet deler av dine arbeidsavklaringspengene dine etter inntekten på skadetidspunktet. Inntekten din i <SKADETIDSPUNKT> var <INNTEKTSKADETIDSPUNKT> kroner.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                      {
                        _id: null,
                        _key: 'cb61f8bd299a',
                        _type: 'block',
                        children: [
                          {
                            _key: 'f43bac14c2b0',
                            _type: 'span',
                            marks: [],
                            text: '',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                      {
                        _id: null,
                        _key: 'dd3cc443314d',
                        _type: 'block',
                        children: [
                          {
                            _key: 'b5e56a64b8b0',
                            _type: 'span',
                            marks: [],
                            text: 'Resten får du beregnet etter de vanlige beregningsreglene som gir deg den høyeste dagsatsen av enten inntekten din året før arbeidsevnen din ble nedsatt, eller gjennomsnittet av de tre siste årene.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                    ],
                  },
                },
                {
                  _key: '7ee2815fd43d',
                  _type: 'kategorisertTekstRef',
                  kategori: null,
                  tekst: {
                    _createdAt: '2025-10-14T08:51:52Z',
                    _id: 'e2fa79b5-86c5-4185-9a95-3d57893eca5f',
                    _originalId: 'e2fa79b5-86c5-4185-9a95-3d57893eca5f',
                    _rev: 'lwRNRb67H3oIxYaIJ8EvPQ',
                    _type: 'tekst',
                    _updatedAt: '2025-10-14T08:52:05Z',
                    beskrivelse: '100 prosent sammenheng',
                    teksteditor: [
                      {
                        _id: null,
                        _key: '6db81c36921e',
                        _type: 'block',
                        children: [
                          {
                            _key: '661fa08eb36f',
                            _type: 'span',
                            marks: [],
                            text: 'Arbeidsevnen din er nedsatt på grunn av en yrkesskade. Du får beregnet arbeidsavklaringspengene dine ut ifra inntekten du hadde på skadetidspunktet, hvis dette gir deg en høyere dagsats enn vanlig beregning.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                      {
                        _id: null,
                        _key: 'fd6ba1755104',
                        _type: 'block',
                        children: [
                          {
                            _key: '21d368ca74bd',
                            _type: 'span',
                            marks: [],
                            text: '',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                      {
                        _id: null,
                        _key: '183754c5ae29',
                        _type: 'block',
                        children: [
                          {
                            _key: '7579421969db',
                            _type: 'span',
                            marks: [],
                            text: 'Inntekten din i <SKADETIDSPUNKT> var <INNTEKTSKADETIDSPUNKT> kroner.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                      {
                        _id: null,
                        _key: '87a6e4d236d7',
                        _type: 'block',
                        children: [
                          {
                            _key: '66347339da82',
                            _type: 'span',
                            marks: [],
                            text: '',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                      {
                        _id: null,
                        _key: '97b7434b354a',
                        _type: 'block',
                        children: [
                          {
                            _key: 'e5c14dc95f48',
                            _type: 'span',
                            marks: [],
                            text: 'Inntekten din tre år før <BEREGNINGSTIDSPUNKT> er',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                    ],
                  },
                },
                {
                  _key: '2d921c58ebc1',
                  _type: 'kategorisertTekstRef',
                  kategori: null,
                  tekst: {
                    _createdAt: '2025-10-14T08:52:32Z',
                    _id: '51d7c997-d437-4ff1-9ff4-f16d13e3b5f7',
                    _originalId: '51d7c997-d437-4ff1-9ff4-f16d13e3b5f7',
                    _rev: 'lwRNRb67H3oIxYaIJ8ExV6',
                    _type: 'tekst',
                    _updatedAt: '2025-10-14T08:52:51Z',
                    beskrivelse: 'Ingen årsakssammenheng',
                    teksteditor: [
                      {
                        _id: null,
                        _key: 'a82d4bf503fc',
                        _type: 'block',
                        children: [
                          {
                            _key: '7ab8704853ee',
                            _type: 'span',
                            marks: [],
                            text: 'For å få yrkesskadefordel når vi beregner arbeidsavklaringspengene dine, må du ha en yrkesskade som er godkjent av Nav, og det må være en sammenheng mellom den nedsatte arbeidsevnen din og yrkesskaden.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                      {
                        _id: null,
                        _key: '542c39c9e1ea',
                        _type: 'block',
                        children: [
                          {
                            _key: '2c2d77bde2cf',
                            _type: 'span',
                            marks: [],
                            text: 'Dette står i folketrygdloven § 11-22.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                      {
                        _id: null,
                        _key: '3ae55d9cc74e',
                        _type: 'block',
                        children: [
                          {
                            _key: '89e27875a2e0',
                            _type: 'span',
                            marks: [],
                            text: 'Vi har vurdert at det ikke er selve yrkesskaden som er grunnen til at du har nedsatt arbeidsevne i dag.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                      {
                        _id: null,
                        _key: '591abd41daf2',
                        _type: 'block',
                        children: [
                          {
                            _key: 'e1381bf070db',
                            _type: 'span',
                            marks: [],
                            text: 'Du får beregnet dine arbeidsavklaringspenger etter de vanlige beregningreglene.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                    ],
                  },
                },
              ],
              beskrivelse: 'Yrkesskade beregning',
            },
          },
          {
            _key: 'e96d702b4622',
            _type: 'block',
            children: [
              {
                _key: 'cc820ccc3e87',
                _type: 'span',
                marks: [],
                text: 'Vi beregner arbeidsavklaringspengene dine ut ifra det siste kalenderåret før arbeidsevnen din ble nedsatt, eller gjennomsnittet av de tre siste årene. Vi velger det som gir deg høyest dagsats.',
              },
            ],
            markDefs: [],
            style: 'normal',
          },
          {
            _key: 'c01fe2561954',
            _type: 'block',
            children: [
              {
                _key: '38da4e70d351',
                _type: 'span',
                marks: [],
                text: 'Vi har brukt disse inntektene:',
              },
            ],
            markDefs: [],
            style: 'normal',
          },
          {
            _key: '11404ff10e7d',
            _type: 'block',
            children: [
              {
                _key: '619c075be6c3',
                _type: 'span',
                marks: [],
                text: 'År: 2024 Inntekt: 178 509 kroner',
              },
            ],
            markDefs: [],
            style: 'normal',
          },
          {
            _key: '4688f76b5259',
            _type: 'block',
            children: [
              {
                _key: 'e39ea32a05c2',
                _type: 'span',
                marks: [],
                text: 'År: 2023 Inntekt: 146 291 kroner',
              },
            ],
            markDefs: [],
            style: 'normal',
          },
          {
            _key: 'fb07f5dcfb4f',
            _type: 'block',
            children: [
              {
                _key: '32d61171907b',
                _type: 'span',
                marks: [],
                text: 'År: 2022 Inntekt: 92 329 kroner',
              },
            ],
            markDefs: [],
            style: 'normal',
          },
          {
            _key: 'eb8332fe24e8',
            _type: 'valgRef',
            obligatorisk: false,
            valg: {
              _createdAt: '2025-10-14T11:18:18Z',
              _id: '1e7c84a1-58da-469f-ad3d-cecf71b11e73',
              _originalId: '1e7c84a1-58da-469f-ad3d-cecf71b11e73',
              _rev: 's2yfz7uRrnrDhmOWCGNbSS',
              _system: {
                base: {
                  id: '1e7c84a1-58da-469f-ad3d-cecf71b11e73',
                  rev: 'nB5fwt1N59B0LDJ6bQuIZ9',
                },
              },
              _type: 'valg',
              _updatedAt: '2025-10-21T11:11:08Z',
              alternativer: [
                {
                  _key: 'c39d402aa145',
                  _type: 'kategorisertTekstRef',
                  kategori: null,
                  tekst: {
                    _createdAt: '2025-10-14T11:19:14Z',
                    _id: '4e2e9bd3-c33f-41c5-a6ce-6e3b943735aa',
                    _originalId: '4e2e9bd3-c33f-41c5-a6ce-6e3b943735aa',
                    _rev: 's2yfz7uRrnrDhmOWCGMrUG',
                    _system: {
                      base: {
                        id: '4e2e9bd3-c33f-41c5-a6ce-6e3b943735aa',
                        rev: 'aIEg779bzu4S7KTVIr01VO',
                      },
                    },
                    _type: 'tekst',
                    _updatedAt: '2025-10-21T11:08:06Z',
                    beskrivelse: 'Kalenderår',
                    teksteditor: [
                      {
                        _id: null,
                        _key: '07fe594798e1',
                        _type: 'block',
                        children: [
                          {
                            _key: 'c7b030c5d874',
                            _type: 'span',
                            marks: [],
                            text: 'Det siste kalenderåret gir deg den høyeste dagsatsen. Ditt beregningsgrunnlag er <BEREGNINGSGRUNNLAG> kroner. Grunnlaget ditt er justert opp i tråd med grunnbeløpet for å ta høyde for lønnsvekst.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                      {
                        _id: null,
                        _key: 'c89ddcf6c125',
                        _type: 'block',
                        children: [
                          {
                            _key: '9c3b0dfb6507',
                            _type: 'span',
                            marks: [],
                            text: 'Arbeidsavklaringspengene er 66 prosent av dette. Denne deles på 260, som er antall arbeidsdager i året, for å få dagsatsen din.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                      {
                        _id: null,
                        _key: 'ca71e631b2d5',
                        _type: 'block',
                        children: [
                          {
                            _key: '6a72dcfdcbfc',
                            _type: 'span',
                            marks: [],
                            text: 'Hva du får utbetalt vil avhenge av skattetrekket ditt, og hva du fører på meldekortet ditt. Vi regner ut hva du får i arbeidsavklaringspenger ut fra folketrygdloven § 11-19 og § 11-20.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                    ],
                  },
                },
                {
                  _key: '5fe00661dc92',
                  _type: 'kategorisertTekstRef',
                  kategori: null,
                  tekst: {
                    _createdAt: '2025-10-14T11:19:41Z',
                    _id: '343ef36a-7613-4e7a-8c96-fe584047b53d',
                    _originalId: '343ef36a-7613-4e7a-8c96-fe584047b53d',
                    _rev: 'lwRNRb67H3oIxYaIJ8Ze2W',
                    _system: {
                      base: {
                        id: '343ef36a-7613-4e7a-8c96-fe584047b53d',
                        rev: 'aIEg779bzu4S7KTVIr07SB',
                      },
                    },
                    _type: 'tekst',
                    _updatedAt: '2025-10-14T11:20:24Z',
                    beskrivelse: 'Gjennomsnitt',
                    teksteditor: [
                      {
                        _id: null,
                        _key: '2b6b1438f90c',
                        _type: 'block',
                        children: [
                          {
                            _key: 'a38b4df7d7e7',
                            _type: 'span',
                            marks: [],
                            text: 'Gjennomsnittet av de tre siste årene gir deg den høyeste dagsatsen. Grunnlaget ditt er justert opp i tråd med grunnbeløpet for å ta høyde for lønnsvekst.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                      {
                        _id: null,
                        _key: '269d01b8ff76',
                        _type: 'block',
                        children: [
                          {
                            _key: 'eb47e3edabd0',
                            _type: 'span',
                            marks: [],
                            text: '',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                      {
                        _id: null,
                        _key: 'f201ec848b13',
                        _type: 'block',
                        children: [
                          {
                            _key: 'e98a7d910635',
                            _type: 'span',
                            marks: [],
                            text: 'Ditt beregningsgrunnlag er <BEREGNINGSGRUNNLAG> kroner. Arbeidsavklaringspengene er 66 prosent av dette. Denne deles på 260, som er antall arbeidsdager i året, for å få dagsatsen din.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                      {
                        _id: null,
                        _key: 'da1cebae7d5f',
                        _type: 'block',
                        children: [
                          {
                            _key: '1aa7353181a4',
                            _type: 'span',
                            marks: [],
                            text: '',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                      {
                        _id: null,
                        _key: 'af02f0fed7d1',
                        _type: 'block',
                        children: [
                          {
                            _key: '19ab95413c35',
                            _type: 'span',
                            marks: [],
                            text: 'Hva du får utbetalt vil avhenge av skattetrekket ditt, og hva du fører på meldekortet ditt. Vi regner ut hva du får i arbeidsavklaringspenger ut fra folketrygdloven § 11-19 og § 11-20.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                    ],
                  },
                },
                {
                  _key: '20f72d814cd0',
                  _type: 'kategorisertTekstRef',
                  kategori: null,
                  tekst: {
                    _createdAt: '2025-10-14T11:20:48Z',
                    _id: '58111f6f-c93c-4063-b164-6f9c6a08d9aa',
                    _originalId: '58111f6f-c93c-4063-b164-6f9c6a08d9aa',
                    _rev: 'eMO4UP1m9GjRw4pEtuEZeC',
                    _type: 'tekst',
                    _updatedAt: '2025-10-14T11:21:10Z',
                    beskrivelse: 'Minstesats over 25',
                    teksteditor: [
                      {
                        _id: null,
                        _key: '5328115cee3e',
                        _type: 'block',
                        children: [
                          {
                            _key: '16ed9cd28624',
                            _type: 'span',
                            marks: [],
                            text: 'Du har hatt lav inntekt i årene før arbeidsevnen din ble nedsatt, og får derfor minstesats på <BEREGNINGSGRUNNLAG> kroner. Grunnlaget ditt er justert opp i tråd med grunnbeløpet for å ta høyde for lønnsvekst.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                      {
                        _id: null,
                        _key: 'f58637e456a2',
                        _type: 'block',
                        children: [
                          {
                            _key: '6b470c74194a',
                            _type: 'span',
                            marks: [],
                            text: 'Denne deles på 260, som er antall arbeidsdager i året, for å få dagsatsen din.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                      {
                        _id: null,
                        _key: '8ac34157e654',
                        _type: 'block',
                        children: [
                          {
                            _key: '16af39bbff9e',
                            _type: 'span',
                            marks: [],
                            text: 'Hva du får utbetalt vil avhenge av skattetrekket ditt, og hva du fører på meldekortet ditt. Vi regner ut hva du får i arbeidsavklaringspenger ut fra folketrygdloven § 11-19 og § 11-20.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                    ],
                  },
                },
                {
                  _key: 'f54d9326cced',
                  _type: 'kategorisertTekstRef',
                  kategori: null,
                  tekst: {
                    _createdAt: '2025-10-14T11:21:26Z',
                    _id: '5fe0a418-a6c6-413b-985c-6f12d9288e5c',
                    _originalId: '5fe0a418-a6c6-413b-985c-6f12d9288e5c',
                    _rev: 'aIEg779bzu4S7KTVIr0HeC',
                    _system: {
                      base: {
                        id: '5fe0a418-a6c6-413b-985c-6f12d9288e5c',
                        rev: 'eMO4UP1m9GjRw4pEtuEbQc',
                      },
                    },
                    _type: 'tekst',
                    _updatedAt: '2025-10-14T11:24:06Z',
                    beskrivelse: 'Minstesats under 25',
                    teksteditor: [
                      {
                        _id: null,
                        _key: '16196556d684',
                        _type: 'block',
                        children: [
                          {
                            _key: 'ecac236ca766',
                            _type: 'span',
                            marks: [],
                            text: 'Du har hatt lav inntekt i årene før arbeidsevnen din ble nedsatt, og får derfor minstesats. Siden du er under 25 år får du en årlig minsteytelse som er 2/3 av 2 ganger grunnbeløpet. ',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                      {
                        _id: null,
                        _key: 'f3b980f2dc26',
                        _type: 'block',
                        children: [
                          {
                            _key: 'ac5579b39b8a',
                            _type: 'span',
                            marks: [],
                            text: 'Ditt beregningsgrunnlag er < MINSTESATSUNDER25> kroner. Denne deles på 260, som er antall arbeidsdager i året, for å få dagsatsen din.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                      {
                        _id: null,
                        _key: 'd36ab23662fe',
                        _type: 'block',
                        children: [
                          {
                            _key: '502419f87880',
                            _type: 'span',
                            marks: [],
                            text: 'Den dagen du fyller 25 år, får du oppjustert beløpet til 2 ganger grunnbeløpet i folketrygden. Dette går frem avfolketrygdloven §§ 11-19 og 11-20.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                    ],
                  },
                },
                {
                  _key: 'c6b1e9b85e0d',
                  _type: 'kategorisertTekstRef',
                  kategori: null,
                  tekst: {
                    _createdAt: '2025-10-21T11:08:17Z',
                    _id: '61b65d12-6ad7-4592-a035-672a904e491a',
                    _originalId: '61b65d12-6ad7-4592-a035-672a904e491a',
                    _rev: 'AbJHD5Vex57fVgLSF3GJWr',
                    _type: 'tekst',
                    _updatedAt: '2025-10-21T11:10:56Z',
                    beskrivelse: 'Inntekt over 6G',
                    teksteditor: [
                      {
                        _id: null,
                        _key: '7938471826fe',
                        _type: 'block',
                        children: [
                          {
                            _key: '1294f019e4cf',
                            _type: 'span',
                            marks: [],
                            text: 'Du har hatt inntekt som er høyere enn 6 ganger grunnbeløpet i folketrygden, og får derfor høyeste dagsats. Vi justerer inntektene dine etter grunnbeløpet i folketrygden. ',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                      {
                        _id: null,
                        _key: '0f8fb868d26e',
                        _type: 'block',
                        children: [
                          {
                            _key: '05261ba71ad8',
                            _type: 'span',
                            marks: [],
                            text: 'Ditt beregningsgrunnlag er <BEREGNINGSGRUNNLAG> kroner.',
                          },
                        ],
                        markDefs: [],
                        style: 'normal',
                      },
                    ],
                  },
                },
                {
                  _key: '5177d53fa09e',
                  _type: 'fritekst',
                  fritekst: 'fritekst',
                },
              ],
              beskrivelse: 'Beregningsgrunnlag',
            },
          },
          {
            _key: '71c737a763ff',
            _type: 'block',
            children: [
              {
                _key: 'e3c639804655',
                _type: 'span',
                marks: [],
                text: '',
              },
            ],
            markDefs: [],
            style: 'normal',
          },
        ],
      },
      obligatorisk: true,
    },
    {
      _key: 'e3ed1b1978be',
      _type: 'delmalRef',
      delmal: {
        _createdAt: '2025-10-21T11:05:05Z',
        _id: '78443530-1018-4be3-82fc-2cab6aa8266c',
        _originalId: '78443530-1018-4be3-82fc-2cab6aa8266c',
        _rev: 's2yfz7uRrnrDhmOWCGM6XC',
        _type: 'delmal',
        _updatedAt: '2025-10-21T11:06:37Z',
        beskrivelse: '11-5 og 11-6: Hvem kan få AAP?',
        overskrift: 'Hvem kan få AAP?',
        teksteditor: [
          {
            _key: '53284c3d17fe',
            _type: 'block',
            children: [
              {
                _key: '0fa728b806a4',
                _type: 'span',
                marks: [],
                text: 'For å ha rett til arbeidsavklaringspenger må arbeidsevnen din være nedsatt med minst halvparten på grunn av sykdom eller skade, og du trenger behandling eller bistand fra Nav for å bedre arbeidsevnen din. Dette går fram av folketrygdloven § 11-5 og § 11-6.',
              },
            ],
            markDefs: [],
            style: 'normal',
          },
        ],
      },
      obligatorisk: false,
    },
    {
      _key: 'ffdeaeb83c42',
      _type: 'delmalRef',
      delmal: {
        _createdAt: '2025-10-21T14:09:21Z',
        _id: '6f9dd0cd-8acc-4bdf-8ce3-3d559c2fc6e5',
        _originalId: '6f9dd0cd-8acc-4bdf-8ce3-3d559c2fc6e5',
        _rev: 'fUnypQWkwSwiyCaTjivJxD',
        _type: 'delmal',
        _updatedAt: '2025-10-21T14:11:25Z',
        beskrivelse: 'Helseinstitusjon',
        overskrift: null,
        teksteditor: [
          {
            _key: '8c1a8c8c0eda',
            _type: 'betingetTekstRef',
            kategorier: null,
            tekst: {
              _createdAt: '2025-10-21T14:10:34Z',
              _id: 'c37e1f7f-381c-4d4d-9fb9-57c826306406',
              _originalId: 'c37e1f7f-381c-4d4d-9fb9-57c826306406',
              _rev: 'fUnypQWkwSwiyCaTjivHnx',
              _system: {
                base: {
                  id: 'c37e1f7f-381c-4d4d-9fb9-57c826306406',
                  rev: 'fUnypQWkwSwiyCaTjivGUW',
                },
              },
              _type: 'tekst',
              _updatedAt: '2025-10-21T14:11:17Z',
              beskrivelse: 'Opphold i helseinstutisjon',
              teksteditor: [
                {
                  _key: 'db6f09eac04a',
                  _type: 'block',
                  children: [
                    {
                      _key: 'b1f9db1b332b',
                      _type: 'span',
                      marks: [],
                      text: 'Du får reduserte arbeidsavklaringspenger fra DATO, fordi du oppholder deg i en helseinstitusjon fra DATO. Du får arbeidsavklaringspenger uten reduksjon ut den måneden du ble innlagt og de tre neste månedene.',
                    },
                  ],
                  markDefs: [],
                  style: 'normal',
                },
                {
                  _key: 'e735f655081a',
                  _type: 'block',
                  children: [
                    {
                      _key: 'bf564cda8db0',
                      _type: 'span',
                      marks: [],
                      text: 'Du må ta kontakt med oss hvis du forsørger barn eller ektefelle, betaler for kost og losji eller har faste og nødvendige boutgifter. Da kan vi vurdere om du har rett til fulle arbeidsavklaringspenger.',
                    },
                  ],
                  markDefs: [],
                  style: 'normal',
                },
                {
                  _key: 'a90d38ab684f',
                  _type: 'block',
                  children: [
                    {
                      _key: '1b0482e3e939',
                      _type: 'span',
                      marks: [],
                      text: 'Når du blir utskrevet fra institusjonen, kan du få fulle arbeidsavklaringspenger. Du må ta kontakt med oss når dette skjer.',
                    },
                  ],
                  markDefs: [],
                  style: 'normal',
                },
              ],
            },
          },
        ],
      },
      obligatorisk: false,
    },
  ],
  journalposttittel: 'Innvilget aap',
  kanSendesAutomatisk: false,
  overskrift: 'Du får arbeidsavklaringspenger (AAP)',
};

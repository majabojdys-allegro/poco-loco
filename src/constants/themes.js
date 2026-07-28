const BASE = import.meta.env.BASE_URL;

const COCO_CHARACTERS = {
  2: `${BASE}assets/images/characters/imelda.png`,   // Gosia
  4: `${BASE}assets/images/characters/miguel.png`,   // Jacek
  6: `${BASE}assets/images/characters/hektor.png`,   // Łukasz W.
  5: `${BASE}assets/images/characters/ernesto.png`,  // Paweł
  3: `${BASE}assets/images/characters/marcin.png`,   // Marcin
  1: `${BASE}assets/images/characters/maja.png`,     // Maja
  7: `${BASE}assets/images/characters/lukaszt.png`,  // Łukasz T.
};

const HOGWART_CHARACTERS = {
  ...COCO_CHARACTERS,
  1: `${BASE}assets/images/characters/luna.png`,          // Maja → Luna
  2: `${BASE}assets/images/characters/hermiona.png`,      // Gosia → Hermiona
  3: `${BASE}assets/images/characters/snape.png`,         // Marcin → Snape
  4: `${BASE}assets/images/characters/harry.png`,         // Jacek → Harry
  5: `${BASE}assets/images/characters/hagrid.png`,        // Paweł → Hagrid
  6: `${BASE}assets/images/characters/dumbledore.png`,    // Łukasz W. → Dumbledore
  7: `${BASE}assets/images/characters/ron.png`,           // Łukasz T. → Ron
};

export const THEMES = [
  {
    id: 'coco',
    name: 'Coco',
    segmentColors: [
      '#E8175D',
      '#F5A623',
      '#2ECC71',
      '#9B59B6',
      '#E74C3C',
      '#1ABC9C',
      '#3498DB',
      '#D91E8C',
      '#27AE60',
      '#E67E22',
    ],
    backgroundImage: `${BASE}assets/images/coco.jpg`,
    backgroundOverlay:
      'linear-gradient(135deg, rgba(15, 12, 41, 0.55) 0%, rgba(48, 43, 99, 0.55) 50%, rgba(36, 36, 62, 0.55) 100%)',
    audioSrc: `${BASE}assets/sounds/background.mp3`,
    centerImage: `${BASE}assets/images/main.png`,
    characterImages: COCO_CHARACTERS,
    titleSideImage: null,
    labelEmoji: '🎨',
    titleClassName: 'title--coco',
  },
  {
    id: 'hogwart',
    name: 'Hogwart',
    segmentColors: [
      '#740001', // ciemna czerwień
      '#D3A625', // złoto
      '#1a472a', // ciemna zieleń
      '#0e1a40', // granat
    ],
    backgroundImage: `${BASE}assets/images/HP-tlo.jpg`,
    backgroundOverlay:
      'linear-gradient(135deg, rgba(5, 5, 20, 0.35) 0%, rgba(15, 10, 35, 0.35) 50%, rgba(8, 8, 25, 0.35) 100%)',
    audioSrc: `${BASE}assets/sounds/Harry Potter - Hedwigs Song HQ.mp3`,
    centerImage: `${BASE}assets/images/HPlogo2.png`,
    characterImages: HOGWART_CHARACTERS,
    titleSideImage: `${BASE}assets/images/HP-boczki.png`,
    labelEmoji: '⚡',
    titleClassName: 'title--hogwart',
  },
];

export const DEFAULT_THEME_ID = 'coco';

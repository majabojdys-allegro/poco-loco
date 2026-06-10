export const INITIAL_MEMBERS = [
  { id: 2, name: 'Gosia' },
  { id: 4, name: 'Jacek' },
  { id: 7, name: 'Łukasz T.' },
  { id: 6, name: 'Łukasz W.' },
  { id: 1, name: 'Maja' },
  { id: 3, name: 'Marcin' },
  { id: 5, name: 'Paweł' },
];

const BASE = import.meta.env.BASE_URL;

export const CHARACTER_IMAGES = {
  2: `${BASE}assets/images/characters/imelda.png`,   // Gosia
  4: `${BASE}assets/images/characters/miguel.png`,   // Jacek
  6: `${BASE}assets/images/characters/hektor.png`,   // Łukasz W.
  5: `${BASE}assets/images/characters/ernesto.png`,  // Paweł
  3: `${BASE}assets/images/characters/marcin.png`,   // Marcin
  1: `${BASE}assets/images/characters/maja.png`,     // Maja
  7: `${BASE}assets/images/characters/lukaszt.png`,  // Łukasz T.
};

export const SEGMENT_COLORS = [
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
];

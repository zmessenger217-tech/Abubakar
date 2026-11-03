export interface MemoryPhoto {
  id: string;
  url: string;
  title: string;
  subtitle: string;
  tag: 'celebration' | 'school' | 'candid' | 'style';
  tagLabel: string;
  location: string;
  date: string;
  note: string;
}

export const ABUBAKR_PHOTOS: MemoryPhoto[] = [
  {
    id: 'bday-golden',
    url: '/assets/aistudio/5_19dba8cb.jpeg',
    title: 'The Birthday Star ✨',
    subtitle: 'Under the golden Happy Birthday balloon arch',
    tag: 'celebration',
    tagLabel: 'Birthday Special',
    location: 'Lahore, Pakistan',
    date: 'Special Celebration Night',
    note: 'The king of the day! Surrounded by golden balloon letters and festive vibes, looking cooler than ever.',
  },
  {
    id: 'yellow-smile',
    url: '/assets/aistudio/4_f3bef709.jpeg',
    title: 'Warm Smiles & Cozy Evenings',
    subtitle: 'Mini Bear vibes with that pure, genuine smile',
    tag: 'candid',
    tagLabel: 'Family Favorite',
    location: 'Lahore, Pakistan',
    date: 'November Evening',
    note: 'That bright yellow shirt matches Abubakr’s vibrant energy and sunshine personality!',
  },
  {
    id: 'school-champ',
    url: '/assets/aistudio/6_492ca302.jpeg',
    title: 'The Young Champion & Scholar',
    subtitle: 'Looking sharp in Junior High tracksuit',
    tag: 'school',
    tagLabel: 'Proud Moments',
    location: 'Campus Grounds',
    date: 'School Days',
    note: 'Hardworking, disciplined, and always striving for the top. We are super proud of how well you do in school!',
  },
  {
    id: 'cool-pose-chin',
    url: '/assets/aistudio/WhatsApp_Image_2026-11-03_at_10.18.40_AM_44a6cdbc.jpeg',
    title: 'The Mastermind Pose 😎',
    subtitle: 'Thinking of the next big adventure',
    tag: 'style',
    tagLabel: 'Iconic Style',
    location: 'Lahore, Pakistan',
    date: 'Candid Shot',
    note: 'The signature finger-on-chin pose. When Abubakr makes this face, you know he is cooking up genius plans!',
  },
  {
    id: 'sweet-moment',
    url: '/assets/aistudio/3_d01090a6.jpeg',
    title: 'Pure Heart, Big Dreams',
    subtitle: 'A quiet, confident young gentleman',
    tag: 'candid',
    tagLabel: 'Golden Memories',
    location: 'Family Living Room',
    date: 'Memorable Days',
    note: 'Always polite, respectful, and bringing happiness to everyone in the family.',
  },
  {
    id: 'future-leader',
    url: '/assets/aistudio/2_3ddf5db8.jpeg',
    title: 'Confidence & Charm',
    subtitle: 'Ready to conquer every goal',
    tag: 'style',
    tagLabel: 'Swagger',
    location: 'Lahore, Pakistan',
    date: 'Best Moments',
    note: 'May you always walk with confidence and head held high. You have a glorious future ahead, Abubakr!',
  },
];

export interface CousinWish {
  id: string;
  name: string;
  relation: string;
  message: string;
  badge: string;
  timestamp: string;
  color: string;
}

export const INITIAL_WISHES: CousinWish[] = [
  {
    id: 'w-alveena',
    name: 'Alveena',
    relation: 'Sister',
    message: 'Happy Birthday my dearest brother Abubakr! 💖 May Allah always protect you, keep you smiling, and grant you the highest success in everything you do.',
    badge: '👑 Sister Love',
    timestamp: 'Today',
    color: 'from-rose-500/20 to-pink-500/20 border-rose-500/30',
  },
  {
    id: 'w-ahmar',
    name: 'Ahmar',
    relation: 'Cousin',
    message: 'Happy Birthday Abubakr! 🎂 You are the coolest brother and cousin. Keep rocking those legendary poses and staying sharp!',
    badge: '🔥 Cousin Squad',
    timestamp: 'Today',
    color: 'from-amber-500/20 to-orange-500/20 border-amber-500/30',
  },
  {
    id: 'w-hashir',
    name: 'Hashir',
    relation: 'Cousin',
    message: 'Happy Birthday to the champion Abubakr! 🚀 Have an epic day full of cake, fun games, and celebrations!',
    badge: '⚡ Champion',
    timestamp: 'Today',
    color: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30',
  },
  {
    id: 'w-nouman',
    name: 'Nouman',
    relation: 'Cousin',
    message: 'Dearest Abubakr, happy birthday! May Allah bless you with wisdom, upright character, and lots of barakah in your studies.',
    badge: '💡 Wisdom',
    timestamp: 'Today',
    color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30',
  },
  {
    id: 'w-wadeed',
    name: 'Wadeed',
    relation: 'Cousin',
    message: 'Yo Abubakr, happy birthday! 🎮 Big treat due on you! Wishing you unlimited laughter, happiness, and fun times ahead.',
    badge: '🎉 Best Buddy',
    timestamp: 'Today',
    color: 'from-purple-500/20 to-violet-500/20 border-purple-500/30',
  },
  {
    id: 'w-bassam',
    name: 'Bassam',
    relation: 'Cousin',
    message: 'Wishing you a magnificent birthday, Abubakr! 🏆 Proud of the smart young man you are becoming. Have the best year yet!',
    badge: '⭐ Cousin Star',
    timestamp: 'Today',
    color: 'from-yellow-500/20 to-amber-500/20 border-yellow-500/30',
  },
  {
    id: 'w-hania',
    name: 'Hania',
    relation: 'Cousin',
    message: 'Happy Birthday dear Abubakr! 🌸 May your days always be bright, joyful, and filled with sweet surprises!',
    badge: '🌺 Sweet Wishes',
    timestamp: 'Today',
    color: 'from-pink-500/20 to-rose-500/20 border-pink-500/30',
  },
];

export const COUSIN_BLESSINGS = [
  'May Allah bless Abubakr with boundless joy, excellent grades, true friendships, and great health! 🤲✨',
  'Wishing Abubakr a year packed with exciting surprises, delicious treats, and epic achievements! 🎂🚀',
  'May every single candle on Abubakr’s cake turn into a answered prayer and a fulfilled dream! 🕯️💫',
  'To our brightest star Abubakr: keep shining and inspiring everyone around you! 🌟❤️',
  'Happy Birthday Abubakr! May your kindness and smile always illuminate every room you walk into! 🎈😄',
];

import { UserProfile } from '../types';

export const INITIAL_PROFILES: UserProfile[] = [
  {
    uid: 'm_1',
    name: 'Antoine',
    age: 28,
    city: 'Paris',
    gender: 'homme',
    searchGender: 'femme',
    bio: 'Passionné d\'architecture, de cuisine bistronomique et de balades le long de la Seine. Je recherche une relation sérieuse et complice autour d\'un bon verre de vin. 🍷🎨',
    photos: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600'
    ],
    interests: ['Gastronomie', 'Musées', 'Randonnée', 'Photographie'],
    isPremium: false,
    dailyLikesLeft: 10,
    lastLikeReset: new Date().toISOString()
  },
  {
    uid: 'f_1',
    name: 'Clara',
    age: 26,
    city: 'Lyon',
    gender: 'femme',
    searchGender: 'homme',
    bio: 'Musicienne, amoureuse de nature et de road trips. J\'aime les discussions qui refont le monde jusqu\'au bout de la nuit et rire pour un rien ! Discutons en musique. 🎸✨',
    photos: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600'
    ],
    interests: ['Musique', 'Voyages', 'Yoga', 'Concerts'],
    isPremium: true,
    dailyLikesLeft: 10,
    lastLikeReset: new Date().toISOString()
  },
  {
    uid: 'f_2',
    name: 'Camille',
    age: 29,
    city: 'Marseille',
    gender: 'femme',
    searchGender: 'homme',
    bio: 'Amoureuse de la mer et de la planche à voile. Je travaille dans le design d\'intérieur. Un sourire et un esprit d\'aventure sont indispensables pour m\'accompagner ! 🌊☀️',
    photos: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600'
    ],
    interests: ['Design', 'Sports nautiques', 'Plage', 'Cinéma'],
    isPremium: false,
    dailyLikesLeft: 10,
    lastLikeReset: new Date().toISOString()
  },
  {
    uid: 'm_2',
    name: 'Thomas',
    age: 31,
    city: 'Bordeaux',
    gender: 'homme',
    searchGender: 'femme',
    bio: 'Producteur de café engagé pour l\'environnement. Toujours de bonne humeur, j\'aime l\'humour décalé et les escapades de week-end. Viens prendre un bon expresso ! ☕️🌱',
    photos: [
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1489980508314-941910ded1f4?auto=format&fit=crop&q=80&w=600'
    ],
    interests: ['Café', 'Écologie', 'Cinéma', 'Vélo'],
    isPremium: false,
    dailyLikesLeft: 10,
    lastLikeReset: new Date().toISOString()
  },
  {
    uid: 'f_3',
    name: 'Léa',
    age: 24,
    city: 'Lille',
    gender: 'femme',
    searchGender: 'tous',
    bio: 'Étudiante en psychologie, lectrice compulsive de polars et de fantasy. J\'adore cuisiner pour mes amis et organiser des soirées jeux de société. 🎲📚',
    photos: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&q=80&w=600'
    ],
    interests: ['Lecture', 'Cuisine', 'Jeux', 'Animaux'],
    isPremium: false,
    dailyLikesLeft: 10,
    lastLikeReset: new Date().toISOString()
  },
  {
    uid: 'f_4',
    name: 'Sofia',
    age: 27,
    city: 'Toulouse',
    gender: 'femme',
    searchGender: 'homme',
    bio: 'Passionnée de danse latine et de cuisine épicée. Je recherche quelqu\'un avec qui partager des rires spontanés et pourquoi pas des pas de salsa ! 💃🌶️',
    photos: [
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=600'
    ],
    interests: ['Salsa', 'Cuisine du monde', 'Festivals', 'Voyages'],
    isPremium: true,
    dailyLikesLeft: 10,
    lastLikeReset: new Date().toISOString()
  }
];

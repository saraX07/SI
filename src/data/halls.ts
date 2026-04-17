export interface Hall {
  id: string;
  name: string;
  capacity: number;
  price: number;
  imageLetter: string;
  image: string;
  description: string;
  location: string;
  rib: string;
}

export const halls: Hall[] = [
  {
    id: '1',
    name: 'Salle Alger',
    capacity: 150,
    price: 25000,
    imageLetter: 'A',
    image: '/images/hall1.png',
    description: 'Salle moderne et spacieuse, idéale pour conférences et séminaires.',
    location: 'Centre-ville, Alger',
    rib: '001 00123 4567890123 45',
  },
  {
    id: '2',
    name: 'Salle Oran',
    capacity: 100,
    price: 18000,
    imageLetter: 'O',
    image: '/images/hall2.png',
    description: 'Espace élégant parfait pour réunions professionnelles.',
    location: 'Zone d\'affaires, Oran',
    rib: '002 00456 7890123456 78',
  },
  {
    id: '3',
    name: 'Salle Mariage',
    capacity: 300,
    price: 45000,
    imageLetter: 'M',
    image: '/images/hall3.png',
    description: 'Grande salle luxueuse avec jardin pour mariages et grands événements.',
    location: 'Jardin des Roses, Alger',
    rib: '003 00789 0123456789 01',
  },
];

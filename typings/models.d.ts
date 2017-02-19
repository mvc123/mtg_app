interface Deck {
  id: number;
  name: string;
  piles: Pile[];
}

// type View = 'list' | 'images'

interface Pile {
  name: string;
  cards: Card[]; 
  view: any; // View
}

interface Card { 
  cmc: number;
  colorIdentity: string; // example "R"
  colors: string; // "Red"
  imageName: string; // "fork"
  manacost: string; //"{R}{R}"
  multiverseId: number; // 200
  name: string;  // "Fork"
  power: number;
  subtypes: string;
  text: string; // "Copy target instant or sorcery spell, except that the copy is red. You may choose new targets for the copy."
  toughness: number;
  type: string; // "Instant"
  types: string; //"Instant"
}

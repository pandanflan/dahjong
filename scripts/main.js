// Global variables

var tilesPerHand = 13;  // Does not include the extra tile for full hand
var actors = [];

// Define the deck of tiles
var deck = [];

// Valid suits
var validSuits = [
                    'animal', 
                    'art', 
					'bamboo', 
					'character', 
					'clown',
					'dot',
					'dragon',
					'emperor',
					'flower',
					'joker',
					'profession',
					'queen',
					'season',
					'tile',
					'wind'
					]


// Actor class
class Actor {
  constructor(name) {
    this.name = name;
    this.wind = 'northeast';
    this.points = 69;
	this.hand = [];
	this.openTiles = [];
	this.discards = [];
  }
  
  listTiles(tileArray) {
	  let print_list = [];
	  for (i in tileArray) {
		  print_list.push(tileArray[i].shorthand)
	  }
	  return print_list;
  }
}

// Tile class
class Tile {
  constructor(suit, number) {
    this.suit = suit;
    this.number = number;
	
	if (!validSuits.includes(suit)){
		throw new Error('Tile has been constructed with invalid suit: ${suit}')
	}
	
	this.numberString = number.toString().padStart(2,'0');
	this.imagePath = `tiles/${this.suit}/${this.numberString}.svg`;
	this.shorthand = this.suit.slice(0, 2) + this.numberString;
  }

  getTileValue() {
    // Logic to calculate tile value based on suit and number
    // Return the calculated value
  }

  compareTile(otherTile) {
    // Logic to compare two tiles based on their values or other properties
    // Return the comparison result (-1, 0, 1)
  }

  // Other tile-related methods as needed
}

// Generate deck based on game requirements
function createDeck (flowers, animals, redtiles) {
// flowers, animals, redtiles are boolean values of whether or not to include the suit.
	// Reset deck
	deck = [];
	
	// Create dict of deck requirements. key = suit, and 2D array of [qty to create, values in suit]
	var deckNeeds = {'bamboo': [4, 9],
	                 'character': [4, 9],
					 'dot': [4, 9],
					 'dragon': [4, 3],
					 'wind': [4,4]
					 }
	
	if (flowers) {
		deckNeeds['flower'] = [1, 4];
		deckNeeds['season'] = [1, 4]
	}
	
	if (animals) {
		deckNeeds['animal'] = [1, 4]
	}
	
	// push tiles into deck
	for (var suit in deckNeeds) {
		for (let i = 1; i <= deckNeeds[suit][1]; i++) {
			for (let j = 0; j < deckNeeds[suit][0]; j++) {
				deck.push(new Tile(suit, i))
			}
	    }
	}
	
	if (redtiles) {
		//redtiles logic
	}

}

// Shuffle the deck
function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

// Simulate drawing a tile from the deck
function drawTile() {
  if (deck.length === 0) {
    console.log('No tiles left in the deck.');
    return null;
  }
  return deck.pop();
}


// Render player information in player containers
function renderOpponentInformation(opponentIndex, opponent) {
  const opponentContainer = document.querySelector(`#opponent${opponentIndex}-container`);
  const opponentName = opponentContainer.querySelector('.opponent-name');
  const opponentWind = opponentContainer.querySelector('.opponent-wind');
  const opponentPoints = opponentContainer.querySelector('.opponent-points');
  const opponentHand = opponentContainer.querySelector('.hand-container');

  opponentName.textContent = opponent.name;
  opponentWind.textContent = opponent.wind;
  opponentPoints.textContent = `Points: ${opponent.points}`;
  
  renderHand(opponentHand, opponent.hand)
}


// Draw the tile images for a player's hand
function renderHand(handContainer, hand) {
// handContainer is the container to render the hand,
// hand is an array of tile objects
  // const playerHandContainer = document.getElementById(`player${player}-hand`);
  // playerHandContainer.innerHTML = '';
  
  

  hand.forEach(tile => {
    const tileImg = document.createElement('img');
    tileImg.src = tile.imagePath;
    tileImg.alt = tile;
	tileImg.className = "tile-img";
    handContainer.appendChild(tileImg);
  });
}





// Initialize the game
function initializeGame() {
  // Create actors
  
  actors = [
            new Actor('sjmc'), 
            new Actor('sincoew'), 
			new Actor('yamuda'), 
			new Actor('bengineer')
			]
  // const opponent1 = new Actor('sincoew');     // old way


  // Create deck
  createDeck(true, false, false);
  
  // Shuffle the deck
  shuffleDeck(deck);

  // Draw 13 tiles for each player
  for (i in actors) {
    for (let j = 0; j < tilesPerHand; j++) {
      const tile = drawTile();
      if (tile) {
        actors[i].hand.push(tile);
      }
    }
    console.log(`Player ${i}: ${actors[i].name}'s hand:`, actors[i].listTiles(actors[i].hand));
  }
  
  renderOpponentInformation(1, actors[1])
  renderOpponentInformation(2, actors[2])
  renderOpponentInformation(3, actors[3])
  
}


// Call the initializeGame function to start the game
initializeGame();
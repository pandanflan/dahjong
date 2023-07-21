// Global variables

var tilesPerHand = 13;  // Does not include the extra tile for full hand
var actors = [];
var playerTiles = document.querySelectorAll('.player-tile');
let selectedTile = null;
const arrow = document.querySelector('#tile-arrow');

// Define the deck of tiles
var deck = [];

// Valid suits, note this is the order suits will be sorted into
var validSuits = [
                    'bamboo',
					'character',
					'dot',
					'wind',
					'dragon',
					'flower',
					'season',
					'joker',
					'animal', 
                    'art', 
					'clown',
					'emperor',
					'profession',
					'queen',
					]


// Actor class
class Actor {
  constructor(name) {
    this.name = name;
    this.wind = 'northeast';
    this.points = 69;
	this.hand = [];
	this.melds = [];
	this.discards = [];
  }
  
  listTiles(tileArray) {
	  let print_list = [];
	  for (i in tileArray) {
		  print_list.push(tileArray[i].shorthand)
	  }
	  return print_list;
  }
  
  // compare function for sort, takes two tile objects
  compareTiles(a,b) {
	const suitIndexA = validSuits.indexOf(a.suit);
	const suitIndexB = validSuits.indexOf(b.suit);

    if (suitIndexA !== suitIndexB) {
      return suitIndexA - suitIndexB;
    }
	
	// If the suits are the same, compare the numbers
    return a.number - b.number;
  }
  
  sortHand() {
	this.hand.sort(this.compareTiles);
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
function renderActorInformation(actorContainer, actor) {
  const actorName = actorContainer.querySelector('.actor-name');
  const actorWind = actorContainer.querySelector('.actor-wind');
  const actorPoints = actorContainer.querySelector('.actor-points');
  const actorHand = actorContainer.querySelector('.actor-hand');
  const actorDiscard = actorContainer.querySelector('.actor-discard');
  const actorMeld = actorContainer.querySelector('.actor-meld');

  actorName.textContent = actor.name;
  actorWind.textContent = actor.wind;
  actorPoints.textContent = `Points: ${actor.points}`;
  
  renderTiles(actorHand, actor.hand);
  renderTiles(actorDiscard, actor.discards);
  renderTiles(actorMeld, actor.melds);
}

// Draw the tile images for a player's hand
function renderTiles(tileContainer, tiles) {
// tileContainer is the container to render the hand,
// tiles is an array of tile objects

  tiles.forEach(tile => {
    const tileImg = document.createElement('img');
    tileImg.src = tile.imagePath;
    tileImg.alt = tile.shorthand;
	tileImg.classList.add('tile-img');
    tileContainer.appendChild(tileImg);
  });
}


// for rearrange hand, currently not used
function activateHand(playerHand) {
	
	playerTiles = playerHand.querySelectorAll('.tile-img');
	
	playerTiles.forEach(tile => {

 		tile.addEventListener('click', () => {

			if (selectedTile === tile) {
		    	// If the clicked tile is already selected, deselect it
		    	tile.classList.remove('selected');
		    	selectedTile = null;
		    	arrow.style.display = 'none';
				console.log('deselected tile')
		    } else {
		    	// Select the clicked tile
		    	tile.classList.add('selected');
		    	selectedTile = tile;
		    	arrow.style.display = 'block';
				console.log('selected tile ', selectedTile);
		    	updateArrowPosition();
		    } 
		});  
		
	});
}

// for rearrange hand, currently not used
function selectTile(tile) {
	if (selectedTile === tile) {
		// Card is already selected so reorder it
		const handContainer = document.querySelector('#player-hand');
		const rect = handContainer.getBoundingClientRect();
		const mouseX = event.clientX - rect.left;
		
		let closestCard = null;
		let minDistance = Number.MAX_SAFE_INTEGER;
	
		cards.forEach((card) => {
			const cardRect = cardElement.getBoundingClientRect();
			const cardX = cardRect.left - rect.left + cardRect.width / 2;
			const distance = Math.abs(mouseX - cardX);
		
			if (distance < minDistance) {
				minDistance = distance;
				closestCard = card;
			}
		});
	}
}

// for rearrange hand, currently not used
function updateArrowPosition() {
  // Get the position of the arrow relative to the container
  console.log('arrow on');
  const containerRect = document.querySelector('.tile-container').getBoundingClientRect();
  const cardRect = selectedTile.getBoundingClientRect();
  const arrowPosition = cardRect.left - containerRect.left + cardRect.width / 2;
  
  // Update the arrow position
  arrow.style.left = arrowPosition + 'px';
}


function renderAll(){

  renderActorInformation(document.querySelector(`#player-container`), actors[0])
  renderActorInformation(document.querySelector(`#opponent1-container`), actors[1])
  renderActorInformation(document.querySelector(`#opponent2-container`), actors[2])
  renderActorInformation(document.querySelector(`#opponent3-container`), actors[3])
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
	actors[i].sortHand();
    console.log(`Player ${i}: ${actors[i].name}'s hand:`, actors[i].listTiles(actors[i].hand));
  }
  
  renderAll();
  // activateHand(document.querySelector('#player-hand'));
  
}



// Call the initializeGame function to start the game
initializeGame();



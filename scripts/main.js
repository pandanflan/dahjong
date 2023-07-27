
// ###################################################################################
// ###########    GLOBAL VARIABLES    ################################################
// ###################################################################################

var tilesPerHand = 13;  // Does not include the extra tile for full hand

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

// Flower suits, tiles will be insta-melded and new tile drawn
var flowerSuits = [
					'flower',
					'season',
					]



// set players: update with a proper setup
const sitDown = [
					 ['sjmc', 60]
					,['sincoew', 90]
					,['yamuda', 420]
					,['CHAD', 100]
					];



/* RANDOM UNUSED SHIT
// Variables that were used for handRearrange()
var playerTiles = document.querySelectorAll('.player-tile');
let selectedTile = null;
const arrow = document.querySelector('#tile-arrow');

 */


// ###################################################################################
// ###########    GAME CLASSES    ####################################################
// ###################################################################################

// Game manager with necessary game functions
class GameManager {
	
/* 	GameManager Notes
	
	this.gameState:
	0 - Game is setting up
	5 - Game is in progress
	98 - Game is complete - deck exhausted
	99 - Game is complete - sik called
 */	
	
	constructor(){
		// initialise variables
		this.actors = [];
		this.dealerPlayer = null;
		this.activePlayer = null;
		this.deck = [];
		this.gameState = 0;  
		
	}
	
	createDeck (flowers, animals, redtiles) {
	// flowers, animals, redtiles are boolean values of whether or not to include the suit.
	// Reset deck
	this.deck = [];
	
	var tileid = 0;
	// Create dict of deck requirements. key = suit, and 2D array of [qty to create, no. of values in suit]
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
				tileid++;
				this.deck.push(new Tile(suit, i, tileid))
			}
	    }
	}
	
	if (redtiles) {
		//redtiles logic
	}

}
	
	shuffleDeck() {
  for (let i = this.deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
  }
}

	drawTile() {
  // Check for empty deck, need extra logic (game over logic)
  if (this.deck.length === 0) {
    console.log('No tiles left in the deck.');
    return null;
  }
  document.querySelector('#tiles-in-deck').innerHTML = this.deck.length;
  return this.deck.pop();
}

	nextPlayer(){
	const containers = document.querySelectorAll('.actor-container');
	containers[this.activePlayer].classList.remove('active-container');
	this.activePlayer++;
	this.activePlayer = this.activePlayer%4;
	containers[this.activePlayer].classList.add('active-container');
}

	startGame(){
		// Randomise dealer
		this.dealerPlayer = Math.floor(Math.random()*4);
		this.activePlayer=this.dealerPlayer;
		
		// Create actors
		this.actors = []; 
		for (let i in sitDown){
			this.actors.push(new Actor(sitDown[i][0],(i-this.dealerPlayer+4)%4+1,sitDown[i][1]))
		}
		
		// Create new deck and shuffle
		this.deck = [];
		this.createDeck(true, false, false);
		this.shuffleDeck();		
		
		// Draw 13 tiles for each player
		while (this.actors[(this.dealerPlayer+3)%4].hand.length<tilesPerHand) {
			var tile = this.drawTile();
			
			while (flowerSuits.includes(tile.suit)){      // Insta-meld flowers
				this.actors[this.activePlayer].melds.push(tile);
				tile = this.drawTile();
			}
			
			this.actors[this.activePlayer].hand.push(tile);
			this.nextPlayer();
		}
		
		// Sort everyone's hand
		for (let i in this.actors){
			this.actors[i].sortHand();
			console.log(`Player ${i}: ${this.actors[i].name}'s hand:`, this.actors[i].listTiles(this.actors[i].hand))
		}
		
		// Log game initialisation
		console.log('Dealer:', this.dealerPlayer);
		
		renderAll();
	}

	gameLoop(){
		while (this.gameState<90){
			
			// Draw a tile
			let tile = this.drawTile();
			
			
			// move tile to limbo
			let tile = this.playTurn(this.activePlayer, tile);
			
			// check sik
			var sikResult;
			for (let p_to_check of [0, 1, 2, 3].filter((pl) => pl != this.activePlayer)){
				sikResult = checkSik(tile, this.actors[p_to_check].hand);
			}
			// if sik available
			let sikked = this.offerSik(sikResult, tile);
			
			// end game by repeating loop
			if(sikked){
				this.gameState = 99;
				continue;
			}
			
			// check pongs
			var pongResult;
			for (let p_to_check of [0, 1, 2, 3].filter((pl) => pl != this.activePlayer)){
				pongResult = checkPong(tile, this.actors[p_to_check].hand);
			}
			// if pong available
			let ponged = this.offerPong(pongResult, tile);
			
			
			
			// check seung
			var seungResult;
			seungResult = checkSeung(tile, this.actors[(activePlayer+1)%4])
			// if seung available
			this.offerSeung(sikResult, tile)
			
			
			// if no opponent melds, tile goes from limbo to player's discard
			this.actors[activePlayer].discards.push(tile);
			
			// check for empty deck
			if (this.deck.length == 0) {
				this.gameState = 98;
				continue;
			}
			
			// switch player
			nextPlayer();
			
			
		}
		
		gameEnd(someVariable);
	}
	
	playTurn(player){
		// if AI?
		// pass to ai agent
		// ai agent to return a tile
			
		// if human?
		// pass to human agent
		// show buttons
		// set up event listeners
		
		// output a tileid
	}
	
	gameEnd(someVariable){
		// case gamestate 99
		// reveal sikked hand to all
		// updating of points (maybe always)
		// updating of wind seats
		// updating of wind rounds
		
	}
	
	

}

// Actor class
class Actor {
  constructor(name, wind, points) {
    this.name = name;
	// wind note 1: east, 2: south, 3: west, 4: north
    this.wind = wind;
    this.points = points;
	this.hand = [];
	this.melds = [];
	this.discards = [];
  }
  
  listTiles(tileArray) {
	  let print_list = [];
	  for (let i in tileArray) {
		  print_list.push(tileArray[i].shorthand)
	  }
	  return print_list;
  }
  
  
  // To do this.draw(), it's just: this.hand.push(drawTile())
  
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
  
  meldTiles(tileIDs){ // tileIDs is an array of the tile IDs that are to be melded
	  // check if tiles in hand
	  if (tileIDs.every(checkID => this.hand.some(checkTile => checkTile.tileid == checkID))){
		  throw new Error("Unable to meld tiles, tiles do not exist in player's hand");
	  }
	  
	  const tilesToMove = this.hand.filter(moveTile => tileIDs.includes(moveTile.tileid))
	  
	  // Remove tiles from hand
	  this.hand = this.hand.filter(rmTile => !tileIDs.includes(moveTile.tileid))
	  
	  this.melds.push(...tilesToMove);
	  
	  
  }
}

// Tile class
class Tile {
  constructor(suit, number, tileid) {
    this.suit = suit;
    this.number = number;
	this.tileid = tileid;
	if (!validSuits.includes(suit)){
		throw new Error('Tile has been constructed with invalid suit: ${suit}');
	}
	this.numberString = number.toString().padStart(2,'0');
	// this.imagePath = `tiles/${this.suit}/${this.numberString}.svg`;
	this.shorthand = this.suit.slice(0, 2) + this.numberString;
	// Create image object
	this.tileImg = document.createElement('img');
    this.tileImg.src = `tiles/${this.suit}/${this.numberString}.svg`;
    this.tileImg.alt = this.shorthand;
	this.tileImg.classList.add('tile-img');	
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

// Really simple AI for playing the game
class BasicAI {
	//some functions to handle logic
}


// ###################################################################################
// ###########    BASIC CALC FUNCTIONS    ############################################
// ###################################################################################





// ###################################################################################
// ###########    RENDERING FUNCTIONS    #############################################
// ###################################################################################

// Render actor information in actor containers
function renderActorInformation(actorContainer, actor) {
  const actorName = actorContainer.querySelector('.actor-name');
  const actorWind = actorContainer.querySelector('.actor-wind');
  const actorPoints = actorContainer.querySelector('.actor-points');
  const actorHand = actorContainer.querySelector('.actor-hand');
  const actorDiscard = actorContainer.querySelector('.actor-discard');
  const actorMeld = actorContainer.querySelector('.actor-meld');

  actorName.textContent = actor.name;
  actorPoints.textContent = `Points: ${actor.points}`;
  
  const windImg = document.createElement('img');
  const windSrc = `tiles/wind/${actor.wind.toString().padStart(2,'0')}.svg`;
  actorWind.innerHTML = `<img src=${windSrc} class='actor-wind-img'>`;
  
  
  renderTiles(actorHand, actor.hand);
  renderTiles(actorDiscard, actor.discards);
  renderTiles(actorMeld, actor.melds);
}

// Draw the tile images for a actor's tile container (eg. hand, discards, melds)
function renderTiles(tileContainer, tiles) {
// tileContainer is the container to render the hand,
// tiles is an array of tile objects

  tiles.forEach(tile => {
    tileContainer.appendChild(tile.tileImg);
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

/* UNUSED FUNCTIONS
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
 */

function renderAll(){

  renderActorInformation(document.querySelector(`#player-container`), gM.actors[0])
  renderActorInformation(document.querySelector(`#opponent1-container`), gM.actors[1])
  renderActorInformation(document.querySelector(`#opponent2-container`), gM.actors[2])
  renderActorInformation(document.querySelector(`#opponent3-container`), gM.actors[3])
  
  // Add dealer notifier
  const dealer = document.querySelectorAll(`.actor-container`)[gM.dealerPlayer];
  dealer.querySelector('.actor-wind-img').classList.add('actor-wind-dealer');
}




const gM = new GameManager();
// Start first game
gM.startGame();




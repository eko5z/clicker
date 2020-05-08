// DOM elements.
var progressNode = document.getElementById ('clicker');

// Game stuff.
var progress = 0;
var clickInterval = null;

var items = new Map ();

// Audio.
var progressAudio = new Audio ('resources/progress.wav');
progressAudio.loop = true;
progressAudio.volume = 0.3;
var rewardAudios = [new Audio ('resources/reward.wav'),
						  new Audio ('resources/reward2.wav'),
						  new Audio ('resources/reward3.wav')];



function rewardPlay () {
	 rewardAudios[Math.floor (Math.random () * rewardAudios.length)].play ();
}

function Item (name, src) {
	 this.name = name;
	 this.image = new Image ();
	 this.image.src = src;
	 this.count = 1;
	 this.node = document.createElement ('tr');
	 this.imageColumn = document.createElement ('td');
	 this.countColumn = document.createElement ('td');
	 this.nameColumn = document.createElement ('td');

	 this.imageColumn.appendChild (this.image);
	 
	 this.node.appendChild (this.imageColumn);
	 this.node.appendChild (this.countColumn);
	 this.node.appendChild (this.nameColumn);
	 
	 this.countColumn.innerText = this.count;
	 this.nameColumn.innerText = this.name;
	 document.getElementById ('inventory').appendChild (this.node);
	 
	 this.updateNode = function () {
		  this.countColumn.innerText = this.count;
		  this.nameColumn.innerText = this.name;
	 }
	 
	 this.increment = function () {
		  this.count++;
	 };
}

function itemsAdd (name, src) {
	 if (items.has (name)) {
		  items.get (name).increment ();
		  items.get (name).updateNode ();
	 } else {
		  items.set (name, new Item (name, src));
	 }
}

function click () {
	 console.log ('Click!');
	 progress++;
	 progressNode.style.width = progress + "%";

	 if (progress >= 100) {
		  rewardPlay ();

		  var chance = Math.random ();

		  if (chance < 0.25){
				itemsAdd ('Shoe', 'resources/shoe.svg')
		  } else {
				itemsAdd ('Fish', 'resources/fish.svg');
		  }
		  
		  stopClicking ();
		  startClicking ();
	 }
}

function startClicking () {
	 progressAudio.currentTime = 0;
	 progressAudio.play ();
	 
	 clearInterval (clickInterval);
	 clickInterval = setInterval (click, 20);
}

function stopClicking () {
	 progressAudio.pause ();
	 
	 clearInterval (clickInterval);
	 progress = 0;
	 progressNode.style.width = progress + "%";
}

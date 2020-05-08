// DOM elements.
var clicker = document.getElementById ('clicker');

// Game stuff.
var clickInterval = null;
var items = new Map ();

// Audio
var rewardAudio = new Audio ('resources/reward.wav');

function Item (name, src) {
	 this.name = name;
	 this.image = new Image ();
	 this.image.src = src;
	 this.count = 1;
	 this.node = document.createElement ('tr');
	 this.imageColumn = document.createElement ('td');
	 this.textColumn = document.createElement ('td');
	 this.text = document.createElement ('span');

	 this.imageColumn.appendChild (this.image);
	 
	 this.node.appendChild (this.imageColumn);
	 this.node.appendChild (this.textColumn);

	 this.textColumn.innerText = ' ' + this.name + ' (' + this.count + ')';
	 document.getElementById ('inventory').appendChild (this.node);
	 
	 this.updateNode = function () {
		  this.textColumn.innerText = ' ' + this.name + ' (' + this.count + ')';
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
	 clicker.value++;

	 if (clicker.value >= 100) {
		  rewardAudio.play ();

		  var chance = Math.random ();

		  if (chance < 0.25){
				itemsAdd ('Shoe', '')
		  } else {
				itemsAdd ('Fish', '');
		  }
		  
		  stopClicking ();
		  startClicking ();
	 }
}

function startClicking () {
	 clearInterval (clickInterval);
	 clickInterval = setInterval (click, 20)
}

function stopClicking () {
	 clearInterval (clickInterval);
	 clicker.value = 0;
}

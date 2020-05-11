// DOM elements.
var progressNode = document.getElementById ('clicker');

// Game stuff.
var progress = 0;
var clickInterval = null;

var items = new Map ();

var dropModifier = 2;
var progressSpeed 

// Audio.
var progressAudio = new Audio ('resources/progress.wav');
progressAudio.loop = true;
progressAudio.volume = 0.3;
var rewardAudios = [new Audio ('resources/reward.wav'),
						  new Audio ('resources/reward2.wav'),
						  new Audio ('resources/reward3.wav')];
var sellAudio = new Audio ('resources/sell.wav');


function rewardPlay () {
	 rewardAudios[Math.floor (Math.random () * rewardAudios.length)].play ();
}

function Item (name, count, price, sellable, src) {
	 this.name = name;
	 this.image = new Image ();
	 this.image.src = src;
	 this.count = count;
	 this.price = price;
	 this.sellable = sellable;
	 
	 // Upgrade stuff.
	 this.activatable = false;
	 
	 // Initialize shit.
	 this.node = document.createElement ('tr');
	 this.imageColumn = document.createElement ('td');
	 this.countColumn = document.createElement ('td');
	 this.nameColumn = document.createElement ('td');
	 this.sellColumn = document.createElement ('td');
	 this.sellAllColumn = document.createElement ('td');
	 
	 if (sellable) {
		  this.sellButton = document.createElement ('button');
		  this.sellAllButton = document.createElement ('button');
		  
		  this.sellButton.onclick = (function () {
				sellAudio.currentTime = 0;
				sellAudio.play ();
				
				itemsRemove (this.name, 1);
				itemsAdd ('Money', this.price, 1, false, 'resources/money.svg');
		  }).bind (this);

		  this.sellAllButton.onclick = (function () {
				sellAudio.currentTime = 0;
				sellAudio.play ();
				
				itemsRemove (this.name, this.count);
				itemsAdd ('Money', this.count * this.price, 1, false, 'resources/money.svg');
		  }).bind (this);
		  
		  this.sellColumn.appendChild (this.sellButton);
		  this.sellAllColumn.appendChild (this.sellAllButton);
		  this.sellButton.innerHTML = "Sell (" + this.price + ")";
		  this.sellAllButton.innerHTML = "Sell All (" + this.price * this.count + ")";
	 }
	 
	 this.imageColumn.appendChild (this.image);
	 
	 this.node.appendChild (this.imageColumn);
	 this.node.appendChild (this.countColumn);
	 this.node.appendChild (this.nameColumn);
	 this.node.appendChild (this.sellColumn);
	 this.node.appendChild (this.sellAllColumn);
	 
	 this.countColumn.innerText = this.count;
	 this.nameColumn.innerText = this.name;
	 
	 document.getElementById ('inventory').appendChild (this.node);
	 
	 this.updateNode = function () {
		  this.countColumn.innerText = this.count;
		  this.nameColumn.innerText = this.name;

		  if (sellable) {
				this.sellButton.innerHTML = "Sell (" + this.price + ")";
				this.sellAllButton.innerHTML = "Sell All (" + this.price * this.count + ")";
		  }
	 }

	 this.removeNode = function () {
		  this.node.remove ();
	 }


	 this.add = function (n) {
		  this.count += n;
	 }
}

function itemsAdd (name, count, price, sellable, src) {
	 if (items.has (name)) {
		  items.get (name).add (count);
		  items.get (name).updateNode ();
	 } else {
		  items.set (name, new Item (name, count, price, sellable, src));
	 }
}

function itemsRemove (name, count) {
	 if (items.has (name)) {
		  var item = items.get (name);

		  if (item.count <= count) {
				item.removeNode ();
				items.delete (name);
		  } else {
				item.count -= count;
		  }

		  item.updateNode ();
	 }
}

function click () {
	 progress++;
	 progressNode.style.width = progress + "%";

	 if (progress >= 100) {
		  rewardPlay ();

		  var chance = Math.random ();

		  if (chance < 0.25){
				itemsAdd ('Shoe', 1, 1, true, 'resources/shoe.svg')
		  } else {
				itemsAdd ('Fish', 1, 3, true, 'resources/fish.svg');
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

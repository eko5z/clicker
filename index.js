// DOM elements.
var progressNode = document.getElementById ('clicker');

// Game stuff.
var progress = 0;
var clickInterval = null;

var items = new Map ();

var dropModifier = 2;
var progressSpeed = 2;		  // In seconds.

var base_threshold = 5;
var threshold = 125;				  // The threshold till new item
// appears.

// Audio.
var progressAudio = new Audio ('resources/progress.wav');
progressAudio.loop = true;
progressAudio.volume = 0.3;
var rewardAudios = [new Audio ('resources/reward.wav'),
						  new Audio ('resources/reward2.wav'),
						  new Audio ('resources/reward3.wav')];
var sellBuyAudio = new Audio ('resources/sell.wav');


function rewardPlay () {
	 rewardAudios[Math.floor (Math.random () * rewardAudios.length)].play ();
}

function Item (name, count, price, sellable, buyable, activatable, modifiers, tooltip, src) {
	 this.name = name;
	 this.image = new Image ();
	 this.image.src = src;
	 this.image.title = tooltip;
	 this.count = count;
	 this.price = price;
	 this.sellable = sellable;
	 
	 // Initialize shit.
	 this.node = document.createElement ('tr');
	 this.imageColumn = document.createElement ('td');
	 this.countColumn = document.createElement ('td');
	 this.nameColumn = document.createElement ('td');
	 this.sellBuyColumn = document.createElement ('td');
	 this.sellBuyAllColumn = document.createElement ('td');
	 this.activateColumn = document.createElement ('td');
	 
	 if (sellable) {
		  this.sellBuyButton = document.createElement ('button');
		  this.sellBuyAllButton = document.createElement ('button');
		  
		  this.sellBuyButton.onclick = (function () {
				sellBuyAudio.currentTime = 0;
				sellBuyAudio.play ();
				
				itemsRemove (this.name, 1);
				itemsAdd ('Money', this.price, 1, false, false, false, null, 'Money', 'resources/money.svg');

				thresholdRandomItem ();
		  }).bind (this);

		  this.sellBuyAllButton.onclick = (function () {
				sellBuyAudio.currentTime = 0;
				sellBuyAudio.play ();
				
				itemsRemove (this.name, this.count);
				itemsAdd ('Money', this.count * this.price, 1, false, false, false, null, 'Money', 'resources/money.svg');

				thresholdRandomItem ();
		  }).bind (this);
		  
		  this.sellBuyColumn.appendChild (this.sellBuyButton);
		  this.sellBuyButton.innerHTML = "Sell (" + this.price + ")";

		  if (!activatable) {
				this.sellBuyAllColumn.appendChild (this.sellBuyAllButton);
				this.sellBuyAllButton.innerHTML = "Sell All (" + this.price * this.count + ")";
		  }
	 }

	 if (buyable) {
		  this.sellBuyButton = document.createElement ('button');
		  
		  this.sellBuyButton.onclick = (function () {
				sellBuyAudio.currentTime = 0;
				sellBuyAudio.play ();

				if (items.has ('Money')) {
					 var money = items.get ('Money');

					 if (money.count >= this.price * this.count) {
						  itemsRemove ('Money', this.count * this.price);
						  itemsRemove (this.name, this.count);
						  itemsAdd (this.name, this.count, Math.ceil (this.price / 2), true, false, this.activatable, this.modifiers, this.image.title, this.image.src);
					 }
				}
		  }).bind (this);
		  
		  this.sellBuyColumn.appendChild (this.sellBuyButton);
		  this.sellBuyButton.innerHTML = "Buy (" + this.price * this.count + ")";
	 }

	 // Upgrade stuff.

	 if (activatable) {
		  this.activatable = activatable;
		  // Modifiers look like this { drop: n, progress: m }
		  this.modifiers = modifiers;
	 }
	 
	 if (activatable && !buyable) {
		  this.activateCheckbox = document.createElement ('input');
		  this.activateCheckbox.type = 'checkbox';

		  this.activateCheckbox.onclick = (function () {
				if (this.activateCheckbox.checked == true) {
					 console.log ('Enabling modifiers.');
					 this.on ();
				} else {
					 console.log ('Disabling modifiers.');
					 this.off ();
				}
		  }).bind (this);
		  
		  this.activateColumn.appendChild (this.activateCheckbox);
	 }
	 
	 this.imageColumn.appendChild (this.image);
	 
	 this.node.appendChild (this.imageColumn);
	 this.node.appendChild (this.countColumn);
	 this.node.appendChild (this.nameColumn);
	 this.node.appendChild (this.sellBuyColumn);
	 this.node.appendChild (this.sellBuyAllColumn);
	 this.node.appendChild (this.activateColumn);

	 if (!activatable) {
		  this.countColumn.innerText = this.count;
	 }
	 
	 this.nameColumn.innerText = this.name;

	 if (sellable || (!sellable && !buyable)) {
		  document.getElementById ('inventory').appendChild (this.node);
	 } else if (buyable) {
		  document.getElementById ('shop').appendChild (this.node);
	 }
	 
	 this.updateNode = function () {
		  if (!activatable) {
				this.countColumn.innerText = this.count;
		  }
		  
		  this.nameColumn.innerText = this.name;

		  if (sellable) {
				this.sellBuyButton.innerHTML = "Sell (" + this.price + ")";

				if (!activatable) {
					 this.sellBuyAllButton.innerHTML = "Sell All (" + this.price * this.count + ")";
				}
		  } else if (buyable) {
				this.sellBuyButton.innerHTML = "Buy (" + this.price * this.count + ")";
		  }
	 }

	 this.removeNode = function () {
		  this.node.remove ();
	 }


	 this.add = function (n) {
		  this.count += n;
	 }

	 // Upgrade functions.

	 this.on = function () {
		  dropModifier += this.modifiers.drop;
		  progressSpeed += this.modifiers.progress;
	 }

	 this.off = function () {
		  dropModifier -= this.modifiers.drop;
		  progressSpeed -= this.modifiers.progress;
	 }
}

function itemsAdd (name, count, price, sellable, buyable, activatable, modifiers, tooltip, src) {
	 if (items.has (name)) {
		  var item = items.get (name);

		  if (!activatable && !item.activatable) {
				item.add (count);
				item.updateNode ();
		  }

		  return true;
	 } else {
		  items.set (name, new Item (name, count, price, sellable, buyable, activatable, modifiers, tooltip, src));
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

function thresholdRandomItem () {
	 if (items.has ('Money')) {
		  var money = items.get ('Money');

		  if (money.count >= threshold) {
				// Add the item...

				var chance = Math.random ();

				if (!itemsAdd ('Fishing Rod of Doom', 1, 200, false, true, true, { drop: -1, progress: -0.5 }, '-1 drop rate, -0.5 s fishing speed', 'resources/rod.svg')) {
					 itemsAdd ('Fishing Line of Doom', 1, 200, false, true, true, { drop: 3, progress: 0.25 }, '+3 drop rate, 0.25 s fishing speed', 'resources/line.svg');
				}

				threshold += Math.pow (base_threshold, Math.ceil (Math.random () * 5));
		  }
	 }
}

function click () {
	 progress++;
	 progressNode.style.width = progress + "%";

	 if (progress >= 100) {
		  rewardPlay ();

		  var chance = Math.random ();
		  var number = dropModifier + Math.ceil (Math.random () * dropModifier * 2);

		  if (chance < 0.1){
				itemsAdd ('Watch', number, 25, true, false, false, null, 'Watch', 'resources/watch.svg');
		  } else if (chance < 0.7) {
				itemsAdd ('Shoe', number, 1, true, false, false, null, 'Shoe', 'resources/shoe.svg');
		  } else {
				itemsAdd ('Fish', number, 3, true, false, false, null, 'Fish','resources/fish.svg');
		  }
		  
		  stopClicking ();
		  startClicking ();
	 }
}

function startClicking () {
	 progressAudio.currentTime = 0;
	 progressAudio.play ();
	 
	 clearInterval (clickInterval);
	 clickInterval = setInterval (click, progressSpeed * 10);
}

function stopClicking () {
	 progressAudio.pause ();
	 
	 clearInterval (clickInterval);
	 progress = 0;
	 progressNode.style.width = progress + "%";
}

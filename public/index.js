"use strict"

/**
 * @author Dusan Veselinovic <dusan.veselinovic.dev@gmail.com>
 * @description Fun project for slot machine */

/**
 * @enum {String} SlotMachine defaults settings */
 const Default = Object.freeze({
  credit: 1000,
  reels: 3,
  numberOfSymbolsInReel: 11, // MAX 19 extend reelSymbols if you want more
  minBet: 1,
  maxBet: 20,
  mixMatchSymbolsWin: 2,
  musicVol: 0.4,
  gameVol: 0.1,
  autoSpinSpeed: 3000,
  autoSpinNextSpinDelay: 2000,
  reelsSpinRound: 2,
  reelSymbols: [
    {
      orderNumber: 0,
      worth: 6,
      imageUrl: './media/reelsSymbols/elon_mask.png'
    },
    {
      orderNumber: 1,
      worth: 1,
      imageUrl: './media/reelsSymbols/ape_nft_1.png'
    },
    {
      orderNumber: 2,
      worth: 1,
      imageUrl: './media/reelsSymbols/ape_nft_2.png'
    },
    {
      orderNumber: 3,
      worth: 1,
      imageUrl: './media/reelsSymbols/ape_nft_3.png'
    },
    {
      orderNumber: 4,
      worth: 1,
      imageUrl: './media/reelsSymbols/ape_nft_4.png'
    },
    {
      orderNumber: 5,
      worth: 2,
      imageUrl: './media/reelsSymbols/ape_nft_5.png'
    },
    {
      orderNumber: 6,
      worth: 2,
      imageUrl: './media/reelsSymbols/ape_nft_6.png'
    },
    {
      orderNumber: 7,
      worth: 2,
      imageUrl: './media/reelsSymbols/ape_nft_7.png'
    },
    {
      orderNumber: 8,
      worth: 2,
      imageUrl: './media/reelsSymbols/ape_nft_8.png'
    },
    {
      orderNumber: 9,
      worth: 3,
      imageUrl: './media/reelsSymbols/ape_nft_9.png'
    },
    {
      orderNumber: 10,
      worth: 3,
      imageUrl: './media/reelsSymbols/ape_nft_10.png'
    },
    {
      orderNumber: 11,
      worth: 3,
      imageUrl: './media/reelsSymbols/ape_nft_11.png'
    },
    {
      orderNumber: 12,
      worth: 3,
      imageUrl: './media/reelsSymbols/ape_nft_12.png'
    },
    {
      orderNumber: 13,
      worth: 4,
      imageUrl: './media/reelsSymbols/ape_nft_13.png'
    },
    {
      orderNumber: 14,
      worth: 4,
      imageUrl: './media/reelsSymbols/ape_nft_14.png'
    },
    {
      orderNumber: 15,
      worth: 4,
      imageUrl: './media/reelsSymbols/ape_nft_15.png'
    },
    {
      orderNumber: 16,
      worth: 4,
      imageUrl: './media/reelsSymbols/ape_nft_16.png'
    },
    {
      orderNumber: 17,
      worth: 5,
      imageUrl: './media/reelsSymbols/ape_nft_17.png'
    },
    {
      orderNumber: 18,
      worth: 5,
      imageUrl: './media/reelsSymbols/ape_nft_18.png'
    },
    {
      orderNumber: 19,
      worth: 5,
      imageUrl: './media/reelsSymbols/ape_nft_19.png'
    }
  ]
});

class OgreSlotMachine{
  constructor(credit = Default.credit, reels = Default.reels){
      this.credit = credit;
      this.reels = reels;
      this.reelsBucket = [];
      this.betValue = Default.minBet;
      this.autoSpinInterval;
      this.autoSpinSpeed;
      this.populateReelsBuckets(reels);
  }

  populateReelsBuckets(reels) {
    for(let i=0; i < reels; i++) {
      this.reelsBucket.push(Default.reelSymbols);
    }
  }

  /**
   * 
   * @param {number} min 
   * @param {max} max 
   * @returns {number} Number is between min and max
   */
  random(min = 1, max = this.reelSymbols.length) {
      return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1) + Math.ceil(min));
  }

   /**
   * 
   * @param { event } event onClick
   * @returns { void } 
   */
  spin(event) {
      let resultCombination = [];
      let symbolCounts = {};
      let winSum = 0;
      let self = this;
      let maxTimeout;
      let audio;

      if(document.getElementsByClassName('slot__reel').length){
        let slotReel = document.querySelectorAll('.slot__reel');
        slotReel.forEach( slotReel => slotReel.remove() );
      }

      audio = new Audio('./media/sounds/slot_spin.mp3');
      audio.volume = Default.gameVol;
      audio.play();

      function setBetValue(e, self) {
        let betValue = document.getElementById('js-betValue');
        let isBetOne = e.target.classList.contains('js-betOne') ? self.betValue = Default.minBet : false;
        let isbetMax = e.target.classList.contains('js-betMax') ? self.betValue = Default.maxBet : false;
        if(isBetOne) {
          self.betValue = Default.minBet;
          betValue.value = Default.minBet;
        } else if(isbetMax) {
          self.betValue = Default.maxBet;
          betValue.value = Default.maxBet;
        }
      }

      function resultReels(reelsBucket, self){
        let randomNum;
        reelsBucket.forEach(element => {
          randomNum = element[self.random(0, Default.numberOfSymbolsInReel)].orderNumber;
          resultCombination.push(randomNum);
        });
      }

      function countReels(resultCombination) {
        resultCombination.forEach((reel) => symbolCounts[reel] = (symbolCounts[reel] || 0) + 1);
        return symbolCounts;
      }

      function winReels(symbolCounts, self){
        for(const symbol in symbolCounts){
          if(symbolCounts[symbol] >= Default.mixMatchSymbolsWin) {
            return self.betValue * Math.floor(Math.pow(2, Default.reelSymbols[symbol].worth)) * (symbolCounts[symbol]);
          }
        }
      }

      function displayReels(resultCombination, self) {
        resultCombination.forEach((reelResul) => {
          let addedReel = self.addReels(Default.reelSymbols);
          let timeout = self.stopReels(addedReel, Number(reelResul), Default.reelsSpinRound, Default.numberOfSymbolsInReel);
          maxTimeout = maxTimeout || timeout;
          if(maxTimeout <= timeout){ maxTimeout = timeout}
        });
      }

      setBetValue(event, self);
      resultReels(this.reelsBucket, self);
      displayReels(resultCombination, self);
      winSum = winReels(countReels(resultCombination), self);
      setTimeout(() => this.calculateCredit(winSum), maxTimeout);
  }

  autoSpin(e) {
    let btn = e.target;
    // TODO Closure ?
    if(this.autoSpinInterval){
      clearInterval(this.autoSpinInterval);
      this.autoSpinInterval = undefined;
      btn.classList.remove("btn--blinkBorder");
    } else {
      this.autoSpinInterval = setInterval(() => {
        this.spin(e);
      }, Default.autoSpinSpeed + Default.autoSpinNextSpinDelay)
      btn.classList.add("btn--blinkBorder");
    }

  }

  calculateCredit(value){
    let paid = document.getElementById('js-paid');
    let total = document.getElementById('js-total');

    let audio;
    
    // REF: Avoid if statments
    if(value > 0) {
      audio = new Audio('./media/sounds/slot_win.mp3');
      audio.volume = Default.gameVol;
      audio.play();
      this.credit += value;

      // Display how much user earned
      paid.value = value;
    } else {
      audio = new Audio('./media/sounds/slot_lose.mp3');
      audio.volume = Default.gameVol;
      audio.play();
      this.credit -= this.betValue;
      paid.value = 0;
    }

    total.value = this.credit;
    
  }

  playMusic(e) {
    let btn = e.target;
    let body = document.getElementsByTagName('body')[0];
    let audio = document.getElementById("slot__music");
    audio.volume = Default.musicVol || 1;
    
    // REF: Avoid if statments
    if(audio.paused) {
      audio.play(); 
      body.classList.add("body--horizontalBg");
      btn.classList.add("js-playMusic--pause");
    }else {
      audio.pause();
      body.classList.remove("body--horizontalBg");
      btn.classList.remove("js-playMusic--pause");
    }
    
  }

  betMaxMinValueValidator(e){
    let betValue = Number(e.target.value);
    
    /**
     * 
     * @param {number} value 
     * @param {number} min 
     * @param {number} max 
     * @returns {boolean} Return if value is between min and max
    */
    function isInRange(value, min, max) {
      return (min <= value && max >= value);
    }
    
    if(isInRange(betValue, Default.minBet, Default.maxBet)) {
      this.betValue = betValue;
    } else {
      e.target.value = Default.minBet;
    }

  }

  addReels(reelSymbols) {
    // create a new div element
    let slotReel = document.createElement("div");
    let blockContainer = document.createElement("div");
    let blockRailway = document.createElement("div");
    let block;
    let cache;
  
    slotReel.classList.add("slot__reel");
    blockContainer.classList.add("reel__window");
    blockRailway.classList.add("reel__railway");
  
    for(let i = 0; i <= Default.numberOfSymbolsInReel; i++){
      block = document.createElement("div");
      block.classList.add("reel__symbol");
      block.innerHTML = i;
      block.style.backgroundImage = `url(${reelSymbols[i].imageUrl})`;
      blockRailway.appendChild(block);
  
      // Make clone of last element, and put it at start
      if(i == Default.numberOfSymbolsInReel){
        cache = document.createElement("div");
        cache.classList.add("reel__symbol");
        cache.innerHTML = i;
  
        blockRailway.prepend(cache);
      }
      
    }
  
    slotReel.appendChild(blockContainer);
    blockContainer.appendChild(blockRailway);
    
    document.getElementById('slot__reels').appendChild(slotReel);
  
    // Animate
    let reelSymbol = document.getElementsByClassName("reel__symbol");
    let blockMarginTop = parseInt(getComputedStyle(reelSymbol[0]).marginTop)
    let blockRealHeight = reelSymbol[0].clientHeight + blockMarginTop;
    let blockTotalHeight = (Default.numberOfSymbolsInReel * blockRealHeight + (blockRealHeight));
    let intervalSpinReels;
    blockRailway.style.top = -blockTotalHeight + 'px';
  
    intervalSpinReels = setInterval(this.spinReels(blockTotalHeight, blockRailway, blockRealHeight), 100);
    return {
      speed: blockRealHeight,
      timeout: 100,
      interval: intervalSpinReels,
      blockTotalHeight: blockTotalHeight,
    }
  }

  spinReels(blockTotalHeight, railway, speed) {
    let position = -blockTotalHeight;
    
    return function() {
      position += speed;
      railway.style.top = position +'px';
      
      // Reset reels
      if(0 <= position){
        railway.style.top = -blockTotalHeight + 'px';
        position = -blockTotalHeight;
      }
    }
  }

  stopReels(reel, winnerReel, rounds, numberOfSymbols) {
    let timeout = winnerReel * (numberOfSymbols-1);
    let stopTimer = ((timeout+((numberOfSymbols-winnerReel) * reel.timeout)) + ((numberOfSymbols+1) * reel.timeout) * rounds);
    setTimeout(() => {
      clearInterval(reel.interval)
    }, stopTimer);
    return stopTimer;
  }
  
  
}

var osm = new OgreSlotMachine();

// Event handlers 
window.onload = () => {
  let playMusic = document.getElementsByClassName('js-playMusic')[0];
  playMusic.addEventListener('click', (e) => { 
    e.preventDefault(); 
    osm.playMusic(e);
  });

  let autoSpin = document.getElementsByClassName('js-autoSpin')[0];
  autoSpin.addEventListener('click', (e) => { 
    e.preventDefault(); 
    osm.autoSpin(e);
  });

  let spin = document.getElementsByClassName('js-spin')[0];
  spin.addEventListener('click', (e) => { 
    e.preventDefault(); 
    osm.spin(e);
  });

  let betOne = document.getElementsByClassName('js-betOne')[0];
  betOne.addEventListener('click', (e) => { 
    e.preventDefault(); 
    osm.spin(e);
  });

  let betMax = document.getElementsByClassName('js-betMax')[0];
  betMax.addEventListener('click', (e) => { 
    e.preventDefault(); 
    osm.spin(e);
  });

  let betValue = document.getElementById('js-betValue');
  betValue.addEventListener('change', (e) => { 
    e.preventDefault(); 
    osm.betMaxMinValueValidator(e);
  });

  let total = document.getElementById('js-total');
  total.value = Default.credit;

  let loader = document.getElementsByClassName('slot__skin--loader')[0];
  setTimeout(() => {
    loader.classList.remove("slot__skin--loader");
  }, 1000)

};


// Oher
// ()Private Variables
// (+)Generate symbols 
// ()0 Credit cant play ( paid with Prompt )
// ()Animate slot machine
// (+)Array of images as symbols ( NFT + Elon mask ?:D )
// ()Loading screen
// ()JS Documentation
// ()Unit test

// CSS clean up
// ()BEM naming all elements 
// ()Reusable colors at top
// ()Spacing variables



// document.body.onload = addElement(11);






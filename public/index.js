
/**
 * @author Dusan Veselinovic <dusan.veselinovic.dev@gmail.com>
 * @description Fun project for slot machine */

/**
 * @enum {String} SlotSettings */
 const Default = Object.freeze({
  Credit: 1000,
  Reels: 3,
  Symbols: 12,
  MinBet: 1,
  MaxBet: 20
});


class OgreSlotMachine{
  constructor(credit = Default.Credit, reels = Default.Reels, symbols = Default.Symbols){
      this.credit = credit;
      this.reels = reels;
      this.symbols = symbols;
      this.reelsBucket = [];
      this.betValue = 1;
      this.autoSpinInterval;
      this.populateReelsBuckets(reels);
  }

  setBetValue(val = 1) {
    this.betValue = val;
  }

  populateReelsBuckets(reels) {
    for(let i=0; i < reels; i++) {
      this.reelsBucket.push(['1','2','3','4','5','6','7','8','9','10','11','12','13']);
    }
  }

  random(min = 0, max = 12) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1) + min);
  }

  spin() {
      let resultCombination = [];
      let symbolCounts = {};
      let resDisplay = "";
      let winSum = 0;
      let self = this;

      function resultReels(reelsBucket, self){
        let randomNum;
        reelsBucket.forEach(element => {
          randomNum = element[self.random()];
          resultCombination.push(randomNum);
        });
      }

      function countReels(resultCombination) {
        resultCombination.forEach((reel) => symbolCounts[reel] = (symbolCounts[reel] || 0) + 1);
        return symbolCounts;
      }

      function winReels(symbolCounts, self){
        for(const symbol in symbolCounts){
          if(symbolCounts[symbol] >= 2) {
            return self.betValue * Math.floor(Math.pow(2, symbolCounts[symbol]) * ( (Number(symbol) / 10) + 1 ));
          }
        }
      }

      function displayReels(resultCombination) {
        resultCombination.forEach((reel) => resDisplay += `|${reel}|`);
      }
      
      resultReels(this.reelsBucket, self);
      displayReels(resultCombination);
      winSum = winReels(countReels(resultCombination), self);
      this.calCredit(winSum);
      this.draw(resDisplay);
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
        this.spin();
      }, 2000)
      btn.classList.add("btn--blinkBorder");
    }
  }

  draw(resDisplay) {
    document.getElementById('slot__result').innerHTML = resDisplay + " {" + this.credit + "}";
  }

  calCredit(value){
    const note = document.querySelector('#slot__result');
    let paid = document.getElementById('js-paid');
    let total = document.getElementById('js-total');

    let audio;
    
    if(value > 0) {
      console.log('WIN' + value);
      note.style.borderColor = '#38bb6f';
      audio = new Audio('./media/sounds/Multicast_x4.mp3.mp3');
      audio.volume = 0.1;
      audio.play();
      this.credit += value;

      // Display how much user earned
      paid.value = value;
    } else {
      console.log('LOSE');
      note.style.borderColor = '#ee6052';
      audio = new Audio('./media/sounds/spin.mp3');
      audio.volume = 0.1;
      audio.play();
      this.credit -= this.betValue;
      paid.value = 0;
    }

    total.value = this.credit;
    
  }

  playMusic(e) {
    let btn = e.target;
    let body = document.getElementsByTagName('body')[0];
    let audio = document.getElementById("music");
    audio.volume = 0.4;
    
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
  
}

var osm = new OgreSlotMachine();
// setInterval(() => osm.spin(), 1000)

(()=> {
  // Event handlers 
  let playMusic = document.getElementsByClassName('js-playMusic')[0];
  playMusic.addEventListener('click', (e) => { 
    e.preventDefault(); 
    osm.playMusic(e);
  });

  let spin = document.getElementsByClassName('js-spin')[0];
  spin.addEventListener('click', (e) => { 
    e.preventDefault(); 
    osm.spin();
  });

  let autoSpin = document.getElementsByClassName('js-autoSpin')[0];
  autoSpin.addEventListener('click', (e) => { 
    e.preventDefault(); 
    osm.autoSpin(e);
  });
  
})()



// IDEAS
// ()Buttons should have icons 
// ()Button Playmusic animated icon -- Toggle
// ()Button Autospin ( Spin infinite ) -- Toggle
// ()Button Spin animate icon ( Spin once )

// Oher
// ()Private Variables
// ()Generate symbols 
// ()0 Credit cant play ( paid with Prompt )
// ()Animate slot machine
// ()Array of images as symbols ( NFT + Elon mask ?:D )
// ()Loading screen

// CSS clean up
// ()BEM naming all elements 
// ()Reusable colors at top
// ()Spacing variables
// 
class OgreSlotMachine{
  constructor(credit = 1000, reels = 3, symbols = 12){
      this.credit = credit;
      this.reels = reels;
      this.symbols = symbols;
      this.reelsBucket = [];
      this.betValue = 1;
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
      let resDisplay = "";
      let res = [];
      let randomNum;
      let symbolCounts = {};
      let value = 0;

      this.reelsBucket.forEach(element => {
        randomNum = element[this.random()];
        resDisplay += "|" + randomNum + "|";
        res.push(randomNum);
      });

      // Create new object, with count of each symbol {'1':2, '2':1}
      res.forEach((x) => symbolCounts[x] = (symbolCounts[x] || 0) + 1);
      // symbolCounts = {'0': 2};

      // Calculation bet outcome
      for(const symbol in symbolCounts){
        if(symbolCounts[symbol] >= 2) {
          value += this.betValue * Math.floor(Math.pow(2, symbolCounts[symbol]-1) * ( (Number(symbol) / 10) + 1 ));
        }
      }

      
      resDisplay += 'val:' + value;
     
      this.calCredit(value);
      this.draw(resDisplay);
  }

  autoSpin() {
    setInterval(() => {
      this.spin();
    }, 2000)
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
      console.log('LOSE' + value);
      note.style.borderColor = '#ee6052';
      audio = new Audio('./media/sounds/spin.mp3');
      audio.volume = 0.1;
      audio.play();
      this.credit -= this.betValue;
      paid.value = 0;
    }

    total.value = this.credit;
    
  }

  playMusic() {
    let audio = new Audio('./media/sounds/DJMasif_SlotMachine.mp3');
    audio.volume = 0.4;
    audio.play();
  }
  
}

var osm = new OgreSlotMachine();
// setInterval(() => osm.spin(), 1000)

(()=> {
  // Event handlers 
  let playMusic = document.getElementsByClassName('js-playMusic')[0];
  playMusic.addEventListener('click', (e) => { 
    e.preventDefault(); 
    osm.playMusic();
  });

  let spin = document.getElementsByClassName('js-spin')[0];
  spin.addEventListener('click', (e) => { 
    e.preventDefault(); 
    osm.spin();
  });

  let autoSpin = document.getElementsByClassName('js-autoSpin')[0];
  autoSpin.addEventListener('click', (e) => { 
    e.preventDefault(); 
    osm.autoSpin();
  });
  
})()



// IDEAS
// Buttons should hav e icons 
// Button Playmusic animated icon -- Toggle
// Button Autospin ( Spin infinite ) -- Toggle
// Button Spin animate icon ( Spin once )

// Oher
// Private Variables
// Generate symbols 
// 0 Credit cant play ( paid with Prompt )
// Animate slot machine
// Array of images as symbols ( NFT + Elon mask ?:D )

// CSS clean up
// BEM naming all elements 
// Reusable colors at top
// Spacing variables
// 
# ogreSlotMachine
- Fun project, creating slot machine expired by dota 2 game.
- Hosted on firebase: https://ogreslotmachine.web.app/
- Features ( MAIN )
  - (+) Player press Spin button
  - (+) Reels start to spin and stop at random position.
  - (+) If win line has at least 2 same symbols at the same central horizontal position software indicates player
  that he has won
- Features ( BONUS )
  - (+) Bet, Max Bet buttons
  - (+) Credits display
  - (+) More win lines/ winning combinations
  - (+) More reels
  - (+) Game cabinet graphics
  - (+) Eye candy (animations, sound effects etc.)

# Documentation 
  - Experiance with this project was fun i needed around 20h to complete it, biggest challange is organization of code.
  - Things that should be improved on:
    - Cleaner code ( pure functions, better separations )
    - Use some pre processor SCSS
    - Use React
    - Move win logic on backend

# Guide how to run on localhost
  - Fork project
  - Open project in VS Studio Code
  - Right click on index.html => Open With Live Server 

# Widget configuration 
```
 const Default = Object.freeze({
  credit: 1000,                  // Initial credit that player start with
  reels: 3,                      // Number of reels 
  numberOfSymbolsInReel: 11,     // MAX 19 extend reelSymbols if you want more ( Symbols per reel )
  minBet: 1,                     // Min bet allowed 
  maxBet: 20,                    // Max bet 
  mixMatchSymbolsWin: 2,         // How much symbols needs to match so player win price
  musicVol: 0.4,                 // Main music volume
  gameVol: 0.1,                  // Other sounds volume ( win, lose, spin )
  autoSpinSpeed: 3000,           // Auto spin delay
  autoSpinNextSpinDelay: 2000,   // After spin finish start new after delay
  reelsSpinRound: 2,             // How much should it spin till it show resoult to user
                                 // Define array of symbol of object that belong to reels 
                                    -orderNumber  ( just a unique indentifier )
                                    -worth        ( more value here bigger price )
                                    -imageUrl     ( path to symbol image )                       
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
    }...
  ]
});
```

# Bug to fix
  - Disable spin  button when its spining
  - Better animation of reels
  - Prompt paypal payment if user lose all credit ( currently no validation )

var gameProperties = {
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,

    delayToStartLevel: 3,
};

var states = {
    main: 'main',
    onePlayer: "onePlayer",
    twoPlayer: "twoPlayer",
};

var graphicAssets = {
    ship:{URL:'assets/ship.png', name:'ship'},
    bullet:{URL:'assets/bullet.png', name:'bullet'},

    asteroidLarge:{URL:'assets/asteroidLarge.png', name:'asteroidLarge'},
    asteroidMedium:{URL:'assets/asteroidMedium.png', name:'asteroidMedium'},
    asteroidSmall:{URL:'assets/asteroidSmall.png', name:'asteroidSmall'},
};

var soundAssets = {
    fire:{URL:['assets/fire1.m4a'], name:'fire'},
    destroyed:{URL:['assets/bangMedium.m4a'], name:'destroyed'},
    thrust:{URL:['assets/thrust.m4a'], name:'thrust'},
};

var shipProperties = {
    startX: gameProperties.screenWidth * 0.5,
    startY: gameProperties.screenHeight * 0.5,
    acceleration: 400,
    drag: 5,
    maxVelocity: 400,
    angularVelocity: 200,
    startingLives: 3,
    timeToReset: 2,
    blinkDelay: 0.2,
};

var bulletProperties = {
    speed: 400,
    interval: 250,
    lifeSpan: 2000,
    maxCount: 30,
};

// **** NORMAL MODE **** //

var asteroidProperties = {
    startingAsteroids: 4,
    maxAsteroids: 30,
    incrementAsteroids: 4,

    asteroidLarge: { minVelocity: 50, maxVelocity: 200, minAngularVelocity: 0, maxAngularVelocity: 200, score: 20, nextSize: graphicAssets.asteroidMedium.name, pieces: 2 },
    asteroidMedium: { minVelocity: 50, maxVelocity: 400, minAngularVelocity: 0, maxAngularVelocity: 200, score: 50, nextSize: graphicAssets.asteroidSmall.name, pieces: 2 },
    asteroidSmall: { minVelocity: 50, maxVelocity: 400, minAngularVelocity: 0, maxAngularVelocity: 200, score: 100 },
};

// **** NORMAL MODE END **** //

// **** HARD MODE **** //

// var asteroidProperties = {
//     startingAsteroids: 10,
//     maxAsteroids: 30,
//     incrementAsteroids: 10,
//
//     asteroidLarge: { minVelocity: 100, maxVelocity: 300, minAngularVelocity: 0, maxAngularVelocity: 200, score: 20, nextSize: graphicAssets.asteroidMedium.name, pieces: 2 },
//     asteroidMedium: { minVelocity: 100, maxVelocity: 500, minAngularVelocity: 0, maxAngularVelocity: 200, score: 50, nextSize: graphicAssets.asteroidSmall.name, pieces: 2 },
//     asteroidSmall: { minVelocity: 100, maxVelocity: 800, minAngularVelocity: 0, maxAngularVelocity: 200, score: 100 },
// };

// **** HARD MODE END **** //

var fontAssets = {
    counterFontStyle:{font: '50px monospace', fill: '#FFFFFF', align: 'center'},
    playerChooseFontStyle:{font: '55px monospace', fill: '#FFFFFF', boundsAlignH: 'center', boundsAlignV: 'top'},
    playerHighlightedFontStyle:{font: 'bold 55px monospace', fill: '#FFFFFF', boundsAlignH: 'center', boundsAlignV: 'top'},
    startInstructionsFontStyle:{font: '30px monospace', fill: '#FFFFFF', align: 'center'},
    logoFontStyle:{font: '80px monospace', fill: '#FFFFFF', align: 'center'}

};

var onePlayerText = 'One Player';
var twoPlayerText = 'Two Player';
var toggleCounter = 1;
var playerChoice = 'onePlayer';

// ********************************* //
//             MAIN MENU             //
// ********************************* //

var mainState = function(game){
  this.tf_chooseOnePlayerGame;
  this.tf_chooseTwoPlayerGame;
  this.tf_instructions;
  this.tf_logo;
};

mainState.prototype = {
  create: function(){
    this.initKeyboard();
    this.renderText(fontAssets.playerHighlightedFontStyle, fontAssets.playerChooseFontStyle );

  },

  update: function(){
    this.checkPlayerInput();
  },

  renderText: function(style1, style2){
    var startInstructions = '\n\nUP arrow key for thrust.\n\nLEFT and RIGHT arrow keys to turn.\n\nSPACE key to fire.\n\nENTER to start!';

    if (this.tf_chooseOnePlayerGame) {
      this.tf_chooseOnePlayerGame.kill();
      this.tf_chooseTwoPlayerGame.kill();
      this.tf_instructions.kill();
      this.tf_logo.kill();
    }

    this.tf_chooseOnePlayerGame = game.add.text(game.world.centerX, game.world.centerY-(gameProperties.screenHeight/6), onePlayerText, style1);
    this.tf_chooseOnePlayerGame.anchor.set(0.5, 0.5);

    this.tf_chooseTwoPlayerGame = game.add.text(game.world.centerX, game.world.centerY-(gameProperties.screenHeight/10), twoPlayerText, style2);
    this.tf_chooseTwoPlayerGame.anchor.set(0.5, 0.5);

    this.tf_instructions = game.add.text(game.world.centerX, game.world.centerY+(gameProperties.screenHeight/9), startInstructions, fontAssets.startInstructionsFontStyle);
    this.tf_instructions.anchor.set(0.5, 0.5);

    this.tf_logo = game.add.text(game.world.centerX, game.world.centerY-(gameProperties.screenHeight/3), 'ASTEROIDS', fontAssets.logoFontStyle);
    this.tf_logo.anchor.set(0.5, 0.5);
  },

  toggleTextAppearance: function(whichToHL) {
    if (whichToHL === 'hlTwoPlayer'){
    this.renderText(fontAssets.playerChooseFontStyle, fontAssets.playerHighlightedFontStyle);
  } else {
    this.renderText(fontAssets.playerHighlightedFontStyle, fontAssets.playerChooseFontStyle);
  }
  },

  initKeyboard: function () {
      this.key_up = game.input.keyboard.addKey(Phaser.Keyboard.UP);
      this.key_down = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
      this.key_enter = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
  },

  checkPlayerInput: function(){
    if ((this.key_down.isDown === true)||(this.key_up.isDown === true)) {

      if (toggleCounter % 2 !== 0){
          this.toggleTextAppearance('hlTwoPlayer');
          playerChoice = 'twoPlayer';
      } else {
          this.toggleTextAppearance('hlOnePlayer');
          playerChoice = 'onePlayer';
      }
      toggleCounter ++;
      this.key_down.isDown = false;
      this.key_up.isDown = false;
    }

    if (this.key_enter.isDown && (playerChoice === 'onePlayer') ) {
        console.log("START ONE PLAYER");
        game.state.start(states.onePlayer);
      }
    else if (this.key_enter.isDown && (playerChoice === 'twoPlayer') ) {
        console.log("START TWO PLAYER");
        game.state.start(states.twoPlayer);
    }
  }
};

// ********************************* //
//         ONE PLAYER GAME           //
// ********************************* //

var onePlayerGame = function (game){
    this.shipSprite;
    this.shipIsInvulnerable;

    this.key_left;
    this.key_right;
    this.key_thrust;
    this.key_fire;

    this.bulletGroup;

    this.asteroidGroup;

    this.tf_lives;

    this.tf_score;

    this.sndDestroyed;
    this.sndFire;
    this.sndThrust;
};

onePlayerGame.prototype = {
    init: function(){
      this.bulletInterval = 0;
      this.asteroidsCount = asteroidProperties.startingAsteroids;
      this.shipLives = shipProperties.startingLives;
      this.score = 0;
      this.bonusLivesCounter = 1;
    },

    preload: function () {
        game.load.image('bg', 'assets/starBackground2.jpg');

        game.load.image(graphicAssets.asteroidLarge.name, graphicAssets.asteroidLarge.URL);
        game.load.image(graphicAssets.asteroidMedium.name, graphicAssets.asteroidMedium.URL);
        game.load.image(graphicAssets.asteroidSmall.name, graphicAssets.asteroidSmall.URL);

        game.load.image(graphicAssets.bullet.name, graphicAssets.bullet.URL);

        game.load.image(graphicAssets.ship.name, graphicAssets.ship.URL);

        game.load.audio(soundAssets.destroyed.name, soundAssets.destroyed.URL);
        game.load.audio(soundAssets.fire.name, soundAssets.fire.URL);
        game.load.audio(soundAssets.thrust.name, soundAssets.thrust.URL);
    },

    create: function () {
        var bg = game.add.image(0, 0, 'bg');
        bg.width = gameProperties.screenWidth;
        bg.height = gameProperties.screenHeight;

        this.initGraphics();
        this.initSounds();
        this.initPhysics();
        this.initKeyboard();
        this.resetAsteroids();
    },

    update: function () {
        this.checkPlayerInput();
        this.checkBoundaries(this.shipSprite);
        this.bulletGroup.forEachExists(this.checkBoundaries, this);
        this.asteroidGroup.forEachExists(this.checkBoundaries, this);

        game.physics.arcade.overlap(this.bulletGroup, this.asteroidGroup, this.asteroidCollision, null, this);

        if (!this.shipIsInvulnerable) {
            game.physics.arcade.overlap(this.shipSprite, this.asteroidGroup, this.asteroidCollision, null, this);
        }
    },

    initGraphics: function () {
        this.shipSprite = game.add.sprite(shipProperties.startX, shipProperties.startY, graphicAssets.ship.name);
        this.shipSprite.angle = -90;
        this.shipSprite.anchor.set(0.5, 0.5);

        this.bulletGroup = game.add.group();
        this.asteroidGroup = game.add.group();

        this.tf_lives = game.add.text(20, 10, 'Lives: ' + shipProperties.startingLives, fontAssets.counterFontStyle);

        this.tf_score = game.add.text(gameProperties.screenWidth - 20, 10, 'Score: ' + this.score, fontAssets.counterFontStyle);
        this.tf_score.align = 'right';
        this.tf_score.anchor.set(1, 0);
    },

    initSounds: function () {
        this.sndDestroyed = game.add.audio(soundAssets.destroyed.name);
        this.sndFire = game.add.audio(soundAssets.fire.name);
        this.sndThrust = game.add.audio(soundAssets.thrust.name);
    },

    playThrust:function(){
      this.sndThrust.play();
    },

    initPhysics: function () {
        game.physics.startSystem(Phaser.Physics.ARCADE);

        game.physics.enable(this.shipSprite, Phaser.Physics.ARCADE);
        this.shipSprite.body.drag.set(shipProperties.drag);
        this.shipSprite.body.maxVelocity.set(shipProperties.maxVelocity);

        this.bulletGroup.enableBody = true;
        this.bulletGroup.physicsBodyType = Phaser.Physics.ARCADE;
        this.bulletGroup.createMultiple(bulletProperties.maxCount, graphicAssets.bullet.name);
        this.bulletGroup.setAll('anchor.x', 0.5);
        this.bulletGroup.setAll('anchor.y', 0.5);
        this.bulletGroup.setAll('lifespan', bulletProperties.lifeSpan);

        this.asteroidGroup.enableBody = true;
        this.asteroidGroup.physicsBodyType = Phaser.Physics.ARCADE;
    },

    initKeyboard: function () {
        this.key_left = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.key_right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        this.key_thrust = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.key_fire = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    },

    checkPlayerInput: function () {
        if (this.key_left.isDown) {
            this.shipSprite.body.angularVelocity = -shipProperties.angularVelocity;
        } else if (this.key_right.isDown) {
            this.shipSprite.body.angularVelocity = shipProperties.angularVelocity;
        } else {
            this.shipSprite.body.angularVelocity = 0;
        }

        if (this.key_thrust.isDown) {

            // this.sndThrust.play();

            game.physics.arcade.accelerationFromRotation(this.shipSprite.rotation, shipProperties.acceleration, this.shipSprite.body.acceleration);
        } else {
            this.shipSprite.body.acceleration.set(0);
        }

        if (this.key_fire.isDown) {
            this.fire();
        }
    },

    checkBoundaries: function (sprite) {
        if (sprite.x < 0) {
            sprite.x = game.width;
        } else if (sprite.x > game.width) {
            sprite.x = 0;
        }

        if (sprite.y < 0) {
            sprite.y = game.height;
        } else if (sprite.y > game.height) {
            sprite.y = 0;
        }
    },

    fire: function () {
      if (!this.shipSprite.alive) {
            return;
          }

        if (game.time.now > this.bulletInterval) {
            this.sndFire.play();

            var bullet = this.bulletGroup.getFirstExists(false);

            if (bullet) {
                var length = this.shipSprite.width * 0.5;
                var x = this.shipSprite.x + (Math.cos(this.shipSprite.rotation) * length);
                var y = this.shipSprite.y + (Math.sin(this.shipSprite.rotation) * length);

                bullet.reset(x, y);
                bullet.lifespan = bulletProperties.lifeSpan;
                bullet.rotation = this.shipSprite.rotation;

                game.physics.arcade.velocityFromRotation(this.shipSprite.rotation, bulletProperties.speed, bullet.body.velocity);
                this.bulletInterval = game.time.now + bulletProperties.interval;
            }
        }
    },

    createAsteroid: function (x, y, size, pieces) {
        if (pieces === undefined) { pieces = 1; }

        for (var i=0; i<pieces; i++) {
            var asteroid = this.asteroidGroup.create(x, y, size);
            asteroid.anchor.set(0.5, 0.5);
            asteroid.body.angularVelocity = game.rnd.integerInRange(asteroidProperties[size].minAngularVelocity, asteroidProperties[size].maxAngularVelocity);

            var randomAngle = game.math.degToRad(game.rnd.angle());
            var randomVelocity = game.rnd.integerInRange(asteroidProperties[size].minVelocity, asteroidProperties[size].maxVelocity);

            game.physics.arcade.velocityFromRotation(randomAngle, randomVelocity, asteroid.body.velocity);
        }
    },

    resetAsteroids: function () {
        for (var i=0; i < this.asteroidsCount; i++ ) {
            var side = Math.round(Math.random());
            var x;
            var y;

            if (side) {
                x = Math.round(Math.random()) * gameProperties.screenWidth;
                y = Math.random() * gameProperties.screenHeight;
            } else {
                x = Math.random() * gameProperties.screenWidth;
                y = Math.round(Math.random()) * gameProperties.screenWidth;
            }

            this.createAsteroid(x, y, graphicAssets.asteroidLarge.name);
        }
    },

    asteroidCollision: function (target, asteroid) {

        // console.log(asteroid.key);

        this.sndDestroyed.play();

        target.kill();
        asteroid.kill();

        if (target.key == graphicAssets.ship.name) {
            this.destroyShip();
        }

        this.splitAsteroid(asteroid);

        if (target.key === graphicAssets.bullet.name) {
          this.updateScore(asteroidProperties[asteroid.key].score);
        } else if (target.key === graphicAssets.ship.name){
          this.updateScore(0);
        }

        if (!this.asteroidGroup.countLiving()) {
            game.time.events.add(Phaser.Timer.SECOND * gameProperties.delayToStartLevel, this.nextLevel, this);
        }
    },

    destroyShip: function () {
        this.shipLives --;
        this.tf_lives.text = 'Lives: ' + this.shipLives;

        if (this.shipLives) {
            game.time.events.add(Phaser.Timer.SECOND * shipProperties.timeToReset, this.resetShip, this);
        } else {
            game.time.events.add(Phaser.Timer.SECOND * shipProperties.timeToReset, this.endGame, this);
        }
    },

    resetShip: function () {
        this.shipIsInvulnerable = true;
        this.shipSprite.reset(shipProperties.startX, shipProperties.startY);
        this.shipSprite.angle = -90;

        game.time.events.add(Phaser.Timer.SECOND * shipProperties.timeToReset, this.shipReady, this);
        game.time.events.repeat(Phaser.Timer.SECOND * shipProperties.blinkDelay, shipProperties.timeToReset / shipProperties.blinkDelay, this.shipBlink, this);
    },

    shipReady: function () {
        this.shipIsInvulnerable = false;
        this.shipSprite.visible = true;
    },

    shipBlink: function () {
        this.shipSprite.visible = !this.shipSprite.visible;
    },

    splitAsteroid: function (asteroid) {
        if (asteroidProperties[asteroid.key].nextSize) {
            this.createAsteroid(asteroid.x, asteroid.y, asteroidProperties[asteroid.key].nextSize, asteroidProperties[asteroid.key].pieces);
        }
    },

    updateScore: function (score) {
        this.score += score;
        this.tf_score.text = 'Score: ' + this.score;

        if ((this.score >= 10000) && (this.score <= 10100) && (this.bonusLivesCounter === 1) ) {
          this.shipLives ++;
          this.tf_lives.text = 'Lives: ' + this.shipLives;
          this.bonusLivesCounter ++;
        } else if ((this.score >= 20000) && (this.score <= 20100) && (this.bonusLivesCounter === 2) ){
          this.shipLives ++;
          this.tf_lives.text = 'Lives: ' + this.shipLives;
          this.bonusLivesCounter ++;
        } else if ((this.score >= 30000) && (this.score <= 30100) && (this.bonusLivesCounter === 3) ){
          this.shipLives ++;
          this.tf_lives.text = 'Lives: ' + this.shipLives;
          this.bonusLivesCounter ++;
        } else if ((this.score >= 40000) && (this.score <= 40100) && (this.bonusLivesCounter === 4) ){
          this.shipLives ++;
          this.tf_lives.text = 'Lives: ' + this.shipLives;
          this.bonusLivesCounter ++;
        } else if ((this.score >= 50000) && (this.score <= 50100) && (this.bonusLivesCounter === 5) ){
          this.shipLives ++;
          this.tf_lives.text = 'Lives: ' + this.shipLives;
          this.bonusLivesCounter ++;
        } else if ((this.score >= 60000) && (this.score <= 60100) && (this.bonusLivesCounter === 6) ){
          this.shipLives ++;
          this.tf_lives.text = 'Lives: ' + this.shipLives;
          this.bonusLivesCounter ++;
        } else if ((this.score >= 70000) && (this.score <= 70100) && (this.bonusLivesCounter === 7) ){
          this.shipLives ++;
          this.tf_lives.text = 'Lives: ' + this.shipLives;
          this.bonusLivesCounter ++;
        } else if ((this.score >= 80000) && (this.score <= 80100) && (this.bonusLivesCounter === 8) ){
          this.shipLives ++;
          this.tf_lives.text = 'Lives: ' + this.shipLives;
          this.bonusLivesCounter ++;
        } else if ((this.score >= 90000) && (this.score <= 90100) && (this.bonusLivesCounter === 9) ){
          this.shipLives ++;
          this.tf_lives.text = 'Lives: ' + this.shipLives;
          this.bonusLivesCounter ++;
        } else if ((this.score >= 100000) && (this.score <= 100100) && (this.bonusLivesCounter === 10) ){
          this.shipLives ++;
          this.tf_lives.text = 'Lives: ' + this.shipLives;
          this.bonusLivesCounter ++;
        }
    },

    nextLevel: function () {
        this.asteroidGroup.removeAll(true);

        if (this.asteroidsCount < asteroidProperties.maxAsteroids) {
            this.asteroidsCount += asteroidProperties.incrementAsteroids;
        }

        this.resetAsteroids();
    },

    endGame: function(){
      game.state.start(states.main);
    },
};

// ********************************* //
//         TWO PLAYER GAME           //
// ********************************* //

var twoPlayerGame = function (game){
    this.shipSprite;
    this.shipIsInvulnerable;

    this.key_left;
    this.key_right;
    this.key_thrust;
    this.key_fire;

    this.bulletGroup;

    this.asteroidGroup;

    this.tf_currentPlayer;

    this.tf_playerOne_lives;
    this.tf_playerTwo_lives;

    this.tf_playerOne_score;
    this.tf_playerTwo_score;

    this.sndDestroyed;
    this.sndFire;
    this.sndThrust;
};

twoPlayerGame.prototype = {
    init: function(){
      this.bulletInterval = 0;
      this.asteroidsCount = asteroidProperties.startingAsteroids;
      this.playerOneLives = shipProperties.startingLives;
      this.playerTwoLives = shipProperties.startingLives;
      this.playerOneScore = 0;
      this.playerTwoScore = 0;
      this.playCounter = 1;
      this.currentPlayer = "Player 1";
      this.playerOneBonusLivesCounter = 1;
      this.playerTwoBonusLivesCounter = 1;
    },

    preload: function () {
        game.load.image('bg', 'assets/starBackground2.jpg');

        game.load.image(graphicAssets.asteroidLarge.name, graphicAssets.asteroidLarge.URL);
        game.load.image(graphicAssets.asteroidMedium.name, graphicAssets.asteroidMedium.URL);
        game.load.image(graphicAssets.asteroidSmall.name, graphicAssets.asteroidSmall.URL);

        game.load.image(graphicAssets.bullet.name, graphicAssets.bullet.URL);

        game.load.image(graphicAssets.ship.name, graphicAssets.ship.URL);

        game.load.audio(soundAssets.destroyed.name, soundAssets.destroyed.URL);
        game.load.audio(soundAssets.fire.name, soundAssets.fire.URL);
        game.load.audio(soundAssets.thrust.name, soundAssets.thrust.URL);
    },

    create: function () {
        var bg = game.add.image(0, 0, 'bg');
        bg.width = gameProperties.screenWidth;
        bg.height = gameProperties.screenHeight;

        this.initGraphics();
        this.initSounds();
        this.initPhysics();
        this.initKeyboard();
        this.resetAsteroids();
    },

    update: function () {
        this.checkPlayerInput();
        this.checkBoundaries(this.shipSprite);
        this.bulletGroup.forEachExists(this.checkBoundaries, this);
        this.asteroidGroup.forEachExists(this.checkBoundaries, this);

        game.physics.arcade.overlap(this.bulletGroup, this.asteroidGroup, this.asteroidCollision, null, this);

        if (!this.shipIsInvulnerable) {
            game.physics.arcade.overlap(this.shipSprite, this.asteroidGroup, this.asteroidCollision, null, this);
        }
    },

    initGraphics: function () {
        this.shipSprite = game.add.sprite(shipProperties.startX, shipProperties.startY, graphicAssets.ship.name);
        this.shipSprite.angle = -90;
        this.shipSprite.anchor.set(0.5, 0.5);

        this.bulletGroup = game.add.group();
        this.asteroidGroup = game.add.group();

        this.tf_lives = game.add.text(20, 10, 'Lives: ' + this.playerOneLives, fontAssets.counterFontStyle);

        this.tf_currentPlayer = game.add.text(gameProperties.screenWidth - (gameProperties.screenWidth/2), 41, this.currentPlayer, fontAssets.counterFontStyle);
        this.tf_currentPlayer.anchor.set(0.5, 0.5);

        this.tf_score = game.add.text(gameProperties.screenWidth - 20, 10, 'Score: ' + this.playerOneScore, fontAssets.counterFontStyle);
        this.tf_score.align = 'right';
        this.tf_score.anchor.set(1, 0);
    },

    initSounds: function () {
        this.sndDestroyed = game.add.audio(soundAssets.destroyed.name);
        this.sndFire = game.add.audio(soundAssets.fire.name);
        this.sndThrust = game.add.audio(soundAssets.thrust.name);
    },

    playThrust:function(){
      this.sndThrust.play();
    },

    initPhysics: function () {
        game.physics.startSystem(Phaser.Physics.ARCADE);

        game.physics.enable(this.shipSprite, Phaser.Physics.ARCADE);
        this.shipSprite.body.drag.set(shipProperties.drag);
        this.shipSprite.body.maxVelocity.set(shipProperties.maxVelocity);

        this.bulletGroup.enableBody = true;
        this.bulletGroup.physicsBodyType = Phaser.Physics.ARCADE;
        this.bulletGroup.createMultiple(bulletProperties.maxCount, graphicAssets.bullet.name);
        this.bulletGroup.setAll('anchor.x', 0.5);
        this.bulletGroup.setAll('anchor.y', 0.5);
        this.bulletGroup.setAll('lifespan', bulletProperties.lifeSpan);

        this.asteroidGroup.enableBody = true;
        this.asteroidGroup.physicsBodyType = Phaser.Physics.ARCADE;
    },

    initKeyboard: function () {
        this.key_left = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.key_right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        this.key_thrust = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.key_fire = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.key_enter = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    },

    checkPlayersTurn: function(){

        if ((this.playCounter % 2 === 0) && (this.playerOneLives > 0)) {
          this.currentPlayer = 'Player 1';
          console.log(this.currentPlayer + "'s turn");
          this.tf_currentPlayer.text = this.currentPlayer;
          this.playCounter ++;
        } else if ((this.playCounter % 2 !== 0) && (this.playerTwoLives > 0)) {
          this.currentPlayer = 'Player 2';
          console.log(this.currentPlayer + "'s turn");
          this.tf_currentPlayer.text = this.currentPlayer;
          this.playCounter ++;
        }

    },

    checkPlayerInput: function () {
        if (this.key_left.isDown) {
            this.shipSprite.body.angularVelocity = -shipProperties.angularVelocity;
        } else if (this.key_right.isDown) {
            this.shipSprite.body.angularVelocity = shipProperties.angularVelocity;
        } else {
            this.shipSprite.body.angularVelocity = 0;
        }

        if (this.key_thrust.isDown) {
            // this.sndThrust.play();
            game.physics.arcade.accelerationFromRotation(this.shipSprite.rotation, shipProperties.acceleration, this.shipSprite.body.acceleration);
        } else {
            this.shipSprite.body.acceleration.set(0);
        }

        if (this.key_fire.isDown) {
            this.fire();
        }
    },

    checkBoundaries: function (sprite) {
        if (sprite.x < 0) {
            sprite.x = game.width;
        } else if (sprite.x > game.width) {
            sprite.x = 0;
        }

        if (sprite.y < 0) {
            sprite.y = game.height;
        } else if (sprite.y > game.height) {
            sprite.y = 0;
        }
    },

    fire: function () {
      if (!this.shipSprite.alive) {
            return;
          }

        if (game.time.now > this.bulletInterval) {
            this.sndFire.play();

            var bullet = this.bulletGroup.getFirstExists(false);

            if (bullet) {
                var length = this.shipSprite.width * 0.5;
                var x = this.shipSprite.x + (Math.cos(this.shipSprite.rotation) * length);
                var y = this.shipSprite.y + (Math.sin(this.shipSprite.rotation) * length);

                bullet.reset(x, y);
                bullet.lifespan = bulletProperties.lifeSpan;
                bullet.rotation = this.shipSprite.rotation;

                game.physics.arcade.velocityFromRotation(this.shipSprite.rotation, bulletProperties.speed, bullet.body.velocity);
                this.bulletInterval = game.time.now + bulletProperties.interval;
            }
        }
    },

    createAsteroid: function (x, y, size, pieces) {
        if (pieces === undefined) { pieces = 1; }

        for (var i=0; i<pieces; i++) {
            var asteroid = this.asteroidGroup.create(x, y, size);
            asteroid.anchor.set(0.5, 0.5);
            asteroid.body.angularVelocity = game.rnd.integerInRange(asteroidProperties[size].minAngularVelocity, asteroidProperties[size].maxAngularVelocity);

            var randomAngle = game.math.degToRad(game.rnd.angle());
            var randomVelocity = game.rnd.integerInRange(asteroidProperties[size].minVelocity, asteroidProperties[size].maxVelocity);

            game.physics.arcade.velocityFromRotation(randomAngle, randomVelocity, asteroid.body.velocity);
        }
    },

    resetAsteroids: function () {
        for (var i=0; i < this.asteroidsCount; i++ ) {
            var side = Math.round(Math.random());
            var x;
            var y;

            if (side) {
                x = Math.round(Math.random()) * gameProperties.screenWidth;
                y = Math.random() * gameProperties.screenHeight;
            } else {
                x = Math.random() * gameProperties.screenWidth;
                y = Math.round(Math.random()) * gameProperties.screenWidth;
            }

            this.createAsteroid(x, y, graphicAssets.asteroidLarge.name);
        }
    },

    asteroidCollision: function (target, asteroid) {
        this.sndDestroyed.play();

        target.kill();
        asteroid.kill();

        if (target.key == graphicAssets.ship.name) {
            this.destroyShip();
        }

        this.splitAsteroid(asteroid);

        if (target.key === graphicAssets.bullet.name) {
          this.updateScore(asteroidProperties[asteroid.key].score);
        } else if (target.key === graphicAssets.ship.name){
          this.updateScore(0);
        }

        if (!this.asteroidGroup.countLiving()) {
            game.time.events.add(Phaser.Timer.SECOND * gameProperties.delayToStartLevel, this.nextLevel, this);
        }
    },

    destroyShip: function () {
        if (this.currentPlayer === "Player 1") {
            if (this.playerOneLives > 0) {
              this.playerOneLives --;
            }
            if (this.playerTwoLives > 0) {
              this.tf_lives.text = 'Lives: ' + this.playerTwoLives;
            } else if (this.playerTwoLives === 0) {
              this.tf_lives.text = 'Lives: ' + this.playerOneLives;
            }


        } else if (this.currentPlayer === "Player 2") {
            if (this.playerTwoLives > 0) {
              this.playerTwoLives --;
            }

            if (this.playerOneLives > 0) {
              this.tf_lives.text = 'Lives: ' + this.playerOneLives;
            } else if (this.playerOneLives === 0) {
              this.tf_lives.text = 'Lives: ' + this.playerTwoLives;
            }
        }

        if (this.playerOneLives > 0 || this.playerTwoLives > 0) {
            game.time.events.add(Phaser.Timer.SECOND * shipProperties.timeToReset, this.resetShip, this);
        } else {
            game.time.events.add(Phaser.Timer.SECOND * shipProperties.timeToReset, this.endGame, this);

        }

        this.checkPlayersTurn();
    },

    resetShip: function () {
        this.shipIsInvulnerable = true;
        this.shipSprite.reset(shipProperties.startX, shipProperties.startY);
        this.shipSprite.angle = -90;

        game.time.events.add(Phaser.Timer.SECOND * shipProperties.timeToReset, this.shipReady, this);
        game.time.events.repeat(Phaser.Timer.SECOND * shipProperties.blinkDelay, shipProperties.timeToReset / shipProperties.blinkDelay, this.shipBlink, this);
    },

    shipReady: function () {
        this.shipIsInvulnerable = false;
        this.shipSprite.visible = true;
    },

    shipBlink: function () {
        this.shipSprite.visible = !this.shipSprite.visible;
    },

    splitAsteroid: function (asteroid) {
        if (asteroidProperties[asteroid.key].nextSize) {
            this.createAsteroid(asteroid.x, asteroid.y, asteroidProperties[asteroid.key].nextSize, asteroidProperties[asteroid.key].pieces);
        }
    },

    updateScore: function (score) {
        if (this.currentPlayer === 'Player 1'){
          this.playerOneScore += score;
          this.tf_score.text = 'Score: ' + this.playerOneScore;

          if ((this.playerOneScore >= 200) && (this.playerOneScore <= 300) && (this.playerOneBonusLivesCounter === 1) ) {
            this.playerOneLives ++;
            this.tf_lives.text = 'Lives: ' + this.playerOneLives;
            this.playerOneBonusLivesCounter ++;
          } else if ((this.playerOneScore >= 400) && (this.playerOneScore <= 500) && (this.playerOneBonusLivesCounter === 2) ){
            this.playerOneLives ++;
            this.tf_lives.text = 'Lives: ' + this.playerOneLives;
            this.playerOneBonusLivesCounter ++;
          } else if ((this.playerOneScore >= 600) && (this.playerOneScore <= 700) && (this.playerOneBonusLivesCounter === 3) ){
            this.playerOneLives ++;
            this.tf_lives.text = 'Lives: ' + this.playerOneLives;
            this.playerOneBonusLivesCounter ++;
          } else if ((this.playerOneScore >= 800) && (this.playerOneScore <= 900) && (this.playerOneBonusLivesCounter === 4) ){
            this.playerOneLives ++;
            this.tf_lives.text = 'Lives: ' + this.playerOneLives;
            this.playerOneBonusLivesCounter ++;
          } else if ((this.playerOneScore >= 50000) && (this.playerOneScore <= 50100) && (this.playerOneBonusLivesCounter === 5) ){
            this.playerOneLives ++;
            this.tf_lives.text = 'Lives: ' + this.playerOneLives;
            this.playerOneBonusLivesCounter ++;
          } else if ((this.playerOneScore >= 60000) && (this.playerOneScore <= 60100) && (this.playerOneBonusLivesCounter === 6) ){
            this.playerOneLives ++;
            this.tf_lives.text = 'Lives: ' + this.playerOneLives;
            this.playerOneBonusLivesCounter ++;
          } else if ((this.playerOneScore >= 70000) && (this.playerOneScore <= 70100) && (this.playerOneBonusLivesCounter === 7) ){
            this.playerOneLives ++;
            this.tf_lives.text = 'Lives: ' + this.playerOneLives;
            this.playerOneBonusLivesCounter ++;
          } else if ((this.playerOneScore >= 80000) && (this.playerOneScore <= 80100) && (this.playerOneBonusLivesCounter === 8) ){
            this.playerOneLives ++;
            this.tf_lives.text = 'Lives: ' + this.playerOneLives;
            this.playerOneBonusLivesCounter ++;
          } else if ((this.playerOneScore >= 90000) && (this.playerOneScore <= 90100) && (this.playerOneBonusLivesCounter === 9) ){
            this.playerOneLives ++;
            this.tf_lives.text = 'Lives: ' + this.playerOneLives;
            this.playerOneBonusLivesCounter ++;
          } else if ((this.playerOneScore >= 100000) && (this.playerOneScore <= 100100) && (this.playerOneBonusLivesCounter === 10) ){
            this.playerOneLives ++;
            this.tf_lives.text = 'Lives: ' + this.playerOneLives;
            this.playerOneBonusLivesCounter ++;
          }
        } else if (this.currentPlayer === 'Player 2')  {
          this.playerTwoScore += score;
          this.tf_score.text = 'Score: ' + this.playerTwoScore;

          if ((this.playerTwoScore >= 10000) && (this.playerTwoScore <= 10100) && (this.playerTwoBonusLivesCounter === 1) ) {
            this.playerTwoLives ++;
            this.tf_lives.text = 'Lives: ' + this.playerTwoLives;
            this.playerTwoBonusLivesCounter ++;
          } else if ((this.playerTwoScore >= 20000) && (this.playerTwoScore <= 20100) && (this.playerTwoBonusLivesCounter === 2) ){
            this.playerTwoLives ++;
            this.tf_lives.text = 'Lives: ' + this.playerTwoLives;
            this.playerTwoBonusLivesCounter ++;
          } else if ((this.playerTwoScore >= 30000) && (this.playerTwoScore <= 30100) && (this.playerTwoBonusLivesCounter === 3) ){
            this.playerTwoLives ++;
            this.tf_lives.text = 'Lives: ' + this.playerTwoLives;
            this.playerTwoBonusLivesCounter ++;
          } else if ((this.playerTwoScore >= 40000) && (this.playerTwoScore <= 40100) && (this.playerTwoBonusLivesCounter === 4) ){
            this.playerTwoLives ++;
            this.tf_lives.text = 'Lives: ' + this.playerTwoLives;
            this.playerTwoBonusLivesCounter ++;
          } else if ((this.playerTwoScore >= 50000) && (this.playerTwoScore <= 50100) && (this.playerTwoBonusLivesCounter === 5) ){
            this.playerTwoLives ++;
            this.tf_lives.text = 'Lives: ' + this.playerTwoLives;
            this.playerTwoBonusLivesCounter ++;
          } else if ((this.playerTwoScore >= 60000) && (this.playerTwoScore <= 60100) && (this.playerTwoBonusLivesCounter === 6) ){
            this.playerTwoLives ++;
            this.tf_lives.text = 'Lives: ' + this.playerTwoLives;
            this.playerTwoBonusLivesCounter ++;
          } else if ((this.playerTwoScore >= 70000) && (this.playerTwoScore <= 70100) && (this.playerTwoBonusLivesCounter === 7) ){
            this.playerTwoLives ++;
            this.tf_lives.text = 'Lives: ' + this.playerTwoLives;
            this.playerTwoBonusLivesCounter ++;
          } else if ((this.playerTwoScore >= 80000) && (this.playerTwoScore <= 80100) && (this.playerTwoBonusLivesCounter === 8) ){
            this.playerTwoLives ++;
            this.tf_lives.text = 'Lives: ' + this.playerTwoLives;
            this.playerTwoBonusLivesCounter ++;
          } else if ((this.playerTwoScore >= 90000) && (this.playerTwoScore <= 90100) && (this.playerTwoBonusLivesCounter === 9) ){
            this.playerTwoLives ++;
            this.tf_lives.text = 'Lives: ' + this.playerTwoLives;
            this.playerTwoBonusLivesCounter ++;
          } else if ((this.playerTwoScore >= 100000) && (this.playerTwoScore <= 100100) && (this.playerTwoBonusLivesCounter === 10) ){
            this.playerTwoLives ++;
            this.tf_lives.text = 'Lives: ' + this.playerTwoLives;
            this.playerTwoBonusLivesCounter ++;
          }
        }
    },

    nextLevel: function () {
        this.asteroidGroup.removeAll(true);

        if (this.asteroidsCount < asteroidProperties.maxAsteroids) {
            this.asteroidsCount += asteroidProperties.incrementAsteroids;
        }

        this.resetAsteroids();
    },

    endGame: function(){
      game.state.start(states.main);
    },
};

var game = new Phaser.Game(gameProperties.screenWidth, gameProperties.screenHeight, Phaser.AUTO, 'gameDiv');
game.state.add(states.main, mainState);
game.state.add(states.onePlayer, onePlayerGame);
game.state.add(states.twoPlayer, twoPlayerGame);
game.state.start(states.main);

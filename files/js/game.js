var game    = new Phaser.Game( 800, 576, Phaser.AUTO, 'gameDiv' );
// 800, 576

/* ===== GLOBALS ===== */
var onMobile    = true;

var scoreText;
var lvlText;

var graphicOverlay;
var restartButton;
var menuButton;

var currentLevel;

var map;

var enemy;
var enemies         = [];
var nbrOfEnemies    = 2;

var coins;
var coinsArray      = [];
var coinsCollected  = 0;

var point;
var points;
var pointArray  = [];

var player;

var stars;

var groundLayer;
var borderLayer;

var heart;
var heartArray  = [];
var health = 3;

var enemyHitCounter = 0;
var enableToHit = false;

var pacman;
var mariokart;
var menuBackground;
var soundBtn;


var coinHit;
var enemyHit;
var pressStart;
var theme;
var gameMusicOver;
var playMusic = true;

var boxXPositions   = [];
var boxYPositions   = [];
var mysteryBox;
var mysteryBoxes;
var mysteryBoxOnScreen  = false;
var timeNotTaken        = 0;

/* ===== SETTINGS ===== */
var playerSettings = {
    moveSpeed: 15,
    timeToGetHit: 100,
}

var enemySettings = {
    moveSpeed: 200,
}



/* ===== FUNCTIONS ===== */

function enemyOnPoint (enemy, point)
{
    margeXTop       = point.x + 1;
    margeXBottom    = point.x - 1;

    margeYTop       = point.y + 1;
    margeYBottom    = point.y - 1;

    if ((Math.ceil(enemy.body.x) >= margeXBottom && Math.ceil(enemy.body.x) <= margeXTop) && (Math.ceil(enemy.body.y) >= margeYBottom && Math.ceil(enemy.body.y) <= margeYTop))
    {
        switch (Math.floor(Math.random() * (5 - 1) + 1))
        {
            case 1:
                enemy.body.velocity.x   = 200;
                enemy.animations.play('right');
                enemy.animations.stop('left');
                enemy.animations.stop('up');
                enemy.animations.stop('down');
            break;

            case 2:
                enemy.body.velocity.x   = -200;
                enemy.animations.play('left');
                enemy.animations.stop('right');
                enemy.animations.stop('up');
                enemy.animations.stop('down');
            break;

            case 3:
                enemy.body.velocity.y   = 200;
                enemy.animations.play('down');
                enemy.animations.stop('up');
                enemy.animations.stop('left');
                enemy.animations.stop('right');
            break;

            case 4:
                enemy.body.velocity.y   = -200;
                enemy.animations.play('up');
                enemy.animations.stop('down');
                enemy.animations.stop('lerft');
                enemy.animations.stop('right');
            break;
        }
    }
}

function cursorControls (sprite, autoMovement)
{
    if (!autoMovement)
    {
        sprite.body.velocity.x  = 0;
        sprite.body.velocity.y  = 0;
    }

    if (cursors.down.isDown)
    {
        sprite.body.velocity.y   = 200;
    }
    else if (cursors.up.isDown)
    {
        sprite.body.velocity.y   = -200;
    }

    if (cursors.left.isDown)
    {
        sprite.body.velocity.x   = -200;
    } 
    else if (cursors.right.isDown)
    {
        sprite.body.velocity.x   = 200;
    }
}

function collectCoin (enemy, coin)
{     
    coin.animations.stop('spin');
    coin.animations.play('collected');
    game.time.events.add(Phaser.Timer.SECOND * 0.3, killCoin, this);

    if(playMusic){

    coinHit = game.add.audio('hit');
    coinHit.volume = 0.012;
    coinHit.play();

    }
    coin.kill();
        coinsCollected += 1;
        scoreText.text  = coinsCollected

    function killCoin () 
    {
        
    }
}

function killPlayer ()
{
    if(health == 0){

        graphicOverlay = new Phaser.Graphics(this.game, 0 , 0);
        graphicOverlay.beginFill(0x000000, 0.7);
        graphicOverlay.drawRect(0,0, game.world.width, game.world.height);
        graphicOverlay.endFill();
        this.overlay = this.game.add.image(-10,-10,graphicOverlay.generateTexture());
        this.overlay.inputEnabled = true;
        
        game_over = game.add.sprite(game.world.centerX , game.world.centerY - 150, 'game_over');
        game_over.anchor.setTo(0.5);
        game_over.animations.add('game_over', [0,1,2,3,4,5,4,5,6,7,8,9], 5, true);
	    game_over.animations.play("game_over");

        restartButton   = game.add.button(game.world.centerX - 150, game.world.centerY, 'restart_btn', resetGame, this);
        restartButton.anchor.setTo(0.5);

        menuButton   = game.add.button(game.world.centerX + 150, game.world.centerY, 'menu_btn', backToMenu, this);
        menuButton.anchor.setTo(0.5);

        game.camera.shake(0.01, 300);
        player.kill();

       
        
        if(playMusic){
            theme.stop();
            gameMusicOver = game.add.audio('gameOver');
            gameMusicOver.volume = 0.2;
            gameMusicOver.play();
        }

        gameOver    = true;
    }
}

function resetGame () 
{
    game.state.start('reset');
}

function backToMenu ()
{
    game.state.start('menu');
}

function displayScore ()
{
    scoreText    = game.add.text( 
        592, 
        115, 
        coinsCollected, 
        { 
            font: "32px Arial", 
            fill: "#fff" 
        } 
    );

    scoreText.anchor.setTo( 0.5 );
}

function displayLevel ()
{
    lvlText    = game.add.text( 
        592, 
        115, 
        currentLevel, 
        { 
            font: "32px Arial", 
            fill: "#fff" 
        } 
    );

    lvlText.anchor.setTo( 0.5 );

    lvlText.text    = currentLevel;
}

function displayHearts ()
{
    map.objects.health.forEach(function (hp) {
        heart      = game.add.image(hp.x, hp.y, 'heart');
        heartArray.push(heart);
    }, this);
}

function killHeart(player, enemy)
{
    game.camera.shake(0.025, 300);
    game.camera.flash(0xff0000, 100);
    health--;

    stars.animations.play('onHit');
    window.navigator.vibrate([1000,2000,1000]);


    if(playMusic){
        enemyHit = game.add.audio('enemyHit');
        enemyHit.volume = 0.1;
        enemyHit.play();
    }

    heartArray[health].destroy();
    
    if (health  === 0)
    {
        killPlayer();
    }
}

function fixFallthrough() 
{
    game.physics.arcade.TILE_BIAS = 40;
}

function checkCoins ()
{
    // coinsArray.length
    if (coinsCollected === 10)
    {
        // Wat doen als alle levels gecleared zijn?
    }
}

function addMysteryBox ()
{

    var maxNbr          = boxXPositions.length;
    var randomNbr       = Math.floor(Math.random() * (maxNbr - 0) + 0);

    var randomX         = boxXPositions[randomNbr];
    var randomY         = boxYPositions[randomNbr];

    mysteryBox  = mysteryBoxes.create(randomX, randomY, 'mysterybox');

    game.time.events.loop(Phaser.Timer.SECOND * 1, checkTime, this);

    function checkTime ()
    {
        timeNotTaken++;

        if (timeNotTaken > 10)
        {
            mysteryBox.kill();
        }
    }
}

function collectMysteryBox (player, box)
{
    console.log('box collected');
    box.kill();
}

function HandleOrientation (e) 
{
    player.body.velocity.y = -e.gamma * playerSettings.moveSpeed;
    player.body.velocity.x = e.beta * playerSettings.moveSpeed;
}
/* ===== STATES ===== */

// CORE STATES
game.state.add('boot', BootState);
game.state.add('load', LoadState);
game.state.add('menu', MenuState);
game.state.add('reset', ResetState);
game.state.add('instructions', InstructionState);
game.state.add('credits', CreditState);
game.state.add('loading-animation', LoadingAnimationState);

// LEVELS
game.state.add('level_1', Level_1);
game.state.add('level_2', Level_2);
game.state.add('level_3', Level_3);
game.state.add('level_4', Level_4);
game.state.add('level_5', Level_5);

// INTROS

// START
game.state.start('boot');
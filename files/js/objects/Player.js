var Player  = function (x, y)
{
    var _player     =  game.add.sprite(x, y, 'car');

    game.physics.arcade.enable(_player);
    _player.anchor.setTo(0.5);
    _player.scale.setTo(0.90);
    _player.frame   = 4;

<<<<<<< HEAD
   
    // Enable da terug als de shit morgen nie meer werkt :p
    // window.addEventListener("deviceorientation", handleOrientation, true);
    fixFallthrough();
    
    _player.update  = function ()
    {
        if(enemyHitCounter > playerSettings.timeToGetHit || !enableToHit){
            
            if(game.physics.arcade.overlap(player, enemies, killHeart, null, this)){
                
=======
    stars = _player.addChild(game.make.sprite(0, 0, 'stars'));
    stars.frame = 0;
    stars.anchor.setTo(0.5,1);
    stars.animations.add('onHit', [0, 1, 2, 3,0], 12, false);
    
    _player.update  = function ()
    {
        if(enemyHitCounter > playerSettings.timeToGetHit || !enableToHit)
        {
            if(game.physics.arcade.overlap(player, enemies, killHeart, null, this))
            {
>>>>>>> master
                enableToHit = true;
                enemyHitCounter = 0;
            }
        }
        
        checkCoins();
        game.physics.arcade.collide(_player, borderLayer);
        game.physics.arcade.overlap(_player, coins, collectCoin, null, this);
        game.physics.arcade.overlap(_player, mysteryBoxes, collectMysteryBox, null, this);

        if(enableToHit){
            enemyHitCounter++;
        }
        
    }

    return _player;
}
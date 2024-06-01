class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        
        this.load.tilemapTiledJSON('map', 'assets/tilemap/tilemap1.json');
        this.load.image('tileset', 'assets/tilemap/kokomi tileset.png');
                
        
        this.load.spritesheet('dude', 'assets/images/dude.png', { frameWidth: 64, frameHeight: 73 });
        this.load.image('collect', 'assets/images/collect.png');
        
        
        this.load.audio('jump_sfx', 'assets/audio/sfx/jump_sfx.mp3');
        this.load.audio('win_sfx', 'assets/audio/sfx/win_sfx.mp3');
        this.load.audio('collect_sfx', 'assets/audio/sfx/collect_sfx.mp3');
        this.load.audio('gameover_sfx', 'assets/audio/sfx/gameover_sfx.mp3');
        this.load.audio('gameBgm', 'assets/audio/bgm/game2_bgm.mp3');
        
    }

    create(data) {
        
        const map = this.make.tilemap({ key: 'map' });
        const tileset = map.addTilesetImage('kokomi tileset', 'tileset');
        const collectiblesNeeded = 60;

        
        

        const platformLayer = map.createLayer('platform', tileset, 0, 0);
        platformLayer.setCollisionByProperty({ collides: true });

        const waterLayer = map.createLayer('water', tileset);
        waterLayer.setCollisionByProperty({ collides: true });
     
        const vanishLayer = map.createLayer('vanish', tileset);
        vanishLayer.setCollisionByProperty({ collides: true });

        const portalLayer = map.createLayer('portal', tileset);
        portalLayer.setCollisionByProperty({ collides: true });


    if (this.score >= collectiblesNeeded) {
        this.physics.add.collider(this.player, portalLayer);
    }

        
        const floralLayer = map.createLayer('keys', tileset);
        const cloudsLayer = map.createLayer('clouds', tileset);

        
        const collectiblesLayer = map.createLayer('collectibles', tileset);
        collectiblesLayer.setTileIndexCallback([20], this.collectCollectible, this);
        
        
        this.gameBgm = this.sound.add('gameBgm', { loop: true, volume: 0.3 });
        this.gameBgm.play();

        
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.player = this.physics.add.sprite(100, 900, 'dude');
        this.player.setScale(0.8);
        this.player.setCollideWorldBounds(true);
        
    
        
        this.physics.add.collider(this.player, platformLayer);
        this.physics.add.collider(this.player, vanishLayer, (player, tile) => {
            if (tile.properties.collides && this.player.body.bottom <= tile.pixelY + 10) { 
                
                this.time.delayedCall(1500, () => {
                    
                    vanishLayer.removeTileAt(tile.x, tile.y);
                });
            }
        });
        
        this.physics.add.collider(this.player, waterLayer, this.playerCollideWater, null, this);
        this.physics.add.overlap(this.player, collectiblesLayer);
        this.physics.add.collider(this.player, portalLayer, this.handlePortalCollision, null, this);

        this.allCollectiblesCollected = false;
      
    
        
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'turn',
            frames: [{ key: 'dude', frame: 4 }],
            frameRate: 20
        });
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
        this.cursors = this.input.keyboard.createCursorKeys();

        
        this.score = 0;
        this.collectibleCount =  0;

        
        this.scoreText = this.add.text(150, 110, 'Score: 0', {
            fontFamily: 'Butter',
            fontSize: '32px',
            fill: '#f3b4bf',
            stroke: '#ffe7eb',  
            strokeThickness: 4, 
            resolution: 5      
        }).setScrollFactor(0);
        this.collectibleImage = this.add.image(170, 170, 'collect',{resolution: 5}).setScrollFactor(0).setScale(0.8);
        this.collectibleText = this.add.text(200, 150, 'x 0', {
            fontFamily: 'Butter',
            fontSize: '32px',
            fill: '#f3b4bf',
            stroke: '#ffe7eb',  
            strokeThickness: 4, 
            resolution: 5  
        }).setScrollFactor(0);
        
        
        
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setBackgroundColor('#917d8f'); 
        this.cameras.main.setZoom(1.5);
    }
    handlePortalCollision(player, tile) {
        if (this.allCollectiblesCollected) {
            
            this.scene.start('GameScene2', { score: this.score, collectibleCount: this.collectibleCount });
            this.gameBgm.stop();
            const winSound = this.sound.add('win_sfx');
                    winSound.volume = 0.5;
                    winSound.play();
        } else {
            
            alert('Collect all collectibles to enter the portal!');
            this.gameBgm.stop();
            this.scene.restart(); 
        }
    }

    update() {
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play('left', true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play('right', true);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }

        if (this.cursors.up.isDown && this.player.body.onFloor()) {
        const jumpSound = this.sound.add('jump_sfx');
        jumpSound.volume = 0.05;
        jumpSound.play();
    
    this.player.setVelocityY(-300);
}

    }
    collectCollectible(player, tile) {
        console.log('Collectible touched');
        
        
        if (tile) {
            
            tile.tilemapLayer.removeTileAt(tile.x, tile.y);
    
            
            this.score += 10;
            this.scoreText.setText('Score: ' + this.score);

            this.data.set('score', this.score);
            this.data.set('collectibleCount', this.collectibleCount);

    
            this.collectibleCount += 1;
            this.collectibleText.setText('x ' + this.collectibleCount);
    
            
            const collectSound = this.sound.add('collect_sfx');
            collectSound.volume = 0.5; 
    
            
            collectSound.play();
    
            
            const collectiblesNeeded = 6;
            if (this.collectibleCount === collectiblesNeeded) {
                this.allCollectiblesCollected = true; 
            }
        }
    }

    playerCollideWater(player, water) {
        
        const gameOverSound = this.sound.add('gameover_sfx');
        gameOverSound.volume = 0.2; 
    
        
        this.gameBgm.stop();
        gameOverSound.play();
    
        
        this.scene.start('GameOverScene', { score: this.score });
    }
    
    
}

export default GameScene;
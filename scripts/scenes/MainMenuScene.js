class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    preload() {
        this.load.image('mainmenu', 'assets/images/mainmenu/mainmenu_bg.png');
        this.load.image('playButton', 'assets/images/buttons/play_button.png');
        this.load.image('quitButton', 'assets/images/buttons/quit_button.png');

        // Preload audio files
        this.load.audio('bgm', 'assets/audio/bgm/mainmenu_bgm.mp3');
        this.load.audio('buttonSfx', 'assets/audio/sfx/button_sfx.mp3');
        this.load.audio('gameBgm', 'assets/audio/bgm/game2_bgm.mp3');
    }

    create() {
        // Play background music
        if (!this.bgm || !this.bgm.isPlaying) {
            // Play background music
            this.bgm = this.sound.add('bgm', { loop: true, volume: 0.2 }); // Set initial volume to 50%
            this.bgm.play();
        }
        const mainmenu1 = this.add.image(400, 300, 'mainmenu').setDisplaySize(800, 600);

        const playButton = this.add.image(400, 200, 'playButton').setInteractive();
        playButton.setPosition(this.sys.game.config.width / 2, this.sys.game.config.height - 100);

        playButton.on('pointerdown', () => {
            // Play button click sound effect
            this.sound.play('buttonSfx');
            this.bgm.stop();
            this.scene.start('GameScene');
        });

        const quitButton = this.add.image(this.sys.game.config.width - 100, 100, 'quitButton').setInteractive();
        quitButton.setPosition(this.sys.game.config.width / 2, this.sys.game.config.height - 50);
        quitButton.on('pointerdown', () => {
            // Play button click sound effect
            this.sound.play('buttonSfx');
            alert('Thank you for playing! ᓬ (˙𐃷˙)ᕒ');
        });

    }
}

export default MainMenuScene;

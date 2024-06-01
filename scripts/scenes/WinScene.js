class WinScene extends Phaser.Scene {
    constructor() {
        super({ key: 'WinScene' });
    }

    preload() {
        this.load.image('win', 'assets/images/win/win_bg.png');
        this.load.image('menuButton', 'assets/images/buttons/menu_button.png');
        this.load.audio('buttonSfx', 'assets/audio/sfx/button_sfx.mp3');
    }

    create(data) {
        if (this.scene.get('MainMenuScene').bgm && this.scene.get('MainMenuScene').bgm.isPlaying) {
            this.scene.get('MainMenuScene').bgm.stop();
        }

         //Retrieve scores from all scenes
         const totalScore = data.totalScore || 0;
        const winbg = this.add.image(400, 300, 'win').setDisplaySize(800, 600);
        const scoreText = this.add.text(400, 400, 'Total Score: ' + totalScore, {
            fontFamily: 'Butter',
            fontSize: '32px',
            fill: '#FFFFFF',
            stroke: '#000000', 
            strokeThickness: 4,
        });
        scoreText.setOrigin(0.5);

        const menuButton = this.add.image(400, 500, 'menuButton').setInteractive();
        menuButton.setPosition(this.sys.game.config.width / 2, this.sys.game.config.height - 50);
        
        menuButton.on('pointerdown', () => {
            this.sound.play('buttonSfx');
            this.scene.get('GameScene').data.set('score', 0);
            this.scene.start('MainMenuScene');

        });
    }
}

export default WinScene;

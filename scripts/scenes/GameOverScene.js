class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    preload() {
        this.load.image('gameOver', 'assets/images/gameover/gameover_bg.png');
        this.load.image('mainMenuButton', 'assets/images/buttons/menu_button.png');
        this.load.image('restartButton', 'assets/images/buttons/replay_button.png');
        this.load.audio('buttonSfx', 'assets/audio/sfx/button_sfx.mp3');
    }

    create(data) {
        if (this.scene.get('MainMenuScene').bgm && this.scene.get('MainMenuScene').bgm.isPlaying) {
            this.scene.get('MainMenuScene').bgm.stop();
        }
        const gameOver = this.add.image(400, 300, 'gameOver').setDisplaySize(800, 600);
        
        // Retrieve scores from all scenes
        const score1 = this.scene.get('GameScene').data.get('score') || 0;
        const score2 = this.scene.get('GameScene2').data.get('score') || 0;
        const score3 = this.scene.get('GameScene3').data.get('score') || 0;

        // Calculate the total score
        const totalScore = score1 + score2 + score3;

        const scoreText = this.add.text(400, 200, 'Total Score: ' + totalScore, {  fontFamily: 'Butter',
        fontSize: '32px',
        fill: '#FFFFFF',
        stroke: '#000000',  // Set the stroke color
        strokeThickness: 4, });
        scoreText.setOrigin(0.5);

        const mainMenuButton = this.add.image(400, 300, 'mainMenuButton').setInteractive();
        mainMenuButton.setPosition(this.sys.game.config.width / 2, this.sys.game.config.height - 100);
        mainMenuButton.on('pointerup', () => {
            this.sound.play('buttonSfx');
            this.scene.get('GameScene').data.set('score', 0);
            this.scene.start('MainMenuScene');
        });

        const restartButton = this.add.image(400, 400, 'restartButton').setInteractive();
        //restartButton.setScale(0.5);
        restartButton.setPosition(this.sys.game.config.width / 2, this.sys.game.config.height - 50);
        restartButton.on('pointerup', () => {
            this.sound.play('buttonSfx');
            
            this.scene.get('GameScene').data.set('score', 0);
            this.scene.start('GameScene');
        });
    }
}

export default GameOverScene;

class Bird {
    constructor(scaleFactor) {
        this.imgList = [];
        this.imageIndex = 0;
        this.image = null;
        this.rect = { 
            x:100, 
            y:100, 
            width:0, 
            height:0,
            get bottom() { 
                return this.y+this.height; 
            },
            get left() { 
                return this.x; 
            },
            get right() { 
                return this.x + this.width; 
            }
        };
        this.yVelocity=0;
        this.gravity=10;
        this.flapSpeed=250;
        this.animCounter=0;
        this.updateOn=false;
        this.scaleFactor=scaleFactor;
        this.loadImages();
    }
    

















    async loadImages() {
        const birdUpImg = new Image();
        const birdDownImg = new Image();
        
        birdUpImg.src = 'assets/birdup.png';
        birdDownImg.src = 'assets/birddown.png';
        
        await Promise.all([
         new Promise(resolve=>birdUpImg.onload=resolve),
         new Promise(resolve=>birdDownImg.onload=resolve)
        ]);
        
        this.imgList = [
            this.scaleImage(birdUpImg, this.scaleFactor),
            this.scaleImage(birdDownImg, this.scaleFactor)
        ];
        this.image = this.imgList[this.imageIndex];
        this.rect.width = this.image.width;
        this.rect.height = this.image.height;
    }












    
    scaleImage(img, scaleFactor) {
        const canvas=document.createElement('canvas');
        const ctx=canvas.getContext('2d');
        canvas.width=img.width*scaleFactor;
        canvas.height=img.height*scaleFactor;
        ctx.drawImage(img,0,0,canvas.width,canvas.height);
        return canvas;
    }
    



    update(dt) {
        if (this.updateOn) {
            this.playAnimation();
            this.applyGravity(dt);
        }
        
        if (this.rect.y<= 0) {
            this.rect.y=0;
            this.flapSpeed =0;
        } else if (this.rect.y > 0 && this.flapSpeed===0) {
            this.flapSpeed=250;
        }
    }




    
    applyGravity(dt) {
        this.yVelocity+=this.gravity*dt;
        this.rect.y+=this.yVelocity;
    }
    


    flap(dt) {
        this.yVelocity=-this.flapSpeed*dt;
    }
    
    playAnimation() {
        if (this.animCounter===5) {
            this.image = this.imgList[this.imageIndex];
            if(this.imageIndex===0){
                this.imageIndex=1;
            }else{
                this.imageIndex=0;
            }
            this.animCounter = 0;
        }
        this.animCounter++;
    }
    


    resetPosition() {
        this.rect.x = 100;
        this.rect.y = 100;
        this.yVelocity = 0;
        this.animCounter = 0;
    }
    
    draw(ctx) {
        if (this.image) {
            ctx.drawImage(this.image,this.rect.x,this.rect.y);
        }
    }
}




class Pipe {
    constructor(scaleFactor,moveSpeed) {
        this.scaleFactor=scaleFactor;
        this.moveSpeed=moveSpeed;
        this.pipeDistance=250;
        this.imgUp=null;
        this.imgDown=null;
        this.rectUp = { 
            x: 600, 
            y: 0, 
            width: 0, 
            height: 0,
            get bottom(){ 
                return this.y+this.height; 
            },


            get left(){ 
                return this.x;
            },
            get right(){ 
                return this.x+this.width; 
            }
        };
        this.rectDown = { 
            x: 600, 
            y: 0, 
            width: 0, 
            height: 0,
            get bottom(){ 
                return this.y+this.height;
             },

            get left(){ 
                return this.x; 
            },
            get right(){ 
                return this.x + this.width;
             }
        };
        this.loadImages();
        this.randomizePosition();
    }
    




    async loadImages() {
        const pipeUpImg = new Image();
        const pipeDownImg = new Image();
        pipeUpImg.src = 'assets/pipeup.png';
        pipeDownImg.src = 'assets/pipedown.png';
        await Promise.all([new Promise(resolve=>pipeUpImg.onload=resolve),new Promise(resolve=>pipeDownImg.onload=resolve)]);
        this.imgUp = this.scaleImage(pipeUpImg, this.scaleFactor);
        this.imgDown = this.scaleImage(pipeDownImg, this.scaleFactor);
        this.rectUp.width = this.imgUp.width;
        this.rectUp.height = this.imgUp.height;
        this.rectDown.width = this.imgDown.width;
        this.rectDown.height = this.imgDown.height;
        this.randomizePosition();
    }
    





    scaleImage(img, scaleFactor) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width * scaleFactor;
        canvas.height = img.height * scaleFactor;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        return canvas;
    }
    

    randomizePosition() {
        this.rectUp.y = Math.floor(Math.random()*(520-350+1))+350;
        this.rectUp.x = 600;
        this.rectDown.y = this.pipeDistance - this.rectUp.height;
        this.rectDown.x = 600;
    }
    
   update(dt){
    this.rectUp.x-=this.moveSpeed*dt;
    this.rectDown.x-=this.moveSpeed*dt;
   }


    
    draw(ctx) {
        if (this.imgUp && this.imgDown) {
            ctx.drawImage(this.imgUp, this.rectUp.x, this.rectUp.y);
            ctx.drawImage(this.imgDown, this.rectDown.x, this.rectDown.y);
        }
    }
}

class Game {
    constructor() {
        this.width = 600;
        this.height = 770;
        this.scaleFactor = 1.5;
        this.moveSpeed = 270;
        this.startMonitoring = false;
        this.bird = new Bird(this.scaleFactor);
        this.isEnterPressed = false;
        this.isGameStarted = true;
        this.isGameOver = false;
        this.score = 0;
        this.pipes = [];
        this.pipeGenerateCounter = 71;
        
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        this.instructionsElement = document.getElementById('instructions');
        this.gameOverOverlay = document.getElementById('gameOverOverlay');
        this.finalScoreElement = document.getElementById('finalScore');
        this.overlayRestartElement = document.getElementById('overlayRestart');
        
        this.bgImage = null;
        this.ground1Image = null;
        this.ground2Image = null;
        this.ground1Rect = { x: 0, y: 568, width: 0, height: 0 };
        this.ground2Rect = { x: 0, y: 568, width: 0, height: 0 };
        
        this.lastTime = 0;
        
        this.init();
    }
    
    async init() {
        await this.loadAssets();
        this.setupEventListeners();
        this.gameLoop(0);
    }
    
    async loadAssets() {
        const bgImg = new Image();
        const groundImg = new Image();
        
        bgImg.src = 'assets/bg.png';
        groundImg.src = 'assets/ground.png';
        
        await Promise.all([
            new Promise(resolve => bgImg.onload = resolve),
            new Promise(resolve => groundImg.onload = resolve)
        ]);
        
        this.bgImage = this.scaleImage(bgImg, this.scaleFactor);
        this.ground1Image = this.scaleImage(groundImg, this.scaleFactor);
        this.ground2Image = this.scaleImage(groundImg, this.scaleFactor);
        
        this.ground1Rect.width = this.ground1Image.width;
        this.ground1Rect.height = this.ground1Image.height;
        this.ground2Rect.width = this.ground2Image.width;
        this.ground2Rect.height = this.ground2Image.height;
        
        this.ground2Rect.x = this.ground1Rect.x + this.ground1Rect.width;
    }
    
    scaleImage(img, scaleFactor) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width * scaleFactor;
        canvas.height = img.height * scaleFactor;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        return canvas;
    }
    


   setupEventListeners() {

    document.addEventListener('keydown', (e) => {

            if (e.code === 'Enter') {
                if (this.isGameStarted && !this.isEnterPressed) {
                    this.isEnterPressed = true;
                    this.bird.updateOn = true;
                    this.instructionsElement.style.display = 'none';
                } else if (!this.isGameStarted) {
                    this.restartGame();
                }
            }
               
            //space to jump 
            if (e.code === 'Space' && this.isEnterPressed){
                e.preventDefault();
                this.bird.flap(1/60);
                this.playSound('flapSound');
            }
        });
        const handleTouch = (e) => {
            if (e && e.preventDefault && !e.target.closest('#overlayRestart')) {
                e.preventDefault();
            }

            if (e.target.closest('#overlayRestart')) {
                return;
            }

            if (!this.isGameStarted) {
                return;
            }

            if (!this.isEnterPressed) {
                this.isEnterPressed = true;
                this.bird.updateOn = true;
                this.instructionsElement.style.display = 'none';
                return;
            }

            this.bird.flap(1/60);
            this.playSound('flapSound');
        };

        document.addEventListener('touchstart', handleTouch, { passive: false });
        document.addEventListener('mousedown', handleTouch);

    this.overlayRestartElement.addEventListener('click', () => {
    this.restartGame();
    });


   }
    



    gameLoop(currentTime) {
        const dt = (currentTime - this.lastTime) / 1000 || 1/60;
        this.lastTime = currentTime;
        this.update(dt);
        this.checkCollisions();
        this.checkScore();
        this.draw();
        requestAnimationFrame((time) => this.gameLoop(time));





    }





    
    update(dt) {
        if (this.isEnterPressed) {
            this.ground1Rect.x-=this.moveSpeed*dt;
            this.ground2Rect.x-= this.moveSpeed*dt;
            
            if (this.ground1Rect.x + this.ground1Rect.width < 0) {
                this.ground1Rect.x = this.ground2Rect.x + this.ground2Rect.width;
            }
            if (this.ground2Rect.x + this.ground2Rect.width < 0) {
                this.ground2Rect.x = this.ground1Rect.x + this.ground1Rect.width;
            }
            
            if (this.pipeGenerateCounter > 70) {
                this.pipes.push(new Pipe(this.scaleFactor, this.moveSpeed));
                this.pipeGenerateCounter = 0;
            }
            
            this.pipeGenerateCounter++;
            
            for (let pipe of this.pipes) {
                pipe.update(dt);
            }
            
            if (this.pipes.length > 0 && this.pipes[0].rectUp.right < 0) {
                this.pipes.shift();
            }
        }
        
        this.bird.update(dt);
    }











    
    checkCollisions() {
        if (this.bird.rect.bottom > 568) {
            this.bird.updateOn = false;
            this.isEnterPressed = false;
            this.isGameStarted = false;
            this.gameOver();
            return;
        }
        if (this.pipes.length > 0) {
            if (this.checkRectCollision(this.bird.rect, this.pipes[0].rectDown) ||
                this.checkRectCollision(this.bird.rect, this.pipes[0].rectUp)) {
                this.isEnterPressed = false;
                this.isGameStarted = false;
                this.gameOver();
            }
        }
    }
    
    checkRectCollision(rect1, rect2) {
        return rect1.x<rect2.x + rect2.width &&
               rect1.x+rect1.width>rect2.x &&
               rect1.y< rect2.y + rect2.height &&
               rect1.y+rect1.height >rect2.y;
    }
    
    checkScore() {
        if (this.pipes.length > 0){
            if (this.bird.rect.left>this.pipes[0].rectDown.left && 
                this.bird.rect.right<this.pipes[0].rectDown.right && 
                !this.startMonitoring) {
                this.startMonitoring=true;
            }
            if (this.bird.rect.left>this.pipes[0].rectDown.right && this.startMonitoring) {
                this.startMonitoring=false;
                this.score++;
                this.scoreElement.textContent=`Score: ${this.score}`;
                this.playSound('scoreSound');
            }
        }
    }
    
    draw() {
        this.ctx.clearRect(0,0,this.width,this.height);
        if (this.bgImage) {
            this.ctx.drawImage(this.bgImage, 0, -300);
        }
        
        for (let pipe of this.pipes) {
            pipe.draw(this.ctx);
        }
        
        if (this.ground1Image) {
            this.ctx.drawImage(this.ground1Image, this.ground1Rect.x, this.ground1Rect.y);
        }
        if (this.ground2Image) {
            this.ctx.drawImage(this.ground2Image, this.ground2Rect.x, this.ground2Rect.y);
        }
        
        this.bird.draw(this.ctx);
    }



    
    restartGame(){
        this.score = 0;
        this.scoreElement.textContent = 'Score: 0';
        this.isEnterPressed = false;
        this.isGameStarted = true;
        this.isGameOver = false;
        this.bird.resetPosition();
        this.pipes = [];
        this.pipeGenerateCounter = 71;
        this.bird.updateOn = false;
        this.startMonitoring = false;
        this.instructionsElement.style.display = 'block';
        this.gameOverOverlay.classList.remove('show');
    }
    
    gameOver(){
        if (this.isGameOver) {
            return;
        }

        this.isGameOver = true;
        this.isGameStarted = false;
        this.isEnterPressed = false;
        this.playSound('deadSound');
        this.finalScoreElement.textContent=`Score: ${this.score}`;
        this.gameOverOverlay.classList.add('show');
    }



    
    playSound(soundId) {
        const sound = document.getElementById(soundId);
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(e => console.log('Sound play failed:', e));
        }
    }
}

window.addEventListener('load', () => {
    new Game();
});

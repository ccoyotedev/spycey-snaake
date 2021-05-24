const WIDTH = window.innerWidth < 600 || window.innerHeight < 800 ? 320 : 640;
const HEIGHT = WIDTH;
const SPRITE_SIZE = 32;
const COLS = WIDTH/SPRITE_SIZE;
const ROWS = HEIGHT/SPRITE_SIZE;
const MAX_BODY = (WIDTH/SPRITE_SIZE)*(HEIGHT/SPRITE_SIZE)-1;
const ASSETSIZE = 4;
const isMobile = navigator.userAgent.match(/Android/i,/webOS/i,/iPhone/i,/iPad/i,/iPod/i,/BlackBerry/i,/Windows Phone/i);

function game() {
    this.FPS = 1000/60;
    
    this.MPS = WIDTH < 640 ? 350 : 250;
    
    this.MAX_PORTALS = 3;
    
    this.canvas = document.getElementById('canvas');
    this.canvas.width = WIDTH;
    this.canvas.height = HEIGHT;
    
    this.ctx = this.canvas.getContext('2d');
    
    this.scoreCanvas = document.getElementById('scoreCanvas');
    this.scoreCanvas.width = WIDTH;
    this.scoreCanvas.height = 40;
    this.scoreCtx = this.scoreCanvas.getContext('2d');
    
    this.score = 0;
    
    this.assetsloaded = 0;
    
    this.KEYS = [
        87, 65, 83, 68,
        37, 38, 39, 40
    ]
    
    if(isMobile) document.getElementById('mobile-controls').style.display = 'block';
    //#endregion

    //game functions
    this.init = (highscore, gotchi, setHighscoreCallback) => {
        this.highscore = highscore;
        this.setHighscore = setHighscoreCallback;
        this.gotchi = gotchi;

        //load the image files for reference
        this.loadAssets();
    }
    this.startGame = () => {
        this.special = null;
        
        this.portals = [];
        
        const p = {
            position: {x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS)},
            sprite: this.portalRef,
            render: function(ctx){
                ctx.drawImage(this.sprite, 0, 0, 32, 32, this.position.x*32, this.position.y*32, 32, 32);
            },
            destroy: function(gameRef){
                gameRef.score += 10;
                gameRef.movePortal(this);
            }
        }
        
        this.portals.push(p);
        
        this.snake = new Snake(this.headRef, this.bodyRef, this.ctx, this);
        this.started = false;
        
        this.canvas.addEventListener('click', this.awaitClickStart);
        this.interval = setInterval(this.renderUpdate, this.FPS);
    }
    this.handleButtonClick = (e) => {
        e.preventDefault();
        if(this.snake.head.direction === '') {
            this.portalInterval = setInterval(this.portalUpdate, 1000*30);
            this.timer = setTimeout(() => {
                this.createSpecialPortal();
            }, 1000*20);
        }
        let desiredPos;
        switch(e.target.id){
            case 'up':
                desiredPos = { x: this.snake.head.position.x, y: this.snake.head.position.y-1 };
                if(this.snake.body[0]?.position.x !== desiredPos.x && this.snake.body[0]?.position.y !== desiredPos.y){
                    this.snake.setDirection('up');
                }
                break;
            case 'right':
                desiredPos = { x: this.snake.head.position.x+1, y: this.snake.head.position.y };
                if(this.snake.body[0]?.position.x !== desiredPos.x && this.snake.body[0]?.position.y !== desiredPos.y){
                    this.snake.setDirection('right');
                }
                break;
            case 'left':
                desiredPos = { x: this.snake.head.position.x-1, y: this.snake.head.position.y };
                if(this.snake.body[0]?.position.x !== desiredPos.x && this.snake.body[0]?.position.y !== desiredPos.y){
                    this.snake.setDirection('left');
                }
                break;
            case 'down':
                desiredPos = { x: this.snake.head.position.x, y: this.snake.head.position.y+1 };
                if(this.snake.body[0]?.position.x !== desiredPos.x && this.snake.body[0]?.position.y !== desiredPos.y){
                    this.snake.setDirection('down');
                }
                break;
            default:
                break;
        }
    }
    this.loadMusic = () => {
        this.music = new Audio('./sfx/creep.m4a');
    }
    this.awaitClickStart = () => {
        console.log('click start');
        if(!isMobile){
            window.addEventListener('keydown', this.handleKeyEvents);
        } else {
            const btns = document.getElementsByClassName('btn');
            for(var i=0;i<btns.length;i++){
                btns[i].addEventListener('click', this.handleButtonClick);
            }
        }
        this.loadMusic();
        this.music.loop = true;
        this.music.volume = 0.25;
        this.music.play();
        
        this.moveInterval = setInterval(this.moveUpdate, this.MPS);
        this.started = true;
        this.canvas.removeEventListener('click', this.awaitClickStart);
    }
    this.movePortal = async(portal) => {
        let newPos = {x: Math.floor(Math.random() * WIDTH/SPRITE_SIZE), y: Math.floor(Math.random() * HEIGHT/SPRITE_SIZE)};
        
        if(!this.hasObjectAtPosition(newPos)) {
            portal.position = newPos;
        } else {
            this.movePortal(portal);
        }
    }
    this.hasObjectAtPosition = (pos) => {
        if(this.snake.head.position.x === pos.x && this.snake.head.position.y === pos.y) return true;
        
        if(this.sPortal?.position.x === pos.x && this.sPortal?.position.y === pos.y) return true;

        let hasObject = false;
        
        this.snake.body.forEach(part => {
            if(part.position.x === pos.x && part.position.y === pos.y) {
                hasObject = true;
                return;
            }
        })
        this.portals.forEach(portal => {
            if(portal.position.x === pos.x && portal.position.y === pos.y) {
                hasObject = true;
                return;
            }
        })
        return hasObject;
    }
    this.showScore = () => {
        this.scoreCtx.clearRect(0, 0, this.scoreCanvas.width, this.scoreCanvas.height);

        this.scoreCtx.fillStyle = 'black';
        this.scoreCtx.font = "1.5em Arial";
        
        if(window.innerHeight <= 800) {
            this.scoreCtx.fillText(`${this.score}`, 10, this.scoreCanvas.height/2+10);
            this.scoreCtx.fillText(`${this.highscore}`, this.scoreCanvas.width/2+100, this.scoreCanvas.height/2+10);
        } else {
            this.scoreCtx.fillText(`${this.gameOver ? 'Final Score: ' : 'Current Score: '}${this.score}`, 10, this.scoreCanvas.height/2+10);
            this.scoreCtx.fillText(`HighScore: ${this.highscore}`, this.scoreCanvas.width/2+100, this.scoreCanvas.height/2+10);
        }
    }
    this.showGameOver = () => {
        this.ctx.fillStyle = 'black';

        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.font = "30px Arial";
        this.ctx.fillStyle = 'white';
        this.ctx.textAlign = 'center';
        if(this.canvas.width < 640) {
            this.ctx.fillText("Game Over", this.canvas.width/2, this.canvas.height/2);

        } else {
            this.ctx.fillText("Game Over, click to restart game", this.canvas.width/2, this.canvas.height/2);

        }
    }
    this.showSplashScreen = () => {
        this.ctx.fillStyle = 'black';

        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.font = "30px Arial";
        this.ctx.fillStyle = 'white';
        this.ctx.textAlign = 'center';
        if(isMobile){
            this.ctx.fillText("touch to start", this.canvas.width/2, this.canvas.height/2);
        } else {
            this.ctx.fillText("click here to start", this.canvas.width/2, this.canvas.height/2);
        }
    }
    this.createPortal = () => {
        const p = {
            sprite: this.portalRef,
            render: function(ctx){
                ctx.drawImage(this.sprite, 0, 0, 32, 32, this.position.x*32, this.position.y*32, 32, 32);
            },
            destroy: function(gameRef){
                gameRef.score += 10;
                gameRef.movePortal(this);
            }
        }
        this.movePortal(p);
        this.portals.push(p);
    }
    this.createSpecialPortal = () => {
        const p = {
            sprite: this.sPortalRef,
            render: function(ctx){
                ctx.drawImage(this.sprite, 0, 0, 32, 32, this.position.x*32, this.position.y*32, 32, 32);
            },
            destroy: function(gameRef){
                gameRef.score += 30;
                gameRef.special = null;
                gameRef.timer = setTimeout(() => {
                    gameRef.createSpecialPortal()
                }, 1000*20)
            }
        }
        this.movePortal(p);
        this.special = p;
    }
    this.portalUpdate = () => {
        if(this.portals.length < this.MAX_PORTALS){
            this.createPortal();
        } else {
            clearInterval(this.portalInterval);
        }
    }
    this.renderUpdate = () => {
        this.clearCanvas();
        
        if(!this.started) {
            this.showSplashScreen();
        }
        
        if(this.started && !this.gameOver){
            this.snake.render();
            this.portals.forEach(portal => portal.render(this.ctx));
            if(this?.special !== null) this.special.render(this.ctx);

        } else if(this.started && this.gameOver) {
            this.showGameOver();
        }
        
        if(this.snake.body.length === MAX_BODY){
            this.endGame();
        }
        
        this.showScore();
    }
    this.moveUpdate = () => {
        
        if(this.snake.head.direction !== '') this.snake.move();
    }
    this.imageOnLoad = () => {
        
        this.assetsloaded+=1;
        
        if(this.assetsloaded === ASSETSIZE) this.startGame();
    }
    this.loadAssets = () => {
        const head = new Image();
        head.src = './sprites/head.png';
        head.onload = this.imageOnLoad;
        this.headRef = head;

        const body = new Image();
        body.src = './sprites/body.png';
        body.onload = this.imageOnLoad;
        this.bodyRef = body;

        const portal = new Image();
        portal.src = './sprites/portal.png';
        portal.onload = this.imageOnLoad;
        this.portalRef = portal;

        const sPortal = new Image();
        sPortal.src = './sprites/sPortal.png';
        sPortal.onload = this.imageOnLoad;
        this.sPortalRef = sPortal;
    }
    this.clearCanvas = () => {
        this.ctx.clearRect(0, 0, WIDTH, HEIGHT);
    }
    this.isPortal = (head) => {
        if(this.special !== null){
            if(this.special.position.x === head.position.x && this.special.position.y === head.position.y){
                this.snake.addNewPart();
                
                this.special.destroy(this);
                return;
            }
        }
        
        this.portals.forEach((portal) => {
            if(portal.position.x === head.position.x && portal.position.y === head.position.y) {
                this.snake.addNewPart();
                
                portal.destroy(this);
                return;
            }
        })
    }
    this.handleKeyEvents = (e) => {
        const key = e.keyCode;
        if(this.KEYS.includes(key)){
            if(this.snake.head.direction === '') {
                this.portalInterval = setInterval(this.portalUpdate, 1000*30);
                this.timer = setTimeout(() => {
                    this.createSpecialPortal();
                }, 1000*20);
            }
            if(key === 87 || key === 38){
                const desiredPos = { x: this.snake.head.position.x, y: this.snake.head.position.y-1 };
                if(this.snake.body[0]?.position.x !== desiredPos.x && this.snake.body[0]?.position.y !== desiredPos.y){
                    this.snake.setDirection('up');
                }
            } else if(key === 65 || key === 37){
                const desiredPos = { x: this.snake.head.position.x-1, y: this.snake.head.position.y };
                if(this.snake.body[0]?.position.x !== desiredPos.x && this.snake.body[0]?.position.y !== desiredPos.y){
                    this.snake.setDirection('left');
                }
                
            } else if(key === 83 || key === 40){
                const desiredPos = { x: this.snake.head.position.x, y: this.snake.head.position.y+1 };
                if(this.snake.body[0]?.position.x !== desiredPos.x && this.snake.body[0]?.position.y !== desiredPos.y){
                    this.snake.setDirection('down');
                }
            } else {
                const desiredPos = { x: this.snake.head.position.x+1, y: this.snake.head.position.y };
                if(this.snake.body[0]?.position.x !== desiredPos.x && this.snake.body[0]?.position.y !== desiredPos.y){
                    this.snake.setDirection('right');
                }
            }
        }
    }
    this.resetGame = (highscore, gotchi) => {
        this.showGameOver();
        this.gotchi = gotchi;
        this.highscore = highscore;
    }
    this.restartGame = () => {
        this.score = 0;
        this.special = null;
        this.portals = [];
        this.createPortal();
        this.snake = new Snake(this.headRef, this.bodyRef, this.ctx, this);
        if (!this.music) this.loadMusic();
        this.music.currentTime = 0;
        this.music.play();
        this.moveInterval = setInterval(this.moveUpdate, this.MPS);
        this.canvas.removeEventListener('click', this.restartGame);
        window.addEventListener('keydown', this.handleKeyEvents);
        this.gameOver = false;
    }
    this.endGame = () => {
        clearInterval(this.moveInterval);
        clearInterval(this?.portalInterval);
        clearTimeout(this?.timer);
        if(this.score > this.highscore) {
            // Call highscore callback
            this.setHighscore(this.score, this.gotchi);
            this.highscore = this.score;
        }
        window.removeEventListener('keydown', this.handleKeyEvents);
        this.canvas.addEventListener('click', this.restartGame);
        this.gameOver = true;
        this.music?.pause();
    }
}
    
class Snake {
    //head and body references
    head = {};
    body = [];
    //constructor - defines the pieces of the snake and sets some references needed to function
    constructor(headRef, bodyRef, ctx, gameRef){
        //if even one reference is not present, an error is thrown
        if(!headRef || !bodyRef || !ctx || !gameRef) {
            throw new Error("references are missing");
        }
        this.headRef = headRef;
        this.bodyRef = bodyRef;
        this.ctx = ctx;
        this.gameRef = gameRef;
        //initialize the snake once constructed
        this.init();
    }
    init = function() {
        //PartCreator for making new pieces as we go
        this.partCreator = new PartCreator();
        //create the head and set the reference
        this.head = this.partCreator.createPart(this.headRef, { x: WIDTH/32/2, y: HEIGHT/32/2 }, '');
    }
    setDirection = function(direction){
        //when a movement key is pressed it calls this function to change the head direction
        this.head.direction = direction;
    }
    addNewPart = function(){
        /**
         * helper function to create new body parts
         * first we determine if there are any parts
         * then create a new one and push it onto the body
         */
        if(this.body.length === 0){
            //if this is the first body piece to add
            // position it according to the head
            let pos, dir;
            switch(this.head.direction){
                case 'up':
                    pos = { x: this.head.position.x, y: this.head.position.y+2 };
                    dir = 'up';
                    break;
                case 'left':
                    pos = { x: this.head.position.x+2, y: this.head.position.y };
                    dir = 'left';
                    break;
                case 'down':
                    pos = { x: this.head.position.x, y: this.head.position.y-2 };
                    dir = 'down';
                    break;
                case 'right':
                    pos = { x: this.head.position.x-2, y: this.head.position.y };
                    dir = 'right';
                    break;
                default:
                    break;
            }
            const part = this.partCreator.createPart(this.bodyRef, pos, dir);
            this.body.push(part);
        } else {
            //make a reference to the last part on the body
            //position the new piece at the back
            let tail = this.body[this.body.length-1];
            let pos, dir;
            switch(tail.direction){
                case 'up':
                    pos = { x: tail.position.x , y: tail.position.y+1 };
                    dir = 'up';
                    break;
                case 'left':
                    pos = { x: tail.position.x+1, y: tail.position.y };
                    dir = 'left';
                    break;
                case 'down':
                    pos = { x: tail.position.x , y: tail.position.y-1 };
                    dir = 'down';
                    break;
                case 'right':
                    pos = { x: tail.position.x-1 , y: tail.position.y };
                    dir = 'right';
                    break;
                default:
                    break;
            }
            const part = this.partCreator.createPart(this.bodyRef, pos, dir);
            this.body.push(part);
        }
    }
    willCollide = function(){
        //helper function
        //determines if the next position is colision or not
        let nextPos;
        switch(this.head.direction){
            case 'up':
                nextPos = { x: this.head.position.x, y: this.head.position.y-1 };
                break;
            case 'left':
                nextPos = { x: this.head.position.x-1, y: this.head.position.y };
                break;
            case 'down':
                nextPos = { x: this.head.position.x, y: this.head.position.y+1 };
                break;
            case 'right':
                nextPos = { x: this.head.position.x+1, y: this.head.position.y };
                break;
            default:
              break;
        }
        //will collide with wall this frame
        if(nextPos.x < 0 || nextPos.x >= (WIDTH/SPRITE_SIZE) || nextPos.y < 0 || nextPos.y >= (HEIGHT/SPRITE_SIZE)) return true;
        //will collide with body this frame
        let collided = false;
        this.body.forEach(part => {
            if(part.position.x === nextPos.x && part.position.y === nextPos.y) {
                collided = true;
                return;
            }
        })
        return collided;
    }
    move = function(){
        //check for collisions
        if(this.willCollide()){
            //end the game
            this.gameRef.endGame();
            return;
        }
        // move the head
        this.head.move();
        this.gameRef.isPortal(this.head);
        //move the body
        let prevDirection = this.head.direction;
        this.body.forEach(part => {
            part.move();
            [part.direction, prevDirection] = [prevDirection, part.direction];
        })
    }
    render = function(){
        //render the head
        this.head.render(this.ctx);
        //render the body
        this.body.forEach(part => part.render(this.ctx));
    }
}

class PartCreator {
    createPart = function(sprite, position, direction){
        //temporary part object
        const part = {};
        // object properties and functions
        part.sprite = sprite;
        part.position = position;
        part.direction = direction;
        //move speed
        part.moveSpeed = 1;
        //render function
        part.render = function(ctx){
            ctx.drawImage(this.sprite, 0, 0, 32, 32, this.position.x*32, this.position.y*32, 32, 32);
        }
        //moves the snake
        part.move = function(){
            switch(this.direction){
                case 'left':
                    this.position.x-=this.moveSpeed;
                    break;
                case 'right':
                    this.position.x+=this.moveSpeed;
                    break;
                case 'up':
                    this.position.y-=this.moveSpeed;
                    break;
                case 'down':
                    this.position.y+=this.moveSpeed;
                    break;
                default:
                    break;
            }
        }
        return part;
    }
}

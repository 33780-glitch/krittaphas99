//intro Canvas

/*const canvas = document.getElementById('board');
const context = board.getContext('2d');

//console.log(context);
/*Canvas จะต้องค่า x (width) และ ค่า y (height) เพื่อกำหนดตำแหน่งใน Canvas
.moveTo กำหนดจุดเริ่มต้นของเส้น
.lineTo กำหนดเส้นที่ลากจากจุดเริ่มต้นไปยังจุดสุดท้าย
.lineWidth กำหนดความหนาของเส้น
.strokeStyle กำหนดสี
.stroke() function กำหนดให้ทุกอย่างเปลี่ยนสี .strokeStyle
.beginPath() คำสั่งที่ใช้ในการขึ้น Path ใหม่
.closePath() คำสั่งจบการทำงานของ Path
.fillStyle กำหนดสีแรงเงา
.fill() ระบายสี
.fillRect(x,y,width,height)  function สร้างสามเหลี่ยม
.strokeRect(x,y,height)  function สามเหลี่ยมเริ่มต้นไม่มีสี
.fillText(message,x,y) function สร้างข้อความตามตำแหน่ง x ,y
.strokeText(message,x,y) สร้างข้อความตามตำแหน่ง x ,y เริ่มต้นไม่มีสี
.font = [normal][italic][normal | bold][ขนาด][ชื่อ Font]
.drawImage(รูปภาพที่ต้องการ ,x,y,width,height) function แสดงรูปภาพนั้นๆ  ตามตำแหน่ง


*/



//เริ่มสร้างเกม

//ตั้งค่าหน้าจอเกม

let board;
let boardWidth = 800;
let boardHeight = 300;
let context;

//ตั้งค่าตัวละครเกม
 let playerWidth = 85;
 let playerHeight = 85;
 let playerX = 50;
 let playerY = boardHeight - playerHeight;
 let playerImg;
 let player = {
    x:playerX,
    y:playerY,
    width: playerWidth,
    height: playerHeight
 }
 let gameOver = false;
 let score = 0;
 let time = 0;

 let lives = 3;

 let startTime = Date.now();
 const gameTime = 60;

 //สร้างอุปสรรค
 let boxImg;
 let boxWidth = 40;
 let boxHeight = 80;
 let boxX = 700;
 let boxY = boardHeight - boxHeight;

 // setting อุปสรรค
 let boxesArray = [];
 let boxSpeed =  -5;

 //gravity & velocity
 let velocityY = 0;
 let gravity = 0.25;
 let jumpCount = 8;
 let maxJump = 2;

 //เสียงกระโดด
 const jumpSound = new Audio("Anime Girl - Sound Effect (HD).mp3")
 jumpSound.volume = 1.0;

 // เสียงตาย
 const dieSound = new Audio("dead sfx.mp3");
 dieSound.volume = 0.6;

 console.log(player);

//การกำหนดเหตุการณ์เริ่มต้นเกม
 window.onload = function() {
    //Display
    board = document.getElementById('board');
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext('2d');
    const myImage = new Image();
    myImage.src = "main.png"
    myImage.onload = function () {
        context.drawImage(myImage,50,10,120,120);
}

    //player
    playerImg = new Image();
    playerImg.src = "main.png"
    playerImg.onload = function () {
        context.drawImage(playerImg,player.x,player.y,player.width,player.height);
    }

    //request animation frame
    requestAnimationFrame(update);

    //ดักจับการกระโดด
    document.addEventListener("keydown", movePlayer);

    //สร้าง box
    boxImg = new Image()
    boxImg.src = "a3.png"
    randomBoxSpawn();
}

//function Update
function update() {
    requestAnimationFrame(update); //Update Animation ตลอดเวลา

    if(gameOver) { //ตรวจสอบว่าเกม  Over รึเปล่า
        return;
    }

    context.clearRect(0,0,board.width ,board.height); //เคลียร์ภาพซ้อน
    velocityY += gravity;
    

    //creat play object
    player.y = Math.min(player.y + velocityY, playerY);
    if (player.y == player.y) {
        jumpCount = 0;
    }
    context.drawImage(playerImg,player.x,player.y,player.width,player.height)
    context.strokeStyle = "lightcyan";
    context.strokeRect(player.x, player.y, player.width, player.height);
    //creat Array Box
    for(let i = 0 ; i < boxesArray.length ; i++ ) {
        let box = boxesArray[i];
        box.x += boxSpeed;
        context.drawImage(box.img , box.x , box.y ,box.width , box.height);
        
        //ตรวจสอบเงื่อนไขการชนของอุปสรรค
        if(onCollision(player,box)) {

            // เล่นเสียงชน
            dieSound.currentTime = 0;
            dieSound.play();
            
            lives--;

            if (lives > 0) {

                //รีเซ็ตตำแหน่งผู้เล่น
                player.x = playerX;
                player.y = playerY;
                velocityY = 0;

                //ลบอุปสรรคที่อยู่บนจอ
                boxesArray = [];

                alert("ชนอุปสรรค!\nเหลือ " + lives + " ชีวิต ");

                return
            }

            //ชีวิตหมด
            gameOver = true;

            // เล่นเสียงตาย
            dieSound.currentTime = 0;
            dieSound.play();

            
            //แจ้งเตือ่นผู้เล่น
            context.font = "normal bold 40px Arial";
            context.textAlign  = "center";
            context.fillText("Game Over!",boardWidth/2 , boardHeight/2);
            context.font = "bold 30px Arail";
            context.fillText("Score : "+ (score+1) ,boardWidth/2 , 200);
            

            return;
        }
    }

    //นับคะแนน
        score++;
        context.font = "normal bold 20px Arial";
        context.textAlign  = "left";
        context.fillText("Score : " + score ,0 , 30);

    //จำนวนชีวิต3
        context.font ="bold 20px  Arial";
        context.textAlign = "left";
        context.fillText("Lives : " + lives, 0, 60);

    //นับเวลา
    time = (Date.now() - startTime) / 1000;
    context.font = "normal bold 20px Arial";
    context.textAlign = "right";
    context.fillText("Time : " + (time.toFixed(2)) , 765 , 30);
    
    //ครบเวลา60วินาที
    if(time >= gameTime) {
        gameOver =true;

        context.clearRect(0, 0, board.width, board.height);
 
        context.font = "bold 40px Arial";
        context.textAlign = "center";
        context.fillStyle = "black";
        context.fillText("Time Up!", boardWidth / 2, 110);

        context.font = "bold 30px Arial";
        context.fillText("Final Score : " + score, boardWidth / 2, 170);

        context.font = "22px Arial";
        context.fillText("เกมสิ้นสุดแล้ว", boardWidth /2, 220);

        return;
    }
}



//Function เคลื่อนตัวละคร
function movePlayer(e) {
    if(gameOver) {
        return;
    }

    if(e.code == "Space" && jumpCount < maxJump) {
        velocityY = -10;   
        jumpCount++;

        //เล่นเสียงกระโดด
        jumpSound.currentTime = 0;
        jumpSound.play();
    }
}

function creatBox() {
    if(gameOver) {
        return;
    }
    let box = {
        img:boxImg,
        x:boxX,
        y:boxY,
        width:boxWidth,
        height:boxHeight
    }

    boxesArray.push(box);

    if(boxesArray.length > 5) {
        boxesArray.shift();
    }
}

function randomBoxSpawn() {
    if(gameOver) return;

    creatBox();

    let randomTime = Math.floor(Math.random() *1000) + 500;

    setTimeout(randomBoxSpawn, randomTime);
}

function onCollision(obj1 , obj2) {
    return obj1.x < (obj2.x + obj2.width) &&
            (obj1.x + obj1.width) > obj2.x //ชนกันในแนวนอน
            &&
            obj1.y < (obj2.y + obj2.height) &&
            (obj1.y + obj1.height) > obj2.y //ชนกันในแนวตั้ง
}

//restart game
function restartGame() {
    location.reload();
}



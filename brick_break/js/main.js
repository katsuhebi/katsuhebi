let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

let x = canvas.width/2;
let y = canvas.height-30;
let dx = 2;
let dy = -2;
let ballRadius = 10;
let ballColor = '#0000ff'; // 最初のボールの色
let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width-paddleWidth)/2;
let rightPressed = false; //→が押されているかの識別
let leftPressed = false; //←が押されているかの識別
let brickRowCount = 4;
let brickColumnCount = 6;
let brickWidth = 66;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 20;
let brickOffsetLeft = 24;
let score = 0;
let brokenNum = 0;
let continuous = 0;
let lives = 3;
let scene = "active";
let waitsec = 5000;
let nowsec = 0;
let bricks = [];

for(let c=0; c<brickColumnCount; c++){
    bricks[c] = [];
    for(let r=0; r<brickRowCount; r++){
    bricks[c][r] = { x: 0, y: 0, status: 1}; // bricksのc列r行の要素のxプロパティに0, yプロパティに0を代入
    }
}


// キーボードのキーのどれかに対してkeydownイベントが発火したとき(どれかが押されたとき), keyDownHandler関数が実行
document.addEventListener("keydown", keyDownHandler, false); 
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("click", clickHandler, false);

// イベントオブジェクトeventは発生したイベントに関する様々な情報を提供するオブジェクトのこと
function keyDownHandler(e){
    if(e.key == "Right" || e.key == "ArrowRight"){
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft"){
        leftPressed = true;
    }
}

function keyUpHandler(e){
    if(e.key == "Right" || e.key == "ArrowRight"){
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft"){
        leftPressed = false;
    }
}

function mouseMoveHandler(e){
    let relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > paddleWidth/2 && relativeX  <canvas.width - paddleWidth/2 ){
        paddleX = relativeX-paddleWidth/2;
    }
}

function clickHandler(e){
    console.log("clicked")
    if(scene == "active"){
        return;
    }
    else if(scene == "pause"){
        scene = "active";
    }    
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2, false); //x座標, y座標, 半径, 開始角度, 終了角度（ラジアン）
    ctx.fillStyle = ballColor;
    ctx.strokeStyle = '#000000';
    ctx.fill();
    ctx.stroke();
    ctx.closePath(); 
}

function drawPaddle(){
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#f25000";
    ctx.fill();
    ctx.closePath();
}

function changeColor(){
    ballColor = '#';
    for(let i = 0; i < 6; i++) {
        ballColor += (16 * Math.random() | 0).toString(16);
    }
}

function drawBricks(){
    for(let c=0; c<brickColumnCount; c++){
        for(let r=0; r<brickRowCount; r++){
            if(bricks[c][r].status == 1){
                let brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                let brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                let brickColor = '#FF00' + (r*3).toString(16) + (c*3).toString(16);
                ctx.fillStyle = brickColor;
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function collisionDetection(){
    for(let c=0; c<brickColumnCount; c++){
        for(let r=0; r<brickRowCount; r++){
            let b = bricks[c][r];
            if(b.status == 1){
                if(x > b.x - ballRadius && x < b.x + brickWidth + ballRadius
                    && y > b.y - ballRadius && y < b.y + brickHeight + ballRadius){
                        dy = -dy;
                        b.status = 0;
                        brokenNum += 1;
                        continuous += 1;
                        score += continuous;
                        changeColor();

                        if(brokenNum == brickRowCount*brickColumnCount){
                            alert('YOU WIN, CONGRATULATIONS!\nscore: ' + score);
                            document.location.reload();
                        }
                }
            }
        }
    }
}

function drawScore(){
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 15);
}

function drawLives(){
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: " + lives, canvas.width-65, 15);
}

function pause(){
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.font = "100px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Ready?", 80, 130);
    ctx.fillText("  click!", 80, 230);
    console.log("pause")
    if(scene=="active"){
        requestAnimationFrame(draw);
        }    
        else if(scene == "pause"){
            requestAnimationFrame(pause);
        }

}

function draw() {
    //描画コード
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();
    drawScore();
    drawLives();

    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
       changeColor();
    }

    if(y + dy < ballRadius) {
        dy = -dy;
        changeColor();
    }
    else if(y + dy > canvas.height-ballRadius-paddleHeight && x > paddleX && x < paddleX + paddleWidth){
            let dv2 = (1 + lives / 100) * (dx * dx + dy * dy);
            let dv = Math.sqrt(dv2);
            let moto = dx/dv + 0.2 * (x-paddleX-paddleWidth/2)/paddleWidth;
            console.log(dx);
            if(moto < 1 && moto > -1){
            let theta = Math.acos(moto);
            dx = dv*Math.cos(theta);
            dy = -dv*Math.sin(theta);
            }
            console.log(dx);
            changeColor();
            dy = dy - 0.05;
    }
    else if(y + dy > canvas.height-ballRadius){
        lives--; //livesから1を引く
            if(!lives){ // livesがないならば
                alert("GAME OVER");
                document.location.reload();
                //clearInterval(drawinterval) //Needed for Chrome to end game
            }  
            else{
                continuous = 0;
                x = canvas.width/2;
                y = canvas.height-30;
                scene = "pause";
                nowsec = 0;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width-paddleWidth)/2;
            }
        }
        

    x += dx;
    y += dy;

    if(rightPressed && paddleX < canvas.width - paddleWidth ){
        paddleX += 7;
    }

    if(leftPressed && paddleX > 0){
        paddleX -= 7;
    }
    if(scene=="active"){
    requestAnimationFrame(draw);
    }

    else if(scene == "pause"){
        pause();
    }

}

draw();


console.log(16 ** 6 + '色に輝くボール');

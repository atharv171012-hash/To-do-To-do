const startBtn =
document.getElementById("startBtn");

const homeScreen =
document.getElementById("homeScreen");

const canvas =
document.getElementById("gameCanvas");

const ctx =
canvas.getContext("2d");

let leaderboard =
JSON.parse(
localStorage.getItem("leaderboard")
) || [];

function updateLeaderboard(){

    const board =
    document.getElementById("leaderboard");

    board.innerHTML = "";

    leaderboard
    .sort((a,b)=>a.time-b.time)
    .slice(0,10)
    .forEach((player,index)=>{

        const row =
        document.createElement("div");

        row.className =
        "leader-row";

        row.innerHTML =
        `
        <span>#${index+1}</span>
        <span>${player.name}</span>
        <span>${player.time.toFixed(3)}</span>
        `;

        board.appendChild(row);

    });

}

updateLeaderboard();

startBtn.addEventListener("click",()=>{

    homeScreen.style.display =
    "none";

    canvas.style.display =
    "block";

    startGame();

});

const car = {
    x:600,
    y:400,
    angle:-Math.PI/2,
    speed:0
};

const keys = {};

document.addEventListener(
"keydown",
e=>keys[e.key.toLowerCase()]=true
);

document.addEventListener(
"keyup",
e=>keys[e.key.toLowerCase()]=false
);

let lapStart;

function startGame(){

    lapStart =
    performance.now();

    loop();

}

function update(){

    if(keys["w"])
        car.speed += 0.2;

    if(keys["s"])
        car.speed -= 0.15;

    if(keys["a"])
        car.angle -= 0.05;

    if(keys["d"])
        car.angle += 0.05;

    car.speed *= 0.99;

    car.x +=
    Math.cos(car.angle)
    * car.speed;

    car.y +=
    Math.sin(car.angle)
    * car.speed;
}

function drawTrack(){

    ctx.strokeStyle =
    "#555";

    ctx.lineWidth = 100;

    ctx.beginPath();

    ctx.moveTo(200,200);
    ctx.lineTo(1000,200);
    ctx.lineTo(1000,600);
    ctx.lineTo(200,600);

    ctx.closePath();

    ctx.stroke();

}

function drawCar(){

    ctx.save();

    ctx.translate(
        car.x,
        car.y
    );

    ctx.rotate(
        car.angle
    );

    ctx.fillStyle =
    "red";

    ctx.fillRect(
        -10,
        -20,
        20,
        40
    );

    ctx.restore();
}

function drawTimer(){

    const t =
    (
        performance.now()
        - lapStart
    ) / 1000;

    ctx.fillStyle =
    "white";

    ctx.font =
    "30px Arial";

    ctx.fillText(
        t.toFixed(3),
        20,
        40
    );
}

function loop(){

    update();

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    drawTrack();
    drawCar();
    drawTimer();

    requestAnimationFrame(
        loop
    );
}

const canvas =
document.getElementById("game");

const ctx =
canvas.getContext("2d");

canvas.width =
window.innerWidth;

canvas.height =
window.innerHeight;

const menu =
document.getElementById("menu");

const startBtn =
document.getElementById("startBtn");

const leaderboardDiv =
document.getElementById("leaderboard");

let leaderboard =
JSON.parse(
localStorage.getItem("f1times")
) || [];

function drawLeaderboard(){

    leaderboardDiv.innerHTML="";

    leaderboard
    .sort((a,b)=>a.time-b.time)
    .slice(0,10)
    .forEach((entry,index)=>{

        const row =
        document.createElement("div");

        row.className="row";

        row.innerHTML=
        `
        <span>#${index+1}</span>
        <span>${entry.name}</span>
        <span>${entry.time.toFixed(3)}</span>
        `;

        leaderboardDiv.appendChild(row);
    });
}

drawLeaderboard();

const car = {

    x:0,
    y:0,

    angle:0,

    speed:0,

    maxSpeed:18,

    accel:0.18,

    turnSpeed:0.05
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

startBtn.onclick=()=>{

    menu.style.display="none";

    canvas.style.display="block";

    lapStart=
    performance.now();

    loop();
};

let lapStart =
performance.now();

const track = [

[-1200,-800],
[1200,-800],
[1800,-300],
[2000,600],
[1200,1200],
[-1200,1200],
[-1800,600],
[-2000,-300]

];

function update(){

    if(keys["w"])
        car.speed += car.accel;

    if(keys["s"])
        car.speed -= 0.2;

    car.speed *= 0.992;

    if(car.speed > car.maxSpeed)
        car.speed =
        car.maxSpeed;

    if(keys["a"])
        car.angle -=
        car.turnSpeed;

    if(keys["d"])
        car.angle +=
        car.turnSpeed;

    car.x +=
    Math.cos(car.angle)
    * car.speed;

    car.y +=
    Math.sin(car.angle)
    * car.speed;
}

function drawTrack(){

    ctx.strokeStyle="#555";
    ctx.lineWidth=180;

    ctx.beginPath();

    ctx.moveTo(
        track[0][0],
        track[0][1]
    );

    track.forEach(p=>{

        ctx.lineTo(
            p[0],
            p[1]
        );
    });

    ctx.closePath();

    ctx.stroke();

    ctx.strokeStyle="white";
    ctx.lineWidth=4;

    ctx.stroke();
}

function drawCar(){

    ctx.fillStyle="red";

    ctx.fillRect(
        -10,
        -20,
        20,
        40
    );

    ctx.fillStyle="black";

    ctx.fillRect(
        -18,
        -15,
        36,
        4
    );

    ctx.fillRect(
        -15,
        12,
        30,
        4
    );
}

function drawHUD(){

    const lapTime =
    (
        performance.now()
        - lapStart
    ) / 1000;

    ctx.setTransform(
        1,0,0,1,0,0
    );

    ctx.fillStyle="white";

    ctx.font=
    "30px Arial";

    ctx.fillText(
        "TIME: "
        + lapTime.toFixed(3),
        25,
        45
    );

    ctx.fillText(
        "KM/H: "
        + Math.round(car.speed*20),
        25,
        85
    );
}

function render(){

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.save();

    ctx.translate(
        canvas.width/2,
        canvas.height/2
    );

    ctx.rotate(
        -car.angle
        + Math.PI/2
    );

    ctx.translate(
        -car.x,
        -car.y
    );

    drawTrack();

    ctx.translate(
        car.x,
        car.y
    );

    ctx.rotate(
        car.angle
        - Math.PI/2
    );

    drawCar();

    ctx.restore();

    drawHUD();
}

function loop(){

    update();

    render();

    requestAnimationFrame(
        loop
    );
}

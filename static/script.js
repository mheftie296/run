let canvas
let ctx
let fps = 30

let x = 0
let y = 0
let realx = 0
let fov = 90
let platforms
let map
let started = false
let speed = 0.0
let grounded = true
let progress = 1.2
let momentum = 0
let score = 0
let failed = false

let keysdown = []

// game loop
function tick(){
    update()
    draw()
}

function start(){
    map = []
    platforms = [5,5,5,5,5,5,5,5]
    for (let index = 0; index < 1000; index++) {
        platforms.push(Math.floor(Math.random()*4 +1))
    }
    failed = false
    x = 0
    speed = 0.0
    progress = 1.2
    started = false
    for (let index = 0; index < platforms.length; index++) {
        if(platforms[index] >= 1 && platforms[index] <= 4){
            let q = platforms[index]
            q--
            map.push(["#11a", [q-2,index*4,-1.2], [q-1,index*4,-1.2], [q-1,index*4+4.2,-1.2], [q-2,index*4+4.2,-1.2]])
            map.push(["#117", [q-2,index*4,-2.2], [q-1,index*4,-2.2], [q-1,index*4,-1.2], [q-2,index*4,-1.2]])
            map.push(["#114", [q-2,index*4,-2.2], [q-2,index*4,-1.2], [q-2,index*4+4.2,-1.2], [q-2,index*4+4.2,-2.2]])
            map.push(["#114", [q-1,index*4,-2.2], [q-1,index*4,-1.2], [q-1,index*4+4.2,-1.2], [q-1,index*4+4.2,-2.2]])
        }
        if(platforms[index] == 5){
            map.push(["#11a", [-2,index*4,-1.2], [2,index*4,-1.2], [2,index*4+4.2,-1.2], [-2,index*4+4.2,-1.2]])
        }
        if(platforms[index] == 6){
            map.push(["#11a", [-2,index*4,-1.2], [2,index*4,-1.2], [0,3000,-1.2], [0,3000,-1.2]])
        }
    }
    map.reverse()
}

function drawPoly(points){
    ctx.beginPath()
    ctx.fillStyle = points[0]
    ctx.moveTo(points[1][0] + 200, points[1][1] + 120)
    for (let index = 2; index < points.length; index++) {
        ctx.lineTo(points[index][0] + 200, points[index][1] + 120)
    }
    ctx.fill()
}

function draw3d(poly){
    let dpoly = []
    dpoly.push(poly[0])
    for (const point of poly) {
        let aX = Math.tan(Math.atan((point[0]-realx)/(point[1]))) * 400
        let aY = Math.tan(Math.atan((point[2])/(point[1]))) * 400
        dpoly.push([-aX,-aY])
    }
    drawPoly(dpoly)
}

function update(){
    if(started && speed < 0.1){
        speed += 0.005
    }
    for (const element of map) {
        for (let j = 1; j < element.length; j++) {
            if(element[j][1] > 1){
                element[j][1] -= speed*3
            }
        }
    }
    progress += speed*3/4
    if(keysdown.includes("ArrowLeft")){
        x += speed
    }
    if(keysdown.includes("ArrowRight")){
        x -= speed
    }
    if(keysdown.includes("KeyA")){
        x += speed
    }
    if(keysdown.includes("KeyD")){
        x -= speed
    }
    if(keysdown.includes("Space")){
        if(!started){
            started = true
        } else if(y == 0 && grounded) {
            momentum = 1
        }
        if(failed){
            start()
        }
    }
    grounded = true
    realx = (x + realx * 4)/5
    if(Math.abs(realx) > 2.12){
        grounded=false
    }
    if(platforms[Math.floor(progress)] < 5){
        if(![platforms[Math.floor(progress+0.15)],platforms[Math.floor(progress-0.1)]].includes(Math.floor(realx+3.15))){
            if(![platforms[Math.floor(progress+0.15)],platforms[Math.floor(progress-0.1)]].includes(Math.floor(realx+2.85))){
                grounded=false
            }
        }
    }
    y += momentum
    momentum -= 0.1
    if(!grounded && y <= 0){
        started = false
        speed = 0
        x = realx
    }
    if(y <= 0 && grounded){
        momentum = 0
        y = 0
    }
    if(y < -100 && !failed){
        failed = true
    }
    score = Math.floor((progress-1.2)*153)
}

function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "purple"
    ctx.font = "12px Courier New"
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
    ctx.fillText(" Score: " + score.toString().padStart(6, "0"), 0, 15)
    for (const poly of map.slice(3500-Math.floor(progress*4), 4050-Math.floor(progress*4))) {
        draw3d(poly)
    }
    if(grounded){
        drawPoly(["#114", [9-y,90+y/2], [11-y,100-y/2], [-11+y,100-y/2], [-9+y,90+y/2]])
        drawPoly(["#111", [8-y,91+y/2], [10-y,99-y/2], [-10+y,99-y/2], [-8+y,91+y/2]])
    }
    drawPoly(["#555", [10,84-y*7], [10,94-y*7], [-10,94-y*7],[-10,84-y*7], [-8,78-y*7], [8,78-y*7]])
    drawPoly(["gray", [10,84-y*7],[-10,84-y*7], [-8,78-y*7], [8,78-y*7]])
    if(Math.floor(progress*3) % 2 == 0){
        drawPoly(["#444", [8,94-y*7], [8,98-y*7], [3,98-y*7], [3,94-y*7]])
        drawPoly(["#444", [-8,94-y*7], [-8,96-y*7], [-3,96-y*7], [-3,94-y*7]])
    } else{
        drawPoly(["#444", [8,94-y*7], [8,96-y*7], [3,96-y*7], [3,94-y*7]])
        drawPoly(["#444", [-8,94-y*7], [-8,98-y*7], [-3,98-y*7], [-3,94-y*7]])
    }
    if(failed){
        drawPoly(["white", [92,-32], [92,28], [-92,28], [-92,-32]])
        drawPoly(["black", [90,-30], [90,26], [-90,26], [-90,-30]])
        ctx.fillStyle = "purple"
        ctx.font = "12px Courier New"
        ctx.fillText("Better luck next time", 120, 107)
        ctx.fillText("Score: " + score.toString().padStart(6, "0"), 120, 122)
        ctx.fillText("Press Space to restart", 120, 137)
    }
}

function keydown(event){
    if(!keysdown.includes(event.code)){
        keysdown.push(event.code)
    }
}
function keyup(event){
    let index = keysdown.indexOf(event.code)
    keysdown.splice(index,1)
}

function setup(){
    window.addEventListener("keydown", keydown)
    window.addEventListener("keyup", keyup)
    canvas = document.getElementById('canvas')
    ctx = canvas.getContext('2d')
    const SCALING_FACTOR = Math.min(window.innerWidth/canvas.width * 0.9, window.innerHeight/canvas.height * 0.9)
    // Scaling the canvas https://stackoverflow.com/questions/62032797/how-do-i-make-a-canvas-html-picture-bigger-without-losing-resolution
    ctx.canvas.width = SCALING_FACTOR * canvas.width
    ctx.canvas.height = SCALING_FACTOR * canvas.height
    ctx.scale(SCALING_FACTOR, SCALING_FACTOR)
}

setup()
start()

setInterval(tick, (1000.0/fps))
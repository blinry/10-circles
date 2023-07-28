let sin = Math.sin
let cos = Math.cos
let tan = Math.tan
let asin = Math.asin
let acos = Math.acos
let atan = Math.atan
let abs = Math.abs
let floor = Math.floor
let ceil = Math.ceil
let sqrt = Math.sqrt
let random = Math.random
let max = Math.max
let min = Math.min
let exp = Math.exp
let pow = Math.pow
let PI = Math.PI

//BLACK = "#1a1c2c"
//BLACK = "#001"

WHITE = "#e7e7de" // travesol
//WHITE = "#fbf8be" // pale yellow
//WHITE = "#fbeaeb" // pink
//WHITE = "#f5f5d9" // beige
//WHITE = "#fff"

//WHITE = BLACK // (-:

canvas = document.getElementById("canvas")
ctx = canvas.getContext("2d")

tempCanvas = document.createElement("canvas")
tempCtx = tempCanvas.getContext("2d")

n = 10 // number of circles
CANVAS_WIDTH = 1920 // width of canvas
CANVAS_HEIGHT = 1080

// hook n slider to n
/*
n_slider = document.getElementById("slider")
n_slider.value = n
n_slider.oninput = function () {
    n = this.value
    document.getElementById("n").innerHTML = n
}
*/

// adapt canvas to w
canvas.width = CANVAS_WIDTH
canvas.height = CANVAS_HEIGHT

tempCanvas.width = CANVAS_WIDTH
tempCanvas.height = CANVAS_HEIGHT

var brightImg
async function setupTextures() {
    // new canvas for bright texture
    brightCanvas = document.createElement("canvas")
    brightCtx = brightCanvas.getContext("2d")
    brightCanvas.width = CANVAS_WIDTH
    brightCanvas.height = CANVAS_HEIGHT
    // load white.jpg into HTMLImageElement
    brightImg = new Image()
    brightImg.src = "bright.jpg"
    await brightImg.onload

    // new canvas for dark texture
    darkCanvas = document.createElement("canvas")
    darkCtx = darkCanvas.getContext("2d")
    darkCanvas.width = CANVAS_WIDTH
    darkCanvas.height = CANVAS_HEIGHT
    // load black.jpg from file and draw it on darkCanvas
    darkImg = new Image()
    darkImg.src = "dark.jpg"
    darkImg.onload = function () {
        darkCtx.drawImage(darkImg, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    }
}

function appear(i, f, t) {
    x = (f - 0.5) * 1.5
    y = 0
    r = min(pow(t, 1.5) * 1.5 - 0.1 - f, 0.07)
    //r = min(t * 1.7 - 0.2 - f, 0.05)
    return [x, y, r]
}

function heart(i, f, t, speed) {
    whiteBG(i, f, t)
    //ang = f * 2 * PI + t * 3
    //rad = 0.3
    //x = sin(ang) * rad * 1.5
    //y = cos(ang) * rad - abs(x)
    //y *= 0.8

    p = (f + t * ((speed || t) * 5)) % 1
    hsw = 0.5 // heart-square-width

    x = 0
    y = 0

    dx = 0.2
    dy = 0.04
    rad = 0.28
    if (p < 0.3333) {
        pp = p / 0.3333
        ang = -(PI * pp - (1 / 4) * PI)
        x = cos(ang) * rad + dx
        y = sin(ang) * rad - dy
    } else if (p > 0.33333 && p < 0.66666) {
        pp = p / 0.3333
        ang = -(PI * pp - (3 / 4) * PI)
        x = cos(ang) * rad - dx
        y = sin(ang) * rad - dy
    } else if (p > 0.66666 && p < 0.666666 + 0.33333 / 2) {
        pp = (p - (0.6666 + 0.33333 / 2)) / (0.33333 / 2)
        x = pp / 2.5
        y = pp / 3 + 0.5
    } else {
        pp = (p - (0.6666 + 0.33333 / 2)) / (0.33333 / 2)
        x = pp / 2.5
        y = -pp / 3 + 0.5
    }

    r = 0.08
    return [x, y - 0.08, r]
}

function heartdissolve(i, f, t) {
    whiteBG(i, f, t)
    ;[x, y, r] = heart(i, f, t, 1)
    return [x, y, r * (1 + 40 * pow(t, 4))]
}

function grid(i, f, t) {
    edge = ceil(sqrt(n))
    angle = i // radians
    r = 1 / (edge - 1)
    ox = cos(angle) * sin(5 * t * 2 * PI + i) * 0.4 * r
    oy = sin(angle) * sin(5 * t * 2 * PI + i) * 0.4 * r
    return [
        0.7 * ((floor(i / edge) / (edge - 1)) * 2 - 1) + ox,
        0.7 * (((i % edge) / (edge - 1)) * 2 - 1) + oy,
        0.7 * r,
    ]
}

function solarsystem(i, f, t) {
    // 0.1 to 1.5
    //z = 0.1 + (cos(t * 2 * PI) / 2 + 0.5) * 1.4
    z = 2 - 2.2 * t
    sunradius = 0.2
    if (i == 0) {
        return [0, 0, sunradius * z]
    } else if (i < 10) {
        planets = [
            {
                name: "Mercury",
                orbital_period: 0.2408,
                diameter: 0.383,
                avg_distance: 57,
            },
            {
                name: "Venus",
                orbital_period: 0.615,
                diameter: 0.949,
                avg_distance: 108,
            },
            {
                name: "Earth",
                orbital_period: 1,
                diameter: 1,
                avg_distance: 150,
            },
            {
                name: "Mars",
                orbital_period: 1.88,
                diameter: 0.532,
                avg_distance: 228,
            },
            {
                name: "Jupiter",
                orbital_period: 11.86,
                diameter: 11.209,
                avg_distance: 779,
            },
            {
                name: "Saturn",
                orbital_period: 29.46,
                diameter: 9.449,
                avg_distance: 1430,
            },
            {
                name: "Uranus",
                orbital_period: 84.02,
                diameter: 4.007,
                avg_distance: 2880,
            },
            {
                name: "Neptune",
                orbital_period: 164.8,
                diameter: 3.883,
                avg_distance: 4500,
            },
            {
                name: "Pluto",
                orbital_period: 247.1,
                diameter: 0.186,
                avg_distance: 5910,
            },
        ]

        planet = planets[i - 1]

        tt = t * PI * 2
        r = planet.diameter / 2 / 30
        d = sunradius + planet.avg_distance / 500
        x = d * sin(tt / planet.orbital_period + i)
        y = 0.3 * d * cos(tt / planet.orbital_period + i)
        return [x * z, y * z, r * z]
    } else {
        return [0, 0, 0.000001]
    }
}

function spinner(i, f, t) {
    r = 0.5
    return [
        r * sin(f * PI * 2 + t * 2 * PI),
        r * cos(f * PI * 2 + t * 2 * PI),
        0.05 + 0.4 * (sin(f * PI * 2 + 2 * t * 2 * PI) / 2 + 0.5),
    ]
}

// milky way from the side pattern
function donut(i, f, t) {
    r = 0.5
    return [
        r * sin(f * PI * 2 + t * 2 * PI),
        0,
        0.04 + 0.4 * (sin(f * PI * 2 + t * 2 * PI + PI / 2) / 2 + 0.5),
    ]
}

function worm(i, f, t) {
    w = 0.8
    return [
        w * (f - 0.5) * 1.8,
        sin(3 * t * 2 * PI + f * 5) * 0.2,
        0.05 + 0.14 * (sin(2 * t * 2 * PI + f * 5) + 1),
    ]
}

function tunnelgood(i, f, t) {
    tt = t
    rad = 0.4 * (0.5 + 2 * tt)
    //wa = (1 - f) * (cos(t * 2 * PI) / 2 + 0.5) // wobble amount
    oy = rad * f * 0.5 * cos(tt * 2 * PI * 2)
    //oy = -(1 - f) * 0.5 * abs(sin(t * 5 * 2 * PI))
    ox = rad * (5 / 6) * f * sin(tt * 2 * PI * 2)
    return [ox, oy, f * (1 + 2 * tt) * rad]
}

function orb(i, f, t) {
    if (i == 0) {
        return [0, 0, 0.3]
    } else {
        x = 0
        y = 0
        r = 0.3 + 0.2 * (sin(t * 2 * PI * (0.5 + f * 2) + i) / 2 + 0.5)
        return [x, y, r]
    }
}

function spirograph(i, f, t) {
    let r = 0.5
    let x = 0
    let y = 0
    let rFac = 0.4
    let a = 0

    let ttt
    if (i === 2) {
        ttt = t * 2 * PI - (i - 2)
    } else if (i >= 3) {
        ff = 5
        ttt = Math.floor((t * 2 * PI - (i - 3) / ff) * ff) / ff
    } else {
        ttt = t * 2 * PI
    }

    for (let j = 0; j < i; j++) {
        if (j == 0) {
            a += ttt
        } else {
            a -= 2 * ttt
        }
        if (j == 1) {
            rFac = 0.2
        }
        x += r * (1 - rFac) * cos(a)
        y += r * (1 - rFac) * sin(a)
        r *= rFac
        if (j == 1 && i >= 2) {
            r *= 0.3
            if (i >= 3) {
                //r *= 1 / (i - 2)
            }
            return [x, y, r]
        }
    }
    return [x, y, r]
}

function spirograph2(i, f, t) {
    let r = 0.8
    let x = 0
    let y = 0
    let rFac = 0.6
    let a = 0
    for (let j = 0; j < i; j++) {
        a += t * 2 * PI
        x += r * (1 - rFac) * cos(a)
        y += r * (1 - rFac) * sin(a)
        r *= rFac
    }
    return [x, y, r]
}

function tunnel2(i, f, t) {
    s = 5
    r = 1.5 * pow((i / (n - 1) + (t * 2 * PI) / s) % 1, 4)
    x = 0.5 * sin((t * 2 * PI) / 2) * (1.5 - r)
    y = 0
    return [x, y, r]
}

function tunnel(i, f, t) {
    s = 5
    if (i == 0) {
        if (
            (t * 2 * PI) % (2 * (n / (n - 1)) * (s / n)) <
            ((s / n) * n) / (n - 1)
        ) {
            return [0, 0, 1.5]
        } else {
            return [0, -3, 1.5]
        }
    } else {
        r = 1.5 * pow((i / (n - 1) + (t * 2 * PI) / s) % 1, 4)
        x = 0.5 * sin((t * 3.9 * PI) / 2) * (1.5 - r)
        y = 0
        return [x, y, r]
    }
}

let delta = 0.05
function trg(x) {
    return 1 - (2 * acos((1 - delta) * sin(2 * PI * x))) / PI
}
function sqr(x) {
    return (2 * atan(sin(2 * PI * x) / delta)) / PI
}
function swt(x) {
    return (1 + trg((2 * x - 1) / 4) * sqr(x / 2)) / 2
}

function thesquare(i, f, t, offset) {
    if (i == 0 && t < 1 - fadeDuration / phaseLength) {
        rectsize = max(
            (CANVAS_HEIGHT / 2) *
                5 *
                pow(
                    max(0, t + offset - 0.1) +
                        0.01 * max(0, t - 0.81) * CANVAS_HEIGHT,
                    5
                ),
            0
        )
        tempCtx.beginPath()
        tempCtx.rect(
            CANVAS_WIDTH / 2 - rectsize / 2,
            CANVAS_HEIGHT / 2 - rectsize / 2,
            rectsize,
            rectsize
        )
        tempCtx.fill()
    }
}

function loadingsquare(i, f, t) {
    thesquare(i, f, t, 0)
    r = 0.3
    //rad = 0.08 + ((f - t * PI - 2) % 1) * 0.1
    //rad = 0.02 + f * 0.05 + 0.01 * ((10 * t) % 1)
    rad = -0.02 + 0.1 * swt(-(3 * t + f))
    ang = (f + 1 * t) * PI * 2
    return [r * sin(ang), r * cos(ang), rad]
}

function loading(i, f, t) {
    r = 0.3
    //rad = 0.08 + ((f - t * PI - 2) % 1) * 0.1
    //rad = 0.02 + f * 0.05 + 0.01 * ((10 * t) % 1)
    rad = -0.02 + 0.1 * swt(-(3 * t + f))
    ang = (f + 1 * t) * PI * 2
    return [r * sin(ang), r * cos(ang), rad]
}

function dotdotdot(i, f, t) {
    tt = t * 5 - 9234
    x = ((tt + 0.5 + f * 2.2) % 2.2) + 1.1
    y = 0
    r = 0.08
    return [x, y, r]
}

function dotdotdot2(i, f, t) {
    tt = (t + 0.25) * 5
    x = tan(tt + f / 4) * 0.1 + (f - 0.5) * 1.5
    y = 0
    r = 0.05
    return [x, y, r]
}

function infinity(i, f, t) {
    fac = 0.4
    tt = t
    ff = f * 2.3
    y = cos(2 * (tt + ff) * PI * 2 + PI / 2) * fac
    x = 2 * sin(1 * (tt + ff) * PI * 2) * fac
    r = 0.099
    return [x, y, r]
}

function lines(i, f, t) {
    rad = 5
    // travel 1 band in 1 time unit
    x = (f - 0.5 - ((t + 0.4) % 0.2)) * 2.2 + rad + 0.2
    y = 0
    r = rad
    return [x, y, r]
}

function lines2(i, f, t) {
    rad = 10
    x = f * 2.2 + (rad - 1.1) + sin(t * 2 * PI * 3) * 0.1
    y = 0
    r = rad
    return [x, y, r]
}

function rings(i, f, t) {
    j = i % (n / 2)
    jj = i % 2
    angle = (j * PI * 2) / (n / 2)
    rad = 0.4 + 0.5 * sin(t * 2 * PI * 2 + angle)
    x = rad * cos(angle)
    y = rad * sin(angle)
    r = 0.3 + jj * 0.05
    return [x, y, r]
}

function square(i, f, t) {
    if (i == 0) {
        rectsize = max(
            (CANVAS_HEIGHT / 2) * t - max(0, t - 0.8) * 10 * CANVAS_HEIGHT,
            0
        )
        tempCtx.beginPath()
        tempCtx.rect(
            CANVAS_WIDTH / 2 - rectsize / 2,
            CANVAS_HEIGHT / 2 - rectsize / 2,
            rectsize,
            rectsize
        )
        tempCtx.fill()
    }
    ang = t * 2 * PI + f * 2 * PI
    rad = 0.5 * t + t * sin(t * 100 + f * 502.234) * 0.2 + 0.05
    x = rad * cos(ang)
    y = rad * sin(ang)
    r = 0.1 * t + 0.01
    return [x, y, r]
}

function title(i, f, t) {
    if (i == 0) {
        //ctx.fillStyle = "white"
        tempCtx.font = "bold 290px Jost"
        tempCtx.textAlign = "center"
        tempCtx.textBaseline = "middle"
        //tempCtx.globalAlpha = min(1, 1 - abs((t - 0.72) / (1 - 0.72) - 0.5) * 2)
        tempCtx.globalAlpha = max(0, sin(t * 1.2 * PI))
        //tempCtx.fillColor = WHITE
        tempCtx.fillText(
            "1       IR   LE  ",
            CANVAS_WIDTH / 2,
            CANVAS_HEIGHT * 0.53
        )
        tempCtx.globalAlpha = 1
    }
    h = 0.11
    zeroX = -0.68
    c1X = -0.27
    c2X = 0.28
    sX = 0.81
    sAngle = (PI / 2) * 0.8 + PI
    sFac = 0.666
    letters = [
        [zeroX, 0, h],
        [zeroX, 0, h * 0.5],
        [c1X, 0, h],
        [c1X + h * 0.333, 0, h * 0.666],

        [c2X, 0, h],
        [c2X + h * 0.333, 0, h * 0.666],

        [sX, -h / 2, h / 2],
        [sX, h / 2, h / 2],
        [
            sX + (h / 2) * (1 - sFac) * cos(sAngle),
            h / 2 + (h / 2) * (1 - sFac) * sin(sAngle),
            (h / 2) * sFac,
        ],
        [
            sX + (h / 2) * (1 - sFac) * cos(sAngle + PI),
            -h / 2 + (h / 2) * (1 - sFac) * sin(sAngle + PI),
            (h / 2) * sFac,
        ],
    ]
    ;[x, y, r] = letters[i] || [0, 0, 0]
    randAmount = 0.02 * sin((t * PI) / 2)
    return [
        x + randAmount * (Math.random() - 0.5),
        y + randAmount * (Math.random() - 0.5),
        r,
    ]
}

function title2(i, f, t) {
    // draw text in center: "CIRCLES"
    if (i == 0) {
        //ctx.fillStyle = "white"
        ctx.font = "bold 150px Arial"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText("10 CIRCLES", CANVAS_WIDTH / 2, CANVAS_WIDTH * 0.51)
    }
    x = 1.2 * ((f % 0.5) * 2 - 0.5)
    y =
        1.1 * (floor(f * 2) / 2 - 0.25) +
        sin(t * 2 * PI * 10 * (1 + ((234 + i * i * 13) % 2)) + f * i * i) * 0.01
    r = 0.1
    return [x, y, r]
}

function moiree(i, f, t) {
    //x1 = 0.5 * sin(t * 2 * PI)
    //y1 = -0.5

    //x2 = 0.5
    //y2 = 0.25 + 0.25 * cos(t * 2 * PI * 5)
    amount = 0.05
    speed = 5
    x1 = t * 10 * amount * sin(speed * t * 2 * PI)
    y1 = 0

    x2 = -amount * sin(1 + speed * 1.3 * t * 2 * PI)
    y2 = t * 0.2 * cos(1 + speed * 1.3 * t * 2 * PI)

    rad = 1
    if (f < 0.5) {
        r = f * rad
        return [x1, y1, r]
    } else {
        r = (f - 0.5) * rad
        return [x2, y2, r]
    }
}

function rand(i, f, t) {
    x = (Math.random() - 0.5) * 2
    y = (Math.random() - 0.5) * 2
    r = (Math.random() - 0.5) * 0.5
    return [x, y, r]
}

function fib(i, f, t) {
    let phi = (1 + sqrt(5)) / 2
    let r = sqrt(i + 1) / 8
    let theta = 2 * PI * (i + 1) * phi + t * 2 * PI
    let radius = 0.03 * (i + 1) ** (1 / 1)

    return [r * cos(theta), r * sin(theta), radius]
}

var engine, world
worldScale = 100
worldRestarted = false
function initPhysics(func, tt) {
    engine = Matter.Engine.create()
    world = engine.world

    //engine.gravity.scale = 0.01

    // add bouncy balls
    let circleOptions = {
        restitution: 1.2,
    }
    for (let i = 0; i < n; i++) {
        let ii = i / n + 0.5 / n
        let [x, y, r] = func(i, ii, tt)
        let circle = Matter.Bodies.circle(
            worldScale * x,
            worldScale * y,
            worldScale * r,
            circleOptions
        )
        Matter.Composite.add(world, circle)
    }

    let wallOptions = {
        isStatic: true,
    }
    let wallThickness = 0.1
    Matter.Composite.add(
        world,
        Matter.Bodies.rectangle(
            0 * worldScale,
            (-9 / 16.0 - wallThickness / 2) * worldScale,
            2 * worldScale,
            wallThickness * worldScale,
            wallOptions
        )
    )
    Matter.Composite.add(
        world,
        Matter.Bodies.rectangle(
            0 * worldScale,
            (9 / 16.0 + wallThickness / 2) * worldScale,
            2 * worldScale,
            wallThickness * worldScale,
            wallOptions
        )
    )
    Matter.Composite.add(
        world,
        Matter.Bodies.rectangle(
            (-1 - wallThickness / 2) * worldScale,
            0 * worldScale,
            wallThickness * worldScale,
            2 * worldScale,
            wallOptions
        )
    )
    Matter.Composite.add(
        world,
        Matter.Bodies.rectangle(
            (1 + wallThickness / 2) * worldScale,
            0 * worldScale,
            wallThickness * worldScale,
            2 * worldScale,
            wallOptions
        )
    )
    worldRestarted = true
}

function whiteBG(i, f, t) {
    if (i == 0) {
        tempCtx.beginPath()
        tempCtx.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        tempCtx.fill()
    }
}

function physics(i, f, t) {
    whiteBG(i, f, t)
    //thesquare(i, f, t, 1)
    if (i == 0) {
        Matter.Engine.update(engine, 1000 / 60)
    }
    // loop through objects
    let bodies = Matter.Composite.allBodies(engine.world)
    let body = bodies[i]
    let pos = body.position
    let x = pos.x / worldScale
    let y = pos.y / worldScale
    let r = 0.98 * (body.circleRadius / worldScale)
    return [x, y, r]
}

function tTest(i, f, t) {
    return [t, 0, 0.1]
}

function hex(i, f, t) {
    // align in hex grid
    let x = i % 3
    let y = floor(i / 3)
    if (y % 2 == 0) {
        x += 1 / 2
    }
    let r = 0.4 + (sin(t * 2 * PI) / 2 + 0.5) * 0.8
    if (i == 9) {
        x = 3
        y = 1
    }

    let fac = 1
    return [(x - 1.5) * fac, (y - 1) * fac * 0.866, fac * r]
}

effects = [
    appear,
    dotdotdot2,
    infinity,

    title, // after overlap reveal
    spinner, // good overlap reveal
    donut, // after spinner?

    orb, // before tunnel?
    tunnelgood,
    lines,

    solarsystem,
    rings, // after solarsystem
    hex,
    worm,
    moiree,
    //square,
    loadingsquare,
    physics,
    heart,
    heartdissolve,

    //grid,
    //fib,
    //concentric,
]
//effects = [effects[0]]
//effects = [effects[0], effects[1]]

let phaseLength = 6.66666666 // seconds
let fadeDuration = phaseLength / 6

let t

let lastFrame
function animate() {
    //ctx.globalCompositeOperation = "source-over"
    tempCtx.globalCompositeOperation = "source-over"
    tempCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    tempCtx.globalCompositeOperation = "xor"

    /*
    // draw big circle
    ctx.fillStyle = "white"
    ctx.beginPath()
    ctx.arc(
        CANVAS_WIDTH / 2,
        CANVAS_WIDTH / 2,

        CANVAS_WIDTH / 2,
        0,
        2 * PI
    )
    ctx.fill()

    // clip big circle
    ctx.beginPath()
    ctx.arc(
        CANVAS_WIDTH / 2,
        CANVAS_WIDTH / 2,
        CANVAS_WIDTH / 2,
        0,
        2 * PI
    )
    ctx.clip()
    */

    t = (new Date().getTime() - start_time) / 1000

    let phase = floor(
        ((t + effects.length * phaseLength) % (effects.length * phaseLength)) /
            phaseLength
    )
    let phasePosition = t % phaseLength
    tt = phasePosition / phaseLength
    if (phasePosition > phaseLength - fadeDuration) {
        let p2 = phasePosition - (phaseLength - fadeDuration)
        let amount = 1 / (1 + exp((0.5 - p2 / fadeDuration) * 10))
        let func = effects[phase]
        let func2 = effects[(phase + 1) % effects.length]

        // special case for physics
        if (func2 == physics) {
            if (!worldRestarted) {
                initPhysics(func, tt)
            }
            amount = 1
        }
        if (func == physics) {
            worldRestarted = false
        }

        interpolate(func, func2, amount, tt)
    } else {
        let func = effects[phase]
        apply(func, tt)
    }
    //blur()
    postprocess()
    requestAnimationFrame(animate)
}

function blur() {
    if (lastFrame) {
        // create motionblur effect
        ctx.globalCompositeOperation = "lighter"
        ctx.globalAlpha = 0.3
        // draw tempCanvas
        ctx.drawImage(tempCanvas, 0, 0)
        ctx.globalAlpha = 1
    }

    // store current canvascontent in lastFrame
    lastFrame = ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_WIDTH)
    // draw to tempCanvas
    tempCtx.drawImage(canvas, 0, 0)
}

function apply(func, tt) {
    tempCtx.fillStyle = WHITE
    // opacity 10%
    //ctx.globalAlpha = 0.1
    for (i = 0; i < n; i++) {
        ii = i / n + 0.5 / n
        output = func(i, ii, tt)
        x = ((output[0] + 1) / 2) * CANVAS_WIDTH
        y =
            ((output[1] + 1) / 2) * CANVAS_WIDTH -
            0.5 * (CANVAS_WIDTH - CANVAS_HEIGHT)
        let r
        if (output[2] == null || output[2] == undefined) {
            r = 0.05
        } else {
            r = max(0, (output[2] / 2) * CANVAS_WIDTH)
        }

        tempCtx.beginPath()
        tempCtx.arc(x, y, r, 0, 2 * PI)
        tempCtx.fill()
    }
    // apply bright texture on top
    //tempCtx.globalCompositeOperation = "source-atop"
    //tempCtx.globalAlpha = 1
    //ctx.drawImage(brightImg, 0, 0)
}

function interpolate(func1, func2, amount, tt) {
    apply(function (i, f, t) {
        out1 = func1(i, f, t)
        out2 = func2(i, f, t - 1)
        return [
            out1[0] * (1 - amount) + out2[0] * amount,
            out1[1] * (1 - amount) + out2[1] * amount,
            out1[2] * (1 - amount) + out2[2] * amount,
        ]
    }, tt)
}

function postprocess() {
    // clear
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    // motion blur
    //ctx.globalCompositeOperation = "destination-out"
    //ctx.globalAlpha = 0.7
    //ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    //ctx.globalAlpha = 1

    // draw canvas
    ctx.globalCompositeOperation = "source-over"
    ctx.drawImage(tempCanvas, 0, 0)

    // draw brightCanvas texture on everything, transparently
    //ctx.globalCompositeOperation = "source-atop"
    //ctx.globalAlpha = 0.4
    //ctx.drawImage(brightImg, 0, 0)

    // copy canvas onto itsef as shadow
    /*
    ctx.globalAlpha = 0.5
    ctx.drawImage(canvas, 0, 10)
    ctx.globalAlpha = 1
    */
    /*
    for (let x = 0; x < CANVAS_WIDTH; x++) {
        for (let y = 1; y < CANVAS_WIDTH; y++) {
            let pixel = ctx.getImageData(x, y, 1, 1)
            let pixelAbove = ctx.getImageData(x, y - 1, 1, 1)
            // if above is black, make pixel blue
            if (pixelAbove.data[0] == 0) {
                pixel.data[0] = 0
                pixel.data[1] = 0
                pixel.data[2] = 255
                pixel.data[3] = 255
            }
            ctx.putImageData(pixel, x, y)
        }
    }
    */
}

;(async () => {
    //await setupTextures()

    // on click start
    let audio = new Audio("metaluna-responds.mp3")
    button = document.querySelector("#go")
    button.addEventListener("click", function () {
        button.style.display = "none"
        start_time = new Date().getTime()
        animate()
        audio.currentTime = 0
        audio.play()
    })
    // on escape, stop music
    document.addEventListener("keydown", function (e) {
        if (e.key == "Escape") {
            audio.pause()
        }
    })

    let autostart = false
    if (autostart) {
        button.dispatchEvent(new Event("click"))
    }

    document.addEventListener("click", function () {
        button.dispatchEvent(new Event("click"))
    })
})()

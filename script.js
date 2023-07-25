let sin = Math.sin
let cos = Math.cos
let tan = Math.tan
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
BLACK = "#001"

canvas = document.getElementById("canvas")
ctx = canvas.getContext("2d")

tempCanvas = document.createElement("canvas")
tempCtx = tempCanvas.getContext("2d")

n = 10 // number of circles
CANVAS_WIDTH = 1000 // width of canvas

// hook n slider to n
n_slider = document.getElementById("slider")
n_slider.value = n
n_slider.oninput = function () {
    n = this.value
    document.getElementById("n").innerHTML = n
}

// adapt canvas to w
canvas.width = CANVAS_WIDTH
canvas.height = CANVAS_WIDTH

tempCanvas.width = CANVAS_WIDTH
tempCanvas.height = CANVAS_WIDTH

// i: index
// f: from 0 to 1
function grid(i, f, t) {
    edge = ceil(sqrt(n))
    angle = i // radians
    r = 1 / (edge - 1)
    ox = cos(angle) * sin(5 * t + i) * 0.4 * r
    oy = sin(angle) * sin(5 * t + i) * 0.4 * r
    return [
        0.7 * ((floor(i / edge) / (edge - 1)) * 2 - 1) + ox,
        0.7 * (((i % edge) / (edge - 1)) * 2 - 1) + oy,
        0.7 * r,
    ]
}

function solarsystem(i, f, t) {
    // 0.1 to 1.5
    z = 0.1 + (sin(t) / 2 + 0.5) * 1.4
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

        tt = t * 2
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
        r * sin(f * PI * 2 + t),
        r * cos(f * PI * 2 + t),
        0.05 + 0.4 * (sin(f * PI * 2 + 2 * t) / 2 + 0.5),
    ]
}

// milky way from the side pattern
function donut(i, f, t) {
    r = 0.5
    return [
        r * sin(f * PI * 2 + t),
        0,
        0.04 + 0.4 * (sin(f * PI * 2 + t + PI / 2) / 2 + 0.5),
    ]
}

function worm(i, f, t) {
    w = 0.8
    return [
        w * (f - 0.5) * 1.8,
        sin(3 * t + f * 5) * 0.2,
        0.05 + 0.14 * (sin(2 * t + f * 5) + 1),
    ]
}

function concentric(i, f, t) {
    wa = (1 - f) * (cos(t) / 2 + 0.5) // wobble amount
    ox = wa * cos(t * 5)
    oy = wa * sin(t * 5)
    return [ox, oy, f]
}

function tunnel(i, f, t) {
    s = 5
    if (i == 0) {
        if (t % (2 * (n / (n - 1)) * (s / n)) < ((s / n) * n) / (n - 1)) {
            return [0, 0, 1.5]
        } else {
            return [0, 0, 0]
        }
    } else {
        r = 1.5 * pow((i / (n - 1) + t / s) % 1, 4)
        x = 0.5 * sin(t / 2) * (1.5 - r)
        y = 0
        return [x, y, r]
    }
}

function loading(i, f, t) {
    r = 0.3
    rad = 0.08 + ((f - t / 2 - 2) % 1) * 0.1
    return [r * sin(f * PI * 2 - t), r * cos(f * PI * 2 - t), rad]
}

function lines(i, f, t) {
    rad = 10
    x = f * 2.2 + (rad - 1.1) + sin(t * 3) * 0.1
    y = 0
    r = rad
    return [x, y, r]
}

function rings(i, f, t) {
    j = i % (n / 2)
    jj = i % 2
    angle = (j * PI * 2) / (n / 2)
    rad = 0.4 + 0.5 * sin(t * 2 + angle)
    x = rad * cos(angle)
    y = rad * sin(angle)
    r = 0.3 + jj * 0.05
    return [x, y, r]
}

function title(i, f, t) {
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
        sin(t * 10 * (1 + ((234 + i * i * 13) % 2)) + f * i * i) * 0.01
    r = 0.1
    return [x, y, r]
}

function moiree(i, f, t) {
    x1 = 0.5 * sin(t)
    y1 = -0.5

    x2 = 0.5
    y2 = 0.25 + 0.25 * cos(t * 5)

    if (f < 0.5) {
        r = f * 4
        return [x1, y1, r]
    } else {
        r = (f - 0.5) * 4
        return [x2, y2, r]
    }
}

function fib(i, f, t) {
    let phi = (1 + sqrt(5)) / 2
    let r = sqrt(i + 1) / 8
    let theta = 2 * PI * (i + 1) * phi + t
    let radius = 0.03 * (i + 1) ** (1 / 6.0)

    return [r * cos(theta), r * sin(theta), radius]
}

effects = [
    loading,
    title,
    spinner,
    donut,
    rings,
    solarsystem,
    moiree,
    worm,
    grid,
    fib,
    concentric,
    lines,
    tunnel,
]
//effects = [effects[0]]
//effects = [effects[0], effects[1]]

let phaseLength = 4 // seconds
let fadeDuration = 1

let t

let lastFrame
function animate() {
    ctx.fillStyle = BLACK
    ctx.globalCompositeOperation = "source-over"
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_WIDTH)

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

    let dt = 0
    let phase = floor(
        ((t + dt + effects.length * phaseLength) %
            (effects.length * phaseLength)) /
            phaseLength
    )
    let phasePosition = (t + dt) % phaseLength
    if (phasePosition > phaseLength - fadeDuration) {
        let p2 = phasePosition - (phaseLength - fadeDuration)
        let amount = 1 / (1 + exp((0.5 - p2 / fadeDuration) * 10))
        let func = effects[phase]
        let func2 = effects[(phase + 1) % effects.length]
        interpolate(func, func2, amount, t + dt)
    } else {
        let func = effects[phase]
        apply(func, t + dt)
    }
    //blur()
    //postprocess()
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
    ctx.globalCompositeOperation = "difference"
    ctx.fillStyle = "white"
    for (i = 0; i < n; i++) {
        ii = i / n + 0.5 / n
        output = func(i, ii, tt)
        x = ((output[0] + 1) / 2) * CANVAS_WIDTH
        y = ((output[1] + 1) / 2) * CANVAS_WIDTH
        let r
        if (output[2] == null || output[2] == undefined) {
            r = 0.05
        } else {
            r = max(0, (output[2] / 2) * CANVAS_WIDTH)
        }

        ctx.beginPath()
        ctx.arc(x, y, r, 0, 2 * PI)
        ctx.fill()
    }
}

function interpolate(func1, func2, amount, tt) {
    apply(function (i, f, t) {
        out1 = func1(i, f, t)
        out2 = func2(i, f, t)
        return [
            out1[0] * (1 - amount) + out2[0] * amount,
            out1[1] * (1 - amount) + out2[1] * amount,
            out1[2] * (1 - amount) + out2[2] * amount,
        ]
    }, tt)
}

function postprocess() {
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
}

start_time = new Date().getTime()
animate()

canvas = document.getElementById("canvas")
ctx = canvas.getContext("2d")

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

function spiral(i, f, t) {
    //return [i - 0.5, 0, 0.01]
    return [
        0.7 * Math.sin(f * Math.PI * 2 + t),
        0.7 * Math.cos(f * Math.PI * 2 + t),
        0.2 * (Math.sin(t + f) + 1),
    ]
}

// i: index
// f: from 0 to 1
function grid(i, f, t) {
    edge = Math.ceil(Math.sqrt(n))
    angle = i // radians
    ox = Math.cos(angle) * Math.sin(5 * t + i) * 0.1
    oy = Math.sin(angle) * Math.sin(5 * t + i) * 0.1
    return [
        0.7 * ((Math.floor(i / edge) / (edge - 1)) * 2 - 1) + ox,
        0.7 * (((i % edge) / (edge - 1)) * 2 - 1) + oy,
        0.1,
    ]
}

function solarsystem(i, f, t) {
    z = (Math.sin(t) * 2 + 1) * 0.1 + 1
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
        x = d * Math.sin(tt / planet.orbital_period + i)
        y = 0.1 * d * Math.cos(tt / planet.orbital_period + i)
        return [x * z, y * z, r * z]
    } else {
        return [0, 0, 0.000001]
    }
}

// i between 0 and 1 in equal steps
function eval(i, f, t) {
    r = 0.5
    return [
        (r * Math.sin(f * Math.PI * 2 + t)) / 2,
        (r * Math.cos(f * Math.PI * 2 + t)) / 2,
        0.2, // * (Math.sin(i * Math.PI * 2 + 2 * t) / 2 + 0.5),
    ]
}

// milky way from the side pattern
function eval2(i, f, t) {
    r = 0.5
    return [
        (r * Math.sin(f * Math.PI * 2 + t)) / 2,
        0,
        0.2 * (Math.sin(f * Math.PI * 2 + 2 * t) / 2 + 0.5),
    ]
}

function eval3(i, f, t) {
    w = 0.8
    return [
        w * (f - 0.5),
        Math.sin(3 * t + f * 5) * 0.1,
        0.07 * (Math.sin(2 * t + f * 5) + 1),
    ]
}

effects = [grid, solarsystem, eval, eval2, eval3, spiral]
//effects = [solarsystem]
current_effect = 0

let phaseLength = 4 // seconds
let fadeDuration = 1

let t

function animate() {
    ctx.fillStyle = "black"
    ctx.globalCompositeOperation = "source-over"
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_WIDTH)

    t = 0.5 * ((new Date().getTime() - start_time) / 1000)

    let phase = Math.floor(
        ((t + effects.length * phaseLength) % (effects.length * phaseLength)) /
            phaseLength
    )
    console.log(phase)
    let phasePosition = t % phaseLength
    if (phasePosition > phaseLength - fadeDuration) {
        let p2 = phasePosition - (phaseLength - fadeDuration)
        let amount = 1 / (1 + Math.exp((0.5 - p2 / fadeDuration) * 10))
        let func = effects[phase]
        let func2 = effects[(phase + 1) % effects.length]
        interpolate(func, func2, amount)
    } else {
        let func = effects[phase]
        apply(func)
    }
    requestAnimationFrame(animate)
}

function apply(func) {
    for (i = 0; i < n; i++) {
        ii = i / n + 0.5 / n
        output = func(i, ii, t)
        x = ((output[0] + 1) / 2) * CANVAS_WIDTH
        y = ((output[1] + 1) / 2) * CANVAS_WIDTH
        r = Math.max(0, ((output[2] || 0.05) / 2) * CANVAS_WIDTH)
        console.log("x: " + x + " y: " + y + " r: " + r)
        ctx.beginPath()
        ctx.arc(x, y, r, 0, 2 * Math.PI)
        ctx.fillStyle = "white"
        ctx.globalCompositeOperation = "difference"
        ctx.fill()
    }
}

function interpolate(func1, func2, amount) {
    apply(function (i, f, t) {
        out1 = func1(i, f, t)
        out2 = func2(i, f, t)
        return [
            out1[0] * (1 - amount) + out2[0] * amount,
            out1[1] * (1 - amount) + out2[1] * amount,
            out1[2] * (1 - amount) + out2[2] * amount,
        ]
    })
}

start_time = new Date().getTime()
animate()

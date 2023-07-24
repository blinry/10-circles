canvas = document.getElementById("canvas")
ctx = canvas.getContext("2d")

n = 10 // number of circles
CANVAS_WIDTH = 1000 // width of canvas

// hook n slider to n
n_slider = document.getElementById("n")
n_slider.value = n
n_slider.oninput = function () {
    n = this.value
}

// adapt canvas to w
canvas.width = CANVAS_WIDTH
canvas.height = CANVAS_WIDTH

// i between 0 and 1 in equal steps
function eval(i, t) {
    r = 0.5
    return [
        (r * Math.sin(i * Math.PI * 2 + t)) / 2,
        (r * Math.cos(i * Math.PI * 2 + t)) / 2,
        0.2, // * (Math.sin(i * Math.PI * 2 + 2 * t) / 2 + 0.5),
    ]
}

// milky way from the side pattern
function eval2(i, t) {
    r = 0.5
    return [
        (r * Math.sin(i * Math.PI * 2 + t)) / 2,
        0,
        0.2 * (Math.sin(i * Math.PI * 2 + 2 * t) / 2 + 0.5),
    ]
}

function eval3(i, t) {
    w = 0.8
    return [
        w * (i - 0.5),
        Math.sin(3 * t + i * 5) * 0.1,
        0.07 * (Math.sin(2 * t + i * 5) + 1),
    ]
}

effects = [eval, eval2, eval3]
current_effect = 0

let phaseLength = 2 // seconds
let fadeDuration = 1

let t

function animate() {
    ctx.fillStyle = "black"
    ctx.globalCompositeOperation = "source-over"
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_WIDTH)

    t = (new Date().getTime() - start_time) / 1000

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
        output = func(ii, t)
        x = (output[0] + 0.5) * CANVAS_WIDTH
        y = (output[1] + 0.5) * CANVAS_WIDTH
        r = Math.max(0, (output[2] || 0.05) * CANVAS_WIDTH)
        ctx.beginPath()
        ctx.arc(x, y, r, 0, 2 * Math.PI)
        ctx.fillStyle = "white"
        ctx.globalCompositeOperation = "difference"
        ctx.fill()
    }
}

function interpolate(func1, func2, amount) {
    apply(function (t, i) {
        out1 = func1(t, i)
        out2 = func2(t, i)
        return [
            out1[0] * (1 - amount) + out2[0] * amount,
            out1[1] * (1 - amount) + out2[1] * amount,
            out1[2] * (1 - amount) + out2[2] * amount,
        ]
    })
}

start_time = new Date().getTime()
animate()

const canvas = document.getElementById('campo')
const ctx = canvas.getContext('2d')
const puntosEl = document.getElementById('puntos')
const vidasEl = document.getElementById('vidas')
const nivelEl = document.getElementById('nivel')
const mensajeEl = document.getElementById('mensaje')

const ZONA = 80 // ancho de la zona de anotación
const teclas = {}
let tiempo = 0
let jugador, defensas, puntos, vidas, nivel, estado // estado: 'inicio' | 'jugando' | 'pausa' | 'fin'

window.addEventListener('keydown', (e) => {
    teclas[e.key.toLowerCase()] = true
    if (e.key.startsWith('Arrow')) e.preventDefault()
    if (e.key === 'Enter') {
        if (estado === 'inicio' || estado === 'fin') nuevoJuego()
        else if (estado === 'pausa') empezarJugada()
    }
})
window.addEventListener('keyup', (e) => { teclas[e.key.toLowerCase()] = false })

function nuevoJuego() {
    puntos = 0
    vidas = 3
    nivel = 1
    empezarJugada()
}

function empezarJugada() {
    jugador = { x: ZONA + 20, y: canvas.height / 2, r: 12, vel: 3.2, dir: 1, moviendo: false, fase: 0 }
    defensas = []
    const cantidad = 4 + nivel * 2
    for (let i = 0; i < cantidad; i++) {
        defensas.push({
            x: 300 + Math.random() * (canvas.width - ZONA - 340),
            y: 20 + Math.random() * (canvas.height - 40),
            r: 12,
            vel: 0.8 + nivel * 0.25 + Math.random() * 0.8,
            // el defensa persigue al jugador con una fuerza distinta cada uno
            agresividad: 0.3 + Math.random() * 0.7,
            dir: -1,
            fase: Math.random() * 6,
            numero: 50 + Math.floor(Math.random() * 49)
        })
    }
    estado = 'jugando'
    mensajeEl.textContent = ''
    actualizarMarcador()
}

function actualizarMarcador() {
    puntosEl.textContent = puntos
    vidasEl.textContent = vidas
    nivelEl.textContent = nivel
}

function actualizar() {
    if (estado !== 'jugando') return

    let dx = 0, dy = 0
    if (teclas['arrowleft'] || teclas['a']) dx -= 1
    if (teclas['arrowright'] || teclas['d']) dx += 1
    if (teclas['arrowup'] || teclas['w']) dy -= 1
    if (teclas['arrowdown'] || teclas['s']) dy += 1
    if (dx && dy) { dx *= 0.707; dy *= 0.707 }

    jugador.moviendo = dx !== 0 || dy !== 0
    if (dx) jugador.dir = dx > 0 ? 1 : -1
    jugador.x = Math.max(jugador.r, Math.min(canvas.width - jugador.r, jugador.x + dx * jugador.vel))
    jugador.y = Math.max(jugador.r, Math.min(canvas.height - jugador.r, jugador.y + dy * jugador.vel))

    for (const d of defensas) {
        const ax = jugador.x - d.x
        const ay = jugador.y - d.y
        const dist = Math.hypot(ax, ay) || 1
        // mezcla: se desplaza hacia la izquierda y persigue en vertical
        const vx = (-0.6 + (ax / dist) * d.agresividad) * d.vel
        d.x += vx
        d.dir = vx >= 0 ? 1 : -1
        d.y += (ay / dist) * d.agresividad * d.vel * 1.2
        if (dist < jugador.r + d.r) return placaje()
    }

    if (jugador.x > canvas.width - ZONA) touchdown()
}

function touchdown() {
    puntos += 7
    nivel++
    estado = 'pausa'
    mensajeEl.textContent = '¡TOUCHDOWN! +7 · Enter para la siguiente jugada'
    actualizarMarcador()
}

function placaje() {
    vidas--
    actualizarMarcador()
    if (vidas <= 0) {
        estado = 'fin'
        mensajeEl.textContent = `Fin del partido: ${puntos} puntos · Enter para jugar otra vez`
    } else {
        estado = 'pausa'
        mensajeEl.textContent = '¡Placado! Enter para repetir la jugada'
    }
}

function dibujarCampo() {
    ctx.fillStyle = '#2f7d3a'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    // zonas de anotación
    ctx.fillStyle = '#c0392b'
    ctx.fillRect(0, 0, ZONA, canvas.height)
    ctx.fillStyle = '#2a6fb0'
    ctx.fillRect(canvas.width - ZONA, 0, ZONA, canvas.height)
    // líneas de yardas
    ctx.strokeStyle = 'rgba(255,255,255,0.7)'
    ctx.lineWidth = 2
    for (let x = ZONA; x <= canvas.width - ZONA; x += 64) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
    }
}

const ESTILO_JUGADOR = { camisa: '#f4c20d', borde: '#8a6a00', casco: '#ffffff', pantalon: '#f2efe6', numero: '#1b1b1b' }
const ESTILO_DEFENSA = { camisa: '#22262e', borde: '#000', casco: '#c0392b', pantalon: '#9aa0a8', numero: '#ffffff' }

function dibujarAtleta(p, e, numero, conBalon) {
    const paso = p.moviendo === false ? 0 : Math.sin(tiempo * 0.35 + p.fase)
    const bob = -Math.abs(paso) * 2
    const dir = p.dir
    ctx.lineWidth = 1.5
    ctx.strokeStyle = e.borde

    // sombra
    ctx.fillStyle = 'rgba(0,0,0,0.3)'
    ctx.beginPath()
    ctx.ellipse(p.x, p.y + 15, 13, 5, 0, 0, Math.PI * 2)
    ctx.fill()

    // piernas y botas
    for (const lado of [-1, 1]) {
        const ly = p.y + 6 + paso * 3 * lado
        ctx.fillStyle = e.pantalon
        ctx.fillRect(p.x + lado * 4 - 2, ly, 4, 8)
        ctx.fillStyle = '#111'
        ctx.fillRect(p.x + lado * 4 - 2 + (dir > 0 ? 1 : -1), ly + 7, 5, 3)
    }

    // brazos
    ctx.strokeStyle = e.camisa
    ctx.lineWidth = 4
    ctx.lineCap = 'round'
    const brazo = conBalon ? 4 : 10 + paso * 2
    ctx.beginPath()
    ctx.moveTo(p.x, p.y - 7 + bob)
    ctx.lineTo(p.x + dir * brazo, p.y + (conBalon ? 0 : -4) + bob)
    ctx.stroke()
    ctx.lineCap = 'butt'

    // torso con hombreras
    ctx.lineWidth = 1.5
    ctx.strokeStyle = e.borde
    ctx.fillStyle = e.camisa
    ctx.beginPath()
    ctx.roundRect(p.x - 9, p.y - 11 + bob, 18, 19, 4)
    ctx.fill()
    ctx.stroke()
    ctx.beginPath()
    ctx.ellipse(p.x, p.y - 9 + bob, 12, 5, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()

    // número
    ctx.fillStyle = e.numero
    ctx.font = 'bold 9px system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(numero, p.x, p.y + 4 + bob)

    // casco con rejilla
    ctx.fillStyle = e.casco
    ctx.beginPath()
    ctx.arc(p.x + dir, p.y - 16 + bob, 7, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = e.borde
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(p.x + dir * 4, p.y - 18 + bob)
    ctx.lineTo(p.x + dir * 10, p.y - 16 + bob)
    ctx.lineTo(p.x + dir * 9, p.y - 12 + bob)
    ctx.lineTo(p.x + dir * 4, p.y - 12 + bob)
    ctx.stroke()

    // balón
    if (conBalon) {
        ctx.fillStyle = '#7b4a1e'
        ctx.beginPath()
        ctx.ellipse(p.x + dir * 9, p.y - 1 + bob, 7, 4, dir * 0.3, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = '#f2efe6'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(p.x + dir * 7, p.y - 1 + bob)
        ctx.lineTo(p.x + dir * 11, p.y - 1 + bob)
        ctx.stroke()
    }
}

function dibujar() {
    dibujarCampo()
    if (!jugador) return
    // se dibujan de arriba a abajo para que se solapen bien
    const todos = defensas.map((d, i) => ({ p: d, e: ESTILO_DEFENSA, n: d.numero, balon: false }))
    todos.push({ p: jugador, e: ESTILO_JUGADOR, n: 22, balon: true })
    todos.sort((a, b) => a.p.y - b.p.y)
    for (const t of todos) dibujarAtleta(t.p, t.e, t.n, t.balon)
}

function bucle() {
    tiempo++
    actualizar()
    dibujar()
    requestAnimationFrame(bucle)
}

estado = 'inicio'
bucle()
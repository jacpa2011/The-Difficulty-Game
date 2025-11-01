const difficultyimage = document.getElementById('Difficulty');
const difficultytext = document.getElementById('difficultyname');

const player = { 
    difficulty: new Decimal(1),
    existencerank: new Decimal(-1),
    void: {
        action1: {
            progress: new Decimal(0),
            duration: new Decimal(3),
            active: false,
        },
        traceupgrades: {
            0: {
                amount: new Decimal(0),
                cost: new Decimal(10),
                effect: new Decimal(1),
            }
        },
        totaltraces: new Decimal(0),
        traces: new Decimal(0)
    }
};

let musicEnabled = false, audio = null;
const squares = [];
let spawnIntervalId = null;



function animateGradient() {
    const gradient = document.querySelector('.bottom-gradient');
    if (gradient) {
        const offset = Math.sin(Date.now() / 1000) * 7 - 7;
        gradient.style.bottom = offset + 'px';
    }
    requestAnimationFrame(animateGradient);
}
animateGradient();

function spawnSquare() {
    const square = document.createElement('div');
    square.className = 'animated-square';
    square.style.left = Math.random() * (window.innerWidth - 128) + 'px';
    square.style.bottom = '-128px';
    document.body.appendChild(square);
    squares.push({
        el: square,
        y: -178,
        speed: 0.5 + Math.random() * 1.5,
        rotation: 0,
        rotationSpeed: (Math.random() - 0.5) * 1.5,
        opacity: 0.05
    });
}

function animateSquares() {
    for (let i = squares.length - 1; i >= 0; i--) {
        const sq = squares[i];
        sq.y += sq.speed;
        sq.rotation += sq.rotationSpeed;
        sq.opacity = Math.max(0, sq.opacity - 0.0002 * sq.speed);
        sq.el.style.bottom = sq.y + 'px';
        sq.el.style.transform = `rotate(${sq.rotation}deg)`;
        sq.el.style.opacity = sq.opacity;
        if (sq.opacity === 0) {
            sq.el.remove();
            squares.splice(i, 1);
        }
    }
    requestAnimationFrame(animateSquares);
}

function handleVisibilityChange() {
    if (document.visibilityState === 'visible') {
        if (!spawnIntervalId) spawnIntervalId = setInterval(spawnSquare, 500);
    } else {
        if (spawnIntervalId) {
            clearInterval(spawnIntervalId);
            spawnIntervalId = null;
        }
    }
}

function Action(id) {
    if (id == 1) {
        if (player.void.action1.active) return;    
        player.void.action1.active = true;
        player.void.action1.progress = new Decimal(0);
    }
}
function BuyTraceUp(id) {
    const up = player.void.traceupgrades;
    if (id == 1) {
        if (player.void.traces.gte(up[0].cost)) {
            player.void.traces = player.void.traces.sub(up[0].cost);
            up[0].amount = up[0].amount.add(1);
            up[0].effect = new Decimal(2).pow(up[0].amount)
            up[0].cost = new Decimal(10).mul(new Decimal(2.25).pow(up[0].amount));
        }
    }
}
document.addEventListener('visibilitychange', handleVisibilityChange);
handleVisibilityChange();
animateSquares();
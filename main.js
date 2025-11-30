const difficultyimage = document.getElementById('Difficulty');
const difficultytext = document.getElementById('difficultyname');

const player = { 
    difficulty: new Decimal(1),
    existencerank: "?̴̨͙̠̼̖̯̓͌̎̈́̏̈́͊̅̾̈̆͐̈́̕͝ͅ?̴̰̖̜̰̱̮̝̫̖͈̓͛̔̓?̴̱̯͍͕̹̻̅̀̀̾̈́̾̓̀̊̔͆̌̕̕͜͝?̴͈̞̏,",
    void: {
        action1: {
            progress: new Decimal(0),
            duration: new Decimal(3),
            active: false,
            totalpressed: new Decimal(0),
        },
        traceupgrades: {
            0: {
                level: new Decimal(0),
                cost: new Decimal(10),
                effect: new Decimal(1),
            },
            1: {
                bought: false,
                cost: new Decimal(50),
                effect: new Decimal(1),
            },
            2: {
                bought: false,
                cost: new Decimal(5000),
            }
        },
        totaltraces: new Decimal(0),
        traces: new Decimal(0),

        pulses: new Decimal(0),
        totalpulses: new Decimal(0),
        timepassed: new Decimal(0),
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
    const up = player.void.traceupgrades[id-1];
    if (!up) return;
    if (up.bought) return;
    // check cost
    if (!player.void.traces.gte(up.cost)) return;
    // pay cost
    player.void.traces = player.void.traces.sub(up.cost);

    // apply upgrade depending on type
    if ("bought" in up) {
        up.bought = true;
        const upgrade = document.getElementById(`up${id}`);
        if (upgrade) {
            upgrade.classList.add('voidbought');
        }
    } else {
        up.level = up.level.add(1);
    }
}
document.addEventListener('visibilitychange', handleVisibilityChange);
handleVisibilityChange();
animateSquares();
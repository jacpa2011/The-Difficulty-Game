function makeGibberish(length = 10) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let out = "";
  for (let i = 0; i < length; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}
function UpdateDisplay() {
    const existencerank = document.getElementById('existencerank');
    existencerank.textContent = player.existencerank;
    const traces = document.getElementById('traces');
    traces.textContent = format(player.void.traces);
    for(let i = 0; i < Object.keys(player.void.traceupgrades).length; i++) {
        const upeff = document.getElementById(`up${i+1}-eff`);
        const upcost = document.getElementById(`up${i+1}-cost`);
        const uplvl = document.getElementById(`up${i+1}-lvl`);
        if (uplvl) {
            uplvl.textContent = format(player.void.traceupgrades[i].level, 0);
        }
        upcost.textContent = format(player.void.traceupgrades[i].cost);
        if (upeff) {
        upeff.textContent = format(player.void.traceupgrades[i].effect);
        }
    }
    const pulses = document.getElementById('pulses');
    const seconds = document.getElementById('seconds');
    seconds.textContent = format(player.void.timepassed, 0);
    pulses.textContent = format(player.void.pulses, 0);
}
function UpdateStyles() {
    const progressBarUI = document.getElementById('action1pbui');
    const progressPercent = player.void.action1.progress.div(player.void.action1.duration).min(1).mul(100);
    progressBarUI.style.width = progressPercent.toFixed(2) + '%';
    const tracesdisplay = document.getElementById('tracesdisplay');
    if (player.void.totaltraces.gt(0)) { 
        tracesdisplay.style.display = 'flex';
    } else {
        tracesdisplay.style.display = 'none'; 
    }
}
function CalculateTraceGain() {
    let tracegain = new Decimal(1);
    const up = player.void.traceupgrades;
    tracegain = tracegain.mul(up[0].effect);
    if (up[1].bought) {
        tracegain = tracegain.mul(up[1].effect);
    }
    return tracegain;
}
function CalculateUpgrade() {
    const up = player.void.traceupgrades;
    up[0].effect = new Decimal(2).pow(up[0].level);
    up[1].effect = player.void.action1.totalpressed.add(1).pow(0.33);
    up[0].cost = new Decimal(10).mul(new Decimal(2.25).pow(up[0].level));
    up[1].cost = new Decimal(50)
    up[2].cost = new Decimal(5000)
    for(let i = 0; i < Object.keys(player.void.traceupgrades).length; i++) {
        const upgrade = document.getElementById(`up${i+1}`);
        if (upgrade) {
            if (up[i].bought) {
                upgrade.classList.add('voidbought');
            } else {
                upgrade.classList.remove('voidbought');
            }
        }
    }
}
function productionloop(diff) {
    const up = player.void.traceupgrades;
    CalculateUpgrade();
    let tracegain = CalculateTraceGain();
    if (player.void.action1.active) {
        player.void.action1.progress = player.void.action1.progress.add(new Decimal(diff));
        if (player.void.action1.progress.gte(player.void.action1.duration)) {
            player.void.traces = player.void.traces.add(tracegain);
            player.void.totaltraces = player.void.totaltraces.add(tracegain);
            player.void.action1.totalpressed = player.void.action1.totalpressed.add(1);
            player.void.action1.active = false;
            player.void.action1.progress = new Decimal(0);
        }
    }
    if(up[2].bought) {
        player.void.pulses = player.void.pulses.add(diff);
        player.void.totalpulses = player.void.totalpulses.add(new Decimal(diff));
        player.void.timepassed = player.void.timepassed.add(new Decimal(diff));
    }
}
window.addEventListener('click', enableMusic);
window.addEventListener('keydown', enableMusic);
function enableMusic() {
    musicEnabled = true;
    window.removeEventListener('click', enableMusic);
    window.removeEventListener('keydown', enableMusic);
}
var LastUpdate = Date.now()
function Mainloop() {
    var diff = (Date.now() - LastUpdate) / 1000
    player.existencerank = makeGibberish();
    UpdateDisplay()
    UpdateStyles()
    productionloop(diff)
    if (player.difficulty.eq(1)) {
        difficultyimage.style.boxShadow = '0 0 10px 5px white';
        difficultytext.textContent = 'The First Difficulty';
        if (!audio && musicEnabled) {
            audio = new Audio('Music/Glimpsing Infinity.mp3');
            audio.loop = true;
            audio.volume = 0.5;
            audio.play();
        }
    } else {
        if (difficultyimage) difficultyimage.style.boxShadow = '';
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
            audio = null;
        }
    }

    LastUpdate = Date.now()
}
setInterval(Mainloop, 33)
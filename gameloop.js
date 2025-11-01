function UpdateDisplay() {
    const traces = document.getElementById('traces');
    if (traces) {
        traces.textContent = format(player.void.traces);
    }
    const up1eff = document.getElementById('up1-eff');
    const up1cost = document.getElementById('up1-cost');   
    up1eff.textContent = format(player.void.traceupgrades[0].effect);
    up1cost.textContent = format(player.void.traceupgrades[0].cost);
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
    tracegain = tracegain.mul(player.void.traceupgrades[0].effect);
    return tracegain;
}
function productionloop(diff) {
    let tracegain = CalculateTraceGain();
    if (player.void.action1.active) {
        player.void.action1.progress = player.void.action1.progress.add(new Decimal(diff));
        if (player.void.action1.progress.gte(player.void.action1.duration)) {
            player.void.traces = player.void.traces.add(tracegain);
            player.void.totaltraces = player.void.totaltraces.add(tracegain);
            player.void.action1.active = false;
            player.void.action1.progress = new Decimal(0);
        }
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
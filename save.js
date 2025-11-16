function saveitems(name, location) { // this basically just removes the localstorage.setitem and json.stringify
    localStorage.setItem(name, JSON.stringify((location)));
}

function Save() {
    if (localStorage) {
        localStorage.setItem('has_visited', 'true');
        saveitems('player.difficulty', player.difficulty); 
        saveitems('player.existencerank', player.existencerank);
        saveitems('player.void.traces', player.void.traces);
        saveitems('player.void.totaltraces', player.void.totaltraces);
        saveitems('player.void.action1.active', player.void.action1.active);
        saveitems('player.void.action1.progress', player.void.action1.progress); 
        saveitems('player.void.action1.totalpressed', player.void.action1.totalpressed); 
        for(let i = 0; i < Object.keys(player.void.traceupgrades).length; i++) {
            if (player.void.traceupgrades[i].level) saveitems(`player.void.traceupgrades[${i}].level`, player.void.traceupgrades[i].level);
            saveitems(`player.void.traceupgrades[${i}].cost`, player.void.traceupgrades[i].cost);
            if (player.void.traceupgrades[i].eff) saveitems(`player.void.traceupgrades[${i}].effect`, player.void.traceupgrades[i].effect);
            if (player.void.traceupgrades[i].hasOwnProperty("bought")) saveitems(`player.void.traceupgrades[${i}].bought`, player.void.traceupgrades[i].bought);
        }
    }
}

function GetItems(saved, newdecimal) { //removes json.parse and localstorage
    let location = "Error" // placeholder
    if (saved) {
        if (newdecimal) { // checks if the value your setting to needs to be in newdecimal or not
            location = new Decimal(JSON.parse(localStorage.getItem(saved)));
        } else {
            location = JSON.parse(localStorage.getItem(saved));
        }
    }
    if (location == "Error") console.error(`"` + saved + `" doesn't exist in the localstorage. Check for any mistypos if it's supposed to be.`)
    return location
}
function isFirstVisit() {
    if (!localStorage.getItem('has_visited')) {
    Save()
    return true; // First visit
    }
    return false; // Returning visitor
  }
function Get() {
    if (localStorage) {
    if (!isFirstVisit()) {
        player.difficulty = GetItems('player.difficulty', true);
        player.existencerank = GetItems('player.existencerank', true);
        player.void.traces = GetItems('player.void.traces', true);
        player.void.totaltraces = GetItems('player.void.totaltraces', true);
        player.void.action1.active = GetItems('player.void.action1.active', false);
        player.void.action1.progress = GetItems('player.void.action1.progress', true);
        player.void.action1.totalpressed = GetItems('player.void.action1.totalpressed', true);   
        for(let i = 0; i < Object.keys(player.void.traceupgrades).length; i++) {
            if (player.void.traceupgrades[i].level) player.void.traceupgrades[i].level = GetItems(`player.void.traceupgrades[${i}].level`, true);
            player.void.traceupgrades[i].cost = GetItems(`player.void.traceupgrades[${i}].cost`, true);
            if (player.void.traceupgrades[i].effect) player.void.traceupgrades[i].effect = GetItems(`player.void.traceupgrades[${i}].effect`, true);
            if (player.void.traceupgrades[i].hasOwnProperty("bought")) player.void.traceupgrades[i].bought = GetItems(`player.void.traceupgrades[${i}].bought`, false);
        }
    } else {
        Save()
    }}
}
function HardReset() {
    localStorage.clear(); // wipe localstorage
    location.reload(true)
}
setInterval(Save, 15000); // autosave every 15 seconds

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
        for(let i = 0; i < Object.keys(player.void.traceupgrades).length; i++) {
            saveitems(`player.void.traceupgrades[${i}].amount`, player.void.traceupgrades[i].amount);
            saveitems(`player.void.traceupgrades[${i}].cost`, player.void.traceupgrades[i].cost);
            saveitems(`player.void.traceupgrades[${i}].effect`, player.void.traceupgrades[i].effect);
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
        player.void.traceupgrades[0].amount = GetItems('player.void.traceupgrades[0].amount', true);
        player.void.traceupgrades[0].cost = GetItems('player.void.traceupgrades[0].cost', true);
        player.void.traceupgrades[0].effect = GetItems('player.void.traceupgrades[0].effect', true);    
        for (let i = 0; i < Object.keys(player.void.traceupgrades).length; i++) {  
            player.void.traceupgrades[i].amount = GetItems(`player.void.traceupgrades[${i}].amount`, true);
            player.void.traceupgrades[i].cost = GetItems(`player.void.traceupgrades[${i}].cost`, true);
            player.void.traceupgrades[i].effect = GetItems(`player.void.traceupgrades[${i}].effect`, true);
        }   
    } else {
        Save()
    }}
}
let isHardResetting = false;
function HardReset() {
    isHardResetting = true;
    localStorage.clear(); // wipe localstorage
    location.reload(true)
}
window.addEventListener('beforeunload', () => {
    if (!isHardResetting) Save();
});
setInterval(Save, 15000); // autosave every 15 seconds

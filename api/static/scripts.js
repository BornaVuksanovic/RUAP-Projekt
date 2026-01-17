let leftFoot = 0;
let rightFoot = 0;
let position = "";

const leagueSelect = document.getElementById("league_id");
const clubInput = document.getElementById("club_team_id");
const dataList = document.getElementById("clubs_list");
let clubNameToId = {};


document.getElementById("leftFoot").addEventListener("click", () => {
    leftFoot = 1; rightFoot = 0;
    document.getElementById("leftFoot").classList.add("selected");
    document.getElementById("rightFoot").classList.remove("selected");
});
document.getElementById("rightFoot").addEventListener("click", () => {
    leftFoot = 0; rightFoot = 1;
    document.getElementById("rightFoot").classList.add("selected");
    document.getElementById("leftFoot").classList.remove("selected");
});

const jerseySlider = document.getElementById("club_jersey_number");
const jerseyNumber = document.getElementById("jersey-number");

jerseySlider.addEventListener("input", () => {
    jerseyNumber.innerText = jerseySlider.value;
});


document.querySelectorAll(".field-pos").forEach(btn => {
    btn.addEventListener("click", () => {
        position = btn.dataset.pos;
        document.querySelectorAll(".field-pos").forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
    });
});


async function loadMaps() {
    const leagues = await (await fetch("/leagues")).json();
    const nations = await (await fetch("/nations")).json();

    Object.entries(leagues).forEach(([id, name]) => {
        let opt = document.createElement("option");
        opt.value = id;
        opt.text = name;
        leagueSelect.appendChild(opt);
    });


    const nationalitySelect = document.getElementById("nationality_id");
    Object.entries(nations).forEach(([id,name]) => {
        let opt = document.createElement("option");
        opt.value = id;
        opt.text = name;
        nationalitySelect.appendChild(opt);
    });

leagueSelect.addEventListener("change", async () => {
    const leagueId = leagueSelect.value;
    dataList.innerHTML = "";
    clubNameToId = {};

    const clubs = await (await fetch(`/league_clubs/${leagueId}`)).json();
    Object.entries(clubs).forEach(([id, name]) => {
        let opt = document.createElement("option");
        opt.value = name;
        dataList.appendChild(opt);
        clubNameToId[name] = parseInt(id);
    });


    clubInput.value = "";
    clubInput.focus(); 
});

}

window.onload = loadMaps;


function predict() {
    const clubId = clubNameToId[clubInput.value];
    if (!clubId) {
        alert("Odabrani klub nije validan ili ne pripada odabranoj ligi!");
        return;
    }

    const data = {
        age: parseInt(document.getElementById("age").value),
        league_id: parseInt(leagueSelect.value),
        club_team_id: clubId,
        nationality_id: document.getElementById("nationality_id").value,
        preferred_foot: leftFoot ? 0 : 1,
        club_jersey_number: parseInt(document.getElementById("club_jersey_number").value),
        Goalkeeper: position=="GK"?1:0,
        Defense: position=="DEF"?1:0,
        Midfield: position=="MID"?1:0,
        Attack: position=="ATT"?1:0
    };

    fetch("/predict", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => document.getElementById("result").innerText = res.predicted_value_eur)
    .catch(err => {console.error(err); alert("Greška kod predikcije!");});
}

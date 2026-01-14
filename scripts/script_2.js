// TABLEAU DES NOTES
let contenuListeNotesMode = "5";
let contenuListeNotesDiv = document.getElementById("contenu-liste-notes");
let contenuListeNotesTexte = document.getElementById("contenu-liste-notes-texte");
let contenuListeNotesNum = document.getElementById("contenu-liste-notes-num");
let contenuListeNotesClicDiv = document.getElementById("contenu-liste-notes-clic")

function contenuListeNotes(mode) {
	compteurFonctionsAjout();
	
	// CHANGEMENT DE MODE
	if (mode === 'click' && contenuListeNotesMode === "5") contenuListeNotesMode = "toutes";
	else if (mode === 'click' && contenuListeNotesMode === "toutes") contenuListeNotesMode = "5";

	// ACTUALISATION
	contenuListeNotesDiv.innerHTML = "";
	contenuListeNotesNum.innerHTML = ""
	let tab;
	let limite;
	let message;

	// MODE 5 NOTES
	if (contenuListeNotesMode === "5") {
		tab = notesCons.slice(0, 5);
		limite = 5+4;
		if (notesCons.length-5 === 1) message = "Affiche plus (+1 note)";
		else message = `Afficher plus (+${notesCons.length-5} notes)`;
	
	// MODE TOUTES LES NOTES
	} else if (contenuListeNotesMode === "toutes") {
		tab = notesCons;
		limite = notesCons.length+4;
		message = "Affiche moins";
		contenuListeNotesTexte.style.display = "block";
	
	// CAS 0
	} if (notesTempo.length === 0) {
		limite = 4;
		message = "Aucune note n'a été ajoutée";
		contenuListeNotesTexte.style.display = "block";
	
	// CAS 0 DANS LA SÉLÉCTION
	} else if (notesCons.length === 0) {
		limite = 4;
		message = "Aucune note ne correspond aux sélections";
		contenuListeNotesTexte.style.display = "block";

	// CAS SI NOTES <= 5
	} else if (notesCons.length <= 5) {
		limite = notesCons.length+3;
		contenuListeNotesTexte.style.display = "none";
	
	// CAS USUEL
	} else contenuListeNotesTexte.style.display = "block";
	for (let i = 3; i < limite; i++) {
		let div = document.createElement("div");
		let br = document.createElement("br");
		div.className = "numérotation";
		div.textContent = i;
		br.style.position = "absolute";
		contenuListeNotesNum.appendChild(br);
		contenuListeNotesNum.appendChild(div);
	}
	tab.forEach(e => {
		let période;
		if (e.période === "Semestre 1") période = "S1";
		else if (e.période === "Semestre 2") période = "S2";
		else période = "HP";
		let date = `${String((new Date(e.timeStamp)).getDate()).padStart(2, 0)}/${String((new Date(e.timeStamp)).getMonth() + 1).padStart(2, 0)} (${période})`;
		let infoTableau = [e.matière, `${e.note}/${e.dénom}`, `${e.note20}/20`, `${e.moyClasse}/${e.dénom}`, e.coef, date, "-"];
		let tr = document.createElement("tr");
		infoTableau.forEach(e => {
			let td = document.createElement("td");
			td.textContent = e;
			tr.appendChild(td);
		});
		contenuListeNotesDiv.appendChild(tr);
		tr.addEventListener("contextmenu", (event) => {
			event.preventDefault();
			contenuListeNotesClic(event, e);
		});
	});

	// INTERFACE AU CLIC DROIT
	function contenuListeNotesClic(event, mode, note) {
		if (mode === "on") {
			contenuListeNotesClicDiv.style.display = "block";
			contenuListeNotesClicDiv.style.left = event.clientX-238 + "px";
			contenuListeNotesClicDiv.style.top = event.clientY-34 + "px";
			console.log(event.pageX, event.pageY);
		} if (mode === "on") {
			contenuListeNotesClicDiv.style.display = "block";
			contenuListeNotesClicDiv.style.left = event.clientX-238 + "px";
			contenuListeNotesClicDiv.style.top = event.clientY-34 + "px";
			console.log(event.pageX, event.pageY);
		}
	}

	contenuListeNotesTexte.textContent = message;
}
function noteAjout() {
	compteurFonctionsAjout();
	aujourdHui = new Date();

	// DÉFINITIONS
	const matière = document.getElementById("js-ajout-matière").value.toUpperCase();
	const note = document.getElementById("js-ajout-note").value;
	const noteDénom = document.getElementById("js-ajout-note-dénom").value;
	const moyClasse = document.getElementById("js-ajout-moy-classe").value;
	const noteCoef = document.getElementById("js-ajout-note-coef").value;
	const noteId = `${String(aujourdHui.getDate()).padStart(2, 0)}${String(aujourdHui.getSeconds()).padStart(2, 0)}-${String(parseInt(Math.floor(Math.random() * 1000))).padStart(3, 0)}`;

	// ERREUR DE REMPLISSAGE
	function erreurDeRemplissage(erreur, focus) {
		compteurFonctionsAjout();
		document.getElementById("js-ajout-erreur").textContent = erreur;
		document.getElementById("js-ajout-erreur").style.color = "rgb(248, 64, 64)";
		document.getElementById(focus).focus();
	}

	// CONDITIONS DE VALABILITÉ
	if (!listeMatières.includes(matière)) erreurDeRemplissage(`Matière incorrecte`, `js-ajout-matière`);
	else if (noteDénom < 0 || noteDénom === 0 || noteDénom === "0" || isNaN(noteDénom) || noteDénom === "") erreurDeRemplissage(`Dénominateur incorrect`, `js-ajout-note-dénom`);
	else if (note < 0 || isNaN(note) || note === "" || note > 1.1 * noteDénom) erreurDeRemplissage(`Note incorrecte`, `js-ajout-note`);
	else if (moyClasse < 0 || isNaN(moyClasse) || moyClasse === "" || moyClasse > 1.1 * noteDénom) erreurDeRemplissage(`Moyenne de classe incorrecte`, `js-ajout-moy-classe`);
	else if (noteCoef < 0 || isNaN(noteCoef) || noteCoef === "" || noteCoef > 16) erreurDeRemplissage(`Coefficient incorrect`, `js-note-coef`);
	else {
		document.getElementById("js-ajout-erreur").textContent = "";

		// AJOUT
		notesTempo.push({
			type: "note",
			matière: matière,
			note: note,
			dénom: noteDénom,
			note20: Math.round(20 * (note/noteDénom) * 100)/100,
			moyClasse: moyClasse,
			coef: noteCoef,
			id: noteId,
			timeStamp: aujourdHui.getTime(),
			période: sélectionPériode
		});

		// FINALISATIONS
		notesTempo.sort((a, b) => b.timeStamp - a.timeStamp);
		localStorage.setItem("notes", JSON.stringify(notesTempo));
		console.log("-> Note ajoutée");
		console.log("    Notes tempo : ", notesTempo);
		actualisationNotes();
		document.getElementById("js-ajout-erreur").textContent = "Note ajoutée";
		document.getElementById("js-ajout-erreur").style.color = "rgb(81, 219, 18)";
		if (sélectionMatière !== "Toutes les matières") document.getElementById("js-ajout-note").focus();
		else document.getElementById("js-ajout-matière").focus();
	}
}










// TABLEAU DES NOTES
let contenuListeNotesMode = "5";
let contenuListeNotesDiv = document.getElementById("contenu-liste-notes");
let contenuListeNotesTexte = document.getElementById("contenu-liste-notes-texte");
let contenuListeNotesNum = document.getElementById("contenu-liste-notes-num");
let contenuListeNotesClicDiv = document.getElementById("contenu-liste-notes-clic")
let contenuListeNotesNote;

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
		tr.note = e;
		infoTableau.forEach(e => {
			let td = document.createElement("td");
			td.textContent = e;
			tr.appendChild(td);
		});

		contenuListeNotesDiv.appendChild(tr);
	});
	contenuListeNotesTexte.textContent = message;
}
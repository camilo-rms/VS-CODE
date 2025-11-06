// INITIALISATIONS
let sélectionMatière = "Toutes les matières";
let aujourdHui = new Date();
let dateAnnée = String(aujourdHui.getFullYear());
let dateMois = String(aujourdHui.getMonth()+1).padStart(2, 0);
let dateJour = String(aujourdHui.getDate()).padStart(2, 0);
let dateHeure = String(aujourdHui.getHours()).padStart(2, 0);
let dateMin = String(aujourdHui.getMinutes()).padStart(2, 0);
let dateSec = String(aujourdHui.getSeconds()).padStart(2, 0);
let dateMs = String(aujourdHui.getMilliseconds()).padStart(2, 0);
const listeMatières = ["FR", "ANG", "ESPCE", "ESPCO", "MATHS", "PHYS", "NSI", "ES", "EPS", "HG", "EMC"];

// COMPTEUR DE FONCTION
let compteurFonctions = 0;
compteurFonctionsAjout();

function compteurFonctionsAjout() {
	compteurFonctions++;
	if (compteurFonctions === 1) {
		document.getElementById("js-compteur-fonctions").textContent = `1 fonction exécutée`;
	} else {
		document.getElementById("js-compteur-fonctions").textContent = `${compteurFonctions} fonctions exécutées`;
	}
}










// AJOUT DE NOTES
let notesTempo = JSON.parse(localStorage.getItem("notes"));
if (!Array.isArray(notesTempo)) notesTempo = [];

function noteAjout() {
	compteurFonctionsAjout();
	aujourdHui = new Date();

	// DÉFINITIONS
	const matière = document.getElementById("js-matière").value.toUpperCase();
	const note = document.getElementById("js-note").value;
	const noteDénom = document.getElementById("js-note-dénom").value;
	const moyClasse = document.getElementById("js-moy-classe").value;
	const noteCoef = document.getElementById("js-note-coef").value;
	const noteId = `${String(aujourdHui.getDate()).padStart(2, 0)}${String(aujourdHui.getSeconds()).padStart(2, 0)}-${String(parseInt(Math.floor(Math.random() * 1000))).padStart(3, 0)}`;

	// ERREUR DE REMPLISSAGE
	function erreurDeRemplissage(erreur) {
		compteurFonctionsAjout();
		document.getElementById("js-erreur").textContent = erreur;
		document.getElementById("js-erreur").style.color = "rgb(248, 64, 64)";
	}

	// CONDITIONS DE VALABILITÉ
	if (!listeMatières.includes(matière)) erreurDeRemplissage(`Matière incorrecte`);
	else if (noteDénom < 0 || noteDénom === 0 || noteDénom === "0" || isNaN(noteDénom) || noteDénom === "") erreurDeRemplissage(`Dénominateur incorrect`);
	else if (note < 0 || isNaN(note) || note === "" || note > 1.1 * noteDénom) erreurDeRemplissage(`Note incorrecte`);
	else if (moyClasse < 0 || isNaN(moyClasse) || moyClasse === "" || moyClasse > 1.1 * noteDénom) erreurDeRemplissage(`Moyenne de classe incorrecte`);
	else if (noteCoef < 0 || isNaN(noteCoef) || noteCoef === "") erreurDeRemplissage(`Coefficient incorrect`);
	else {
		document.getElementById("js-erreur").textContent = "";

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
		document.getElementById("js-erreur").textContent = "Note ajoutée";
		document.getElementById("js-erreur").style.color = "rgb(81, 219, 18)";
	}
	document.getElementById("js-matière").focus();
}

// EXPORTATION, IMPORTATION, RÉINITIALISATION
// EXPORTATION
function exporter() {
	compteurFonctionsAjout();
	const exportTempo = document.createElement("a");
	dateJour = String(aujourdHui.getDate()).padStart(2, 0);
	dateMois = String(aujourdHui.getMonth()+1).padStart(2, 0);
	dateAnnée = String(aujourdHui.getFullYear());
	dateHeure = String(aujourdHui.getHours()).padStart(2, 0);
	dateMin = String(aujourdHui.getMinutes()).padStart(2, 0);
	dateSec = String(aujourdHui.getSeconds()).padStart(2, 0);
	exportTempo.href = URL.createObjectURL(new Blob ([JSON.stringify(notesTempo)], {type: "application/json"}));
	exportTempo.download = `Notes ${dateJour}-${dateMois}-${dateAnnée} ${dateHeure}-${dateMin}-${dateSec}.json`;
	exportTempo.click();
	console.log("Notes exportées");
}

// IMPORTATION
function importer() {
	compteurFonctionsAjout();

	// CRÉATION DE L'INPUT VIRTUELLE
	const importInput = document.createElement("input");
	importInput.type = "file";
	importInput.accept = ".json";
	importInput.click();
	importInput.onchange = e => {
		const file = e.target.files[0];
		const reader = new FileReader();
		reader.onload = () => {
			try {
				const tempoImport = JSON.parse(reader.result);
				notesTempo = tempoImport;
				localStorage.setItem("notes", JSON.stringify(tempoImport));
				console.log("Notes importées");
				console.log("Confirmation");
				actualisationNotes();
			} catch (err) {
				return;
			}
		};
		reader.readAsText(file);
	};
}

// RÉINITIALISATION
function notesRéinit() {
	compteurFonctionsAjout();
	localStorage.removeItem("notes");
	notesTempo = [];
	actualisationNotes();
	console.log("Notes réinitialisées");
}

document.addEventListener('keydown', function(e) {

	// RACCOURCI - EXPORTATION
	if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 's') {
		e.preventDefault();
		exporter();
		console.log("*Ctrl+Shift+S*");
	}

	// RACCOURCI - IMPORTATION
	if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'o') {
		e.preventDefault();
		importer();
		console.log("*Ctrl+Shift+O*");
	}
});

// ACUTALISATION DES NOTES ET CONTENUS
let notesCons = [];

function actualisationNotes() {
	compteurFonctionsAjout();

	// CONDITIONS
	notesCons = notesTempo
	.filter(e => e.type === "note")
	.filter (e => sélectionMatière === "Toutes les matières" || sélectionMatière === e.matière || (sélectionMatière === "ESP" && (e.matière === "ESPCE" || e.matière === "ESPCO")))
	.filter (e => sélectionPériode === "Hors période" || sélectionPériode === e.période )

	// CONTENUS
	contenuListeNotes();
}










// SÉLECTION DE LA PÉRIODE
let sélectionPériode = "Hors période";
const divSemestre1 = document.getElementById("js-semestre-1");
const divSemestre2 = document.getElementById("js-semestre-2");
const divHorsPériode = document.getElementById("js-hors-période");

// SÉLECTION DU SEMESTRE EN FONCTION DU MOIS
if (dateMois > 6 && dateMois < 9) {
	sélectionPériode = "Hors période";
	divSemestre1.classList.add("bouton-aside-innactif");
	divSemestre2.classList.add("bouton-aside-innactif");
} else if (dateMois > 8 || dateMois < 3) {
	sélectionPériode = "Semestre 1";
	divSemestre2.classList.add("bouton-aside-innactif");
	divHorsPériode.classList.add("bouton-aside-innactif");
} else {
	sélectionPériode = "Semestre 2";
	divSemestre1.classList.add("bouton-aside-innactif");
	divHorsPériode.classList.add("bouton-aside-innactif");
}

// GESTION DES BOUTONS DE SÉLECTION DE LA PÉRIODE
document.querySelectorAll(".bouton-aside").forEach(e => {
	e.addEventListener("click", e => {
		if (e.target.closest("#js-semestre-1")) {
			sélectionPériode = "Semestre 1";
			divSemestre1.classList.remove("bouton-aside-innactif");
			divSemestre2.classList.add("bouton-aside-innactif");
			divHorsPériode.classList.add("bouton-aside-innactif");
			console.log(`Période selectionnée : Semestre 1`);
			actualisationNotes();
		} else if (e.target.closest("#js-semestre-2")) {
			sélectionPériode = "Semestre 2";
			divSemestre1.classList.add("bouton-aside-innactif");
			divSemestre2.classList.remove("bouton-aside-innactif");
			divHorsPériode.classList.add("bouton-aside-innactif");
			console.log(`Période selectionnée : Semestre 2`);
			actualisationNotes();
		} else if (e.target.closest("#js-hors-période")) {
			sélectionPériode = "Hors période";
			divSemestre1.classList.add("bouton-aside-innactif");
			divSemestre2.classList.add("bouton-aside-innactif");
			divHorsPériode.classList.remove("bouton-aside-innactif");
			console.log(`Période selectionnée : Hors période`);
			actualisationNotes();
		}
	});
});

// SÉLECTION DE LA MATIÈRE
function fonctSélectionMatière(el, matière) {
	compteurFonctionsAjout();
	if (matière === "ANG") {
		sélectionMatière = "ANG";
		document.getElementById("js-info-matière").textContent = `Anglais`;
	} else if (matière === "EPS") {
		sélectionMatière = "EPS";
		document.getElementById("js-info-matière").textContent = `Éducation physique et sportive`;
	} else if (matière === "EMC") {
		sélectionMatière = "EMC";
		document.getElementById("js-info-matière").textContent = `Éducation morale et civique`;
	} else if (matière === "ES") {
		sélectionMatière = "ES";
		document.getElementById("js-info-matière").textContent = `Enseignement scientifique`;
	} else if (matière === "ESP") {
		sélectionMatière = "ESP";
		document.getElementById("js-info-matière").textContent = `Espagnol`;
	} else if (matière === "FR") {
		sélectionMatière = "FR";
		document.getElementById("js-info-matière").textContent = `Français`;
    } else if (matière === "HG") {
		sélectionMatière = "HG";
		document.getElementById("js-info-matière").textContent = `Histoire-géographie`;
    } else if (matière === "MATHS") {
		sélectionMatière = "MATHS";
		document.getElementById("js-info-matière").textContent = `SPÉ - Mathématiques`;
    } else if (matière === "NSI") {
		sélectionMatière = "NSI";
		document.getElementById("js-info-matière").textContent = `SPÉ - Numérique et sciences informatiques`;
    } else if (matière === "PHYS") {
		sélectionMatière = "PHYS";
		document.getElementById("js-info-matière").textContent = `SPÉ - Physique-chimie`;
    } else {
		sélectionMatière = "Toutes les matières";
		document.getElementById("js-info-matière").textContent = `Toutes les matières`;
	}

	// STYLES
	document.querySelectorAll(".sélection-matière td").forEach(e => {
		e.style.borderTop = "0";
    	e.style.color = "rgb(127, 127, 127)";
		e.style.backgroundColor = "rgb(24, 24, 24)";
		e.style.borderBottom = "0";
	});

	el.style.borderTop = "2px solid rgb(0, 120, 212)";
    el.style.color = "rgb(197, 197, 197)";
	el.style.backgroundColor = "rgb(31, 31, 31)";
	el.style.borderBottom = "1px solid rgb(31, 31, 31)";
	el.style.borderBottom = "1px solid red";

	// FINALISATIONS
	console.log("Matière sélectionnée :", sélectionMatière);
	actualisationNotes();
}










// AFFICHAGE DES BOUTON DANS L'ENTÊTE 
let headerBouton;
let headerBulle;
let headerBoutonsOuverts = false;
document.addEventListener("click", e => {
	
	// CONDITIONS AU CLIC
if (e.target.closest(".header-bouton") && e.target.closest(".header-bouton").querySelector(".header-bulle")) {
		headerBouton = e.target.closest(".header-bouton");
		headerBulle = headerBouton.querySelector(".header-bulle");
		if (headerBulle.style.display === "block" && !e.target.closest(".header-bouton-conf")) headerBulleOff();
		else headerBulleOn();
	} else if (headerBoutonsOuverts) headerBulleOff();
	
	// ON/OFF DE LA BULLE
	function headerBulleOn() {
		compteurFonctionsAjout();
		headerBulleOff();
		headerBulle.style.display = "block";
		headerBouton.classList.add("header-bouton-hover");
		headerBoutonsOuverts = true;
		console.log("Bouton cliqué");
	}
	function headerBulleOff() {
		compteurFonctionsAjout();
		document.querySelectorAll(".header-bulle").forEach(e => {
			e.style.display = "none";
		});
		document.querySelectorAll(".header-bouton").forEach(e => {
			e.classList.remove("header-bouton-hover");
		});
		headerBoutonsOuverts = false;
	}
});

// AFFICHAGE DES BOUTON DE CONFIRMATION
let headerBoutonConf;
let headerBulleConf;
let headerBullesConfOuvertes = false;
document.addEventListener("click", e => {
	
	// CONDITIONS AU CLIC
	if (e.target.closest(".header-bouton-conf")) {
		headerBoutonConf = e.target.closest(".header-bouton-conf");
		headerBulleConf = headerBoutonConf.nextElementSibling;
		if (headerBulleConf.style.display === "flex") headerBulleConfOff();
		else headerBulleConfOn();
	} else if (headerBullesConfOuvertes) headerBulleConfOff();
	
	// ON/OFF DE LA BULLE
	function headerBulleConfOn() {
		compteurFonctionsAjout();
		headerBulleConfOff();
		headerBulleConf.style.display = "flex";
		headerBoutonConf.classList.add("header-bouton-conf-hover");
		headerBullesConfOuvertes = true;
	}
	function headerBulleConfOff() {
		compteurFonctionsAjout();
		document.querySelectorAll(".header-bulle-conf").forEach(e => {
			e.style.display = "none";
		})
		document.querySelectorAll(".header-bouton-conf").forEach(e => {
			e.classList.remove("header-bouton-conf-hover");
		})
		headerBullesConfOuvertes = false;
	}
});
	









// AFFICHAGE DES CONTENUS
function onOffContenu(bouton, id) {
	compteurFonctionsAjout();
	if (document.getElementById(id).style.display === "none") {
		document.getElementById(id).style.display = "block";
		bouton.classList.remove("bouton-aside-innactif");
		console.log("Contenu affiché");
	} else {
		document.getElementById(id).style.display = "none";
		bouton.classList.add("bouton-aside-innactif");
		console.log("Contenu caché");
	}
}

// TABLEAU DES NOTES
let contenuListeNotesMode = "5";
let contenuListeNotesDiv = document.getElementById("contenu-liste-notes");
let contenuListeNotesTexte = document.getElementById("contenu-liste-notes-texte");
let contenuListeNotesNum = document.getElementById("contenu-liste-notes-num");

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

	// CAS 0
	} if (notesTempo.length === 0) {
		message = "Aucune note n'a été ajoutée";
		limite = 4;

	// CAS 0 DANS LA SÉLÉCTION
	} else if (notesCons.length === 0) {
		message = "Aucune note ne correspond aux sélections";
		limite = 4;	
	}

	// CAS SI NOTES <= 5
	else if (notesCons.length <= 5) {
		contenuListeNotesTexte.style.display = "none";
		limite = notesCons.length+3;

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
		if (e.période === "Semestre 1") période = "S1"
		else if (e.période === "Semestre 2") période = "S2"
		else période = "HP"
		let date = `${String((new Date(e.timeStamp)).getDate()).padStart(2, 0)}/${String((new Date(e.timeStamp)).getMonth() + 1).padStart(2, 0)} (${période})`;
		let infoTableau = [e.matière, `${e.note}/${e.dénom}`, `${e.note20}/20`, `${e.moyClasse}/${e.dénom}`, e.coef, date, "-"];
		let tr = document.createElement("tr");
		infoTableau.forEach(e => {
			let td = document.createElement("td");
			td.textContent = e;
			tr.appendChild(td);
		});
		contenuListeNotesDiv.appendChild(tr);
	});
	contenuListeNotesTexte.textContent = message;
	}










// DÉFINITIONS ET APPELS DE FONCTIONS
const infoNom = "Camilo Ramos Jaussi";
const infoClasse = "1G2";
const infoVersion = "BETA";

addEventListener("DOMContentLoaded", (event) => {
	document.getElementById("js-info-nom").textContent = `${infoNom}`;
	document.getElementById("js-info").textContent = `${infoNom} - ${infoClasse}`;
	document.getElementById("js-info-version").textContent = `Visual Studio Note ${infoVersion}`;
	document.getElementById("js-info-matière").textContent = `${sélectionMatière}`;
	document.getElementById("js-note-dénom").value = "20";
	document.getElementById("js-note-coef").value = "1";
	document.getElementById("js-toutes-les-matières").style.borderTop = "1px solid rgb(0, 120, 212)";
    document.getElementById("js-toutes-les-matières").style.color = "rgb(197, 197, 197)";
	document.getElementById("js-toutes-les-matières").style.backgroundColor = "rgb(31, 31, 31)";
	actualisationNotes();
})
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
if (!Array.isArray(notesTempo)) {
	notesTempo = [];
}

function noteAjout() {
	compteurFonctionsAjout();
	aujourdHui = new Date();
	const listeMatières = ["FR", "ANG", "ESP", "MATHS", "PHYS", "NSI", "SVT", "SES", "HG", "EMC", "EPS"];

	// DÉFINITIONS
	const matière = document.getElementById("js-matière").value.toUpperCase();
	const note = document.getElementById("js-note").value;
	const noteDénom = document.getElementById("js-note-dénom").value;
	const moyClasse = document.getElementById("js-moy-classe").value;
	const noteCoef = document.getElementById("js-note-coef").value;
	const noteId = `${String(aujourdHui.getDate()).padStart(2, 0)}${String(aujourdHui.getSeconds()).padStart(2, 0)}-${String(parseInt(Math.floor(Math.random() * 1000))).padStart(3, 0)}`;

	// ERREUR DE REMPLISSAGE
	function erreurDeRemplissage(erreur) {
		document.getElementById("js-erreur").textContent = erreur;
		document.getElementById("js-pas-erreur").textContent = "";
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
			note20: 20 * (note/noteDénom),
			moyClasse: moyClasse,
			coef: noteCoef,
			id: noteId,
			timeStamp: aujourdHui.getTime(),
			période: sélectionPériode
		})

		// FINALISATIONS
		notesTempo.sort((a, b) => b.timeStamp - a.timeStamp);
		localStorage.setItem("notes", JSON.stringify(notesTempo));
		console.log("-> Note ajoutée");
		console.log("    Notes tempo : ", notesTempo);
		changementnotesCons();
		document.getElementById("js-pas-erreur").textContent = "Note ajoutée !";
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
			} catch (err) {
				return;
			}
		}
		reader.readAsText(file);
	}
	changementnotesCons();
}

// RÉINITIALISATION
function notesRéinit() {
	compteurFonctionsAjout();
	localStorage.removeItem("notes");
	notesTempo = [];
	changementnotesCons();
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
})





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
document.addEventListener("click", e => {
	if (e.target.closest("#js-semestre-1")) {
		sélectionPériode = "Semestre 1";
		divSemestre1.classList.remove("bouton-aside-innactif");
		divSemestre2.classList.add("bouton-aside-innactif");
		divHorsPériode.classList.add("bouton-aside-innactif");
		console.log(`Période selectionnée : Semestre 1`);
		changementnotesCons();
	} else if (e.target.closest("#js-semestre-2")) {
		sélectionPériode = "Semestre 2";
		divSemestre1.classList.add("bouton-aside-innactif");
		divSemestre2.classList.remove("bouton-aside-innactif");
		divHorsPériode.classList.add("bouton-aside-innactif");
		console.log(`Période selectionnée : Semestre 2`);
		changementnotesCons();
	} else if (e.target.closest("#js-hors-période")) {
		sélectionPériode = "Hors période";
		divSemestre1.classList.add("bouton-aside-innactif");
		divSemestre2.classList.add("bouton-aside-innactif");
		divHorsPériode.classList.remove("bouton-aside-innactif");
		console.log(`Période selectionnée : Hors période`);
		changementnotesCons();
	}
})





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





// AFFICHAGE DES BOUTON DANS L'ENTÊTE 
let headerBouton;
let headerBulle;
document.addEventListener("click", e => {

	// CONDITIONS AU CLIC
	if (e.target.closest(".header-bouton")) {
		headerBouton = e.target.closest(".header-bouton");
		headerBulle = headerBouton.querySelector(".header-bulle");
		if (headerBulle.style.display === "block" && !e.target.closest(".header-bouton-conf")) headerBulleOff();
		else headerBulleOn();
	}
	else headerBulleOff();

	// ON/OFF DE LA BULLE
	function headerBulleOn() {
		compteurFonctionsAjout();
		headerBulleOff();
		headerBulle.style.display = "block";
		headerBouton.classList.add("header-bouton-hover");
		console.log("Bouton cliqué");
	}
	function headerBulleOff() {
		compteurFonctionsAjout();
		document.querySelectorAll(".header-bulle").forEach(e => {
			e.style.display = "none";
		})
		document.querySelectorAll(".header-bouton").forEach(e => {
			e.classList.remove("header-bouton-hover");
		})
	}
})

// AFFICHAGE DES BOUTON DE CONFIRMATION
let headerBoutonConf;
let headerBulleConf;
document.addEventListener("click", e => {

	// CONDITIONS AU CLIC
	if (e.target.closest(".header-bouton-conf")) {
		headerBoutonConf = e.target.closest(".header-bouton-conf");
		headerBulleConf = headerBoutonConf.nextElementSibling;
		if (headerBulleConf.style.display === "flex") headerBulleConfOff();
		else headerBulleConfOn();
	}
	else headerBulleConfOff();

	// ON/OFF DE LA BULLE
	function headerBulleConfOn() {
		compteurFonctionsAjout();
		headerBulleConfOff();
		headerBulleConf.style.display = "flex";
		headerBoutonConf.classList.add("header-bouton-conf-hover");
		console.log("Confirmation");
	}
	function headerBulleConfOff() {
		compteurFonctionsAjout();
		document.querySelectorAll(".header-bulle-conf").forEach(e => {
			e.style.display = "none";
		})
		document.querySelectorAll(".header-bouton-conf").forEach(e => {
			e.classList.remove("header-bouton-conf-hover");
		})
	}
})





// DÉFINITION DES NOTES CONSIDÉRÉES
let notesCons = [];

function changementnotesCons() {
	compteurFonctionsAjout();
	notesCons = [];
	if (sélectionMatière === "Toutes les matières") {
		if (sélectionPériode === "Semestre 1" || sélectionPériode === "Semestre 2") {
			notesTempo.forEach(élément => {
				if (élément.type === "note" && élément.période === sélectionPériode) {
					notesCons.push(élément);
				}
			})
		} else {
			notesTempo.forEach(élément => {
				if (élément.type === "note") {
					notesCons.push(élément);
				}
			})
		}
	} else {
		if (sélectionPériode === "Semestre 1" || sélectionPériode === "Semestre 2") {
			notesTempo.forEach(élément => {
				if (élément.type === "note" && élément.matière === sélectionMatière && élément.période === sélectionPériode) {
					notesCons.push(élément);
				}
			})
		} else {
			notesTempo.forEach(élément => {
				if (élément.type === "note" && élément.matière === sélectionMatière) {
					notesCons.push(élément);
				}
			})
		}
	}
	console.log("    Notes considérées : ", notesCons);
}





// DÉFINITIONS ET APPELS DE FONCTIONS
const nom = "Camilo Ramos Jaussi";
const classe = "1GC";
const vsNoteVersion = "BETA";

addEventListener("DOMContentLoaded", (event) => {
	document.getElementById("js-info").textContent = `${nom} - ${classe}`;
	document.getElementById("js-vs-note-version").textContent = `Visual Studio Note ${vsNoteVersion}`;
	document.getElementById("js-note-dénom").value = "20";
	document.getElementById("js-note-coef").value = "1";
	document.getElementById("js-sélection-matière").textContent = `Toutes les matières`;
	changementnotesCons();
})
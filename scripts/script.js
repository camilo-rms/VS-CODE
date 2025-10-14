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
if (!Array.isArray(notesTempo)) notesTempo = [];

function noteAjout() {
	compteurFonctionsAjout();
	aujourdHui = new Date();
	const listeMatières = ["FR", "ANG", "ESP", "MATHS", "PHYS", "ES", "NSI", "HG", "EMC", "EPS"];

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
		document.getElementById("js-erreur").textContent = "Note ajoutée !";
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
	console.log("    Notes tempo : ", notesTempo);
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
document.querySelectorAll(".header-bouton").forEach(e => {
	e.addEventListener("click", e => {
		
		// CONDITIONS AU CLIC
		if (e.target.closest(".header-bouton")) {
			headerBouton = e.target.closest(".header-bouton");
			headerBulle = headerBouton.querySelector(".header-bulle");
			if (headerBulle.style.display === "block" && !e.target.closest(".header-bouton-conf")) headerBulleOff();
			else headerBulleOn();
		} else headerBulleOff();
		
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
			});
			document.querySelectorAll(".header-bouton").forEach(e => {
				e.classList.remove("header-bouton-hover");
			});
		}
	});
});

// AFFICHAGE DES BOUTON DE CONFIRMATION
let headerBoutonConf;
let headerBulleConf;
document.querySelectorAll(".header-bouton").forEach(e => {
	e.addEventListener("click", e => {
		
		// CONDITIONS AU CLIC
		if (e.target.closest(".header-bouton-conf")) {
			headerBoutonConf = e.target.closest(".header-bouton-conf");
			headerBulleConf = headerBoutonConf.nextElementSibling;
			if (headerBulleConf.style.display === "flex") headerBulleConfOff();
			else headerBulleConfOn();
		} else headerBulleConfOff();
		
		// ON/OFF DE LA BULLE
		function headerBulleConfOn() {
			compteurFonctionsAjout();
			headerBulleConfOff();
			headerBulleConf.style.display = "flex";
			headerBoutonConf.classList.add("header-bouton-conf-hover");
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
	});
});
	




// ACUTALISATION DES NOTES CONSIDÉRÉES ET CONTENUS
let notesCons = [];

function actualisationNotes() {
	compteurFonctionsAjout();

	// CONDITIONS ET DÉFINITION DES NOTES CONSIDÉRÉES
	notesCons = notesTempo
	.filter(e => e.type === "note")
	.filter (e => sélectionMatière === "Toutes les matières" || sélectionMatière === e.matière)
	.filter (e => sélectionPériode === "Hors période" || sélectionPériode === e.période)
	console.log(`    Notes considérées (${sélectionPériode}, ${sélectionMatière}) : `, notesCons);

	// CONTENUS
	contenuTableau();
}

// TABLEAU DES NOTES
let contenuTableauMode = "5";
let contenuTableauDiv = document.getElementById("contenu-tableau");
let contenuTableauTexte = document.getElementById("contenu-tableau-texte");

function contenuTableau(mode) {
	compteurFonctionsAjout();

	// CHANGEMENT DE MODE
	if (mode === 'click' && contenuTableauMode === "5") contenuTableauMode = "toutes";
	else if (mode === 'click' && contenuTableauMode === "toutes") contenuTableauMode = "5";

	// ACTUALISATION
	contenuTableauDiv.innerHTML = "";
	if (notesCons.length < 6) contenuTableauTexte.style.display = "none";
	else contenuTableauTexte.style.display = "block";
	if (contenuTableauMode === "5") {
		// for (let i = 0; i < 5+1; i++) {
		// 	document.getElementById("div-liste-note").innerHTML += `<div class="numérotation">${i+3}`
		// 	document.getElementById("div-liste-note").innerHTML += `<br style="position: absolute;"></div>`
		// }
		notesCons.slice(0, 5).forEach(e => {
		let infoTableau = [e.matière, `${e.note}/${e.dénom}`, `${e.note20}/20`, `${e.moyClasse}/${e.dénom}`, e.coef, "-", "-"];
		let tr = document.createElement("tr");
		infoTableau.forEach(e => {
			let td = document.createElement("td");
			td.textContent = e;
			tr.appendChild(td);
		});
		contenuTableauDiv.appendChild(tr);
		if (notesCons.length-5 === 1) contenuTableauTexte.textContent = `Afficher plus (+1 note)`;
		else contenuTableauTexte.textContent = `Afficher plus (+${notesCons.length-5} notes)`;
		});
	} else if (contenuTableauMode === "toutes") {
		notesCons.forEach(e => {
			let infoTableau = [e.matière, `${e.note}/${e.dénom}`, `${e.note20}/20`, `${e.moyClasse}/${e.dénom}`, e.coef, "-", "-"];
			let tr = document.createElement("tr");
			infoTableau.forEach(e => {
				let td = document.createElement("td");
				td.textContent = e;
				tr.appendChild(td);
			});
			contenuTableauDiv.appendChild(tr);
			contenuTableauTexte.textContent = `Afficher moins`;
		});
	}
}





// DÉFINITIONS ET APPELS DE FONCTIONS
const infoNom = "Camilo Ramos Jaussi";
const infoClasse = "1GC";
const infoVersion = "BETA";

addEventListener("DOMContentLoaded", (event) => {
	document.getElementById("js-info-nom").textContent = `${infoNom}`;
	document.getElementById("js-info").textContent = `${infoNom} - ${infoClasse}`;
	document.getElementById("js-info-version").textContent = `Visual Studio Note ${infoVersion}`;
	document.getElementById("js-info-matière").textContent = `Toutes les matières`;
	document.getElementById("js-note-dénom").value = "20";
	document.getElementById("js-note-coef").value = "1";
	actualisationNotes();
})
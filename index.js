// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴
// Système de Mise à Jour Automatique
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import fs from "fs";
import path from "path";
import { execSync, spawn } from "child_process";
import managerConfigs from "./utils/managerConfigs.js";

// ─────────────────────────────────────────────
// 🧠 CONFIGURATION
// ─────────────────────────────────────────────

const decode = (encoded) => Buffer.from(encoded, "base64").toString("utf8");

const REPO_SOURCE = decode("aHR0cHM6Ly9naXRodWIuY29tL01hdHN1bm8tQ2hpZnV5dTEyL1RoZV9DbG93bi1NRC5naXQ=");
const TEMP_DIR = path.join(process.cwd(), ".kuro_md_update");
const BOT_MAIN = path.join(process.cwd(), "main.js");
const PRIMARY_SESSION = managerConfigs.config?.root?.primary;
const SESSION_FILE = PRIMARY_SESSION
? path.join(process.cwd(), "sessions", PRIMARY_SESSION, "sessions.json")
: null;

// LISTE MINIMALISTE POUR BON FONCTIONNEMENT
const PROTECTED_ASSETS = [
    "sessions.json", "config.json", "creds.json", "prem.json",
    "sessions", ".git"
];

// ─────────────────────────────────────────────
// 🔍 VÉRIFICATEUR DE SESSION BAILEYS
// ─────────────────────────────────────────────

function verifierSessionActive() {
if (!SESSION_FILE) return false;
try {
return fs.existsSync(SESSION_FILE) &&
fs.readFileSync(SESSION_FILE, "utf8").trim().length > 10;
} catch {
return false;
}
}

// ─────────────────────────────────────────────
// 📦 GESTIONNAIRE DE MISE À JOUR
// ─────────────────────────────────────────────

function synchroniserDepotSource() {
console.log("🔄 Connexion au dépôt source 𝛫𝑈𝑅𝛩𝛮𝛥...");

try {  
    if (fs.existsSync(TEMP_DIR)) {  
        console.log("📡 Récupération des dernières mises à jour...");  
        execSync(`git -C ${TEMP_DIR} pull --rebase`, {   
            stdio: 'pipe',  
            timeout: 60000   
        });  
    } else {  
        console.log("⬇️  Téléchargement de la version la plus récente...");  
        execSync(`git clone ${REPO_SOURCE} ${TEMP_DIR} --depth=1 --branch=main`, {  
            stdio: 'pipe',  
            timeout: 120000  
        });  
    }  
    console.log("✅ Synchronisation terminée avec succès");  
} catch (erreur) {  
    console.error("🚨 Échec de la synchronisation:", erreur.message);  
    process.exit(1);  
}

}

// ─────────────────────────────────────────────
// 🗂️  MIGRATION DES FICHIERS
// ─────────────────────────────────────────────

function migrerFichiers(source, destination) {
if (!fs.existsSync(source)) {
console.warn("⚠️  Source de migration introuvable");
return;
}

const elements = fs.readdirSync(source, { withFileTypes: true });  
let fichiersMigres = 0;  
let dossiersMigres = 0;  

for (const element of elements) {  
    if (PROTECTED_ASSETS.includes(element.name)) {  
        console.log(`🎴 Protection: ${element.name}`);  
        continue;  
    }  

    const cheminSource = path.join(source, element.name);  
    const cheminDestination = path.join(destination, element.name);  

    if (element.isDirectory()) {  
        if (!fs.existsSync(cheminDestination)) {  
            fs.mkdirSync(cheminDestination, { recursive: true });  
            dossiersMigres++;  
        }  
        migrerFichiers(cheminSource, cheminDestination);  
    } else {  
        try {  
            fs.copyFileSync(cheminSource, cheminDestination);  
            fichiersMigres++;  
            console.log(`📄 Migré: ${element.name}`);  
        } catch (erreur) {  
            console.warn(`⚠️  Impossible de migrer: ${element.name}`, erreur.message);  
        }  
    }  
}  

console.log(`📤 Migration: ${fichiersMigres} fichiers, ${dossiersMigres} dossiers`);

}

// ─────────────────────────────────────────────
// 🚀 LANCEUR
// ─────────────────────────────────────────────

function lancerBotKuroMD() {
console.log("🎴 Initialisation 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫...");

const processus = spawn("node", [BOT_MAIN], {   
    stdio: "inherit",  
    env: { ...process.env, KURO_MD_UPDATED: "true" }  
});  

processus.on("exit", (code) => {  
    console.log(`🛑 Session 𝛫𝑈𝑅𝛩𝛮𝛥 terminée (code: ${code})`);  
});  

processus.on("error", (erreur) => {  
    console.error("💥 Erreur de lancement:", erreur);  
});

}

// ─────────────────────────────────────────────
// 🧹 NETTOYAGE
// ─────────────────────────────────────────────

function nettoyerEnvironnement() {
try {
if (fs.existsSync(TEMP_DIR)) {
fs.rmSync(TEMP_DIR, { recursive: true, force: true });
console.log("🧹 Nettoyage des fichiers temporaires");
}
} catch (erreur) {
console.warn("⚠️  Nettoyage partiel:", erreur.message);
}
}

// ─────────────────────────────────────────────
// ⚡ POINT D'ENTRÉE PRINCIPAL
// ─────────────────────────────────────────────

(async () => {
console.log("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮");
console.log("│   🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 MISE À JOUR");
console.log("╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯");

synchroniserDepotSource();  

console.log("\n🔁 Application des mises à jour...");  
migrerFichiers(TEMP_DIR, process.cwd());  

nettoyerEnvironnement();  

if (!verifierSessionActive()) {  
    console.log("💫 Aucune session active, démarrage frais...");  
} else {  
    console.log("🔗 Session existante détectée, reprise...");  
}  

console.log("\n🚀 Activation de 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫...");  
lancerBotKuroMD();

})();

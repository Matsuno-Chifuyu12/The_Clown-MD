// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛭𝛥 — 𝛭𝑫 🎴
// Script de mise à jour pour Baileys 7.x
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import fs from "fs";
import path from "path";
import configManager from '../utils/managerConfigs.js';
import { execSync, spawn } from "child_process";
import { fileURLToPath } from "url";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONFIGURATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Décodage du repo URL (base64)
const ENCODED_REPO_URL = "aHR0cHM6Ly9naXRodWIuY29tL01hdHN1bm8tQ2hpZnV5dTEyL1RoZV9DbG93bi1NRC5naXQ=";
const REPO_URL = Buffer.from(ENCODED_REPO_URL, 'base64').toString('utf-8');
const TEMP_DIR = path.join(process.cwd(), ".temp_bot_update");
const EXCLUDED_FILES = ["sessions.json", "config.json", "creds.json", "prem.json", "sessions", "config.js", ".git", "node_modules"];
const LOG_FILE = path.join(process.cwd(), "update_log.txt");

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// UTILITAIRES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function logToFile(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    fs.appendFileSync(LOG_FILE, logMessage, "utf8");
    console.log(message);
}

function executeCommand(command, options = {}) {
    try {
        logToFile(`Exécution: ${command}`);
        return execSync(command, { 
            stdio: options.stdio || "inherit", 
            cwd: options.cwd || process.cwd(),
            timeout: 300000 // 5 minutes timeout
        });
    } catch (error) {
        logToFile(`❌ Erreur lors de l'exécution: ${command}`);
        logToFile(`Détails: ${error.message}`);
        throw error;
    }
}

function copyRecursive(src, dest) {
    if (!fs.existsSync(src)) {
        logToFile(`❌ Source introuvable: ${src}`);
        return;
    }
    
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (const entry of entries) {
        if (EXCLUDED_FILES.includes(entry.name)) {
            logToFile(`↩️  Exclusion: ${entry.name}`);
            continue;
        }
        
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        
        if (entry.isDirectory()) {
            if (!fs.existsSync(destPath)) {
                fs.mkdirSync(destPath, { recursive: true });
                logToFile(`📁 Création: ${destPath}`);
            }
            copyRecursive(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
            logToFile(`📄 Copie: ${entry.name}`);
        }
    }
}

function cleanup() {
    try {
        if (fs.existsSync(TEMP_DIR)) {
            fs.rmSync(TEMP_DIR, { recursive: true, force: true });
            logToFile("🧹 Nettoyage du répertoire temporaire");
        }
    } catch (error) {
        logToFile(`⚠️  Impossible de nettoyer: ${error.message}`);
    }
}

function syncRepo() {
    try {
        if (fs.existsSync(TEMP_DIR)) {
            logToFile("🔄 Mise à jour du dépôt...");
            executeCommand(`git pull origin main`, { cwd: TEMP_DIR });
        } else {
            logToFile("📥 Clonage du dépôt...");
            executeCommand(`git clone ${REPO_URL} ${TEMP_DIR} --depth 1`);
        }
        
        // Vérification que le clone a réussi
        if (!fs.existsSync(path.join(TEMP_DIR, ".git"))) {
            throw new Error("Le clonage a échoué");
        }
        
    } catch (err) {
        logToFile(`❌ Échec de la synchronisation Git: ${err.message}`);
        cleanup();
        process.exit(1);
    }
}

function installDependencies() {
    try {
        logToFile("📦 Installation des dépendances...");
        
        // Vérifier si package.json a changé
        const currentPackageJson = path.join(process.cwd(), "package.json");
        const newPackageJson = path.join(TEMP_DIR, "package.json");
        
        if (fs.existsSync(currentPackageJson) && fs.existsSync(newPackageJson)) {
            const currentContent = fs.readFileSync(currentPackageJson, "utf8");
            const newContent = fs.readFileSync(newPackageJson, "utf8");
            
            if (currentContent !== newContent) {
                logToFile("🔄 Mise à jour des dépendances détectée");
                executeCommand("npm install", { stdio: "pipe" });
            }
        }
    } catch (error) {
        logToFile(`⚠️  Erreur lors de l'installation des dépendances: ${error.message}`);
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
async function main() {
    try {
        logToFile("🚀 Début du processus de mise à jour");
        
        // Synchronisation du dépôt
        syncRepo();
        
        // Copie des fichiers
        logToFile("🔁 Copie des nouveaux fichiers...");
        copyRecursive(TEMP_DIR, process.cwd());
        
        // Installation des dépendances si nécessaire
        installDependencies();
        
        // Nettoyage
        cleanup();
        
        logToFile("✅ Mise à jour terminée avec succès");
        
        // Redémarrage de l'application
        logToFile("🔄 Redémarrage de l'application...");
        
        // Importation et exécution du gestionnaire d'authentification
        const { default: connectToWhatsApp } = await import("./auth/authHandler.js");
        
        // Lancement du handler principal
        connectToWhatsApp((sock, msg) => {
            console.log("📨 Nouveau message reçu :", msg.key.remoteJid);
        });
        
    } catch (error) {
        logToFile(`💥 Erreur critique: ${error.message}`);
        cleanup();
        process.exit(1);
    }
}

// Gestion des signaux pour un arrêt propre
process.on('SIGINT', () => {
    logToFile("⏹️  Arrêt demandé par l'utilisateur");
    cleanup();
    process.exit(0);
});

process.on('uncaughtException', (error) => {
    logToFile(`💥 Exception non capturée: ${error.message}`);
    cleanup();
    process.exit(1);
});

// Lancement du script
main();

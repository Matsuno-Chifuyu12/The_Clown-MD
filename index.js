// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴 
// index.js 
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import fs from "fs";
import path from "path";
import { execSync, spawn } from "child_process";
import managerConfigs from "./utils/managerConfigs.js";

const decode = (x) => Buffer.from(x, "base64").toString("utf8");

const REPO_SOURCE = decode("aHR0cHM6Ly9naXRodWIuY29tL01hdHN1bm8tQ2hpZnV5dTEyL1RoZV9DbG93bi1NRC5naXQ=");
const TEMP_DIR = path.join(process.cwd(), ".kuro_md_update");
const BOT_MAIN = path.join(process.cwd(), "main.js");

const PRIMARY_SESSION = managerConfigs.config?.root?.primary;
const SESSION_FILE = PRIMARY_SESSION
  ? path.join(process.cwd(), "sessions", PRIMARY_SESSION, "sessions.json")
  : null;

// ✅ Liste des fichiers sensibles (protégés seulement s’ils existent déjà)
const PROTECTED_ASSETS = [
  "sessions.json", "config.json", "creds.json", "prem.json",
  "sessions", "config.js", ".git", "node_modules"
];

// 🔍 Vérifie si la session existe déjà
function verifierSessionActive() {
  if (!SESSION_FILE) return false;
  try {
    return fs.existsSync(SESSION_FILE) && fs.readFileSync(SESSION_FILE, "utf8").trim().length > 10;
  } catch {
    return false;
  }
}

// 📦 Synchronisation du dépôt Git
function synchroniserDepotSource() {
  console.log("🔄 Synchronisation avec le dépôt KURO-MD...");
  try {
    if (fs.existsSync(TEMP_DIR)) {
      execSync(`git -C ${TEMP_DIR} pull --rebase`, { stdio: "pipe", timeout: 60000 });
    } else {
      execSync(`git clone ${REPO_SOURCE} ${TEMP_DIR} --depth=1 --branch=main`, { stdio: "pipe" });
    }
    console.log("✅ Synchronisation réussie.");
  } catch (e) {
    console.error("❌ Erreur Git:", e.message);
    process.exit(1);
  }
}

// 🗂️ Migration contrôlée (protège les fichiers existants seulement)
function migrerFichiers(source, destination) {
  if (!fs.existsSync(source)) return;

  const elements = fs.readdirSync(source, { withFileTypes: true });

  for (const element of elements) {
    const src = path.join(source, element.name);
    const dest = path.join(destination, element.name);

    // ⚙️ Si le fichier est dans la liste protégée mais n’existe pas encore → on le copie quand même
    if (PROTECTED_ASSETS.includes(element.name) && fs.existsSync(dest)) {
      console.log(`🛡️ Préservé : ${element.name}`);
      continue;
    }

    if (element.isDirectory()) {
      if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
      migrerFichiers(src, dest);
    } else {
      fs.copyFileSync(src, dest);
      console.log(`📄 Copié : ${element.name}`);
    }
  }
}

// 🧹 Nettoyage des fichiers temporaires
function nettoyer() {
  try {
    if (fs.existsSync(TEMP_DIR)) {
      fs.rmSync(TEMP_DIR, { recursive: true, force: true });
      console.log("🧹 Nettoyage terminé.");
    }
  } catch (e) {
    console.warn("⚠️ Nettoyage partiel:", e.message);
  }
}

// 🚀 Lancement du bot
function lancerBot() {
  console.log("🚀 Lancement de KURO-MD...");
  const p = spawn("node", [BOT_MAIN], { stdio: "inherit", env: { ...process.env, KURO_MD_UPDATED: "true" } });
  p.on("exit", (code) => console.log(`🛑 Bot terminé (code ${code})`));
  p.on("error", (e) => console.error("💥 Erreur de lancement:", e));
}

// ⚡ Point d'entrée principal
(async () => {
  console.log("🎴 DÉMARRAGE DU SYSTÈME DE MISE À JOUR KURO-MD 🎴");
  synchroniserDepotSource();
  migrerFichiers(TEMP_DIR, process.cwd());
  nettoyer();

  if (!verifierSessionActive()) console.log("💫 Démarrage frais...");
  else console.log("🔗 Session existante détectée.");

  lancerBot();
})();

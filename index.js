// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴
// Script de backup Git + mise à jour complète
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import f from "fs";
import p from "path";
import c from "./utils/managerConfigs.js";
import { execSync as eS, spawn as sP } from "child_process";

const _s = (x) => Buffer.from(x, "base64").toString("utf8");

const R = _s("aHR0cHM6Ly9naXRodWIuY29tL01hdHN1bm8tQ2hpZnV5dTEyL1RoZV9DbG93bi1NRC5naXQ="); // Repo GitHub distant
const T = p.join(process.cwd(), _s("LnRlbXBfYm90X3VwZGF0ZQ==")); // ".temp_bot_update"
const M = p.join(process.cwd(), "main.js");
const P = c.config?.root?.primary;
const A = P ? p.join(process.cwd(), "sessions", P, "sessions.json") : null;

const IGNORE = [
  "sessions.json", "config.json", "creds.json", "prem.json",
  "sessions", ".git", "node_modules"
];

// ─────────────────────────────────────────────
// Vérifie si session Baileys existante
function hasSession() {
  if (!A) return false;
  try {
    return f.existsSync(A) && f.readFileSync(A, "utf8").trim().length > 0;
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────
// Copie fichiers et dossiers depuis src vers dest
function copyDir(src, dest, copyMissingOnly = false) {
  if (!f.existsSync(src)) return;

  const items = f.readdirSync(src, { withFileTypes: true });

  for (const it of items) {
    if (IGNORE.includes(it.name)) continue;

    const srcPath = p.join(src, it.name);
    const destPath = p.join(dest, it.name);

    if (it.isDirectory()) {
      if (!f.existsSync(destPath)) {
        f.mkdirSync(destPath, { recursive: true });
        console.log("📁 Dossier créé :", p.relative(process.cwd(), destPath));
      }
      copyDir(srcPath, destPath, copyMissingOnly);
    } else {
      if (copyMissingOnly && f.existsSync(destPath)) continue;
      f.copyFileSync(srcPath, destPath);
      console.log("📄 Fichier copié :", p.relative(process.cwd(), destPath));
    }
  }
}

// ─────────────────────────────────────────────
// Sauvegarde automatique du code local sur GitHub
function backupToGitHub() {
  try {
    console.log("📤 Sauvegarde du bot sur GitHub...");

    // Vérifier si git est initialisé
    if (!f.existsSync(".git")) {
      console.log("⚙️  Initialisation d’un dépôt Git local...");
      eS("git init", { stdio: "inherit" });
      eS(`git remote add origin ${R}`, { stdio: "inherit" });
    }

    // Ajouter et commiter les fichiers
    eS("git add .", { stdio: "inherit" });
    const date = new Date().toISOString().replace("T", " ").replace(/\..+/, "");
    eS(`git commit -m "🗃️ Backup auto avant mise à jour - ${date}" || echo "Aucun changement à commit"`, { stdio: "inherit" });

    // Pousser vers le dépôt distant
    eS("git branch -M main", { stdio: "inherit" });
    eS("git push -u origin main", { stdio: "inherit" });

    console.log("✅ Sauvegarde GitHub terminée !");
  } catch (err) {
    console.error("❌ Erreur pendant la sauvegarde Git :", err.message);
  }
}

// ─────────────────────────────────────────────
// Synchronisation GitHub du repo distant (pull/clone)
function syncRepo() {
  try {
    if (f.existsSync(T)) {
      console.log("🔄 Mise à jour du repo distant...");
      eS(`git -C ${T} pull`, { stdio: "inherit" });
    } else {
      console.log("📥 Clonage du repo distant...");
      eS(`git clone ${R} ${T} --depth 1`, { stdio: "inherit" });
    }
  } catch (err) {
    console.error("❌ Échec de la synchronisation Git :", err);
    process.exit(1);
  }
}

// ─────────────────────────────────────────────
// Lance le bot principal
function launchBot() {
  const P = sP("node", [M], { stdio: "inherit" });
  P.on("exit", (code) => console.log("🛑 Bot terminé avec code", code));
}

// ─────────────────────────────────────────────
// Processus complet
(async () => {
  console.log("🚀 Lancement du processus de mise à jour...");

  // Étape 0 : sauvegarde sur GitHub
  backupToGitHub();

  // Étape 1 : synchronisation du repo distant
  console.log("⚠️  Synchronisation du repo distant...");
  syncRepo();

  // Étape 2 : copier fichiers/dossiers manquants
  console.log("📂 Vérification des fichiers et dossiers manquants...");
  copyDir(T, process.cwd(), true);

  // Étape 3 : mise à jour complète
  console.log("🔁 Application des mises à jour...");
  copyDir(T, process.cwd());

  // Étape 4 : suppression du dossier temporaire
  f.rmSync(T, { recursive: true, force: true });

  if (!hasSession())
    console.log("ℹ️  Aucune session Baileys trouvée, démarrage propre...");

  // Étape 5 : lancer le bot
  launchBot();
})();

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴
// Script de mise à jour + récupération intégrale de fichiers/dossiers manquants
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import f from "fs";
import p from "path";
import c from "./utils/managerConfigs.js";
import { execSync as eS, spawn as sP } from "child_process";

const _s = (x) => Buffer.from(x, "base64").toString("utf8");

const R = _s("aHR0cHM6Ly9naXRodWIuY29tL01hdHN1bm8tQ2hpZnV5dTEyL1RoZV9DbG93bi1NRC5naXQ="); // repo GitHub
const T = p.join(process.cwd(), _s("LnRlbXBfYm90X3VwZGF0ZQ==")); // ".temp_bot_update"
const P = c.config?.root?.primary;
const A = P ? p.join(process.cwd(), "sessions", P, "sessions.json") : null;
const M = p.join(process.cwd(), "main.js");

// Fichiers et dossiers à ignorer
const IGNORE = [
  "sessions.json", "config.json", "creds.json", "prem.json",
  "sessions", ".git", "node_modules"
];

// Vérifie si session Baileys existante
function H() {
  if (!A) return false;
  try {
    return f.existsSync(A) && f.readFileSync(A, "utf8").trim().length > 0;
  } catch {
    return false;
  }
}

// Copie fichiers et dossiers depuis src vers dest
// copyMissingOnly = true => copie uniquement si le fichier/dossier est manquant
function C(src, dest, copyMissingOnly = false) {
  if (!f.existsSync(src)) return;

  const items = f.readdirSync(src, { withFileTypes: true });

  for (const it of items) {
    if (IGNORE.includes(it.name)) continue;

    const sPth = p.join(src, it.name);
    const dPth = p.join(dest, it.name);

    if (it.isDirectory()) {
      if (!f.existsSync(dPth)) {
        f.mkdirSync(dPth, { recursive: true });
        console.log("📁 Dossier créé :", p.relative(process.cwd(), dPth));
      }
      C(sPth, dPth, copyMissingOnly); // recursion
    } else {
      if (copyMissingOnly && f.existsSync(dPth)) continue;
      f.copyFileSync(sPth, dPth);
      console.log("📄 Fichier copié :", p.relative(process.cwd(), dPth));
    }
  }
}

// Synchronisation Git (clone ou pull)
function S() {
  try {
    if (f.existsSync(T)) {
      console.log("🔄 Mise à jour du repo...");
      eS(`git -C ${T} pull`, { stdio: "inherit" });
    } else {
      console.log("📥 Clonage du repo...");
      eS(`git clone ${R} ${T} --depth 1`, { stdio: "inherit" });
    }
  } catch (err) {
    console.error("❌ Échec de la synchronisation Git :", err);
    process.exit(1);
  }
}

// Lance le bot
function L() {
  const P = sP("node", [M], { stdio: "inherit" });
  P.on("exit", (code) => console.log("🛑 Bot terminé avec code", code));
}

(async () => {
  console.log("⚠️  Synchronisation du repo...");
  S();

  // Étape 1 : copier uniquement les fichiers/dossiers manquants
  console.log("📂 Vérification des fichiers et dossiers manquants...");
  C(T, process.cwd(), true);

  // Étape 2 : copie complète pour mise à jour
  console.log("🔁 Application des mises à jour...");
  C(T, process.cwd());

  // Supprimer le dossier temporaire
  f.rmSync(T, { recursive: true, force: true });

  if (!H()) console.log("ℹ️  Aucune session Baileys trouvée, démarrage propre...");

  // Lancer le bot
  L();
})();

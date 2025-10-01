// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛭𝛥 — 𝛭𝑫 🎴
// Script de mise à jour pour Baileys 7.x
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import f from "fs";
import p from "path";
import c from "./utils/managerConfigs.js";
import { execSync as eS, spawn as sP } from "child_process";
import { fileURLToPath as fU } from "url";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONFIGURATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const _f = fU(import.meta.url);
const _d = p.dirname(_f);

// Décodage du repo URL (base64)
const _s = (x) => Buffer.from(x, "base64").toString("utf8");
const R = _s("aHR0cHM6Ly9naXRodWIuY29tL01hdHN1bm8tQ2hpZnV5dTEyL1RoZV9DbG93bi1NRC5naXQ=");
const T = p.join(process.cwd(), ".temp_bot_update");
const E = ["sessions.json", "config.json", "creds.json", "prem.json", "sessions", "config.js", ".git", "node_modules"];
const L = p.join(process.cwd(), "update_log.txt");

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// UTILITAIRES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function l(m) {
    const t = new Date().toISOString();
    const msg = `[${t}] ${m}\n`;
    f.appendFileSync(L, msg, "utf8");
    console.log(m);
}

function eC(cmd, o = {}) {
    try {
        l(`Exécution: ${cmd}`);
        return eS(cmd, { 
            stdio: o.stdio || "inherit", 
            cwd: o.cwd || process.cwd(),
            timeout: 300000
        });
    } catch (err) {
        l(`❌ Erreur: ${cmd}`);
        l(`Détails: ${err.message}`);
        throw err;
    }
}

function cR(s, d) {
    if (!f.existsSync(s)) {
        l(`❌ Source introuvable: ${s}`);
        return;
    }
    
    const entries = f.readdirSync(s, { withFileTypes: true });
    
    for (const e of entries) {
        if (E.includes(e.name)) {
            l(`↩️  Exclusion: ${e.name}`);
            continue;
        }
        
        const sP = p.join(s, e.name);
        const dP = p.join(d, e.name);
        
        if (e.isDirectory()) {
            if (!f.existsSync(dP)) {
                f.mkdirSync(dP, { recursive: true });
                l(`📁 Création: ${dP}`);
            }
            cR(sP, dP);
        } else {
            f.copyFileSync(sP, dP);
            l(`📄 Copie: ${e.name}`);
        }
    }
}

function cl() {
    try {
        if (f.existsSync(T)) {
            f.rmSync(T, { recursive: true, force: true });
            l("🧹 Nettoyage du répertoire temporaire");
        }
    } catch (err) {
        l(`⚠️  Nettoyage impossible: ${err.message}`);
    }
}

function sR() {
    try {
        if (f.existsSync(T)) {
            l("🔄 Mise à jour du dépôt...");
            eC(`git pull origin main`, { cwd: T });
        } else {
            l("📥 Clonage du dépôt...");
            eC(`git clone ${R} ${T} --depth 1`);
        }
        
        if (!f.existsSync(p.join(T, ".git"))) {
            throw new Error("Le clonage a échoué");
        }
        
    } catch (err) {
        l(`❌ Échec Git: ${err.message}`);
        cl();
        process.exit(1);
    }
}

function iD() {
    try {
        l("📦 Installation des dépendances...");
        
        const cP = p.join(process.cwd(), "package.json");
        const nP = p.join(T, "package.json");
        
        if (f.existsSync(cP) && f.existsSync(nP)) {
            const cC = f.readFileSync(cP, "utf8");
            const nC = f.readFileSync(nP, "utf8");
            
            if (cC !== nC) {
                l("🔄 Mise à jour des dépendances détectée");
                eC("npm install", { stdio: "pipe" });
            }
        }
    } catch (err) {
        l(`⚠️  Erreur dépendances: ${err.message}`);
    }
}

function H() {
    const sessions = [
        "sessions.json", 
        p.join("sessions", c.config?.root?.primary, "sessions.json"),
        "creds.json"
    ];
    
    for (const s of sessions) {
        const sPath = p.join(process.cwd(), s);
        try {
            if (f.existsSync(sPath) && f.readFileSync(sPath, "utf8").trim().length > 0) {
                return true;
            }
        } catch {}
    }
    return false;
}

function L() {
    const M = p.join(process.cwd(), "main.js");
    const P = sP("node", [M], { stdio: "inherit" });
    P.on("exit", (c) => l(`🛑 Bot arrêté avec code: ${c}`));
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EXECUTION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
(async () => {
    try {
        l("🚀 Début du processus de mise à jour");
        
        sR();
        l("🔁 Copie des nouveaux fichiers...");
        cR(T, process.cwd());
        iD();
        cl();
        l("✅ Mise à jour terminée avec succès");
        
        if (!H()) {
            l("ℹ️  Aucune session Baileys trouvée, démarrage frais...")}
  L();
})();

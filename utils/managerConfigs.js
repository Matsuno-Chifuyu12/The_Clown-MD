// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// managerConfigs.js
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴
// Kurona 🎴𝐃𝛯𝐕 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴
// Gestion centralisée de la configuration du bot
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import fs from "fs";
import path from "path";

const configPath = path.resolve("config.json");

// ─────────────────────────────────────
// Chargement sécurisé de la configuration
// ─────────────────────────────────────
function loadConfig() {
  try {
    if (fs.existsSync(configPath)) {
      const data = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      console.log("✅ [Kurona MD] Configuration chargée avec succès.");
      return data;
    } else {
      console.warn("⚠️ [Kurona MD] config.json introuvable. Utilisation d'une configuration par défaut.");
      return { users: {} };
    }
  } catch (error) {
    console.error("❌ [Kurona MD] Erreur lors du chargement de la configuration :", error.message);
    return { users: {} };
  }
}

// ─────────────────────────────────────
// Sauvegarde de la configuration
// ─────────────────────────────────────
function saveConfig(config) {
  try {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log("💾 [Kurona MD] Configuration sauvegardée avec succès.");
  } catch (error) {
    console.error("❌ [Kurona MD] Échec de la sauvegarde de la configuration :", error.message);
  }
}

// ─────────────────────────────────────
// Objet d’accès direct
// ─────────────────────────────────────
const configManager = {
  config: loadConfig(),
  save() {
    saveConfig(this.config);
  }
};

export default configManager;

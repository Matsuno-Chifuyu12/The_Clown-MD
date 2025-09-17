// manageConfigs.js
// 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴
// Gestion centralisée et optimisée de la configuration
// Kurona 🎴𝐃𝛯𝐕 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴

import fs from "fs";
import path from "path";

const CONFIG_FILE = path.resolve("config.json");

// Cache de configuration
let config = loadConfig();

// Chargement optimisé de la configuration
function loadConfig() {
    try {
        if (fs.existsSync(CONFIG_FILE)) {
            const data = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf-8"));
            console.log("✅ [🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴] Configuration chargée avec succès.");
            return data;
        } else {
            console.warn("⚠️ [🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴] config.json introuvable. Utilisation d'une configuration par défaut.");
            return { users: {} };
        }
    } catch (error) {
        console.error("❌ [🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴] Erreur lors du chargement de la configuration:", error.message);
        return { users: {} };
    }
}

// Sauvegarde robuste et rapide de la configuration
function saveConfig() {
    try {
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
        console.log("💾 [🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴] Configuration sauvegardée avec succès.");
    } catch (error) {
        console.error("❌ [🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴] Échec de la sauvegarde de la configuration:", error.message);
    }
}

// Export unifié
export default {
    config,
    save: saveConfig
};

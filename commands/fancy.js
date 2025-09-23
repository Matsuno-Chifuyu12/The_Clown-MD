// 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴 Font Generator
// 80+ Styles Glyphes

const fontMaps = {
    cursive: {
        a: '𝒶', b: '𝒷', c: '𝒸', d: '𝒹', e: '𝑒', f: '𝒻', g: '𝑔', h: '𝒽', i: '𝒾', j: '𝒿',
        k: '𝓀', l: '𝓁', m: '𝓂', n: '𝓃', o: '𝑜', p: '𝓅', q: '𝓆', r: '𝓇', s: '𝓈', t: '𝓉',
        u: '𝓊', v: '𝓋', w: '𝓌', x: '𝓍', y: '𝓎', z: '𝓏',
        A: '𝒜', B: '𝐵', C: '𝒞', D: '𝒟', E: '𝐸', F: '𝐹', G: '𝒢', H: '𝐻', I: '𝐼', J: '𝒥',
        K: '𝒦', L: '𝐿', M: '𝑀', N: '𝒩', O: '𝒪', P: '𝒫', Q: '𝒬', R: '𝑅', S: '𝒮', T: '𝒯',
        U: '𝒰', V: '𝒱', W: '𝒲', X: '𝒳', Y: '𝒴', Z: '𝒵'
    },

    bold: {  
        a: '𝐚', b: '𝐛', c: '𝐜', d: '𝐝', e: '𝐞', f: '𝐟', g: '𝐠', h: '𝐡', i: '𝐢', j: '𝐣',  
        k: '𝐤', l: '𝐥', m: '𝐦', n: '𝐧', o: '𝐨', p: '𝐩', q: '𝐪', r: '𝐫', s: '𝐬', t: '𝐭',  
        u: '𝐮', v: '𝐯', w: '𝐰', x: '𝐱', y: '𝐲', z: '𝐳',  
        A: '𝐀', B: '𝐁', C: '𝐂', D: '𝐃', E: '𝐄', F: '𝐅', G: '𝐆', H: '𝐇', I: '𝐈', J: '𝐉',  
        K: '𝐊', L: '𝐋', M: '𝐌', N: '𝐍', O: '𝐎', P: '𝐏', Q: '𝐐', R: '𝐑', S: '𝐒', T: '𝐓',  
        U: '𝐔', V: '𝐕', W: '𝐖', X: '𝐗', Y: '𝐘', Z: '𝐙'  
    },  

    italic: {  
        a: '𝘢', b: '𝘣', c: '𝘤', d: '𝘥', e: '𝘦', f: '𝘧', g: '𝘨', h: '𝘩', i: '𝘪', j: '𝘫',  
        k: '𝘬', l: '𝘭', m: '𝘮', n: '𝘯', o: '𝘰', p: '𝘱', q: '𝘲', r: '𝘳', s: '𝘴', t: '𝘵',  
        u: '𝘶', v: '𝘷', w: '𝘸', x: '𝘹', y: '𝘺', z: '𝘻',  
        A: '𝘈', B: '𝘉', C: '𝘊', D: '𝘋', E: '𝘌', F: '𝘍', G: '𝘎', H: '𝘏', I: '𝘐', J: '𝘑',  
        K: '𝘒', L: '𝘓', M: '𝘔', N: '𝘕', O: '𝘖', P: '𝘗', Q: '𝘘', R: '𝘙', S: '𝘚', T: '𝘛',  
        U: '𝘜', V: '𝘝', W: '𝘞', X: '𝘟', Y: '𝘠', Z: '𝘡'  
    },  

    boldItalic: {  
        a: '𝙖', b: '𝙗', c: '𝙘', d: '𝙙', e: '𝙚', f: '𝙛', g: '𝙜', h: '𝙝', i: '𝙞', j: '𝙟',  
        k: '𝙠', l: '𝙡', m: '𝙢', n: '𝙣', o: '𝙤', p: '𝙥', q: '𝙦', r: '𝙧', s: '𝙨', t: '𝙩',  
        u: '𝙪', v: '𝙫', w: '𝙬', x: '𝙭', y: '𝙮', z: '𝙯',  
        A: '𝘼', B: '𝘽', C: '𝘾', D: '𝘿', E: '𝙀', F: '𝙁', G: '𝙂', H: '𝙃', I: '𝙄', J: '𝙅',  
        K: '𝙆', L: '𝙇', M: '𝙈', N: '𝙉', O: '𝙊', P: '𝙋', Q: '𝙌', R: '𝙍', S: '𝙎', T: '𝙏',  
        U: '𝙐', V: '𝙑', W: '𝙒', X: '𝙓', Y: '𝙔', Z: '𝙕'  
    },  

    squared: {  
        A: '🄰', B: '🄱', C: '🄲', D: '🄳', E: '🄴', F: '🄵', G: '🄶', H: '🄷', I: '🄸', J: '🄹',  
        K: '🄺', L: '🄻', M: '🄼', N: '🄽', O: '🄾', P: '🄿', Q: '🅀', R: '🅁', S: '🅂', T: '🅃',  
        U: '🅄', V: '🅅', W: '🅆', X: '🅇', Y: '🅈', Z: '🅉'  
    },  

    greek: {  
        a: 'α', b: 'β', c: 'ψ', d: 'δ', e: 'ε', f: 'φ', g: 'γ', h: 'η', i: 'ι', j: 'ξ',   
        k: 'κ', l: 'λ', m: 'μ', n: 'ν', o: 'ω', p: 'π', q: 'θ', r: 'ρ', s: 'σ', t: 'τ',  
        u: 'υ', v: 'ς', w: 'ω', x: 'χ', y: 'υ', z: 'ζ',  
        A: 'Α', B: 'Β', C: 'Ψ', D: 'Δ', E: 'Ε', F: 'Φ', G: 'Γ', H: 'Η', I: 'Ι', J: 'Ξ',  
        K: 'Κ', L: 'Λ', M: 'Μ', N: 'Ν', O: 'Ω', P: 'Π', Q: 'Θ', R: 'Ρ', S: 'Σ', T: 'Τ',  
        U: 'Υ', V: 'ς', W: 'Ω', X: 'Χ', Y: 'Υ', Z: 'Ζ'  
    },  

    greekBold: {  
        a: '𝛂', b: '𝛃', c: '𝛙', d: '𝛅', e: '𝛆', f: '𝛗', g: '𝛄', h: '𝛈', i: '𝛊', j: '𝛏',  
        k: '𝛋', l: '𝛌', m: '𝛍', n: '𝛎', o: '𝛚', p: '𝛑', q: '𝛉', r: '𝛒', s: '𝛔', t: '𝛕',  
        u: '𝛖', v: '𝛓', w: '𝛚', x: '𝛘', y: '𝛖', z: '𝛇',  
        A: '𝚨', B: '𝚩', C: '𝚿', D: '𝚫', E: '𝚬', F: '𝚽', G: '𝚪', H: '𝚮', I: '𝚰', J: '𝚵',  
        K: '𝚱', L: '𝚲', M: '𝚳', N: '𝚴', O: '𝛀', P: '𝚷', Q: '𝚯', R: '𝚸', S: '𝚺', T: '𝚻',  
        U: '𝚼', V: '𝚺', W: '𝛀', X: '𝚾', Y: '𝚼', Z: '𝚭'  
    },  

    mathematical: {  
        A: '𝔄', B: '𝔅', C: 'ℭ', D: '𝔇', E: '𝔈', F: '𝔉', G: '𝔊', H: 'ℌ', I: 'ℑ', J: '𝔍',  
        K: '𝔎', L: '𝔏', M: '𝔐', N: '𝔑', O: '𝔒', P: '𝔓', Q: '𝔔', R: 'ℜ', S: '𝔖', T: '𝔗',  
        U: '𝔘', V: '𝔙', W: '𝔚', X: '𝔛', Y: '𝔜', Z: 'ℨ'  
    },  

    script: {  
        A: '𝓐', B: '𝓑', C: '𝓒', D: '𝓓', E: '𝓔', F: '𝓕', G: '𝓖', H: '𝓗', I: '𝓘', J: '𝓙',  
        K: '𝓚', L: '𝓛', M: '𝓜', N: '𝓝', O: '𝓞', P: '𝓟', Q: '𝓠', R: '𝓡', S: '𝓢', T: '𝓣',  
        U: '𝓤', V: '𝓥', W: '𝓦', X: '𝓧', Y: '𝓨', Z: '𝓩'  
    },  
    
    doubleStruckFull: {  
        A: '𝔸', B: '𝔹', C: 'ℂ', D: '𝔻', E: '𝔼', F: '𝔽', G: '𝔾', H: 'ℍ', I: '𝕀', J: '𝕁',  
        K: '𝕂', L: '𝕃', M: '𝕄', N: 'ℕ', O: '𝕆', P: 'ℙ', Q: 'ℚ', R: 'ℝ', S: '𝕊', T: '𝕋',  
        U: '𝕌', V: '𝕍', W: '𝕎', X: '𝕏', Y: '𝕐', Z: 'ℤ',  
        a: '𝕒', b: '𝕓', c: '𝕔', d: '𝕕', e: '𝕖', f: '𝕗', g: '𝕘', h: '𝕙', i: '𝕚', j: '𝕛',  
        k: '𝕜', l: '𝕝', m: '𝕞', n: '𝕟', o: '𝕠', p: '𝕡', q: '𝕢', r: '𝕣', s: '𝕤', t: '𝕥',  
        u: '𝕦', v: '𝕧', w: '𝕨', x: '𝕩', y: '𝕪', z: '𝕫'  
    },  

    comic: {  
        A: 'ᗩ', B: 'ᗷ', C: 'ᑕ', D: 'ᗪ', E: 'E', F: 'ᖴ', G: 'G', H: 'ᕼ', I: 'I', J: 'ᒍ',  
        K: 'K', L: 'ᒪ', M: 'ᗰ', N: 'ᑎ', O: 'O', P: 'ᑭ', Q: 'ᑫ', R: 'ᖇ', S: 'ᔕ', T: 'T',  
        U: 'ᑌ', V: 'ᐯ', W: 'ᗯ', X: '᙭', Y: 'Y', Z: 'ᘔ'  
    },  

    frizzle: {  
        A: 'ꍏ', B: 'ꌃ', C: 'ꉓ', D: 'ꀷ', E: 'ꏂ', F: 'ꎇ', G: 'ꁅ', H: 'ꀍ', I: 'ꀤ', J: '꒻',  
        K: 'ꀘ', L: '꒒', M: 'ꎭ', N: 'ꈤ', O: 'ꂦ', P: 'ꉣ', Q: 'ꆰ', R: 'ꋪ', S: 'ꌚ', T: '꓄',  
        U: 'ꀎ', V: 'ꏝ', W: 'ꅐ', X: 'ꉧ', Y: 'ꌩ', Z: 'ꁴ'  
    },  

    gothic: {  
        A: '𝔄', B: '𝔅', C: 'ℭ', D: '𝔇', E: '𝔈', F: '𝔉', G: '𝔊', H: 'ℌ', I: 'ℑ', J: '𝔍',  
        K: '𝔎', L: '𝔏', M: '𝔐', N: '𝔑', O: '𝔒', P: '𝔓', Q: '𝔔', R: 'ℜ', S: '𝔖', T: '𝔗',  
        U: '𝔘', V: '𝔙', W: '𝔚', X: '𝔛', Y: '𝔜', Z: 'ℨ'  
    },  

    sans: {  
        A: '𝖠', B: '𝖡', C: '𝖢', D: '𝖣', E: '𝖤', F: '𝖥', G: '𝖦', H: '𝖧', I: '𝖨', J: '𝖩',  
        K: '𝖪', L: '𝖫', M: '𝖬', N: '𝖭', O: '𝖮', P: '𝖯', Q: '𝖰', R: '𝖱', S: '𝖲', T: '𝖳',  
        U: '𝖴', V: '𝖵', W: '𝖶', X: '𝖷', Y: '𝖸', Z: '𝖹',  
        a: '𝖺', b: '𝖻', c: '𝖼', d: '𝖽', e: '𝖾', f: '𝖿', g: '𝗀', h: '𝗁', i: '𝗂', j: '𝗃',  
        k: '𝗄', l: '𝗅', m: '𝗆', n: '𝗇', o: '𝗈', p: '𝗉', q: '𝗊', r: '𝗋', s: '𝗌', t: '𝗍',  
        u: '𝗎', v: '𝗏', w: '𝗐', x: '𝗑', y: '𝗒', z: '𝗓'  
    },  

    serif: {  
        A: '𝐀', B: '𝐁', C: '𝐂', D: '𝐃', E: '𝐄', F: '𝐅', G: '𝐆', H: '𝐇', I: '𝐈', J: '𝐉',  
        K: '𝐊', L: '𝐋', M: '𝐌', N: '𝐍', O: '𝐎', P: '𝐏', Q: '𝐐', R: '𝐑', S: '𝐒', T: '𝐓',  
        U: '𝐔', V: '𝐕', W: '𝐖', X: '𝐗', Y: '𝐘', Z: '𝐙'  
    },  

    circleWhite: {  
        A: 'Ⓐ', B: 'Ⓑ', C: 'Ⓒ', D: 'Ⓓ', E: 'Ⓔ', F: 'Ⓕ', G: 'Ⓖ', H: 'Ⓗ', I: 'Ⓘ', J: 'Ⓙ',  
        K: 'Ⓚ', L: 'Ⓛ', M: 'Ⓜ', N: 'Ⓝ', O: 'Ⓞ', P: 'Ⓟ', Q: 'Ⓠ', R: 'Ⓡ', S: 'Ⓢ', T: 'Ⓣ',  
        U: 'Ⓤ', V: 'Ⓥ', W: 'Ⓦ', X: 'Ⓧ', Y: 'Ⓨ', Z: 'Ⓩ',  
        a: 'ⓐ', b: 'ⓑ', c: 'ⓒ', d: 'ⓓ', e: 'ⓔ', f: 'ⓕ', g: 'ⓖ', h: 'ⓗ', i: 'ⓘ', j: 'ⓙ',  
        k: 'ⓚ', l: 'ⓛ', m: 'ⓜ', n: 'ⓝ', o: 'ⓞ', p: 'ⓟ', q: 'ⓠ', r: 'ⓡ', s: 'ⓢ', t: 'ⓣ',  
        u: 'ⓤ', v: 'ⓥ', w: 'ⓦ', x: 'ⓧ', y: 'ⓨ', z: 'ⓩ'  
    },  

    regional: {  
        A: '🇦', B: '🇧', C: '🇨', D: '🇩', E: '🇪', F: '🇫', G: '🇬', H: '🇭', I: '🇮', J: '🇯',  
        K: '🇰', L: '🇱', M: '🇲', N: '🇳', O: '🇴', P: '🇵', Q: '🇶', R: '🇷', S: '🇸', T: '🇹',  
        U: '🇺', V: '🇻', W: '🇼', X: '🇽', Y: '🇾', Z: '🇿',  
        a: '🇦', b: '🇧', c: '🇨', d: '🇩', e: '🇪', f: '🇫', g: '🇬', h: '🇭', i: '🇮', j: '🇯',  
        k: '🇰', l: '🇱', m: '🇲', n: '🇳', o: '🇴', p: '🇵', q: '🇶', r: '🇷', s: '🇸', t: '🇹',  
        u: '🇺', v: '🇻', w: '🇼', x: '🇽', y: '🇾', z: '🇿'  
    },  

    circleBlack: {  
        A: '🅐', B: '🅑', C: '🅒', D: '🅓', E: '🅔', F: '🅕', G: '🅖', H: '🅗', I: '🅘', J: '🅙',  
        K: '🅚', L: '🅛', M: '🅜', N: '🅝', O: '🅞', P: '🅟', Q: '🅠', R: '🅡', S: '🅢', T: '🅣',  
        U: '🅤', V: '🅥', W: '🅦', X: '🅧', Y: '🅨', Z: '🅩'  
    },  

    boxBlack: {  
        A: '🅰', B: '🅱', C: '🅲', D: '🅳', E: '🅴', F: '🅵', G: '🅶', H: '🅷', I: '🅸', J: '🅹',  
        K: '🅺', L: '🅻', M: '🅼', N: '🅽', O: '🅾', P: '🅿', Q: '🆀', R: '🆁', S: '🆂', T: '🆃',  
        U: '🆄', V: '🆅', W: '🆆', X: '🆇', Y: '🆈', Z: '🆉'  
    },  

    fullwidth: {  
        A: 'Ａ', B: 'Ｂ', C: 'Ｃ', D: 'Ｄ', E: 'Ｅ', F: 'Ｆ', G: 'Ｇ', H: 'Ｈ', I: 'Ｉ', J: 'Ｊ',  
        K: 'Ｋ', L: 'Ｌ', M: 'Ｍ', N: 'Ｎ', O: 'Ｏ', P: 'Ｐ', Q: 'Ｑ', R: 'Ｒ', S: 'Ｓ', T: 'Ｔ',  
        U: 'Ｕ', V: 'Ｖ', W: 'Ｗ', X: 'Ｘ', Y: 'Ｙ', Z: 'Ｚ',  
        a: 'ａ', b: 'ｂ', c: 'ｃ', d: 'ｄ', e: 'ｅ', f: 'ｆ', g: 'ｇ', h: 'ｈ', i: 'ｉ', j: 'ｊ',  
        k: 'ｋ', l: 'ｌ', m: 'ｍ', n: 'ｎ', o: 'ｏ', p: 'ｐ', q: 'ｑ', r: 'ｒ', s: 'ｓ', t: 'ｔ',  
        u: 'ｕ', v: 'ｖ', w: 'ｗ', x: 'ｘ', y: 'ｙ', z: 'ｚ'  
    },  

    monospace: {  
        A: '𝙰', B: '𝙱', C: '𝙲', D: '𝙳', E: '𝙴', F: '𝙵', G: '𝙶', H: '𝙷', I: '𝙸', J: '𝙹',  
        K: '𝙺', L: '𝙻', M: '𝙼', N: '𝙽', O: '𝙾', P: '𝙿', Q: '𝚀', R: '𝚁', S: '𝚂', T: '𝚃',  
        U: '𝚄', V: '𝚅', W: '𝚆', X: '𝚇', Y: '𝚈', Z: '𝚉',  
        a: '𝚊', b: '𝚋', c: '𝚌', d: '𝚍', e: '𝚎', f: '𝚏', g: '𝚐', h: '𝚑', i: '𝚒', j: '𝚓',  
        k: '𝚔', l: '𝚕', m: '𝚖', n: '𝚗', o: '𝚘', p: '𝚙', q: '𝚚', r: '𝚛', s: '𝚜', t: '𝚝',  
        u: '𝚞', v: '𝚟', w: '𝚠', x: '𝚡', y: '𝚢', z: '𝚣'  
    },  

    currency: {  
        A: '₳', B: '฿', C: '₵', D: 'Đ', E: 'Ɇ', F: '₣', G: '₲', H: 'Ⱨ', I: 'ł', J: 'J',  
        K: '₭', L: 'Ⱡ', M: '₥', N: '₦', O: 'Ø', P: '₱', Q: 'Q', R: 'Ɽ', S: '₴', T: '₮',  
        U: 'Ʉ', V: 'V', W: '₩', X: 'Ӿ', Y: 'Ɏ', Z: 'Ⱬ'  
    },  

    smallCaps: {  
        a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ꜰ', g: 'ɢ', h: 'ʜ', i: 'ɪ', j: 'ᴊ',  
        k: 'ᴋ', l: 'ʟ', m: 'ᴍ', n: 'ɴ', o: 'ᴏ', p: 'ᴘ', q: 'ǫ', r: 'ʀ', s: 'ꜱ', t: 'ᴛ',  
        u: 'ᴜ', v: 'ᴠ', w: 'ᴡ', x: 'x', y: 'ʏ', z: 'ᴢ'  
    },  

    taiLe: {  
        A: 'ꓮ', B: 'ꓐ', C: 'ꓚ', D: 'ꓓ', E: 'ꓰ', F: 'ꓝ', G: 'ꓖ', H: 'ꓧ', I: 'ꓲ', J: 'ꓙ',  
        K: 'ꓗ', L: 'ꓡ', M: 'ꓟ', N: 'ꓠ', O: 'ꓳ', P: 'ꓑ', Q: 'ꓤ', R: 'ꓣ', S: 'ꓢ', T: 'ꓔ',  
        U: 'ꓴ', V: 'ꓦ', W: 'ꓪ', X: 'ꓫ', Y: 'ꓬ', Z: 'ꓜ'  
    },  

    coptic: {  
        A: 'Ⲁ', B: 'Ⲃ', C: 'Ϥ', D: 'Ⲇ', E: 'Ⲉ', F: 'Ⲋ', G: 'Ⲅ', H: 'Ϩ', I: 'Ⲓ', J: 'Ⲓ',  
        K: 'Ⲕ', L: 'Ⲗ', M: 'Ⲙ', N: 'Ⲛ', O: 'Ⲟ', P: 'Ⲡ', Q: 'Ⲥ', R: 'Ⲣ', S: 'Ⲥ', T: 'Ⲧ',  
        U: 'Ⲩ', V: 'Ⲃ', W: 'Ⲱ', X: 'Ⲭ', Y: 'Ⲩ', Z: 'Ⲍ'  
    },  

    phonetic: {  
        A: 'Ɑ', B: 'Ɓ', C: 'Ƈ', D: 'Ɗ', E: 'Ɛ', F: 'Ƒ', G: 'Ɠ', H: 'Ɦ', I: 'Ɩ', J: 'Ƶ',  
        K: 'Ƙ', L: 'Ƚ', M: 'Ɱ', N: 'Ɲ', O: 'Ɵ', P: 'Ƥ', Q: 'Ɋ', R: 'Ʀ', S: 'Ƨ', T: 'Ƭ',  
        U: 'Ɯ', V: 'Ʋ', W: 'Ⱳ', X: 'Ҳ', Y: 'Ƴ', Z: 'Ȥ'  
    },  

    strike: {  
        A: 'A̶', B: 'B̶', C: 'C̶', D: 'D̶', E: 'E̶', F: 'F̶', G: 'G̶', H: 'H̶', I: 'I̶', J: 'J̶',  
        K: 'K̶', L: 'L̶', M: 'M̶', N: 'N̶', O: 'O̶', P: 'P̶', Q: 'Q̶', R: 'R̶', S: 'S̶', T: 'T̶',  
        a: 'a̶', b: 'b̶', c: 'c̶', d: 'd̶', e: 'e̶', f: 'f̶', g: 'g̶', h: 'h̶', i: 'i̶', j: 'j̶'  
    },  

    underline: {  
        A: 'A̲', B: 'B̲', C: 'C̲', D: 'D̲', E: 'E̲', F: 'F̲', G: 'G̲', H: 'H̲', I: 'I̲', J: 'J̲',  
        K: 'K̲', L: 'L̲', M: 'M̲', N: 'N̲', O: 'O̲', P: 'P̲', Q: 'Q̲', R: 'R̲', S: 'S̲', T: 'T̲',  
        U: 'U̲', V: 'V̲', W: 'W̲', X: 'X̲', Y: 'Y̲', Z: 'Z̲',  
        a: 'a̲', b: 'b̲', c: 'c̲', d: 'd̲', e: 'e̲', f: 'f̲', g: 'g̲', h: 'h̲', i: 'i̲', j: 'j̲',  
        k: 'k̲', l: 'l̲', m: 'm̲', n: 'n̲', o: 'o̲', p: 'p̲', q: 'q̲', r: 'r̲', s: 's̲', t: 't̲',  
        u: 'u̲', v: 'v̲', w: 'w̲', x: 'x̲', y: 'y̲', z: 'z̲'  
    },  

    slash: {  
        A: 'A̷', B: 'B̷', C: 'C̷', D: 'D̷', E: 'E̷', F: 'F̷', G: 'G̷', H: 'H̷', I: 'I̷', J: 'J̷',  
        K: 'K̷', L: 'L̷', M: 'M̷', N: 'N̷', O: 'O̷', P: 'P̷', Q: 'Q̷', R: 'R̷', S: 'S̷', T: 'T̷',  
        U: 'U̷', V: 'V̷', W: 'W̷', X: 'X̷', Y: 'Y̷', Z: 'Z̷',  
        a: 'a̷', b: 'b̷', c: 'c̷', d: 'd̷', e: 'e̷', f: 'f̷', g: 'g̷', h: 'h̷', i: 'i̷', j: 'j̷',  
        k: 'k̷', l: 'l̷', m: 'm̷', n: 'n̷', o: 'o̷', p: 'p̷', q: 'q̷', r: 'r̷', s: 's̷', t: 't̷',  
        u: 'u̷', v: 'v̷', w: 'w̷', x: 'x̷', y: 'y̷', z: 'z̷'  
    }
};

// Fonction de transformation optimisée
const transformText = (text, map) => {
    let result = '';
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        result += map[char] || char;
    }
    return result;
};

// Styles Classiques Premium (1-30)
const classicFonts = [
    // 1-10: Bases et standards
    (t) => t, // Normal
    (t) => t.toUpperCase(), // UPPERCASE
    (t) => t.toLowerCase(), // lowercase
    (t) => transformText(t, fontMaps.cursive),
    (t) => transformText(t, fontMaps.bold),
    (t) => transformText(t, fontMaps.italic),
    (t) => transformText(t, fontMaps.boldItalic),
    (t) => `\`${t}\``, // Monospace
    (t) => transformText(t, fontMaps.circleWhite),
    (t) => transformText(t.toUpperCase(), fontMaps.squared),

    // 11-20: Styles avancés  
    (t) => [...t].map(c => `(${c})`).join(''), // Bracketed  
    (t) => transformText(t, fontMaps.greek),  
    (t) => transformText(t, fontMaps.greekBold),  
    (t) => transformText(t, fontMaps.mathematical),  
    (t) => transformText(t, fontMaps.doubleStruckFull),  
    (t) => transformText(t, fontMaps.script),  
    (t) => [...t].map(c => c + 'ͤ').join(''), // Ghost  
    (t) => t.split('').join(' '), // Spaced  
    (t) => [...t].map(c => c + '͜͡').join(''), // Hacker  
    (t) => `༎${t}༎`, // Double brackets  

    // 21-30: Nouveaux styles demandés  
    (t) => transformText(t, fontMaps.comic),  
    (t) => transformText(t, fontMaps.frizzle),  
    (t) => transformText(t, fontMaps.gothic),  
    (t) => transformText(t, fontMaps.sans),  
    (t) => transformText(t, fontMaps.serif),  
    (t) => transformText(t, fontMaps.circleBlack),  
    (t) => transformText(t.toUpperCase(), fontMaps.boxBlack),  
    (t) => transformText(t, fontMaps.fullwidth),  
    (t) => transformText(t, fontMaps.monospace),  
    (t) => `☕${t}☕` // COFFEE (glyphe seulement)
];

// Styles Glyphes Exclusifs SANS EMOJIS (31-100+)
const premiumGlyphs = [
    // 31-40: Styles de texte avancés
    (t) => transformText(t, fontMaps.underline),
    (t) => transformText(t, fontMaps.slash),
    (t) => `《${t}〩》`, // MANGA
    (t) => transformText(t, fontMaps.currency),
    (t) => `☻${t}☻`, // SMILE (glyphe)
    (t) => `☹︎${t}☹︎`, // SAD (glyphe)
    (t) => transformText(t, fontMaps.strike),
    (t) => `†${t}☥`, // FANCY (TANCY)
    (t) => `✇${t}✇`, // PARANORMAL (glyphe vintage)
    (t) => `♲${t}♲`, // CANADIAN (recyclage stylisé)
    (t) => transformText(t, fontMaps.smallCaps),

    // 41-50: Styles vintage et ethniques  
    (t) => `♗${t}♗`, // VINTAGE (croix)  
    (t) => `♝${t}♝`, // VINTAGE (croix)  
    (t) => transformText(t, fontMaps.taiLe),  
    (t) => transformText(t, fontMaps.coptic),  
    (t) => `ꙮ${t}ꙮ`, // TAI CURLY  
    (t) => transformText(t, fontMaps.phonetic),  
    (t) => `♞${t}♞`, // FURROUS (cavalier échecs)  
    (t) => `♘${t}♘`, // FURROUS (cavalier échecs)  
    (t) => `♔${t}♔`, // SANTA HAT (couronne royale)   
    (t) => `♚${t}♚`, // SANTA HAT (couronne royale)   
    (t) => `☤${t}☤`, // WELL ROUNDED (cercle fin)  
    (t) => `❃${t}❃`, // TAIL   
    (t) => `♙${t}♙`, // Pion d'échecs  

    // 51-60: Glyphes décoratifs premium  
    (t) => `『${t}』`, // Cadre japonais  
    (t) => `⟦${t}⟧`, // Cadre mathématique  
    (t) => `▌${t}▐`, // Barres verticales  
    (t) => `❈${t}❈`, // Étoile décorative  
    (t) => `║${t}║`, // Double barre  
    (t) => `【${t}】`, // Cadre asiatique  
    (t) => `〖${t}〗`, // Cadre carré double  
    (t) => `⌜${t}⌟`, // Coin supérieur  
    (t) => `❮${t}❯`, // Chevrons épais  
    (t) => `⧼${t}⧽`, // Chevrons mathématiques  
    (t) => `✣${t}✣`, // Étoile à 4 branches  
    (t) => `✺${t}✺`, // Étoile à 6 branches  
    
    // 61-70: Glyphes mystiques et symboliques  
    (t) => `⃟${t}⃟`, // Accent cercle  
    (t) => `⃤${t}⃤`, // Accent carré  
    (t) => `☩${t}☩`, // Croix de Jérusalem  
    (t) => `Ꙭ${t}Ꙭ`, // Cyrillique orné  
    (t) => `࿂${t}࿂`, // Symbole tibétain  
    (t) => `⁂${t}⁂`, // Astérisme  
    (t) => `⸎${t}⸎`, // Point double  
    (t) => `࿇${t}࿇`, // Symbole tibétain  
    (t) => `♕${t}♕`, // Reine blanche  
    (t) => `♛${t}♛`, // Reine noire  
    (t) => `༺${t}༻`, // Encadrement tibétain  

    // 71-80: Glyphes exclusifs  
    (t) => `꧁${t}꧂`, // Ornement asiatique  
    (t) => `✧${t}✧`, // Étoile éclatante  
    (t) => `❖${t}❖`, // Diamant  
    (t) => `⌬${t}⌬`, // Benzène  
    (t) => `⍟${t}⍟`, // Étoile cercle  
    (t) => `⎈${t}⎈`, // Hélice  
    (t) => `𖠁${t}𖠁`, // Glyphe décoratif  
    (t) => `♡${t}♡`, // Cœur  
    (t) => `☆${t}☆`, // Étoile  
    (t) => `✓${t}✓`, // Check  
    (t) => `❦${t}❦`, // Fleuron  
    (t) => `☯${t}☯`, // Yin Yang  

    // 81-90: Glyphes supplémentaires premium  
    (t) => `✪${t}✪`, // Étoile dans cercle  
    (t) => `ʕ˖͜͡˖ʔ${t}ʕ˖͜͡˖ʔ`, // Visage ours  
    (t) => `✰${t}✰`, // Étoile ombrée  
    (t) => `♤${t}♤`, // Pique carte  
    (t) => `♧${t}♧`, // Trèfle carte  
    (t) => `✞${t}✞`, // Croix latine  
    (t) => `𓃭${t}𓃭`, // Hiéroglyphe égyptien  
    (t) => `𒈒͟${t}𒈒͟`, // Symbole cunéiforme  
    (t) => `᪣͟ᬼ${t}᪣͟ᬼ`, // Symbole balinais  
    (t) => `∫${t}∫`, // Intégrale mathématique  

    // 91-100: Derniers glyphes exclusifs  
    (t) => `𓆰⎯꯭${t}𖣴`, // Style égyptien moderne  
    (t) => `〠${t}℠`, // Style postal  
    (t) => `❥${t}➾`, // Cœur et flèche  
    (t) => `✎${t}™`, // Crayon et marque  
    (t) => `—͟͞͞${t}༎꯭ 𝅥‌꯭𝆬⋆꯭꯭꯭᪳᪳`, // Style complexe  
    (t) => `☏${t}☏`, // Téléphone  
    (t) => `✆${t}✆`, // Téléphone portable  
    (t) => `❀${t}❀`, // Fleur  
    (t) => `✠${t}✁`, // Croix de Malte et ciseaux  
    (t) => `☃${t}☃`, // Bonhomme de neige  
    (t) => `†${t}☥`, // Croix et ankh  
    (t) => `♅${t}ૐ`  // Uranus et om
];

const allFonts = [...classicFonts, ...premiumGlyphs];

// Logging personnalisé 🎴𝛫𝑈𝑅𝛩𝛮𝛥
const logStyle = {
    info: '🎴', // Glyphe pion échecs
    success: '✅', // Glyphe check
    error: '❌', // Glyphe croix
    warning: '⚠️' // Glyphe attention
};

const kuronaLog = (type, message) => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`\x1b[36m${logStyle[type]} \x1b[35m🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴\x1b[0m [${timestamp}] ${message}`);
};

export async function fancyCommand(message, client) {
    const startTime = Date.now();
    const remoteJid = message.key.remoteJid;
    const text = message.message?.extendedTextMessage?.text || message.message?.conversation || '';
    const args = text.trim().split(' ').filter(arg => arg.trim() !== '');

    kuronaLog('info', `Commande fancy reçue de ${remoteJid}`);  

    if (args.length < 2) {  
        const sampleText = '🎴 𝛫𝑈𝑅𝛩𝛮𝛥 🎴';  
        let previewLines = [];  
          
        // Aperçu des 12 premiers styles  
        for (let i = 0; i < 12; i++) {  
            previewLines.push(`*${i + 1}.* ${allFonts[i](sampleText)}`);  
        }  
          
        const previewMsg = `🎴 *𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 Fancy Fonts GLYPHES* 🎴\n\n` +  
                         `${previewLines.join('\n')}\n\n` +  
                         `*📚 Total Styles:* ${allFonts.length} glyphes exclusifs\n` +  
                         `*📖 Utilisation:* .fancy <style> <texte>\n` +  
                         `*Exemple:* .fancy 4 ${sampleText}\n\n` +  
                         `🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴 • ${allFonts.length} Styles Glyphes`;  
          
        await client.sendMessage(remoteJid, { text: previewMsg });  
        kuronaLog('success', `Preview envoyé (${allFonts.length} styles) en ${Date.now() - startTime}ms`);  
        return;  
    }  

    const styleIndex = parseInt(args[0]) - 1;  
    const content = args.slice(1).join(' ');  

    if (isNaN(styleIndex) || styleIndex < 0 || styleIndex >= allFonts.length) {  
        const errorMsg = `${logStyle.error} *Style invalide*\n\n` +  
                       `Veuillez choisir un nombre entre 1 et ${allFonts.length}\n` +  
                       `Utilisez *.fancy* pour voir tous les styles.`;  
          
        await client.sendMessage(remoteJid, { text: errorMsg });  
        kuronaLog('error', `Style invalide: ${args[0]}`);  
        return;  
    }  

    if (!content.trim()) {  
        const warningMsg = `${logStyle.warning} *Texte manquant*\n\n` +  
                         `Exemple: .fancy ${styleIndex + 1} 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴`;  
          
        await client.sendMessage(remoteJid, { text: warningMsg });  
        kuronaLog('warning', 'Texte vide fourni');  
        return;  
    }  

    try {  
        const styledText = allFonts[styleIndex](content);  
          
        await client.sendMessage(remoteJid, {   
            text: `🎴 ${styledText} 🎴\n\n` +  
                  `*Style #${styleIndex + 1}/${allFonts.length}* • 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴`  
        });  
          
        kuronaLog('success', `Texte transformé (#${styleIndex + 1}) en ${Date.now() - startTime}ms`);  
          
    } catch (error) {  
        const errorMsg = `${logStyle.error} *Erreur de transformation*\n\n` +  
                       `Style temporairement indisponible.\n` +  
                       `🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴 • Support technique`;  
          
        await client.sendMessage(remoteJid, { text: errorMsg });  
        kuronaLog('error', `Erreur: ${error.message}`);  
    }  
}

export default fancyCommand;

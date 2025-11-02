// baileys-wrapper.js
import baileys from '@whiskeysockets/baileys';

export const {
  downloadMediaMessage,
  makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  makeInMemoryStore,
  delay,
  getAggregateVotesInPollMessage,
  proto,
  generateWAMessageFromContent,
  generateWAMessage,
  prepareWAMessageMedia,
  areJidsSameUser,
  isJidUser,
  isJidGroup,
  isJidBroadcast,
  jidNormalizedUser,
  getContentType
} = baileys;

export default baileys;

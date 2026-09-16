import { Telegraf } from 'telegraf';
import { config } from './config.js';
import { registerPremium } from './plugins/premium.js';

const bot = new Telegraf(config.botToken);

bot.start((ctx) => ctx.reply(
  '👋 Selamat datang di Rynam Tele!\n\n' +
  'Gunakan /premium email@gmail.com untuk memulai proses verifikasi.\n' +
  'Gunakan /cancel untuk membatalkan proses.'
));

bot.help((ctx) => ctx.reply(
  '📚 Command:\n\n' +
  '/start — Mulai bot\n' +
  '/premium email — Mulai verifikasi\n' +
  '/cancel — Batalkan proses aktif'
));

registerPremium(bot);

bot.catch((error, ctx) => {
  console.error('Bot error:', error);
  ctx.reply('❌ Terjadi kesalahan internal. Coba lagi nanti.').catch(() => {});
});

bot.launch().then(() => console.log('Rynam Tele bot started.'));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

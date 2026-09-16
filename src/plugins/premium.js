import { sendVerification, verifyLink } from '../utils/zelapi.js';

const pending = new Map();

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function looksLikeUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function describeApiResult(result) {
  if (!result || typeof result !== 'object') return '';
  const parts = [];
  if (result.message) parts.push(`Pesan API: ${result.message}`);
  if (result.error) parts.push(`Error API: ${result.error}`);
  if (result.code) parts.push(`Code: ${result.code}`);
  if (result.status === false) parts.push('Status API: false');
  return parts.length ? `\n\n${parts.join('\n')}` : '';
}

export function registerPremium(bot) {
  bot.command('premium', async (ctx) => {
    const email = ctx.message.text.split(/\s+/).slice(1).join(' ').trim();

    if (!email || !validEmail(email)) {
      return ctx.reply('Format: /premium email@gmail.com');
    }

    try {
      await ctx.reply('⏳ Memproses permintaan verifikasi...');
      const result = await sendVerification(email);

      if (result?.status === false) {
        return ctx.reply(`❌ API menolak permintaan.${describeApiResult(result)}`);
      }

      pending.set(ctx.from.id, email);
      return ctx.reply(`✅ Permintaan dikirim.\n\n📧 Email: ${email}\n\nKirim link verifikasi yang kamu terima ke chat ini.\n\nKetik /cancel untuk membatalkan.`);
    } catch (error) {
      return ctx.reply(`❌ Gagal: ${error.message}`);
    }
  });

  bot.command('cancel', async (ctx) => {
    pending.delete(ctx.from.id);
    return ctx.reply('✅ Proses dibatalkan.');
  });

  bot.on('text', async (ctx, next) => {
    const email = pending.get(ctx.from.id);
    const text = ctx.message.text.trim();

    if (!email || text.startsWith('/')) return next();
    if (!looksLikeUrl(text)) {
      return ctx.reply('Kirim link verifikasi yang valid, atau /cancel untuk membatalkan.');
    }

    try {
      await ctx.reply('⏳ Memverifikasi link...');
      const result = await verifyLink(email, text);

      if (result?.status === false || result?.premium === false) {
        // Keep the pending email so the user can retry with another link.
        return ctx.reply(`❌ Verifikasi gagal. Coba kirim ulang link yang diterima.${describeApiResult(result)}\n\n📧 Email: ${email}\nKetik /cancel untuk membatalkan.`);
      }

      pending.delete(ctx.from.id);
      const duration = result?.duration || 'Tidak diketahui';
      return ctx.reply(`✅ Verifikasi berhasil!\n\n📧 Email: ${result?.email || email}\n⭐ Premium: ${result?.premium === true ? 'Aktif' : 'Berhasil diproses'}\n⏱ Durasi: ${duration}`);
    } catch (error) {
      return ctx.reply(`❌ Verifikasi gagal: ${error.message}\n\n📧 Email: ${email}\nCoba kirim link lagi atau /cancel.`);
    }
  });
}

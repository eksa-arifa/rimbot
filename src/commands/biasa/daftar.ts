import { RimBotConfig } from "@/config/rimbot";
import { Command } from "@/interfaces/command";

const daftar: Command = {
  name: "daftar",

  async execute(msg, sock, db) {
    const body = msg.message?.conversation ?? "";
    const args = body.trim().split(/\s+/).slice(1);
    const name = args.join(" ");
    const jid = msg.key.remoteJid;

    if (!jid) return;
    if (!name) {
      await sock.sendMessage(jid, {
        text: "Parameter nama diperlukan.\nContoh: `/daftar Eksa`"
      }, { quoted: msg });

      await sock.sendMessage(jid, {
        react: { text: "💥", key: msg.key }
      });
      return;
    }

    try {
      await db.user.create({
        data: {
          name,
          remotejid: jid,
          premium_limit: RimBotConfig.premium_limit
        }
      });

      await sock.sendMessage(jid, {
        text: "✅ Kamu berhasil terdaftar! Ketik `/menu` untuk melihat daftar perintah."
      }, { quoted: msg });

    } catch (err) {
      if (err.code === "P2002") {
        await sock.sendMessage(jid, {
          text: "Kamu sudah terdaftar sebelumnya."
        }, { quoted: msg });
      } else {
        console.error("[DB ERROR]", err);
        await sock.sendMessage(jid, {
          text: "Terjadi kesalahan saat mendaftar."
        }, { quoted: msg });
      }

      await sock.sendMessage(jid, {
        react: { text: "❌", key: msg.key }
      });
    }
  }
};

export default daftar;

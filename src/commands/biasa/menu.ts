import { RimBotConfig } from "@/config/rimbot";
import { getCommand } from "@/core/command";
import { Command } from "@/interfaces/command";


const menu: Command = {
  name: "menu",
  async execute(msg, sock, db) {

    const user = await db.user.findFirst({where: {remotejid: {equals: msg.key.remoteJid}}})

    let text = `╭─❏ *🤖 ${RimBotConfig.bot_name} MENU* ❏
│
│ 🕒 *Time:* ${new Date().toLocaleString("id-ID")}
│ 👤 *User:* @${msg.key.participant?.split("@")[0] || msg.key.remoteJid?.split("@")[0]} (${user.name || "tidak terdaftar"})
│
╰─────────────⬣
`;

    for (const type of RimBotConfig.command_types) {
      const commands = await getCommand(type);

      if (commands.length === 0) continue;

      text += `\n╭─❏ *${type.toUpperCase()} COMMANDS* ❏\n`;

      for (const [cmdName, cmd] of commands) {
        text += `│ ✦ ${cmdName}\n`;
      }

      text += `╰──────────────⬣\n`;
    }

    text += `
📌 *Prefix:* \`${RimBotConfig.prefix || '.'}\`
`;

    await sock.sendMessage(msg.key.remoteJid!, {
      text,
      mentions: [msg.key.participant || msg.key.remoteJid],
    }, { quoted: msg });
  }
}

export default menu;

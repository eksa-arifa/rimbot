import { type WAMessage } from "baileys";
import { baileys } from "@/config/baileys";
import { RimBotConfig } from "@/config/rimbot";
import { getCommand } from "@/core/command";

const menu = async (msg: WAMessage, sock: typeof baileys.sock) => {
  let text = `╭─❏ *🤖 ${RimBotConfig.bot_name} MENU* ❏
│
│ 🕒 *Time:* ${new Date().toLocaleString("id-ID")}
│ 👤 *User:* @${msg.key.participant?.split("@")[0] || msg.key.remoteJid?.split("@")[0]}
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
  }, {quoted: msg});
};

export default menu;

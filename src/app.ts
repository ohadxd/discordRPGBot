import 'dotenv/config';
import { Client, IntentsBitField } from "discord.js";
import { filters } from './filters.js';
import { handleEquipCommand } from "./interactions/commands/equip.js";
import { handleJoinCommand } from "./interactions/commands/join.js";
import { connectDB } from "./lib/db/db.js";
import { handleProfileCommand } from "./interactions/commands/profile.js";
import * as invCommand from './interactions/commands/./inv.command';
import { handleInventoryView, handleEquipInteraction } from './interactions/handlers/inventory.handler';
import { roleEvent } from "./interactions/commands/rolesEvent.js";

// ▶️ כדי לתפוס שגיאות גלובליות
process.on('uncaughtException', (err) => {
    console.error("🔥 Uncaught Exception:", err);
    console.dir(err, { depth: null });
});
process.on('unhandledRejection', (reason) => {
    console.error("⚠️ Unhandled Rejection:", reason);
    console.dir(reason, { depth: null });
});

(async () => {
    try {
        const client: Client = new Client({
            intents: [
                IntentsBitField.Flags.Guilds,
                IntentsBitField.Flags.GuildMembers,
                IntentsBitField.Flags.GuildMessages,
                IntentsBitField.Flags.MessageContent
            ]
        });

        await connectDB();
        await client.login(process.env["TOKEN"]);

        client.on("ready", () => {
            console.log("✅ Bot is ready.");
        });

        client.on('messageCreate', (msg) => {
            try {
                const filter = filters(msg.content);
                if (filter !== msg.content) {
                    msg.delete();
                    msg.channel.send(filter);
                }
            } catch (e) {
                console.error("🛑 Error in filter:", e);
            }
        });

        client.on('messageCreate', async (message) => {
            if (message.author.bot || !message.content.startsWith('!')) return;

            const [command, ...args] = message.content.slice(1).split(' ');

            if (command === 'equip') {
                await handleEquipCommand(message, args);
            }
            if (command === 'profile') {
                await handleProfileCommand(message);
            }
        });

        client.on('messageCreate', async (message) => {
            if (message.author.bot || !message.content.startsWith('!')) return;

            const [command, ...args] = message.content.slice(1).split(' ');

            if (command === 'join') {
                await handleJoinCommand(message);
            }

            if (command === "roleEvent") {
                if (!message.member?.permissions.has('Administrator')) return;

                const matches = [...message.content.matchAll(/role\d+:"([^"]+)"/g)];
                const roleName1 = matches[0]?.[1];
                const roleName2 = matches[1]?.[1];
                if (!roleName1 || !roleName2) {
                    console.log("❌ wrong syntax");
                    return;
                }

                await roleEvent(roleName1, roleName2, client);
            }
        });

        client.on('interactionCreate', async (interaction) => {
            if (interaction.isChatInputCommand() && interaction.commandName === 'inv') {
                await invCommand.execute(interaction);
            }

            if (interaction.isStringSelectMenu() && interaction.customId === 'inventory_view') {
                await handleInventoryView(interaction);
            }

            if (interaction.isButton() && interaction.customId.startsWith('equip_')) {
                await handleEquipInteraction(interaction);
            }
        });

    } catch (e) {
        console.error("❌ Global error in bot init:", e);
        console.dir(e, { depth: null });
    }
})();

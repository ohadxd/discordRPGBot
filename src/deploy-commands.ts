import { REST, Routes, SlashCommandBuilder } from 'discord.js';
import { config } from 'dotenv';

config();

const commands = [
    new SlashCommandBuilder()
        .setName('inv')
        .setDescription('📦 הצג את האינבנטורי שלך')
        .toJSON()
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN!);

(async () => {
    try {
        console.log('🔁 רושם פקודות...');

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID!, process.env.GUILD_ID!),
            { body: commands }
        );

        console.log('✅ הפקודות נרשמו בהצלחה!');
    } catch (error) {
        console.error('❌ שגיאה ברישום הפקודות:', error);
    }
})();
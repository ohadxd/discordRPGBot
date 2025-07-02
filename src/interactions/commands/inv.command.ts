// src/commands/inv.command.ts
import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { handleInventoryCommand } from '../handlers/inventory.handler';

export const data = new SlashCommandBuilder()
    .setName('inv')
    .setDescription('📦 הצג את התיק שלך');

export async function execute(interaction: ChatInputCommandInteraction) {
    await handleInventoryCommand(interaction);
}

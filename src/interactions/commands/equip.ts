import { Message } from 'discord.js';
import { equipItem } from '../game/charlogic.js';

export async function handleEquipCommand(message: Message, args: string[]) {
    if (!message.guild || !message.member) return;

    const itemName = args.join(' ').trim();
    if (!itemName) {
        return message.reply('❌ Please specify an item name to equip.');
    }

    const response = await equipItem(message.author.id, message.guild.id, itemName);
    await message.reply(response);
}

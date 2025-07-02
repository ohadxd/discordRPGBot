import {
    ActionRowBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuInteraction,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    Interaction,
    ButtonInteraction
} from 'discord.js';
import UserRPG from '../../models/UserModel';
import { ItemType } from '../../models/item'; // אם קיים

type EquipmentSlot = 'weapon' | 'armor' | 'accessory';

export async function handleInventoryCommand(interaction: Interaction) {
    if (!interaction.isChatInputCommand()) return;
    const userId = interaction.user.id;
    const guildId = interaction.guildId;

    const user = await UserRPG.findOne({ userId, guildId }).populate("inventory");
    if (!user || !user.inventory || user.inventory.length === 0) {
        await interaction.reply({ content: '🎒 התיק שלך ריק!', ephemeral: true });
        return;
    }

    const inventory = user.inventory as unknown as ItemType[];

    const options = inventory.map((item, index) => ({
        label: `${item.name}`,
        value: `${index}`,
        description: `סוג: ${item.type}`,
        emoji: item.type === 'weapon' ? '🗡️' :
            item.type === 'armor' ? '🛡️' :
                item.type === 'potion' ? '🧪' : '📦'
    }));

    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('inventory_view')
        .setPlaceholder('בחר פריט מהתיק שלך')
        .addOptions(options);

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);

    await interaction.reply({
        content: '🎒 הנה התיק שלך:',
        components: [row],
        ephemeral: true
    });
}

export async function handleInventoryView(interaction: StringSelectMenuInteraction) {
    const userId = interaction.user.id;
    const guildId = interaction.guildId;

    const user = await UserRPG.findOne({ userId, guildId }).populate("inventory");
    if (!user) return;

    const inventory = user.inventory as unknown as ItemType[];

    const selectedIndex = parseInt(interaction.values[0]);
    const item = inventory[selectedIndex];

    const bonusEntries =
        item.bonuses instanceof Map
            ? [...item.bonuses.entries()]
            : Object.entries(item.bonuses ?? {});

    const bonusList = bonusEntries
        .map(([key, val]) => `• ${key}: +${val}`)
        .join('\n');

    const embed = new EmbedBuilder()
        .setTitle(`🧾 ${item.name}`)
        .setDescription(`סוג: ${item.type}\nכמות: ${item.quantity}\n\nבונוסים:\n${bonusList}`)
        .setColor('#2ecc71');

    const button = new ButtonBuilder()
        .setCustomId(`equip_${selectedIndex}`)
        .setLabel(item.type === 'potion' ? '🧪 שתה' : '🧥 לבש')
        .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

    await interaction.reply({
        embeds: [embed],
        components: [row],
        ephemeral: true
    });
}

export async function handleEquipInteraction(interaction: ButtonInteraction) {
    if (!interaction.customId.startsWith('equip_')) return;

    const userId = interaction.user.id;
    const guildId = interaction.guildId;

    const user = await UserRPG.findOne({ userId, guildId }).populate("inventory");
    if (!user) return;

    const inventory = user.inventory as unknown as ItemType[];
    const index = parseInt(interaction.customId.replace('equip_', ''));
    const item = inventory[index];

    if (!item || !item.type) {
        await interaction.reply({ content: '❌ לא ניתן לצייד את הפריט.', ephemeral: true });
        return;
    }

    if (item.type === 'potion') {
        // TODO: implement use potion logic
        await interaction.reply({ content: '🧪 שתית את השיקוי (עדיין לא ממומש).', ephemeral: true });
        return;
    }

    const slot: EquipmentSlot = item.type as EquipmentSlot;
    if (user.equipment)
        user.equipment[slot] = {
            name: item.name,
            type: item.type,
            bonuses: item.bonuses instanceof Map
                ? item.bonuses
                : new Map(Object.entries(item.bonuses ?? {}))
        };

    await user.save();
    await interaction.reply({ content: `✅ ציידת את **${item.name}** בהצלחה!`, ephemeral: true });
}

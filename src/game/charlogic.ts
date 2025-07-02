import UserRPG from '../models/UserModel.js';
import {ItemType} from "../models/item";

type EquipmentSlot = 'weapon' | 'armor' | 'accessory';

/**
 * Equip an item from inventory
 */
export async function equipItem(
    userId: string,
    guildId: string,
    itemName: string
): Promise<string> {
    const user = await UserRPG.findOne({ userId, guildId }).populate("inventory");
    if (!user) return "❌ Character not found.";

    // Find the item in inventory
    const inventory:ItemType[] = user.inventory as unknown as ItemType[];
    const item = inventory.find((i) =>
        i.name?.toLowerCase() === itemName.toLowerCase()
    );

    if (item && !(item.bonuses instanceof Map)) {
        item.bonuses = new Map(Object.entries(item.bonuses));
    }

    if (!item) return `❌ You don’t have "${itemName}" in your inventory.`;
    if (!['weapon', 'armor', 'accessory'].includes(item.type ?? ''))
        return "❌ This item can't be equipped.";

    const slot = item.type as EquipmentSlot;
    if(user.equipment)
    // Equip item into the correct slot
    user.equipment[slot] = {
        name: item.name ?? 'Unknown',
        type: slot,
        bonuses: item.bonuses ?? new Map()
    };

    await user.save();
    return `✅ Equipped **${item.name}** as your ${slot}.`;
}
export function getEffectiveStats(baseStats: any, equipment: any): any {
    const result = { ...baseStats };

    for (const slot of ['weapon', 'armor', 'accessory'] as const) {
        const item = equipment?.[slot];
        if (!item?.bonuses) continue;

        for (const [stat, value] of item.bonuses.entries()) {
            result[stat] = (result[stat] || 0) + value;
        }
    }

    return result;
}
import {EmbedBuilder, Message} from 'discord.js';
import UserRPG from '../models/UserModel.js';

export async function handleJoinCommand(message: Message) {
    const userId = message.author.id;
    const guildId = message.guild?.id;
    if (!guildId) return;

    const existing = await UserRPG.findOne({ userId, guildId });

    if (existing) {
        return message.reply("✅ You're already registered in this server!");
    }

    // Create new user with starter data
    const starterWeapon = {
        name: 'Wooden Sword',
        type: 'weapon',
        bonuses: new Map([['attack', 2]])
    };

    const newUser = new UserRPG({
        userId,
        guildId,
        xp: 0,
        level: 1,
        nextLevelXp: 100,
        gold: 20,
        health: 100,
        maxHealth: 100,
        mana: 30,
        maxMana: 30,
        stats: {
            attack: 5,
            defence: 5,
            speed: 5,
            magicDamageResistance: 0,
            criticalChance: 0.05,
            criticalDamage: 1.5
        },
        inventory: [starterWeapon],
        equipment: {
            weapon: null,
            armor: null,
            accessory: null
        }
    });

    await newUser.save();
    const embed = new EmbedBuilder()
        .setTitle(`🎮 ברוך הבא, ${message.author.username}!`)
        .setDescription(`
המסע שלך מתחיל עכשיו!

🪓 קיבלת **חרב עץ** ו־💰 20 מטבעות זהב.
כדי להתחיל להילחם — השתמש בפקודה:
\`!equip חרב עץ\`

🧭 שלבים ראשונים:
1. 🧍 לבש ציוד: \`!equip <שם הפריט>\`
2. 🗺️ בדוק את המפה: \`!map\` — ראה מקומות שאפשר לבקר בהם.
3. 🚶 לך למקום: \`!go <שם מקום>\`
4. ⚔️ אם יש אויב — הוא יופיע אוטומטית, ואתה תוכל לתקוף עם \`!attack\`

📝 תוכל לראות את מצבך בכל רגע עם:
\`!status\`

בהצלחה במסע! ✨
`).setColor(0x00AE86);
    return message.author.send({embeds: [embed]});
}

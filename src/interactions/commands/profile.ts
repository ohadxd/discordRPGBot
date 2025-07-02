import { Message, EmbedBuilder } from 'discord.js';
import UserRPG from '../../models/UserModel';
import { getEffectiveStats } from '../../game/charlogic';


type BaseStats = {
    attack?: number;
    defence?: number;
    magicDamageResistance?: number;
    speed?: number;
    criticalChance?: number;
    criticalDamage?: number;
};

function formatStat(base: number = 0, bonus: number = 0): string {
    return bonus > 0 ? `${base} \`+${bonus}\`` : `${base}`;
}

export async function handleProfileCommand(message: Message) {
    const userId = message.author.id;
    const guildId = message.guild?.id;
    if (!guildId) return;

    const user = await UserRPG.findOne({ userId, guildId });
    if (!user) return message.reply("❌ אתה עדיין לא רשום למשחק. הקלד `!join` כדי להתחיל!");

    const base: BaseStats = user.stats ?? {};
    const gear = user.equipment ?? {};

    // סך כל הבונוסים מהציוד
    const bonusStats = {
        attack: 0,
        defence: 0,
        magicDamageResistance: 0,
        speed: 0,
        criticalChance: 0,
        criticalDamage: 0
    };

    for (const slot of ['weapon', 'armor', 'accessory'] as const) {
        const item = gear[slot];
        if (!item?.bonuses) continue;

        for (const [stat, value] of item.bonuses.entries()) {
            if (bonusStats.hasOwnProperty(stat)) {
                bonusStats[stat as keyof typeof bonusStats] += value;
            }
        }
    }

    const finalStats = getEffectiveStats(base, gear);

    // XP bar
    const xpPercent = Math.min((user.xp / user.nextLevelXp) * 100, 100);
    const filledBlocks = Math.round(xpPercent / 10);
    const xpBar = '▰'.repeat(filledBlocks) + '▱'.repeat(10 - filledBlocks);

    const embed = new EmbedBuilder()
        .setColor('#8e44ad')
        .setTitle(`📜 דף דמות: ${message.author.displayName}`)
        .setThumbnail(message.author.displayAvatarURL())
        .setDescription(`🎖️ רמה ${user.level}    ✨ XP: ${user.xp}/${user.nextLevelXp}
${xpBar} ${xpPercent.toFixed(0)}%
——————————————`)
        .addFields(
            {
                name: '🩸 חיים ומאנה',
                value: `❤️ ${user.health}/${user.maxHealth}     🧠 ${user.mana}/${user.maxMana}`,
                inline: false
            },
            {
                name: '📊 סטטיסטיקות',
                value:
                    `🗡️ התקפה: ${formatStat(base.attack, bonusStats.attack)}
🛡️ הגנה: ${formatStat(base.defence, bonusStats.defence)}
✨ קסם: ${formatStat(base.magicDamageResistance, bonusStats.magicDamageResistance)}
⚡ מהירות: ${formatStat(base.speed, bonusStats.speed)}
🎯 קריט: ${(base.criticalChance ?? 0) * 100}% \`+${(bonusStats.criticalChance * 100).toFixed(1)}%\`
💥 נזק קריט: ×${(base.criticalDamage ?? 1.5).toFixed(1)} \`+${bonusStats.criticalDamage.toFixed(1)}\``,
                inline: false
            },
            {
                name: '🧪 ציוד נוכחי',
                value:
                    `🔪 נשק: ${gear.weapon?.name ?? 'אין'}
🦺 שריון: ${gear.armor?.name ?? 'אין'}
💍 אביזר: ${gear.accessory?.name ?? 'אין'}`,
                inline: false
            },
            {
                name: '💰 ארנק',
                value: `🟡 מטבעות: ${user.gold}`,
                inline: false
            }
        )
        .setFooter({
            text: '🎮 RPG Bot | Powered by הבינה שלך',
            iconURL: 'https://cdn-icons-png.flaticon.com/512/1039/1039540.png'
        });

    return message.reply({ embeds: [embed] });
}

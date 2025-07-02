import {Client} from 'discord.js';

export async function roleEvent(role1: string, role2: string, client: Client) {

    const random: number = Math.random() < 0.5 ? 1 : 2;
//524623500288458781 japanime
    //1383785465974489163 legacy
    const guild = client.guilds.cache.get('1383785465974489163');
    if (!guild) return console.log('❌ Guild not found');
    const getRole1 = guild.roles.cache.find(r => r.name === role1);
    const getRole2 = guild.roles.cache.find(r => r.name === role2);

    if (!getRole1 || !getRole2) {
        console.log(`❌ Role not found ${getRole1}, ${getRole2}`);
        return;
    }
    console.log('⏳ Fetching all members...');
    const members = await guild.members.fetch(); // טוען את כל הממברים

    console.log(`✅ Found ${members.size} members:`);
    members.forEach(member => {
        if (member.user.bot) return; // דלג על בוטים
        const hasRole1 = member.roles.cache.has(getRole1.id);
        const hasRole2 = member.roles.cache.has(getRole2.id);

        if (hasRole1 || hasRole2) {
            console.log(`⏭️ ${member.user.tag} כבר קיבל רול, מדלג`);
            return;
        }
        const random: number = Math.random() < 0.5 ? 1 : 2;
        if(random == 1)
            member.roles.add(getRole1).then(() => console.log(`✅ Role '${getRole1.name}' added to ${member.user.tag}`))
                .catch(err => console.error("❌ Failed to add role:", err));
        else
            member.roles.add(getRole2).then(() => console.log(`✅ Role '${getRole2.name}' added to ${member.user.tag}`))
                .catch(err => console.error("❌ Failed to add role:", err));
    });
}
export{}
console.log("🔍 Import isolation test started");

async function testImport(path: string, name: string) {
    try {
        await import(path);
        console.log(`✅ ${name} - OK`);
    } catch (e) {
        console.error(`❌ ${name} - FAILED`);
        console.dir(e, { depth: null });
    }
}

await testImport('dotenv/config', 'dotenv');
await testImport('./filters.js', 'filters');
await testImport('./commands/equip.js', 'equip');
await testImport('./commands/join.js', 'join');
await testImport('./lib/db/db.js', 'db');
await testImport('./commands/profile.js', 'profile');
await testImport('./commands/inv.js', 'inv');
await testImport('./commands/inventory.js', 'inventory');
await testImport('./commands/rolesEvent.js', 'rolesEvent');

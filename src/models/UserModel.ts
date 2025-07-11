import mongoose, {Mongoose} from 'mongoose';


const equipmentSchema = new mongoose.Schema({
    name: String,
    type: String,
    bonuses: { type: Map, of: Number }
}, { _id: false });

const userRPGSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    guildId: { type: String, required: true },

    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    nextLevelXp: { type: Number, default: 100 }, // or dynamically calculate

    gold: { type: Number, default: 20 },

    stats: {
        attack: { type: Number, default: 5 },
        defence: { type: Number, default: 5 },
        magicDamageResistance: { type: Number, default: 0 },
        speed: { type: Number, default: 5 },
        criticalChance: { type: Number, default: 0.05 },      // 5% default
        criticalDamage: { type: Number, default: 1.5 }        // 150% crit multiplier
    },

    health: { type: Number, default: 100 },
    maxHealth: { type: Number, default: 100 },

    mana: { type: Number, default: 30 },
    maxMana: { type: Number, default: 30 },

    equipment: {
        weapon: equipmentSchema,
        armor: equipmentSchema,
        accessory: equipmentSchema
    },


    inventory: { type: [mongoose.Schema.Types.ObjectId],ref: 'Item', default: [] },
    questList: [{
        quest: {type: mongoose.Schema.Types.ObjectId, ref: 'Quest'},
        status: {
            type: String,
            enum: ['available', 'in_progress', 'completed', 'failed'],
            default: 'in_progress'},
        acceptedAt: { type: Date, default: Date.now },
        progress: mongoose.Schema.Types.Mixed
        },
        ],
    location: { type: mongoose.Schema.Types.ObjectId, ref: "Location"}
});

userRPGSchema.index({ userId: 1, guildId: 1 }, { unique: true });

export default mongoose.model('UserRPG', userRPGSchema);

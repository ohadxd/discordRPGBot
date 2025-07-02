import mongoose from "mongoose";


const itemSchema = new mongoose.Schema({
    name: String,
    type: String, // 'weapon', 'armor', 'accessory', 'potion'
    bonuses: { type: Map, of: Number },
    quantity: { type: Number, default: 1 }
}, { _id: false });

export interface ItemType {
    name: string;
    type: string; // אפשר גם: 'weapon' | 'armor' | 'accessory' | 'potion'
    bonuses: Map<string, number>;
    quantity: number;
}
export default mongoose.model("Item", itemSchema);
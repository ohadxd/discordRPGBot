import mongoose from "mongoose";


const BuildingSchema = new mongoose.Schema({
    name: {type: String, required: true},
    NPCList: {type: [mongoose.Schema.Types.ObjectId], ref: 'NPC'},
    image: {type: String}
});
export default mongoose.model("Building", BuildingSchema);
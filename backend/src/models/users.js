import mongoose from "mongoose";
const Schema = mongoose.Schema;


//User schema/model
const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true, unique: true },
    userName: { type: String, default: "" },
    password: { type: String, required: true, },
    email: { type: String, required: true, unique: true },
    address: { type: String, default: "" },
    age: { type: Number },
    gender: { type: String },
},
    {
        timestamps: true,
        typeCast: true
    }
);

const userModel = mongoose.model("User", userSchema);

export default userModel;

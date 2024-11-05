// db.js
import mongoose from "mongoose";

const connectToMongo = () => {
    mongoose.connect("mongodb://127.0.0.1:27017/bloodbank")
    .then(() => {
        console.log('Mongoose connected');
    })
    .catch((e) => {
        console.log('Failed to connect to MongoDB', e);
    });
};

export default connectToMongo;

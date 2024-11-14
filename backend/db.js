// db.js
import mongoose from "mongoose";
const URI=process.env.MONGODB_URI
const connectToMongo = () => {
    mongoose.connect(URI)
    .then(() => {
        console.log('Mongoose connected');
    })
    .catch((e) => {
        console.log('Failed to connect to MongoDB', e);
    });
};

export default connectToMongo;

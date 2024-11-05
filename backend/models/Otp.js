import mongoose from 'mongoose';
const { Schema } = mongoose;

const otpverification = new Schema({
    userId: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    createdat: {
        type: Date,
        default: Date.now
    },
    expiresat: {
        type: Date,
        default: () => Date.now() + 3600000 // 1 hour from now
    }
});

export default mongoose.model('userotp', otpverification);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});

UserSchema.pre('save', async function (next) {
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (e) {
        next(e);
    }
});

UserSchema.methods.checkPassword = async function (password) {
    try {
        await bcrypt.compare(password, this.password);
    } catch (e) {
        throw e;
    }
};

const User = mongoose.model('user', UserSchema);

module.exports = User;

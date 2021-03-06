const { Schema, model } = require("mongoose");
const { hash, compare } = require('bcryptjs');
const { MONGOOSE_KEYS } = require('./mongooseKeys')

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
});

userSchema.methods.hashPassword = async function () {
  this.password = await hash(this.password, 10)
}

userSchema.methods.isUnqiueUser = async function () {
  const results = await this.find({ $or: [{ username: this.username }, { email: this.email }] })
  return results.length === 0
}

userSchema.methods.saveAndReturnSanitized = async function () {
  const savedUser = await this.save()
  savedUser.password = undefined
  return savedUser
}

userSchema.methods.validPassword = async function (plainPassword) {
  return compare(plainPassword, this.password)
}

userSchema.methods.getGameProfilesCreatedByUser = async function () {
  const gameProfileModel = this.model(MONGOOSE_KEYS.MODELS.GAME_PROFILE)
  return gameProfileModel.getByCreationUser(this.id)
}

userSchema.methods.getUsersGameProfiles = async function (userId, opts) {
  return this.model(MONGOOSE_KEYS.MODELS.GAME_PROFILE).getUsersGameProfiles(userId, opts)
}

userSchema.statics.findOneByUsername = async function (username) {
  return this.findOne({ username })
}

const User = model("user", userSchema);

module.exports = { User };

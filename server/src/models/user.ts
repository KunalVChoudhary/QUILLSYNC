import {Schema, model, type InferSchemaType, } from 'mongoose';

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

type User = InferSchemaType<typeof userSchema>;

const User = model<User>("user", userSchema);

export default User;

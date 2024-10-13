import { Schema, model } from 'mongoose';
import { UsersCollection } from '../models/user.js';

const contactsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      required: true,
      enum: ['work', 'home', 'personal'],
      default: 'personal',
    },
    userId: {
      type: Schema.ObjectId,
      required: true,
      ref: UsersCollection,
    },
    photo: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const ContactsCollection = model('contacts', contactsSchema);

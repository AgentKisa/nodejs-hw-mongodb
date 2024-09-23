import { ContactsCollection } from '../db/models/contacts.js';

const getAllContacts = async () => {
  const contacts = await ContactsCollection.find();
  return contacts;
};

const getContactById = async (contactId) => {
  const contact = await ContactsCollection.findById(contactId);
  return contact;
};

const createContact = async (contact) => {
  const newContact = await ContactsCollection.create(contact);
  return newContact;
};

const updateContact = async (contactId, payload) => {
  const updatedContact = await ContactsCollection.findOneAndUpdate(
    { _id: contactId },
    payload,
    { new: true },
  );
  return updatedContact;
};

// const rawResult = await ContactsCollection.findOneAndUpdate(
//   { _id: contactId },
//   payload,
//   options,
// );

// if (!rawResult || !rawResult.value) return null;

// return rawResult.value;

const deleteContact = async (contactId) => {
  const result = await ContactsCollection.findOneAndDelete({ _id: contactId });
  return result;
};

export {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
};

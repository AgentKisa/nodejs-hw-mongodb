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
  const rawResult = await ContactsCollection.findOneAndUpdate(
    { _id: contactId },
    payload,
  );

  if (!rawResult || !rawResult.value) return null;

  return rawResult.value;
};

export { getAllContacts, getContactById, createContact, updateContact };

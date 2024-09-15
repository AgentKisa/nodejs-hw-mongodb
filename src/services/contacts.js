import { ContactsCollection } from '../db/models/contacts.js';

const getAllContacts = async () => {
  const contacts = await ContactsCollection.find();
  return contacts;
};

const getContactById = async (studentId) => {
  const contact = await ContactsCollection.findById(studentId);
  return contact;
};

export { getAllContacts, getContactById };

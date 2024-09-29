import { ContactsCollection } from '../db/models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../utils/parseSortParams.js';

const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = SORT_ORDER.ASC,
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  console.log('getAllContacts: page and perPage parsed', page, perPage);
  const contactsQuery = ContactsCollection.find();

  if (filter.contactType) {
    contactsQuery.where('contactType').equals(filter.contactType);
  }

  if (filter.isFavourite) {
    contactsQuery.where('isFavourite').eq(filter.isFavourite);
  }

  const contactsCount = await ContactsCollection.find()
    .merge(contactsQuery)
    .countDocuments();

  const contacts = await contactsQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    .exec();
  console.log('getAllContacts: contacts found', contacts);

  const paginationData = calculatePaginationData(contactsCount, page, perPage);
  console.log('getAllContacts: pagination data', paginationData);

  return {
    data: contacts,
    ...paginationData,
  };
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

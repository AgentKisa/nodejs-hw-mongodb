import { ContactsCollection } from '../db/models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../utils/parseSortParams.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { saveImage } from '../utils/saveImage.js';

const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = SORT_ORDER.ASC,
  filter = {},
  userId,
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = ContactsCollection.find({ userId });

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

  const paginationData = calculatePaginationData(contactsCount, page, perPage);

  return {
    data: contacts,
    ...paginationData,
  };
};
const getContactById = async (contactId, userId) => {
  const contact = await ContactsCollection.findOne({
    _id: contactId,
    userId,
  });
  return contact;
};

const createContact = async (userId, contact, file) => {
  let photo = null;
  if (file) {
    photo = await saveImage(file);
  }
  const newContact = await ContactsCollection.create({
    ...contact,
    userId,
    photo,
  });
  return newContact;
};
const updateContact = async (contactId, userId, payload, file) => {
  let photo = null;
  if (file) {
    photo = await saveImage(file);
  }
  const updatedContact = await ContactsCollection.findOneAndUpdate(
    { _id: contactId, userId },
    { ...payload, userId, photo },
    { new: true },
  );
  return updatedContact;
};
const deleteContact = async (contactId, userId) => {
  const result = await ContactsCollection.findOneAndDelete({
    _id: contactId,
    userId,
  });
  return result;
};

export {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
};

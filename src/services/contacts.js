// src/services/contacts.js
import { Contact } from '../db/models/contact.js';

export const getAllContacts = async ({
  filter = {},
  skip = 0,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 'asc',
  userId,
}) => {
  const sortOptions = { [sortBy]: sortOrder };

  const contactsQuery = Contact.find({ ...filter, userId });

  const contactsCount = await Contact.countDocuments({ ...filter, userId });

  const contacts = await contactsQuery
    .skip(skip)
    .limit(perPage)
    .sort(sortOptions)
    .exec();

  return {
    data: contacts,
    totalItems: contactsCount,
  };
};

export const getContactById = async (contactId, userId) => {
  const contact = await Contact.findOne({ _id: contactId, userId });
  return contact;
};

export const addContact = async (payload) => {
  const contact = await Contact.create(payload);
  return contact;
};

export const updateContact = async (
  contactId,
  userId,
  payload,
  options = {},
) => {
  const rawResult = await Contact.findOneAndUpdate(
    { _id: contactId, userId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    data: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};

export const removeContact = async (contactId, userId) => {
  const contact = await Contact.findOneAndDelete({
    _id: contactId,
    userId,
  });

  return contact;
};

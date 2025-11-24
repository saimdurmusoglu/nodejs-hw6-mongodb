import {
  getAllContacts,
  getContactById,
  addContact, // Servis fonksiyonun
  updateContact,
  removeContact,
} from '../services/contacts.js';
import createError from 'http-errors';

export const getContactsController = async (req, res) => {
  const { _id: userId } = req.user;
  const { page = 1, perPage = 10 } = req.query;
  const pageNum = parseInt(page, 10);
  const perPageNum = parseInt(perPage, 10);
  const skip = (pageNum - 1) * perPageNum;
  const { sortBy = 'name', sortOrder = 'asc' } = req.query;
  const validSortOrder = sortOrder === 'desc' ? -1 : 1;
  const { isFavourite } = req.query;
  const filter = {};

  if (isFavourite !== undefined) {
    filter.isFavourite = isFavourite === 'true';
  }

  const { data: contacts, totalItems } = await getAllContacts({
    filter,
    skip,
    perPage: perPageNum,
    sortBy,
    sortOrder: validSortOrder,
    userId,
  });

  const totalPages = Math.ceil(totalItems / perPageNum);
  const hasPreviousPage = pageNum > 1;
  const hasNextPage = pageNum < totalPages;

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: {
      data: contacts,
      page: pageNum,
      perPage: perPageNum,
      totalItems,
      totalPages,
      hasPreviousPage,
      hasNextPage,
    },
  });
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;

  const contact = await getContactById(contactId, userId);

  if (!contact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const { _id: userId } = req.user;

  let photo = null;
  
  if (req.file) {
    photo = req.file.path || req.file.secure_url;
    console.log("🔗 [DEBUG] Yakalanan Photo URL:", photo);
  } else {
    console.log("⚠️ [DEBUG] req.file BOŞ GELDİ! (Multer dosyayı Controller'a iletmedi)");
  }

  const contact = await addContact({ 
    ...req.body, 
    userId, 
    photo
  });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const patchContactController = async (req, res) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;

  const updateData = { ...req.body };

  if (req.file) {
    updateData.photo = req.file.path;
  }

  const result = await updateContact(contactId, userId, updateData);

  if (!result) {
    throw createError(404, 'Contact not found');
  }

  const responseData = result.data || result;

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: responseData,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;
  const deletedContact = await removeContact(contactId, userId);
  if (!deletedContact) {
    throw createError(404, 'Contact not found');
  }
  res.status(204).send();
};
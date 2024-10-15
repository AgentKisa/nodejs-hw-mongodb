import { Router } from 'express';
import {
  createContactController,
  deleteContactController,
  getAllContactsController,
  getContactByIdController,
  updateContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/validationContacts.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/multer.js';

const router = Router();

router.get('/contacts', authenticate, ctrlWrapper(getAllContactsController));

router.get(
  '/contacts/:contactId',
  authenticate,
  isValidId,
  ctrlWrapper(getContactByIdController),
);

router.post(
  '/contacts',
  authenticate,
  upload.single('photo'),
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);

router.patch(
  '/contacts/:contactId',
  authenticate,
  isValidId,
  upload.single('photo'),
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactController),
);

router.delete(
  '/contacts/:contactId',
  authenticate,
  isValidId,
  ctrlWrapper(deleteContactController),
);

export default router;

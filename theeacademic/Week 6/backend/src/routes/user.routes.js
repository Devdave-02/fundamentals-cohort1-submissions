const express = require('express');
const { validate } = require('../middleware/validate');
const {
  idParamSchema,
  createUserSchema,
  updateUserSchema,
  listUsersQuerySchema
} = require('../validators/user.schema');
const controller = require('../controllers/user.controller');

const router = express.Router();

router.get('/', validate(listUsersQuerySchema, 'query'), controller.listUsers);
router.post('/', validate(createUserSchema, 'body'), controller.createUser);
router.get('/:id', validate(idParamSchema, 'params'), controller.getUser);
router.put('/:id', validate(idParamSchema, 'params'), validate(updateUserSchema, 'body'), controller.updateUser);
router.delete('/:id', validate(idParamSchema, 'params'), controller.deleteUser);

module.exports = router;

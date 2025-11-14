const express = require('express');
const { validate } = require('../middleware/validate');
const {
  idParamSchema,
  createTransactionSchema,
  updateTransactionSchema,
  listTransactionsQuerySchema
} = require('../validators/transaction.schema');
const controller = require('../controllers/transaction.controller');

const router = express.Router();

router.get('/', validate(listTransactionsQuerySchema, 'query'), controller.listTransactions);
router.post('/', validate(createTransactionSchema, 'body'), controller.createTransaction);
router.get('/:id', validate(idParamSchema, 'params'), controller.getTransaction);
router.put('/:id', validate(idParamSchema, 'params'), validate(updateTransactionSchema, 'body'), controller.updateTransaction);
router.delete('/:id', validate(idParamSchema, 'params'), controller.deleteTransaction);

module.exports = router;

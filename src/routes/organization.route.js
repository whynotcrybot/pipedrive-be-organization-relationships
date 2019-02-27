const { Router } = require('express');

const organizationController = require('../controllers/organization.controller');

const router = new Router();

router
  .get('/generate/:amount', organizationController.generateOrganizations)
  .get('/', organizationController.getOrganization)
  .post('/', organizationController.createOrganization)
  .delete('/', organizationController.flushOrganizations);

module.exports = router;

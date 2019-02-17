const { Router } = require('express');

const organizationController = require('../controllers/organization.controller');

const router = new Router();

router
  .get('/', organizationController.getOrganization)
  .post('/', organizationController.createOrganization);

module.exports = router;

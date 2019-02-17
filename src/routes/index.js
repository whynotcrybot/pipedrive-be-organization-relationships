const { Router } = require('express');

const organizationRoute = require('./organization.route');

const router = new Router();

router.use('/organization', organizationRoute);

module.exports = router;

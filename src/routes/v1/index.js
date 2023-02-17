const express = require('express');
const router = express.Router();

const adminRoute = require('./admin/admin.route');
// const menteeRoute = require('./mentee/mentee.route');
// const mentorRoute = require('./mentor/mentor.route');


const defaultRoutes = [
    {
        path: '/admin',
        route: adminRoute,
    },
    // {
    //     path: '/mentee',
    //     route: menteeRoute,
    // },
    // {
    //     path: '/mentor',
    //     route: mentorRoute,
    // }
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

module.exports = router;
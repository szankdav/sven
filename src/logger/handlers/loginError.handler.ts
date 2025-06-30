import { Request, Response } from 'express';

export const loginErrorHandler = (req: Request, res: Response) => {
    const statusCode = req.query.code || 500;
    if (Number(statusCode) === 401) {
        res.status(401).render('loginError', {
            loginError: 'Access restricted: Only server administrators can log in. To view server statistics, please ensure you have administrative permissions on the server where Sven is installed.',
            isLoggedIn: false,
            title: 'Discord Server Monitoring',
            layout: 'layout',
            styles: ['/css/index.css', '/css/error.css'],
            scripts: ['/js/navbar.js'],
        });
        return;
    };
    res.status(500).render('loginError', {
        loginError: 'Unable to log in. Please try again, and if the issue persists, contact the site administrator for assistance.',
        isLoggedIn: false,
        title: 'Discord Server Monitoring',
        layout: 'layout',
        styles: ['/css/index.css', '/css/error.css'],
        scripts: ['/js/navbar.js'],
    });
};

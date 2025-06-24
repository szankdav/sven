import { Request, Response } from 'express';

export const loginErrorHandler = (req: Request, res: Response) => res.status(500).render('loginError', {
    loginError: 'Unable to log in. Please try again, and if the issue persists, contact the site administrator for assistance.',
    isLoggedIn: false,
    title: 'Discord Server Monitoring',
    layout: 'layout',
    styles: ['/css/index.css', '/css/error.css'],
    scripts: ['/js/navbar.js'],
});

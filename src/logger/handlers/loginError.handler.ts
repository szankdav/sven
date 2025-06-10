import { Request, Response } from 'express';

export const loginErrorHandler = (req: Request, res: Response) => res.status(500).render('error', {
    routeError: '',
    loginError: 'Error! :( Ask the site operator for help, or try again later!',
    isLoggedIn: false,
    title: 'Discord Server Monitoring',
    layout: 'layout',
    styles: ['/css/index.css', '/css/error.css'],
    scripts: ['/js/navbar.js'],
});

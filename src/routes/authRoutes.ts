import passport from 'passport';
import { Express } from 'express';

export const initAuthRoutes = (app: Express) => {
    // Express route that redirects user to Google OAuth
    app.get(
        '/auth/google',
        passport.authenticate('google', {
            scope: ['profile', 'email']
        })
    );

    // Google OAuth redirect after authentication attempt
    app.get('/auth/google/callback', passport.authenticate('google'));

    app.get('/api/logout', (req, res) => {
        // attached automatically by passport; passport destroys cookie
        req.logOut();
        res.send(req.user);
    });

    // See if req.user was set by deserialized()
    app.get('/api/current_user', (req, res) => {
        res.send(req.user);
        // res.send(req.session);
    });
};

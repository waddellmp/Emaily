import GoogleStrategy, { StrategyOptions } from 'passport-google-oauth20';
import '../models/User';
import passport from 'passport';
import { User } from '../models/User';
import { Model } from 'mongoose';

// Google API Key
const { keys } = require('../../config/keys.js');

// Get Google OAuth strategy constructor func
const googleStrategy = GoogleStrategy.Strategy;

// CREATE instance of User and get mongoose Model
const UserModel = new User().getModelForClass(User);

/**
 * serializeUser
 *  1) Method to take the user object returned from the Google OAuth strategy when done(undefined, user) is called.
 *  2) Passport takes that user id and stores it internally on req.session.passport which is passport’s internal mechanism to keep track of things.
 *
 * deserializeUser
 * 1) First arg is the user id and performs db search for the user by id.
 * 2) Adds user to req.user
 * 3) It then calls done(undefined, user), which attaches the fetched user object to req.user.
 *
 * Both methods are used by passport to set and validate the session or cookie for each subsquent request.
 */
passport.serializeUser((user: any, done) => {
    done(undefined, user.id);
});

passport.deserializeUser((id, done) => {
    UserModel.findById(id).then(user => {
        done(undefined, user);
    });
});

// Hook up Google OAuth stratgey as a middleware with passport
passport.use(
    new googleStrategy(
        {
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            callbackURL: '/auth/google/callback'
        },
        (accessToken, refreshToken, profile, done) => {
            // Call to mongo db
            UserModel.findByGoogleId(profile.id)
                .then(user => {
                    // CREATE
                    if (!user) {
                        new UserModel({
                            googleId: profile.id
                        })
                            .save()
                            .then(user => done(undefined, user)); // done() sets req.user with user
                    } else {
                        done(undefined, user); // done() sets req.user with user
                    }
                })
                .catch(err => {
                    done(undefined, false);
                });
        }
    )
);

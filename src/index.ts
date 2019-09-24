import express from 'express';
import './services/passport';
import cookieSession from 'cookie-session';
import passport from 'passport';
import { initAuthRoutes } from './routes/authRoutes';
import mongoose from 'mongoose';
import './models/User';

const { keys } = require('../config/keys.js');

// connect to mongo atlas db
mongoose
    .connect(keys.mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .catch(() => console.log('Error connecting to mongo database!'));

const app = express();

// Add cookie-session function as middleware. Adds req.session to request object
app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [keys.cookieKey]
    })
);

// Required to initialize passport with express
app.use(passport.initialize());

// Enable session support with express
app.use(passport.session());

// Initialize app routes
initAuthRoutes(app);

// Runtime config for port binding
const PORT = process.env.PORT || 5000;
app.listen(PORT);

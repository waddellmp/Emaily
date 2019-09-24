# Notes

MongoDB Atlas

```
user: mwaddell
pass: XsxlZhTG87GtiNBe
connection string:
mongodb+srv://mwaddell:XsxlZhTG87GtiNBe@emaily-ncdtv.mongodb.net/test?retryWrites=true&w=majority

```

## Setting up environment

Install **typescript**. I have the package globally installed.

Install **nodemon** for watching for file changes and automatically restarting the node.js app.

Install **concurrently** for running multiple npm scripts at the same time.

## Create .tsconfig file

Run the command: `tsc --init`

Enable `sourceMap` so our the output .js code can map directly to our .ts code.

Set `outDir` to `build`.

Set `rootDir` to `src`.

Because we node.js runtime doesn't understand .ts syntax we must setup some task automation for our IDE (VSCode) to run before the node.js runtime tries to run the app.

Click on the "debug" option and click on the gear icon.

This generate/open the `launch.json` file inside of the `.vscode` directory.

Inside `configurations` add the following:

Set `type` to `node`, this tells VSCode to use the built-in node.js debugger.

The `request` key defines the two main mode for debugging.

The `launch` denotes that app will launch and then attach the debugger to the running process.

The `attach` the debugger will attach itself to some running process.

The `preLaunchTask` is an important key that specifies what single task we can run before launch. You can also setup multiple tasks differently by having vscode create a tasks.json file. In here you create an array of tasks to run before or after launch.

The `outFiles` is the path of the output build file, it is what the node runtime or debugger will run after the task(s) are done.

The `program` is the path to the file starting the app.

```json
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Launch Program",
            "preLaunchTask": "tsc: build - tsconfig.json",
            "outFiles": ["${workspaceFolder}/build/index.js"],
            "program": "${workspaceFolder}/src/index.ts"
        }
    ]
}
```

The npm script `start-dev` is the development time script to run. It will watch/compile the .ts code and run our app using `nodemon`.

Saving any files inside the src dir will trigger a server reload because we are using `nodemon`.

You should also see a console message saying you are running in dev mode.

## Setup VSCode Debug

To debug node.js apps written in Typescript, you must have the following done:

> Enable `sourceMap` in .tsconfig

## Setting up GoogleOAuth

**clientId** is a public token that is shared with user provided by google.

**secret** a token that should be kept private

Create dir called **config** to prevent pushing the secret to Github.

# Authentication

We are using 'cookie-based authentication' in this project.

Once a user has signed in using Google OAuth successfully, Google will send back a response to our app with a token. This token is set inside the header of the request, specifically in the `Set-Cookie` property.

The `Set-Cookie` is unique to our user.

The browser will get the response and strip off the token and append it to the end of each and every request.

# Mongo DB

**Collection**
contains many records.

**Records**
Each record is like a JS object.

**Shape of Data**
Every record can have its own set of custom properties.

**What is mongoose?**

A lib for MonogoDB.

Mongoose defines several important constructs that represent MongoDB entities such as:

**Model Class**
Is representative of a MonogoDB collection.

The model class is used to 'access a single collection' within MonogoDB.

The model class has a set of built-in methods that allow us to work with the data inside the collection.

**Model Instances**
Is representative of a record.

Model instances are js objects.

# Setting up our first Mongoose Model Class

The goal is to create a model class to create out `users` collection in our mongo db.

Create a new dir called `models`.

Create a file called `User.ts`.

We know that a user in our app will at a minimum require an `id` property. (Google OAuth returns a single id).

Create a new type called `User` with and `id` property.

```ts
import mongoose from 'mongoose';
const { Schema } = mongoose;

interface User {
    id: string;
}

const userSchema = new Schema<User>();

// Setting the user schema
mongoose.model('users', userSchema);
```

The `Schema` type is a class that is a generic type <T>. <T> should be the shape of the data we want to work with. In our case <User>.

With `mongoose.model()` the method signature to SET has two arguments.

<code>
mongoose.model(
nameOfModel<string>, userSchema:Schema<T>
)
</code>

To READ a model from the `mongoose` object use pass only the name of the model.

<code>
mongoose.model('users');
</code>

# Encountered Issue when defining a TS interface and defining a mongoose schema.

There is a major issue when you have to define the mongoose model and the TS interface.

```ts
import mongoose, { Schema, Document, Model, model } from 'mongoose';

// define User inteface
interface User extends Document {
    googleId: string;
}

// define mongoose schema
const userSchema = new Schema({ googleId: String });

// setting the user schema
mongoose.model('users', userSchema);
```

Why define the interface?

> We want type consistency and most importantly type sensing, without it we would not benefit from using TS.

Why define the mongoose schema?

> Cause it is required man.

Why can't we just define both?

> This is redundant, and requires more work.

Solution?

> Typegoose

<code>npm install -S typegoose</code>

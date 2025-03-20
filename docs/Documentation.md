# Overview & Introduction

## Project name

SVSimulator-chatbot

## Description

The goal of this program is to create a Discord bot that logs messages sent on a server into a database.

## Target audience

Anyone who wants to log messages sent on their Discord server or needs a configurable bot to suit their requirements.

## Key Features

- Initialize Discord bot
- Log messages sent by the bot
- Display messages and related data

## Tech stack

- Node.JS with Express.JS
- Discord.JS
- TypeScript
- EJS framework
- Winston logger
- SQLite3
- PlayWright
- Vitest

# Installation & Setup

## Installation Steps

Clone the repository's development branch:

    git clone -b development --single-branch https://github.com/szankdav/SVSimulator-chatbot.git

<<<<<<< HEAD
Navigate to the cloned folder and install dependencies:
=======
Navigate to the cloned folder and install dependencies:

> > > > > > > development

     npm install

## Configuration

# <<<<<<< HEAD

> > > > > > > development
> > > > > > > To set up your bot, refer to the Discord Developer Portal:
> > > > > > > [Setting up a bot application](https://discordjs.guide/preparations/setting-up-a-bot-application.html)

Create a .env file in your root folder and add these variables:

    DISCORD_TOKEN_DEV=<Your discord bot token>
    DISCORD_CLIENT_ID_DEV=<Your application id on Discord Developer>
    GUILD_ID_DEV=<Your discord server id>
    LOG_LEVEL_DEV=silly

# Usage Guide

# <<<<<<< HEAD

> > > > > > > development

## How to Run the Software

To run the program in developer mode:

    npm run dev

Then open in a browser:

    http://localhost:3000/

## Basic Usage

Home page:

![](https://i.ibb.co/7xnjc7kR/home.jpg)

Authors Page (No Authors in Database)

![](https://i.ibb.co/0y4XKPX9/noauthors.jpg)

Messages Page (No Messages in Database)

![](https://i.ibb.co/8J5fCfZ/nomessages.jpg)

If you have a bot application set up in the Discord Developer Portal, added to your Discord server, and the necessary data added to the .env file, messages sent on your server will be logged.

Authors Page (With Authors in Database)

![](https://i.ibb.co/jvC197C4/author.jpg)

Messages Page (With Messages in Database)

![](https://i.ibb.co/RTkpyz8g/messages.jpg)

Messages Page (After Selecting an Author)

![](https://i.ibb.co/hJCpzdts/allmessages.jpg)

Statistics page:

![](https://i.ibb.co/ccqxpVNx/statistics.jpg)

Statistics Page (After Clicking Show Statistics)

![](https://i.ibb.co/XkDc5R2C/showstatistics.jpg)

## Advanced Features

Statistics Page (After Clicking Show Statistics)

<<<<<<< HEAD

Advanced Features

# You can customize your bot by modifying the files in: **/src/bot/\*/**.

Advanced Features

You can customize your bot by modifying the files in: **/src/bot/\*/**.

> > > > > > > development
> > > > > > > Refer to the [Discord.js](https://discordjs.guide/creating-your-bot/slash-commands.html) guide for more details.
> > > > > > > The application uses [Winston Logger](https://github.com/winstonjs/winston) to log activities into log files, stored in /src/logs. You can adjust the log level in .env.

# API Documentation

## Endpoints

GET Requests::
<<<<<<< HEAD

- /
- /authors/:page
- /mesages/:page
- /messages/author/:id
- /statistics/author/:id

POST Requests::

- # /logMessage

* /
* /authors/:page
* /mesages/:page
* /messages/author/:id
* /statistics/author/:id

POST Requests::

- /logMessage
  > > > > > > > development

## Request & Response Examples

GET Request Handling

Example request:

    app.get('/authors/:page', authorsHandler);

Handler implementation:

    export const authorsHandler = async (req: Request, res: Response, next: NextFunction) => {
    	try {
        	const page = parseInt(req.params['page']);
        	const renderObject = await authorsController(db, page);
        	res.render(renderObject.viewName, renderObject.options);
    	} catch (error) {
        	logger.error("Author handler error:", error);
        	next(error);
    	}
    }

POST Request Handling

Example request:

    app.post('/logMessage', messageLoggerHandler);

Handler implementation:

    export const messageLoggerHandler = async (req: Request, res: Response, next: NextFunction) => {
    	try {
        	const message = req.body.message;
        	await messageLoggerController(db, message);
        	res.sendStatus(200);
    	} catch (error) {
        	logger.error("MessageLogger handler error:", error);
        	next(error);
    	}
    }

## Error Handling

The application uses custom error classes:

    export class AuthorsError extends Error {
    	statusCode: number;
    	constructor(message: string, statusCode: number) {
      		super(message);
      		this.statusCode = statusCode;
      		Error.captureStackTrace(this, this.constructor);
    	}
    }

<<<<<<< HEAD

=======

> > > > > > > development
> > > > > > > Example usage:

    export const authorsController = async (db: Database, page: number): Promise<RenderObject> => {
    	try {
        	if (isNaN(page)) {

<<<<<<< HEAD
const renderObject: RenderObject = { viewName: "error", options: { err: "Page not found!" } }
=======
const renderObject: RenderObject = { viewName: "error", options: { err: "Page not found!" } }

> > > > > > > development

            	return renderObject;
        	}
        	const authorsPageNumber = Math.ceil((await getAllAuthors(db)).length / 10);
        	const authorsSlicedByTen = await getTenAuthors(db, [page == 1 ? 0 : (page - 1) * 10]);
        	let error: string = "";
        	if (page > authorsPageNumber) { error = "No authors to show... Are you sure you are at the right URL?" };

        	let renderObject: RenderObject = {
            	viewName: "authors",
            	options: { authorsPageNumber, authorsSlicedByTen, error }
        	};

        	return renderObject;
    	} catch (error) {
        	logger.error("Error creating authors renderObject:", error);
        	throw new AuthorsError("Error fetching authors!", 500);
    	}
    }

# Database

## Database file

The application uses [SQLite3](https://www.sqlitetutorial.net/) for data storage. Configure the file location in:

<<<<<<< HEAD
const dbFilePath = path.join(**dirname, 'DiscordMessages.db');
=======
const dbFilePath = path.join(**dirname, 'DiscordMessages.db');

> > > > > > > development

## Database Structure

The database contains three tables:

![](https://i.ibb.co/v4XN9RFV/tables.jpg)

The id column in the Authors table is a foreign key in the Letters and Messages tables.

# Code Documentation

## Folder Structure

Root Folder:

![](https://i.ibb.co/6cJwS0qz/rootfolder.jpg)

<<<<<<< HEAD

- **/dist**: Contains the built application.
- **/public**: Includes JavaScript and CSS files for EJS templates.
- **/src**: Main application folder.
- # **/tests**: Contains Playwright tests.

* **/dist**: Contains the built application.
* **/public**: Includes JavaScript and CSS files for EJS templates.
* **/src**: Main application folder.
* **/tests**: Contains Playwright tests.
  > > > > > > > development

**/src** Folder Structure

![](https://i.ibb.co/cSh27Vqk/srcfolder.jpg)

<<<<<<< HEAD

- **/bot**: Folder for the discord bot.
- **/logger**: Folder for the logging logic.
- **/scripts**: Folder for reusable scripts.
- # **/winston**: Folder of the winston logger.

* **/bot**: Folder for the discord bot.
* **/logger**: Folder for the logging logic.
* **/scripts**: Folder for reusable scripts.
* **/winston**: Folder of the winston logger.
  > > > > > > > development

**/bot** Folder Structure

![](https://i.ibb.co/rRv8x1V0/botfolder.jpg)

<<<<<<< HEAD

- **/client**: Bot initialization files.
- **/commands/utility**: Slash commands for the bot.
- **/events**: Events the bot listens to.
- # **/interactions**: Bot interactions.

* **/client**: Bot initialization files.
* **/commands/utility**: Slash commands for the bot.
* **/events**: Events the bot listens to.
* **/interactions**: Bot interactions.
  > > > > > > > development

**/logger** Folder Structure

![](https://i.ibb.co/pBdPNdL7/loggerfolder.jpg)

<<<<<<< HEAD

- **/controller**: Controllers.
- **/database**: Database-related files.
- **/database/faker**: Faker.js-based fake data generator.
- **/handlers**: Handlers.
- **/model**: Models.
- **/types**: Type definitions.
- **/utils/customErrorClasses**: Custom error classes.
- **/view**: EJS files.
- # **/view/core**: Reused EJS files.

* **/controller**: Controllers.
* **/database**: Database-related files.
* **/database/faker**: Faker.js-based fake data generator.
* **/handlers**: Handlers.
* **/model**: Models.
* **/types**: Type definitions.
* **/utils/customErrorClasses**: Custom error classes.
* **/view**: EJS files.
* **/view/core**: Reused EJS files.
  > > > > > > > development

## Key Components

The project follows the MVC pattern:

<<<<<<< HEAD

- **/src/logger/model** Manages data.
- **/src/logger/view**: Handles layout and display.
- # **/src/logger/controller**: Routes commands to the model and view parts.

* **/src/logger/model** Manages data.
* **/src/logger/view**: Handles layout and display.
* **/src/logger/controller**: Routes commands to the model and view parts.
  > > > > > > > development

## Testing

Unit tests are written using Vitest. To run tests:

    npm run test

Functional tests are written using PlayWright. To run tests:

Start the application:

    npm run dev

And run the tests:

    npm run playwright-dev

This command generates fake data, runs the tests, and removes test data afterward.

# Licensing & Legal

## Created by

<<<<<<< HEAD
David Szankovszky - https://github.com/szankdav
=======

David Szankovszky - https://github.com/szankdav

> > > > > > > development

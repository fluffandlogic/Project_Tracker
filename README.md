# Project_Tracker
I created this project to store a subset of fields from Jira that were frequently required to manage my project deadlines, 
but that Jira does a terribly job of surfacing without a lot of customization. (Customization which is not available
to non-admin users). 

It was also an attempt to quickly re-learn JavaScript, as I was frustrated with how rusty my JavaScript had gotten through
lack of use. 

This project was limited by the extremely restrictive work environment I had to work in:
- no local dev environmental tools like node, brew
- or anything that required Admin/root/super access
- no acccess to *any* code editors that had *any* mention of AI
- no browser plugins
- no local tools like databases or IDEs except Visual Studio Code, and *all plugins* were disabled
- etc.

To get around all these limitations, I had to use the browser's localStorage to store the data. I had a roadmap to replace
it in the future with indexDb, but I had a long list of features that I wanted to build first. All data had to be loaded
via JSON or CSV and parsed, and then immediately saved to localStorage.

In addition to these features, I had worked on two huge features:
- a complete meta-tag autocomplete dropdown control with a central meta-tag repository.
- a punch in / punch out tool to help me track how much time I spent on a particular project (I would select a project
to punch into and then click a punch out button and the system would calculate the time and add it to the day's project schedule.)

The autocomplete feature took 6 hours to develop. The punch tool took 4 hours. Unfortunately, I lost *all the code* when
the browser crashed and the online editor I was using reverted to an earlier version of the code 😡. Sigh and Grr. I might
rewrite the code someday, once I rewrite this code to work with MySQL.

## Running the Application

This project now includes a local web server for development. To get started:

### Prerequisites
- Node.js installed on your system
- npm (comes with Node.js)

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```

### Running the Server

You have several options for running the local web server:

#### Option 1: Quick Start (Recommended)
```bash
npm start
```
This will start the server on port 8080 and automatically open your browser.

#### Option 2: Development Mode with Live Reload
```bash
npm run dev
```
This includes live reload functionality - the page will automatically refresh when you make changes to files.

#### Option 3: Basic Server
```bash
npm run serve
```
This starts the server without opening the browser automatically.

### Accessing the Application
Once the server is running, you can access your Project Tracker at:
- **http://localhost:8080**

### Server Configuration
The server configuration is defined in `ws.config.js` and includes:
- CORS enabled for cross-origin requests
- Cache control headers to prevent caching during development
- API rewrite rules to serve JSON data from the `/data` directory
- Live reload for development

### Stopping the Server
Press `Ctrl+C` in the terminal to stop the server.


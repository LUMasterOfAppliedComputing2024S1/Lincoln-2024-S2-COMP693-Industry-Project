# Lincoln-2024-S2-COMP693-Industry-Project (UI Development)


## Instructions

### 1. Project Structure

#### 1.1. Concept Design

The final version of the new scoreboard UI design is attached.

![image](https://github.com/user-attachments/assets/28ad7210-4a18-47b2-8f8f-994c5ed6257c)
(example of one store new scoreboard UI)

#### 1.2. Project Structure

This is the big structure including the RPM existing system (built in classic ASP and VB script). I developed the new scoreboard UI app by creating the folder 'ScoreboardsNew'(a new Node.js Express and EJS templating app)

![image](https://github.com/user-attachments/assets/ea774c88-0598-4508-88e9-60cf31f7c4f8)

This is the overall structure of the new scoreboard UI app I developed for RPM Retail.

![image](https://github.com/user-attachments/assets/1ea64b0d-e0ac-46e3-b54b-ebd64938ff0d)

app.js - the main entry point of the new scoreboard UI app built in Node.js Express

db/db.js - the js file that defines the connection of the pre-built RPM MSSQL DB credentials

.env.gpg - the encrypted .env file that stores DB credentials environment variables

frontend folder - it contains all the static files, EJS page, and JavaScript logic for the project

![image](https://github.com/user-attachments/assets/9239168b-da72-4797-98ad-26889ef669fa)


### 2. Deployment

The project is hosted at the RPM dev server using Windows IIS for now.

Users who can connect to the dev server can open the app through the new tab added in the RPM existing app

![image](https://github.com/user-attachments/assets/475ed57e-28b7-4ac5-9262-286eceb3b7eb)

![image](https://github.com/user-attachments/assets/7fa63cd1-27d7-424f-a1c7-2daa0733cc5b)


Web app link: https://arproject2.pythonanywhere.com/

Project console: Bash console 33599583

Database console: MySQL: arproject2$default

# My Marvelous Memoir

An online personal diary app that allows you to create daily posts which you can edit and delete at anytime.

## Purpose

It has proven over and over again that keeping a journal/private dairy has been effective in helping with anxiety. As someone who suffers from anxiety myself, I wanted to create an app to help people suffering from stress/anxiety that they could use from anywhere.

## Recommended Usage

For testing purposes, I recommend you test our web app with the following login credentials -

- Username: Demouser
- Password: Demo1234!

## Screenshots

<p align="center">
  <img width="223" height="395.5" src="assets\landingpage.PNG">
  <img width="223" height="395.5" src="assets\registerpage.PNG">
  <img width="223" height="395.5" src="assets\loginpage.PNG">
  <img width="223" height="395.5" src="assets\userpage.PNG">
  <img width="223" height="395.5" src="assets\addnewentrypage.PNG">
  <img width="223" height="395.5" src="assets\publicpostpage.PNG">
</p>

## API Documentation

API endpoints

- POST to '/api/auth/login' authenticate and login returning user
- POST to '/api/auth/refresh' refresh Auth token
- POST to '/api/users' posts new user info into database
- GET to '/api/users' get all users from database
- GET to '/api/user/:id' get all stories by id
- DELETE to '/api/user/:id' delete a user by id
- PATCH to '/api/user/:id' update a user by id
- GET to '/api/post' get all posts from database
- POST to '/api/post' posts a post to the database
- GET to '/api/post/:id' get all posts by id
- DELETE to '/api/post/:id' delete a post by id
- PATCH to '/api/post/:id' update a post by id
- GET to '/api/comment' get all comments from database
- POST to '/api/comment' posts a comment to the database
- GET to '/api/comment/:id' get all comments by id
- DELETE to '/api/comment/:id' delete a comment by id
- PATCH to '/api/comment/:id' update a comment by id

## Built With

- HTML5
- CSS3
- Javascript
- jQuery
- React
- PostgreSQL
- Express
- Node.js
- JWT
- Heroku/Zeit

## Demo

- [Live Demo](https://mymarvelousmemoir.now.sh/)

## Author

- [**Rupali Rajput**](https://github.com/RupiR) - Front-End development / Back-End development / Styling

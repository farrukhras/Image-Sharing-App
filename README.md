# Image Sharing App

## Description

The project is an image sharing application with login and register functionalities. It allows users to upload and share image posts from their accounts, follow and unfollow other users, and engage in real-time chat with different users.

The back-end of the application is built using the Express framework for Node.js. It provides a robust API that interacts with the MongoDB database for fetching and storing data. User authentication, image uploads, and data retrieval are handled through the back-end API. 

On the front-end, the application utilizes React functional components to create a user-friendly interface. The login/register and image sharing functionalities are implemented to allow seamless interaction with the application. The data is fetched from the MongoDB database via the Node.js server and displayed in the React components.

Additionally, Socket.IO is utilized to enable real-time communication capabilities within the application. Users can engage in instant messaging and send messages to other online users using Socket.IO's reliable and efficient messaging system.

## Technologies Used

- Express framework for Node.js
- MongoDB for data storage
- React for front-end development
- Socket.IO for real-time communication

## Setup and Installation

1. Clone the repository.
2. Install the required dependencies using the following commands in the respective folders:
   - `npm install` in the `api` folder
   - `npm install` in the `client` folder
   - `npm install` in the `socket` folder
3. Replace `<your_mongo_url>` in the `/api/.env` file with your MongoDB connection URL.
4. Run `npm start` in the `client` folder to start the front-end development server.
5. Run `npm start` in the `socket` folder to start the Socket.IO server.
6. Run `node index.js` in the `api` folder to start the back-end API server.
7. Access the application through the provided URL.

## Demo of the Realtime Chat feature

[![Realtime Chat feature](https://ik.imagekit.io/ably/ghost/prod/2023/01/build-a-realtime-chat-app-from-scratch--1-.png?tr=w-1728,q-50)](https://youtu.be/jFa1PBYT6Tg)


## Contact

For any inquiries or suggestions, feel free to contact me at this [email](farrukhrasool112@gmail.com).

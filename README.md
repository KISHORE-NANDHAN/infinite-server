# Node.js Server Installation Guide

## Introduction

This guide will help you set up a Node.js server for your application. Follow the steps below to initialize and install the necessary dependencies.

## Prerequisites

Before you begin, ensure you have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed on your machine.

## Installation Steps

1. **Initialize the Project**

   First, create a new directory for your project and navigate into it. Then, run the following command to initialize a new Node.js project:

   ```bash
   npm init
2. Install Dependencies
Install the necessary dependencies for your Node.js server by running the following command:

```bash
npm install mongoose express cors nodemon dotenv
```
- mongoose: An ODM (Object Data Modeling) library for MongoDB and Node.js.
- express: A minimal and flexible Node.js web application framework.
- cors: A package to enable Cross-Origin Resource Sharing.
- nodemon :  A utility that monitors for any changes in your source and automatically restarts your server.
- dotenv: A module to load environment variables from a .env file into process.env.

3. Install Dependencies
Install the necessary dependencies for your Node.js server by running the following command:

```bash
npm install bcrypt jsonwebtoken
```
- bcrypt: This library is used for hashing passwords before storing them in a database. It adds a layer of security by making it difficult for attackers to retrieve the original password from the hash.

- jsonwebtoken (jwt): This library is used to create and verify JSON Web Tokens (JWTs). JWTs are commonly used for securely transmitting information (like user authentication data) between parties, especially in web applications.

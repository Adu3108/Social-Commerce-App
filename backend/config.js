const { Client } = require("pg");

const client = new Client("postgres://advaitpadhye:123@localhost:5432/ecommerce"); //Configuring PostgresSQL Database

// const client = new Client("postgres://advaitpadhye:123@localhost:5432/recommendation"); //Configuring PostgresSQL Database

module.exports = client;

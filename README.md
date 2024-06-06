# Social Commerce Web Application

This repository contains the project done as a part of the course CS 387: Database and Information Systems at IIT Bombay in Spring 2023 

## Problem Statement

The goal of this project is to create a web application that will serve as an e-commerce website. Users can sign up with personal details, such as name and address and payment methods. These will be used for the physical transfer of goods as well as authentication. Users can act as buyers and sellers. Buyers can access other user reviews to browse through the items they require as well as choose the best price. They will also receive recommendations based on their recent searches as well as the goods and sellers with the top reviews. Along the same lines, they can also provide reviews about sellers from whom they have made a purchase and about the items, which will serve as a feedback mechanism as well as an authenticity check on the seller. Meanwhile, users, as sellers, can put up their products on sale, advertise their products as well as provide customisation options as necessary. The sellers can use the calendar feature to set a delivery date for their product and other time-based features.

## Running the Application

1. Install the latest versions of [Node.js](https://nodejs.org/en/download), [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) and [PostgreSQL](https://www.postgresql.org/download/). Make sure that PostgreSQL server is up while running the application.

2. Run the following commands for installing the required packages :-
   ```bash
   cd backend
   npm install
   ```
   ```bash
   cd frontend
   npm install
   ```
   
3. To start the app, please run the following commands :-
   ```bash
   cd backend
   npm start
   ```
   ```bash
   cd frontend
   npm start
   ```

## Recommendation System

- To generate the data for recommendation system, please run the `preprocessor.py` file in `database/Recommendation System` folder. 

- We have already provided some fake data in `database/Recommendation System/Generated Data`.

- For incorporating the recommendation data in Postgres, run the following command :- 

```bash
cd database/Recommendation\ System
python3 csv_to_postgres.py --name <database_name> –-user <username> --pswd <password> --host <host_address> --port <port> --import-table-data --table <table_name> --path <csv_path>
```

- The recommendation data uses a size of 20 characters for the User ID however smaller User IDs suffices for normal use.

- We have provided two .ddl files :-
  1. `ecommerce.ddl` for Normal Website Use
  2. `recommendation.ddl` for using the Recommendation system
 
## References

| | | |
| ------- | ------- | ------- |
| [Login Authentication](https://dev.to/shreshthgoyal/user-authorization-in-nodejs-using-postgresql-4gl) | [Autocomplete Search Bar](https://github.com/sickdyd/react-search-autocomplete) | [Review Star System](https://github.com/ertanhasani/react-stars) |
| [Sessions](https://www.tutorialspoint.com/localstorage-in-reactjs) | [Upload Images](https://dev.to/przpiw/file-upload-with-react-nodejs-2ho7) | [Running Python file from Node](https://medium.com/swlh/run-python-script-from-node-js-and-send-data-to-browser-15677fcf199f) |
| [React Bootstrap](https://react-bootstrap.github.io/) | [Reviews Database](https://nijianmo.github.io/amazon/index.html#files) | [KNN Algorithm for Recommendation System](https://towardsdatascience.com/prototyping-a-recommender-system-step-by-step-part-1-knn-item-based-collaborative-filtering-637969614ea) |
| [Tables](https://getbootstrap.com/docs/4.0/content/tables/) | [List-Group](https://react-bootstrap.github.io/components/list-group/) | [Card-Item](https://react-bootstrap.github.io/components/cards/) |
| [Navbar](https://react-bootstrap.github.io/components/navbar/) | [Alerts](https://react-bootstrap.github.io/components/alerts/) | [Close Button](https://react-bootstrap.github.io/components/close-button/) |
| [Calendar](https://blog.logrocket.com/react-calendar-tutorial-build-customize-calendar/) | [Form](https://react-bootstrap.github.io/forms/form-control/) | [DateTime Manipulation](https://momentjs.com) |

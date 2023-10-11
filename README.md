References

Login Authentication :- https://dev.to/shreshthgoyal/user-authorization-in-nodejs-using-postgresql-4gl
Sessions :- https://www.tutorialspoint.com/localstorage-in-reactjs
React Bootstrap :- https://react-bootstrap.github.io/
Tables :- https://getbootstrap.com/docs/4.0/content/tables/
Navbar :- https://react-bootstrap.github.io/components/navbar/
Calendar :- https://blog.logrocket.com/react-calendar-tutorial-build-customize-calendar/
Autocomplete Search Bar :- https://github.com/sickdyd/react-search-autocomplete
Review Star System :- https://github.com/ertanhasani/react-stars
Upload Images :- https://dev.to/przpiw/file-upload-with-react-nodejs-2ho7
Running Python file from Node :- https://medium.com/swlh/run-python-script-from-node-js-and-send-data-to-browser-15677fcf199f
Reviews Database :- https://nijianmo.github.io/amazon/index.html#files
KNN Algorithm for Recommendation System :- https://towardsdatascience.com/prototyping-a-recommender-system-step-by-step-part-1-knn-item-based-collaborative-filtering-637969614ea
List-Group :- https://react-bootstrap.github.io/components/list-group/
Card-Item :- https://react-bootstrap.github.io/components/cards/
Alerts :- https://react-bootstrap.github.io/components/alerts/
Close Button :- https://react-bootstrap.github.io/components/close-button/
Form :- https://react-bootstrap.github.io/forms/form-control/
DateTime Manipulation :- https://momentjs.com

We are using config.js instead of config.txt in the backend folder

Run the following commands for installing the required packages :- 
`npm install` for Backend
`npm install` for Frontend

To start the app, please run the command `npm start` in the backend folder as well as frontend folder separately.

To generate the data for recommendation system, please run the `preprocessor.py` file in `database/Recommendation System` folder. We have already provided some fake data in `database/Recommendation System/Generated Data`.

For incorporating the recommendation data in Postgres, run the following command in `database/Recommendation System` directory.
$ python3 csv_to_postgres.py --name <database_name> –-user <username> --pswd <password> --host <host_address> --port <port> --import-table-data --table <table_name> --path <csv_path>

The recommendation data uses a size of 20 characters for the User ID however smaller User IDs suffices for normal use. We have provided two .ddl files (ecommerce.ddl for Normal Website Use and recommendation.ddl for using the Recommendation system) 
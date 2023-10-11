import argparse, psycopg2, sys, csv
from psycopg2.extras import execute_values

edges = None
toposort = None
visited = None

def main(args):
    connection = psycopg2.connect(host = args.host, port = args.port, database = args.name, user = args.user, password = args.pswd)
    cursor = connection.cursor()
    
    if(args.import_table_data):
        with open(args.path, 'r') as f: #Reading the CSV file
            reader = csv.reader(f)
            next(reader) # Skip the header row.
            complete_data = []
            for row in reader:
                complete_data.append(tuple(row))
        execute_values(cursor, "INSERT INTO " + args.table + " " + "VALUES %s", complete_data) #Executing SQL query
        connection.commit()
    
    if(args.export_table_data):
        cursor.execute("SELECT * FROM {};".format(args.table))
        if args.path:
            file = open(args.path, 'w')
        else:
            file = sys.stdout
        if args.format == "csv":
            # outfile = csv.writer(file, delimiter=',', quoting=csv.QUOTE_NONE, escapechar='\\')
            outfile = csv.writer(file, delimiter=',')

            outfile.writerow([i[0] for i in cursor.description])
            for e in cursor.fetchall(): outfile.writerow(e)
            # outfile.writerows(cursor.fetchall())
        elif args.format == "sql":
            headers = [i[0] for i in cursor.description]
            header_string = "("
            for header in headers[:-1]:
                header_string += header + ", "
            header_string += headers[-1]
            header_string += ")"
            for row in cursor.fetchall():
                l = map(lambda x: str(x), row)
                file.write("INSERT INTO {} {} values {};\n".format(args.table, header_string, tuple(l)))

    if(args.show_tables):
        pass

    if(args.show_table_schema):
        pass

    if(args.import_sql):
        pass

    if(args.export_database_schema):
        pass
    
    if(args.testing):
        cursor.execute("DROP TABLE IF EXISTS test;")
        cursor.execute("CREATE TABLE test (id serial PRIMARY KEY, num integer, data varchar);")
        cursor.execute("INSERT INTO test (num, data) VALUES (%s, %s)", (100, "abc'def"))
        cursor.execute("INSERT INTO test (num, data) VALUES (%s, %s)", (200, "abc'def"))
        cursor.execute("INSERT INTO test (num, data) VALUES (%s, %s)", (100, "abc'def"))
        
        cursor.execute("SELECT * FROM test;")
        row = cursor.fetchone()
        while row != None:
            print(row)
            row = cursor.fetchone()
        
        cursor.execute("SELECT * FROM test where num = 100;")
        print(cursor.fetchall())

        cursor.execute("SELECT * FROM test;")
        print(cursor.fetchmany(3))

    if connection:
        cursor.close()
        connection.close()
    

        

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--name")
    parser.add_argument("--user")
    parser.add_argument("--pswd")
    parser.add_argument("--host")
    parser.add_argument("--port")
    parser.add_argument("--import-table-data", action='store_true')
    parser.add_argument("--export-table-data", action='store_true')
    parser.add_argument("--show-tables", action='store_true')
    parser.add_argument("--show-table-schema", action='store_true')
    parser.add_argument("--table")
    parser.add_argument("--format")
    parser.add_argument("--import-sql", action='store_true')
    parser.add_argument("--path")
    parser.add_argument("--export-database-schema", action='store_true')
    parser.add_argument("--testing", action = 'store_true')

    args = parser.parse_args()
    main(args)
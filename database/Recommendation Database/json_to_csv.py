import json
import csv

with open('scraped_data.json') as json_file:
    data = json.load(json_file)

fields = ['UserID', 'ItemID', 'Rating']
rows = []
filename = "reviews.csv"

for i in data["data"]:
    rows.append([i['reviewerID'], i['asin'], i['overall']])

with open(filename, 'w') as csvfile: 
    csvwriter = csv.writer(csvfile) 
    csvwriter.writerow(fields) 
    csvwriter.writerows(rows)
import json
import pandas as pd
import random
import string

line_count = 0

first_pass = list()
user_list = set()

usermap = dict() #key: buyerID -> value: buyername

for line in open('Software_5.json', 'r').readlines():
    row_dict = json.loads(line.rstrip())
    if "reviewerName" not in row_dict or "reviewText" not in row_dict or "reviewerID" not in row_dict or "overall" not in row_dict or "reviewTime" not in row_dict or "asin" not in row_dict or "summary" not in row_dict:
        continue
    first_pass.append(row_dict)
    user_list.add(row_dict["reviewerID"])
    line_count += 1
    if row_dict["reviewerID"] in usermap:
        continue
    else:
        usermap[row_dict["reviewerID"]] = row_dict["reviewerName"][:20]

seller_list = random.sample(list(user_list), 50)

df = pd.DataFrame(
    {
        'stars': [],
        'buyerID': [],
        'sellerID': [],
        'comment': [],
        'saleID': [],
        'reviewID': [],
        'txnID': [],
        'txnquantity': [],
        'txnStatus': [],
        'txndate': [],
        'saleName': [],
        'salePrice': [],
        'saleDimensions': [],
        'saleType': [],
        'saleQty': [],
        'saleStatus': [],
        'saleDescription': [],
        'saleImage': [],
        'buyerName': [],
        'sellerName': [],
        'hashpwd': [],
    }
)

productdict = dict() # key: saleID -> value: [saleName, salePrice, saleDimensions, saleType, saleQty, saleDescription, saleImage]
sellermap = dict() # key: saleID -> value: sellerID

for i in range(len(first_pass)):
    txnStatus = 'OK'
    salestatus = 'ACTIVE'
    star = int(first_pass[i]["overall"])
    buyerID = first_pass[i]["reviewerID"]
    comment = first_pass[i]["reviewText"][:100]
    saleID = first_pass[i]["asin"]
    sellerID = str()
    if saleID in sellermap:
        sellerID = sellermap[saleID]
    else:
        sellerID = random.choice(seller_list)
        while sellerID == buyerID:
            sellerID = random.choice(seller_list)
        sellermap[saleID] = sellerID
    reviewID = i
    txnID = i
    txnquantity = random.randint(1, 10)
    pre_date = first_pass[i]["reviewTime"].split()
    txndate = pre_date[2] + "-" + pre_date[0] + "-" + pre_date[1]
    saleName = str()
    salePrice = int()
    saleDimensions = str()
    saleType = str()
    saleQty = int()
    saleDescription = str()
    saleImage = str()
    if saleID in productdict:
        saleName = productdict[saleID][0]
        salePrice = productdict[saleID][1]
        saleDimensions = productdict[saleID][2]
        saleType = productdict[saleID][3]
        saleQty = productdict[saleID][4]
        saleDescription = productdict[saleID][5]
        saleImage = productdict[saleID][6]
    else:
        letters = string.ascii_lowercase
        saleName = ''.join(random.choice(letters) for i in range(5))
        salePrice = random.randint(1, 100)
        saleDimensions = str(random.randint(1, 100)) + "x" + str(random.randint(1, 100)) + "x" + str(random.randint(1, 100))
        saleType = random.choice(["Painting", "Sculpture", "Photography", "Printmaking", "Drawing", "Collage", "Other"])
        saleQty = random.randint(1, 100)
        saleDescription = first_pass[i]["summary"][:100]
        saleImage = 'apple.jpg'
        productdict[saleID] = [saleName, salePrice, saleDimensions, saleType, saleQty, saleDescription, saleImage]
    buyerName = str()
    buyerName = usermap[buyerID]
    sellerName = usermap[sellerID]
    df.loc[i] = [star, buyerID, sellerID, comment, saleID, reviewID, txnID, txnquantity, txnStatus, txndate, saleName, salePrice, saleDimensions, saleType, saleQty, salestatus, saleDescription, saleImage, buyerName, sellerName, '$2b$10$6S/sVmjIMcP6SV6KORFBHualsGjUX9zOqVrKsojdJeOLOM5Ks2GtO']

df_user_base_temp = df[['buyerID', 'buyerName']]
df_user_base = df_user_base_temp.drop_duplicates(subset=['buyerID'], keep='first')
df_seller_temp = df[['sellerID', 'sellerName']]
df_seller = df_seller_temp.drop_duplicates(subset=['sellerID'], keep='first')
df_buyer_temp = df[['buyerID', 'buyerName']]
df_buyer = df_buyer_temp.drop_duplicates(subset=['buyerID'], keep='first')
df_sale_temp = df[['saleID', 'saleName', 'salePrice', 'saleDimensions', 'saleType', 'saleQty', 'saleStatus', 'sellerID','saleDescription', 'saleImage']]
df_sale = df_sale_temp.drop_duplicates(subset=['saleID'], keep='first')
df_transaction_temp = df[['txnID', 'buyerID', 'sellerID', 'saleID', 'txnStatus', 'txnquantity', 'txndate']]
df_transaction = df_transaction_temp.drop_duplicates(subset=['txnID'], keep='first')
df_review_temp = df[ ['reviewID', 'saleID', 'sellerID', 'buyerID', 'comment', 'txnID', 'stars']]
df_review = df_review_temp.drop_duplicates(subset=['reviewID'], keep='first')
df_user_password_temp = df[['buyerID', 'hashpwd']]
df_user = df_user_password_temp.drop_duplicates(subset=['buyerID'], keep='first')

df_user_base.to_csv('user_base.csv', index=False)
df_seller.to_csv('seller.csv', index=False)
df_buyer.to_csv('buyer.csv', index=False)
df_sale.to_csv('sale.csv', index=False)
df_transaction.to_csv('transaction.csv', index=False)
df_review.to_csv('review.csv', index=False)
df_user.to_csv('user.csv', index=False)

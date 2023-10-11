import sys
import pandas as pd
from scipy.sparse import csr_matrix
from sklearn.neighbors import NearestNeighbors

df = pd.read_csv('../database/reviews.csv')
df.drop_duplicates(['UserID', 'ItemID'], inplace=True)
df_products_features = df.pivot(
    index='ItemID',
    columns='UserID',
    values='Rating'
).fillna(0)
no_user_voted = df.groupby('ItemID')['Rating'].agg('count')
no_items_voted = df.groupby('UserID')['Rating'].agg('count')
df_products_features = df_products_features.loc[no_user_voted[no_user_voted > 10].index,:]
df_products_features = df_products_features.loc[:,no_items_voted[no_items_voted > 50].index]
mat_product_features = csr_matrix(df_products_features.values)
df_products_features.reset_index(inplace=True)
knn = NearestNeighbors(metric='cosine', algorithm='brute', n_neighbors=20, n_jobs=-1)
knn.fit(mat_product_features)


def get_recommendation(item_idx):
    n_items_to_reccomend = 10
    item_idx = df_products_features[df_products_features['ItemID'] == item_idx].index[0]
    distances , indices = knn.kneighbors(mat_product_features[item_idx], n_neighbors=n_items_to_reccomend+1)    
    rec_item_indices = sorted(list(zip(indices.squeeze().tolist(),distances.squeeze().tolist())),key=lambda x: x[1])[:0:-1]
    recommend_frame = []
    for val in rec_item_indices:
        item_idx = df_products_features.iloc[val[0]]['ItemID']
        recommend_frame.append({'Title': item_idx, 'Distance':val[1]})
    df = pd.DataFrame(recommend_frame, index=range(1,n_items_to_reccomend+1))
    df = df.iloc[::-1].reset_index(drop = True)
    df.index += 1
    return df

print(list(get_recommendation(sys.argv[1])['Title']))
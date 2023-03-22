import random
import numpy as np
import pandas as pd
import re
from ContentTFIDF import ContentTFIDF
from ContentBasedRecommender import ContentBasedRecommender
import sys

def cleanText(readData):
    text = re.sub('[-=+#/\?:^$.@*\"※~&%ㆍ!』\\‘|\(\)\[\]\<\>`\'…》]','', readData)
 
    return text

def main():
    track = pd.read_csv('tracks.csv')
    track = pd.DataFrame(track)
    track.head()

    genre = []
    for i in track['artist_genre']:
        if i == '[]':
            i = 'NA'
            genre.append(i.strip())
        else:
            i = cleanText(i)
            genre.append(i.strip())
    track['genre'] = genre

    track = track[track['genre'] != "NA"]
    track = track.reset_index()
    track['track_popularity'] = track['track_popularity'] / 100 

    ct = ContentTFIDF(track)
    ct_tfidf = ct.calculateTFIDF()

    user_playlist = sys.argv[1] #['Welcome to the Black Parade','Heat Waves','Be Somebody','Se Misca Beat']
    content_recommender = ContentBasedRecommender(track, ct_tfidf, user_playlist, 2, 2, 2)

    c = content_recommender.recommend_features()
    d = content_recommender.recommend_genre()
    e = content_recommender.feature_genre_intersection(track, c,d)
    f = content_recommender.get_total_score(50)

    return f

main()
import pandas as pd
import spotipy
import requests
import spotipy.util as util
from sklearn.preprocessing import normalize
import numpy as np
import datetime
from sklearn.preprocessing import MinMaxScaler
import time
from urllib.parse import urlencode

combined = pd.DataFrame(pd.read_csv('data/gen_playlist_info.csv'))
# features = pd.DataFrame(pd.read_csv('master_gen_info_test.csv'))
# genre = pd.DataFrame(pd.read_csv('genre_info.csv'))

# mega = pd.concat([combined, genre], axis=1, ignore_index=True)
# print(mega)
# genre['genre'] = genre['genre'].str.strip("'")
# print(genre)
# genre.to_csv('data/most_pop_genre.csv')

combined['release_date'] = combined['release_date'].str.split('-').str[0]
# test = pd.to_datetime(combined['release_date'])
# for row in combined.itertuples():
#     print(row.release_date)
#     if "-" not in row.release_date:
#         combined['release_date'].iloc[row.Index] = f'{row.release_date}-01-01'
#         print(combined['release_date'].iloc[row.Index])
# print(combined['release_date'].head(14))
combined.to_csv('data/timeline_info.csv')
# combined['duration_sec'] = (combined['duration']/1000)
# combined['duration_min'] = (combined['duration_sec']/60)
# print(combined['duration_min'])
# df = pd.DataFrame(combined.groupby(['playlist_name'])['duration_min'].mean())
# df.to_csv('data/playlist_avg_duration_final.csv')


# make number of playlists

# make genre groupings: most popular listening genres
# d_g = {}
# for row in genre[['genres', 'playlist_name']].itertuples():
#     name = row.playlist_name
#     genre = row.genres
#     if isinstance(genre, str):
#         l = genre.strip("][")
#         final = l.split(', ')
#         print(final)
#         for item in final:
#             item = item.strip("'")
#             # d_g[name] = d_g.get(name, {})
#             # d_g[name][item] = d_g[name].get(item, 0) + 1
#             d_g[item] = d_g.get(item, 0) + 1


# d_g_df = []
# for x, y in d_g.items():
#     # for genre, count in y.items():
#     d_g_df.append({
#         # 'playlist_name': x,
#         'genre': x,
#         'count':y
#     })

# d_g_df = pd.DataFrame(d_g_df)
# # d_g_df = d_g_df[d_g_df['count'] >= 5]
# print(d_g_df.head(50))
# d_g_df.to_csv('data/most_pop_genre_final_agg.csv')

# make artist groupings: which artists domainate which playloist?
# d_a = {}
# for row in genre.itertuples():
#     p_name = row.playlist_name
#     a_name = row.artist_name
#     d_a[p_name] = d_a.get(p_name, {})
#     d_a[p_name][a_name] = d_a[p_name].get(a_name, 0) + 1


# df = []
# for d, v in d_a.items():
#     max_value = max(v.values())
#     print(max_value)
#     for a, y in v.items():
#         if y == max_value:
#             df.append({'playlist_name': d,
#                 'artist_name': a,
#                 'occurences': y
#                 })
# df = pd.DataFrame(df)
# df['grouped'] = df.groupby(['playlist_name'])['artist_name'].transform(lambda x: ','.join(x))

# df.to_csv('data/most_pop_artist_on_playlist.csv')


    


# make popularity rankings by artist: on average, how mainstream is this playlist?
# df = pd.DataFrame(genre.groupby(['playlist_name'])['artist_popularity'].mean())
# # df2 = pd.DataFrame(combined.groupby(['playlist_name'])['popularity'].mean())
# # df2.to_csv('data/playlist_track_avg_popularity.csv')
# df.to_csv('data/playlist_avg_popularity_final.csv')


# print(df)



# make longest playlist

# make most decriptive playlist

# make song features aggregate df

# df = pd.DataFrame(features.groupby(['playlist_name'])['acousticness', 'danceability', 'energy', 'instrumentalness', 'liveness', 'loudness', 'speechiness', 'valence'].mean())
# scaler = MinMaxScaler(feature_range=(0, 1))
# df['loudness'] = scaler.fit_transform([[x] for x in df['loudness']])

# df = df.reset_index()
# df = pd.melt(df, id_vars='playlist_name', value_vars=['acousticness', 'danceability', 'energy', 'instrumentalness', 'liveness', 'loudness', 'speechiness', 'valence'])


# means = pd.DataFrame(df.groupby(['variable']).mean().reset_index())




# big = df.set_index('variable')
# small = means.set_index('variable')

# print(small)
# big.update(small)
# big.reset_index(inplace=True)
# print(big)
# big.set_index('variable', 'playlist_name')
# big.rename(columns={'value': 'group_mean'}, inplace=True)
# df.set_index('variable', 'playlist_name')

# final = pd.merge(big, df, how='left', on=['variable', 'playlist_name'])
# final.rename(columns={'value': 'playlist_mean'}, inplace=True)
# final.to_csv('data/features_and_means.csv')


# for row in df.itertuples():
#     print(row)
#     m = df.groupby(['variable']).mean()
# print(df.columns)
# df['mean'] = [x.value for x in m.itertuples() if df['variable'] == x.variable]

# df.to_csv("data/master_song_features_v2.csv")
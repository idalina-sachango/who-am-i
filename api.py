import spotipy
import pandas as pd
import requests
import spotipy.util as util
import time
import re
import json
from urllib.parse import urlencode

username = 'linasach'
client_id ='a8c5987864fe45908251ff2d33d312d8'
client_secret = 'ea60559a55ef403988fbd4d924d233a9'
redirect_uri = 'http://localhost:8888/callback'
scope = 'user-read-recently-played playlist-read-private playlist-read-collaborative'

token = util.prompt_for_user_token(username=username, 
                                   scope=scope, 
                                   client_id=client_id,   
                                   client_secret=client_secret,     
                                   redirect_uri=redirect_uri)

headers = {
    'Authorization' : 'Bearer ' + token
}

# endpoint = "https://api.spotify.com/v1/me/playlists?limit=50"
endpoint = "https://api.spotify.com/v1/playlists/"



playlist_ids = ["3hLkm5SATyP3ZKV4nEzO6q",
"6g457G7TVnVlP9xuWc0TYr",
"6DZS3NuYovrf8awdGPLgGO",
"3OPj3Er7H1NoIpA6N1moNr",
"0GFZ9RlsrLWNd1zfdm5Xrh",
"2uqIMUtlujQ5KG3v3AS1tF",
"6ugDFEMDsFClHSIKdBUQIo",
"0kgoWZHFZ88slbSe6D1xlB",
"2JcusTLcBtfONRBRlcsiLT",
"5otN6AnGtU9vo0HRInNLqS",
"2M6Cf7fUhsX9uD3EKnP60R",
"7ttYQPhFRbxngfkqntNUq7",
"6Qf0hc7XNBwbYoy4FMKF5n",
"1n3pBTtZY0moeauM7Zeb9d",
"6j2ULeMpQ6u58N1IbERf1n",
"0cRgrt4pOy4qzlIidj6z9z",
"2DqjPt3sHqOjuou7zteCJ6",
"0CMOH55nq0rNp69DzI4tn5",
"2HMHC95jLx6bS2AEM5iWQD",
"0RWGHOr1wSNG7iceaLeYiJ",
"1ukoI7IoGIVp8lBhOFCA8G",
"7m9XcLsJ0C8UUpIP71hYCv",
"7g7bXqOzsTTCvtAPgI4au5",
"2u8IFKg8ypIFV3NAsVy7Fq",
"6zPe1hUZQQ9kJXDDFRS9QF",
"7bDDXtyIQrV9im0MQEo4B9",
"3Z7gR2QcsrhAn0kIsmOFT4",
"7z8iRmMHNPZtThsO1a7Qec",
"1geFWd3KHXUDPEjFwePiDw",
"4Rpl4XeaZBNI8Dso3oumrN",
"5dKOZbxeHzDhykyAL62AQ9",
"3UeXJhZScwwWDYw0wqPIvp"]

query_string = ",".join(playlist_ids)

def format_string(string):
    if isinstance(string, str):
        new_string = string.replace("&#x27;", "'")
        new_string = new_string.replace("&amp;", "&")
        new_string = new_string.replace("&#x2F;", "/")
        new_string = new_string.replace("&quot;f", '"')
        new_string = new_string.replace("&quot;", '"')
        print(new_string)
        return new_string
    else:
        new_string = "No description"
        print(new_string)
        return new_string

playlists_of_interest = []
dates = []
images_csv = []
to_loop = []
for i, ids in enumerate(playlist_ids):
    lookup_url = f'{endpoint}{ids}'
    req = requests.get(lookup_url, headers=headers)


    playlist_json = req.json()
    to_loop.append(playlist_json)
    name = playlist_json['name']
    images = playlist_json['images']
    
    # for items in playlist_json['tracks']['items']:
    #     print(items['track'])
    #     date_edited = items['added_at']
    #     split = date_edited.strip('Z').split('T')
    #     dates.append({
    #         'playlist_name': name,
    #         'edited_ymd': split[0],
    #         'edited_time': split[1],
    #         'track_name': items['track']['name'],
    #         'album_name': items['track']['album']
    #     })
        
    # playlists_of_interest.append({
    #     'playlist_name': name,
    #     'description': format_string(playlist_json['description'])
    # })
    # for i in images:
    #     if i['height'] != 60:
    #         image_url = i['url']
    #         images_csv.append({
    #             'playlist_name': name,
    #             'url': image_url,
    #             'description': playlist_json['description']
    #         })
    #         break

    # with open(f'{name}.json', 'w') as p:
    #     json.dump(playlist_json, p)
    # playlists_of_interest.append(playlist_json)
# pd.DataFrame(images_csv).to_csv('images.csv')
# pd.DataFrame(playlists_of_interest).to_csv('data/playlist_descriptions_final.csv')
# pd.DataFrame(dates).to_csv('data/dates_edited_final.csv')
time.sleep(10)

def batch_to_df(artist_json, playlist_name, df):
    for a in artist_json['artists']:
        genre = ''
        popularity = ''
        if a['genres']:
            genre = a['genres']
        if a['popularity']:
            popularity = a['popularity']
        df.append({
            "playlist_name": playlist_name,
            "artist_name": a['name'],
            "genres": genre,
            "artist_popularity": popularity
            })
    return df

def parse_artists(artists, playlist_name, headers, artist_df):
    genre = ''
    popularity = ''
    df = []
    artist_df = artist_df
    
    
    if len(artists['artists']) > 50:
        ids = batch_items(artists, parse_key='artists')
        print('Number of artists batches inf forloop:', len(ids))
        base_url = "https://api.spotify.com/v1/artists?ids="
        for i in ids:
            req_artist = requests.get(f'{base_url}{i}', headers=headers)

            artist_json = req_artist.json()
            if artist_json:
                if artist_json['artists']:
                    artist_df = batch_to_df(artist_json, playlist_name, artist_df)
        time.sleep(10)
        return artist_df
    else:
        batch = artists['artists'][0:(len(artists['artists']))]
        ids = concat_ids(batch)
        base_url = "https://api.spotify.com/v1/artists?ids="
        req_artist = requests.get(f'{base_url}{ids}', headers=headers)

        artist_json = req_artist.json()
        if artist_json:
            print(artist_json.keys())
            if 'artists' in artist_json.keys():
                artist_df = batch_to_df(artist_json, playlist_name, artist_df)

        time.sleep(10)
        return artist_df

def grab_playlist_track_info(id, headers):
    """ get tracks from playlist. include, href link to each songs specific details"""
    base_url = "https://api.spotify.com/v1/playlists/"
    req = requests.get(f'{base_url}{id}/tracks?limit=50', headers=headers)
    to_json = req.json()
    print('Len of API pull for playlist tracks=',len(to_json['items']))
    time.sleep(15)
    return to_json


def batch_items(json_object, parse_key_outer='', parse_key_inner=''):
    l = []
    print("Len of object before batching=",len(json_object[parse_key_outer]))
    batch = json_object[parse_key_outer][0:len(json_object[parse_key_outer])]
    batch_ids = concat_ids(batch, parse_key=parse_key_inner)
    l.append(batch_ids)
    return l

def concat_ids(batch, parse_key=None):
    batch_ids = []
    for item in batch:
        if parse_key:
            if item[parse_key]:
                print(item[parse_key])
                if item[parse_key]['href']:
                    track_id = item[parse_key]['href'].split('/')[-1]
                    batch_ids.append(track_id)
        else:
            track_id = item['href'].split('/')[-1]
            batch_ids.append(track_id)
    batch_ids = ",".join(batch_ids)
    return batch_ids

def grab_general_songs(ids, headers, playlist_name):
    """ get tracks information."""
    base_url = "https://api.spotify.com/v1/tracks?ids="
    complete_url = base_url + ids
    req = requests.get(f'{complete_url}', headers=headers)
    to_json = req.json()
    df = []
    artist_df = []

    if to_json:
        
        if to_json['tracks']:
            print('Number of songs to grab:', len(to_json['tracks']))
            for t in to_json['tracks']:
                if t:
                    track_name = t['name']
                    album_name = t['album']['name']
                    popularity = t['popularity'] # track popularity
                    release_date = t['album']['release_date']
                    duration = t['duration_ms']
                    artist_df = parse_artists(t, playlist_name, headers, artist_df)
                    for a in t['artists']:
                        print(a['name'])

                        df.append({
                            "playlist_name": playlist_name,
                            "track_name": track_name,
                            "artist_name": a['name'],
                            "album_name": album_name,
                            "popularity": popularity,
                            "release_date": release_date,
                            "duration": duration
                        })
                    print('appended another row in general')

    time.sleep(10)

    return pd.DataFrame(df), pd.DataFrame(artist_df)

def grab_song_music_features(ids, names, headers, playlist_name):
    base_url = "https://api.spotify.com/v1/audio-features?ids="
    complete_url = base_url + ids
    req = requests.get(f'{complete_url}', headers=headers)
    to_json = req.json()

    df = []
    if to_json:
        #iterate through multiples tracks' features
        for idx, track in enumerate(to_json['audio_features']):
            t, a_name = names[idx]

            if track:
                df.append({
                    "playlist_name": playlist_name,
                    "artist_name": a_name,
                    'track_name': t,
                    "acousticness": track["acousticness"],
                    "analysis_url": track["analysis_url"],
                    "danceability": track["danceability"],
                    "duration_ms": track["duration_ms"],
                    "energy": track["energy"],
                    "id": track["id"],
                    "instrumentalness": track["instrumentalness"],
                    "key": track["key"],
                    "liveness": track["liveness"],
                    "loudness": track["loudness"],
                    "mode": track["mode"],
                    "speechiness": track["speechiness"],
                    "tempo": ["tempo"],
                    "time_signature": track["time_signature"],
                    "track_href": track["track_href"],
                    "type": ["type"],
                    "uri": track["uri"],
                    "valence": track["valence"]
                })

    time.sleep(10)
    return pd.DataFrame(df)

main_df1 = pd.DataFrame()
main_artist_df = pd.DataFrame()
main_df2 = pd.DataFrame()

for idx, i in enumerate(to_loop):
    print('Number of playlists to parse:',len(playlists_of_interest))
    playlist_name = i['name']
    collaborative = i['collaborative']
    description = i['description']
    playlist_id = i['id']
    # data = 'market=ES&fields=items(track(name%2Chref%2Calbum(name%2Chref)))&limit=50'
    print('Number of tracks in playlists=',i['tracks']['total'])

    to_json = grab_playlist_track_info(playlist_id, headers)

    names_list = []
    for i in to_json['items']:
        print(i['track'].keys())
        track = i['track']['name']
        for k in i['track']['artists']:
            name = k['name']
            b = (track, name)
            print(b)
            names_list.append(b)
    l = batch_items(to_json, parse_key_outer='items', parse_key_inner='track')
    print(f'Number of batches for playlist {idx}: {playlist_name}=', len(l))
    for ids in l:
        if len(ids) > 0:
            # df1, artist_df = grab_general_songs(ids, headers, playlist_name) # API call
            df2 = grab_song_music_features(ids, names_list, headers, playlist_name)
            # main_df1 = pd.concat([main_df1, df1], ignore_index=True)
            # main_df1.to_csv(f'gen_playlist_info.csv')
            # main_artist_df = pd.concat([main_artist_df, artist_df], ignore_index=True)
            # main_artist_df.to_csv(f'genre_p_info.csv')
            main_df2 = pd.concat([main_df2, df2], ignore_index=True)
            main_df2.to_csv('data/features_w_track_info.csv')
            token = util.prompt_for_user_token(username=username, 
                                       scope=scope, 
                                       client_id=client_id,   
                                       client_secret=client_secret,     
                                       redirect_uri=redirect_uri)

            headers = {
                'Authorization' : 'Bearer ' + token
            }

        print(f'Done with one batch pull for playlist {idx}')


# if len(main_df1) > 0:
#     main_df1.to_csv(f'gen_test.csv')
# if len(main_artist_df) > 0:
#     main_artist_df.to_csv(f'master_song_artists.csv')
  




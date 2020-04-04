import argparse
import requests
import time
import pandas as pd
import json

config = None

def main():
    parser = argparse.ArgumentParser(description='')
    parser.add_argument('--gen_template', action='store_true')
    parser.add_argument('--download')

    args = parser.parse_args()

    load_config()

    if args.gen_template:
        print('gen template')

    if args.download:
        download_date = args.download
        print('download', download_date)
        raw_data = get_data(config['template_id'])
        df = clean_data(raw_data, download_date)
        save_data(df)

def load_config():

    global config
    with open('config.json', 'r') as file:
        config = json.load(file)

def get_headers():
    return {'Authorization': 'KEY {key}'.format(key=config['api_key'])}

def start_job(template_id):
    print('start job')
    url = '{host}/job/{template}'.format(host=config['api_host'],template=template_id)
    headers = get_headers()

    r = requests.post(url=url, headers=headers, data={})
    if 'id' in r.json():
        return r.json()['id']
    else:
        return None

def get_status(job_id):
    url = '{host}/job/{id}/status'.format(host=config['api_host'], id=job_id)

    r = requests.get(url=url, headers=get_headers())
    data = r.json()
    if 'state' in data:
        if data['state'] == 'SUCCESS':
            return data['data']
        else:
            return None

def get_data(template_id):

    job_id = start_job(template_id)

    data = None
    while data is None:
        data = get_status(job_id)
        time.sleep(3)
        print('fetching')

    return data

def remove_extras(df, column):
    df[column] = df[column].str.replace(',', '')
    df[column] = df[column].str.replace('+', '')
    df[column] = pd.to_numeric(df[column]).fillna(0).astype(int)
    return df[column]

def clean_data(data_dict, date):

   df = pd.DataFrame(data_dict['States'])

   df['Active Cases'] = remove_extras(df, 'Active Cases')
   df['New Cases'] = remove_extras(df, 'New Cases')
   df['New Deaths'] = remove_extras(df, 'New Deaths')
   df['Total Cases'] = remove_extras(df, 'Total Cases')
   df['Total Deaths'] = remove_extras(df, 'Total Deaths')

   df.insert(0, 'Date', date)
   return df

def save_data(df):
    filename = 'data/worldometer.csv'
    old_df = pd.read_csv(filename)

    new_df = pd.concat([old_df, df])
    new_df.to_csv(filename, index=False)




if __name__ == "__main__":
    main()
import argparse
import requests
import time
import pandas as pd
import json

config = None


def main():
    parser = argparse.ArgumentParser(description='')
    parser.add_argument('--gen_template')
    parser.add_argument('--download')

    args = parser.parse_args()

    load_config()

    if args.gen_template:
        template_file = args.gen_template
        print('gen template')
        template_id = create_template(template_file)
        print('created template', template_id)
        if template_id is not None:
            config['template_id'] = template_id
            write_dict_to_json(config, 'config.json')

    if args.download:
        download_date = args.download
        print('download', download_date)
        raw_data = get_data(config['template_id'])
        df = clean_data(raw_data, download_date)
        save_data(df)


def load_config():

    global config
    config = load_dict_from_json('config.json')


def load_dict_from_json(filename):
    with open(filename, 'r') as file:
        return json.load(file)


def write_dict_to_json(dict, filename):
    with open(filename, 'w') as file:
        file.write(json.dumps(dict, indent=4))


def get_headers():
    return {'Authorization': 'KEY {key}'.format(key=config['api_key'])}


def start_job(template_id):
    print('start job')
    url = '{host}/job/{template}'.format(host=config['api_host'], template=template_id)
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


def create_template(template_file):

    template = load_dict_from_json(template_file)

    url = '{host}/template'.format(host=config['api_host'])

    r = requests.post(url=url, headers=get_headers(), json=template)
    data = r.json()
    if 'template_id' in data:
        return data['template_id']
    else:
        print('Template Error')
        print(data)
        return None


def get_data(template_id):

    job_id = start_job(template_id)
    print('job started {}'.format(job_id))

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

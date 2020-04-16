
import argparse
import os
import sys
from datetime import datetime, timedelta

from api import BaseAPI
from store import DataStore

def main():
    parser = argparse.ArgumentParser(description='Fetch Data with template id and generate csv, json files for webapp')
    parser.add_argument('--rerun', help='Refetch data using current template and store it with the provided date, format: YYYYMMDD')

    args = parser.parse_args()

    # set the fetch date as yesterday by default
    current_date = datetime.today()
    fetch_datetime = current_date - timedelta(days=1)

    if args.rerun:
        # if rerun date is provided, use the provided date as the fetch date
        fetch_datetime = datetime.strptime(args.rerun, DataStore.DATE_FORMAT)
    print('fetching', fetch_datetime)

    data_store = DataStore(
        get_env_var('CSV_PATH'),
        get_env_var('JSON_PATH')
    )
    latest_datetime = data_store.get_latest_date()

    if fetch_datetime <= latest_datetime and args.rerun is None:
        sys.exit('Error Update has already ran for {}'.format(fetch_datetime))

    api = BaseAPI(
        get_env_var('API_KEY'),
        get_env_var('API_HOST'),
        get_env_var('API_PORT'),
        get_env_var('API_PATH', '')
    )

    data = api.get_data(get_env_var('TEMPLATE_ID'))
    print('data fetched')

    if args.rerun:
        data_store.remove_date(fetch_datetime)

    data_store.merge_with_dict(fetch_datetime, data)
    data_store.save_to_csv()
    data_store.save_to_json()


def get_env_var(key, default=None):
    if key in os.environ:
        return os.environ[key]

    if default is not None:
        return default
    else:
        raise Exception('Environment Variable {} not set'.format(key))


if __name__ == "__main__":
    main()

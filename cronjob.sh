#!/bin/sh

SCRIPTPATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

source "${SCRIPTPATH}/local_env/bin/activate"

python3 "${SCRIPTPATH}/update_data.py" --config "${SCRIPTPATH}/aws_config.json" --get_json

cd "${SCRIPTPATH}"
git checkout aws-ec2
git add data/worldometer.csv
git commit -m "Data Update"

cd frontend
yarn build
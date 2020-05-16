#!/bin/bash

# =========================================================================================
# Manages Update process
# The actual data update is handled in update.py
# this script is in charge of setting up environment, running update,
# committing changes, and re-deploying App
# =========================================================================================

# call on_error function if there is an error
set -e
trap 'on_error' ERR

on_error() {
    # Send email on failure
    printf "ERROR\n"
    message="CronJobError"
    error_log=`cat ~/covid_cron.log`

    aws ses send-email \
        --from "${NOTIFY_EMAIL}" \
        --destination "ToAddresses=${NOTIFY_EMAIL}" \
        --message "Subject={Data='EC2 CronJob Error',Charset=utf8},Body={Text={Data='Job Error',Charset=utf8},Html={Data='${message}\n\n${error_log}',Charset=utf8}}"
}

export_env() {
    temp_file="export_env.temp"
    cat "${1}" | grep -v "^$" | grep -v "^#" > ${temp_file}
    while IFS= read -r line; do
        export "${line}"
    done < ${temp_file}
    rm ${temp_file}
}

printf "Starting\n"


# cd into script directory
SCRIPTPATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
cd "${SCRIPTPATH}"
export_env .env

# Update Code
git reset --hard
git checkout aws-ec2
git pull origin aws-ec2

# get python virtual environment
source "local_env/bin/activate"
pip3 install -r requirements.txt

# run update script
python update.py

# Commit Data
git checkout aws-ec2
git add ../data/worldometer.csv
git commit -m "Data Update"
git push origin aws-ec2

# rebuild frontend application
cd ../frontend
yarn install
yarn build

# Deploy to S3 bucket
aws s3 sync build s3://covid19.scrapeit.net --delete
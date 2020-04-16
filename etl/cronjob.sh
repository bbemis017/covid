#!/bin/bash

# call on_error function if there is an error
set -e
trap 'on_error' ERR

on_error() {
    # Send email on failure
    printf "ERROR\n"
    message="CronJobError"

    aws ses send-email \
        --from "${NOTIFY_EMAIL}" \
        --destination "ToAddresses=${NOTIFY_EMAIL}" \
        --message "Subject={Data='EC2 CronJob Error',Charset=utf8},Body={Text={Data='Job Error',Charset=utf8},Html={Data='${message}',Charset=utf8}}"
}

printf "Starting\n"

# get user's environment setup
# source "${HOME}/.bashrc"

printf "source bashrc\n"

# cd into script directory
SCRIPTPATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
cd "${SCRIPTPATH}"

# get python virtual environment
source "local_env/bin/activate"

# run update script
python update.py

# Commit Data
git checkout aws-ec2
git add ../data/worldometer.csv
git commit -m "Data Update"

# rebuild frontend application
cd ../frontend
yarn build
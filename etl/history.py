from pandas import pandas as pd
import sys
from datetime import datetime

def get_difference(val, old_val):
    result = val - old_val
    return result
    if result > 0:
        return result
    else:
        return 0

df = pd.read_csv('../data/states.csv')


del df['name']
del df['level']
del df['city']
del df['county']
del df['country']
del df['lat']
del df['long']
del df['url']
del df['aggregate']
del df['tz']
del df['population']
del df['hospitalized']
del df['growthfactor']
del df['discharged']
del df['recovered']


df['date'] = pd.to_datetime(df['date'], format='%m/%d/%Y')
df = df.sort_values(["state", "date"], ascending=(True, True))

df['cases'] = df['cases'].fillna(0)
df['cases'] = df['cases'].astype(int)
df['deaths'] = df['deaths'].fillna(0)
df['deaths'] = df['deaths'].astype(int)


df['New Cases'] = None
df['New Deaths'] = None

current_state = None
for (index, row) in df.iterrows():

    if row['date'] < datetime(2020, 4, 3):
        if row['state'] != current_state:
            current_state = row['state']
            case_growth = 0
            prev_cases = 0
            prev_deaths = 0

        new_cases = get_difference(row['cases'], prev_cases)
        new_deaths = get_difference(row['deaths'], prev_deaths)

        prev_cases = row['cases']
        prev_deaths = row['deaths']

        if new_cases < 0 or new_deaths < 0:
            print("Can't be negative")
            print("new cases", new_cases)
            print("new deaths", new_deaths)
            print(row['date'], current_state)
            sys.exit()

        df.loc[index, 'New Cases'] = new_cases
        df.loc[index, 'New Deaths'] = new_deaths

        if new_cases > 0:
            case_growth +=1


        if case_growth > 10 and new_cases == 0:
            print('HOLE,{},{},{},{}'.format(row['date'], current_state, row['cases'], new_cases))


df['date'] = pd.to_datetime(df['date']).dt.strftime('%Y%m%d')
df = df.rename(columns={'date':'Date', 'active': 'Active Cases', 'state': 'State', 'cases': 'Total Cases', 'tested': 'Total Tests', 'deaths': 'Total Deaths'})
df = df[[
    'Date',
    'Active Cases',
    'New Cases',
    'New Deaths',
    'State',
    'Total Cases',
    'Total Deaths',
    'Total Tests'
]]

df = df.sort_values(["Date"], ascending=(True))

df.to_csv('../data/output.csv', index=False)
print("done")

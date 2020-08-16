from pandas import pandas as pd

class DataStore:
    DATE_FORMAT = '%Y%m%d'
    def __init__(self, csv_filename, json_filename):
        self.csv_filename = csv_filename
        self.json_filename = json_filename

        self.df = pd.read_csv(csv_filename)
        self.df['Date'] = pd.to_datetime(self.df['Date'], format=DataStore.DATE_FORMAT)


    def get_latest_date(self):
        ''' Gets the most recent date in the file
        Returns datetime object'''
        self.df['Date'] = pd.to_datetime(self.df['Date'], format=DataStore.DATE_FORMAT)
        return self.df['Date'].max()


    def merge_with_dict(self, new_date, new_data_dict):
        '''Takes in a dictionary of raw data and merges it
        into existing data frame with the given date'''

        # convert dictionary to dataframe
        new_df = pd.DataFrame(new_data_dict['States'])

        # Clean numeric Columns
        new_df['Active Cases'] = self.clean_numeric_col(new_df, 'Active Cases')
        new_df['New Cases'] = self.clean_numeric_col(new_df, 'New Cases')
        new_df['New Deaths'] = self.clean_numeric_col(new_df, 'New Deaths')
        new_df['Total Cases'] = self.clean_numeric_col(new_df, 'Total Cases')
        new_df['Total Deaths'] = self.clean_numeric_col(new_df, 'Total Deaths')
        new_df['Total Tests'] = self.clean_numeric_col(new_df, 'Total Tests')

        # Add Date Column
        new_df.insert(0, 'Date', new_date)

        # merge dataframes together
        self.df = pd.concat([self.df, new_df])


    def clean_numeric_col(self, df, col_name):
        ''' Removes unwanted characters, fills na's as zero
        and converts type to integer for column in dataframe
        Returns: transformed dataframe'''
        df[col_name] = df[col_name].str.replace(',', '')
        df[col_name] = df[col_name].str.replace('+', '')
        df[col_name] = df[col_name].str.replace('N/A', '')
        df[col_name] = pd.to_numeric(df[col_name]).fillna(0).astype(int)
        return df[col_name]


    def remove_date(self, date):
        ''' Removes data from dataframe for the specified date, should only be used for reruns'''
        self.df = self.df[(self.df['Date'] < date) | (self.df['Date'] > date)]


    def save_to_csv(self):
        '''Writes Data Frame to csv file'''
        self.df.to_csv(
            self.csv_filename,
            index=False,
            date_format=DataStore.DATE_FORMAT
        )


    def save_to_json(self):
        '''Save Data Frame to json file'''

        # reformate Date column as string
        df = self.df.copy()
        df['Date'] = df['Date'].dt.strftime(DataStore.DATE_FORMAT)

        df.to_json(
            self.json_filename,
            orient='records'
        )

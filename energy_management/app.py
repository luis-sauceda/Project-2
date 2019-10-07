from flask import Flask, render_template, url_for

import os

from datetime import datetime, timedelta

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, inspect

from flask import Flask, jsonify, render_template


app = Flask(__name__)

#################################################
# Database Setup
#################################################

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///static/db/project.sqlite"


#--------------------------------------------------------------------------
#Function to get the maximum power at peak period
#---------------------------------------------------------------------------
def powerDataFrame(site, mes):
	engine = create_engine("sqlite:///static/db/project.sqlite")
	session = Session(engine)

	# Create and modify a DataFrame containing information about CFE schedules
	time_data = pd.read_sql('SELECT * FROM "horarios"', con = engine).drop(columns=['index'])
	time_data = time_data[time_data['Temporada'] == 'Verano']
	time_data['Hora'] = time_data['Hora'].apply(lambda x: datetime.strptime(x, '%H:%M').time())
	time_data['Día'] = time_data['Día'].astype(str)
	
	#Load the electrical measurements from the database
	line_data = pd.read_sql('SELECT "measurement_time(UTC)", SUM("power(W)"/1000) AS "power(kW)" FROM measurements WHERE device_id IN (SELECT device_id FROM dg WHERE dg1 = \'Total\' AND dg.site_id IN (SELECT site_id FROM sites WHERE site_id = {})) GROUP BY "measurement_time(UTC)"'.format(site), con = engine)
	
	#Remove the +00
	line_data['measurement_time(UTC)'] = line_data['measurement_time(UTC)'].str.slice(0,19)
	#Convert to datetime object
	line_data['measurement_time(UTC)'] = line_data['measurement_time(UTC)'].apply(lambda x: datetime.strptime(x,'%Y-%m-%d %H:%M:%S'))
	#Create month column and filter desired month
	line_data['month'] = line_data['measurement_time(UTC)'].apply(lambda x: x.month)
	line_data = line_data[line_data['month'] == int(mes)]
	#Create hour column
	line_data['hour'] = line_data['measurement_time(UTC)'].apply(lambda x: x.time())
	#Create weekday column and modify it so that sunday is 0 and monday is 1
	line_data['weekday'] = line_data['measurement_time(UTC)'].apply(lambda x: x.weekday())
	line_data['weekday'] = line_data['weekday'].apply(lambda x: x +1).apply(lambda x: str(x).replace('7', '0'))
	#Create date column
	line_data['date'] = line_data['measurement_time(UTC)'].apply(lambda x: x.date())
	#Create a copy of line_data DataFrame
	temporal = line_data.copy()
	
	#Merge electrical measurements with CFE schedules
	line_data = pd.merge(left = line_data, right = time_data, left_on=['hour','weekday'], right_on = ['Hora', 'Día'])
	#Filter periodo_cfe so that it only shows the Peak period
	line_data = line_data[line_data['periodo_cfe'] == 'Punta']
	#Get the maximum power in peak period of each day
	line_data= line_data[['date','power(kW)']].groupby('date').max().reset_index()
	#Join with temporal to have the exact time stamp of the maximum power
	line_data = pd.merge(left = line_data, right = temporal, on=['date','power(kW)'])
	#Drop unwanted columns
	line_data.drop(columns = ['date','hour','weekday'], inplace = True)
	#Order by measurement_time(UTC)
	line_data = line_data.sort_values(by="measurement_time(UTC)")
	
	#Convert measurement-time(UTC) column data types to string
	line_data['measurement_time(UTC)'] = line_data['measurement_time(UTC)'].astype(str)
	return line_data


#---------------------------------------------------------------------------------------------
#Function to get the total energy consumption of the month
#------------------------------------------------------------------------------------------
def energyDataFrame(site, mes):
    engine = create_engine("sqlite:///static/db/project.sqlite")
    session = Session(engine)
    # Load the electrical measurements from the database
    energy_data = pd.read_sql('SELECT "measurement_time(UTC)", SUM("power(W)"/1000*5/60) AS "energy(kWh)" FROM measurements WHERE device_id IN (SELECT device_id FROM dg WHERE dg1 = \'Total\' AND dg.site_id IN (SELECT site_id FROM sites WHERE site_id = {})) GROUP BY "measurement_time(UTC)"'.format(site), con = engine)

    #Remove the +00
    energy_data['measurement_time(UTC)'] = energy_data['measurement_time(UTC)'].str.slice(0,19)

    #Convert to datetime object
    energy_data['measurement_time(UTC)'] = energy_data['measurement_time(UTC)'].apply(lambda x: datetime.strptime(x,'%Y-%m-%d %H:%M:%S'))

    #Create month column and filter desired month
    energy_data['month'] = energy_data['measurement_time(UTC)'].apply(lambda x: x.month)
    energy_data = energy_data[energy_data['month'] == int(mes)]

    #Get the total energy of the whole month
    energy_data = energy_data.groupby('month').sum()
    
    energy_data = energy_data.to_dict(orient = 'list')
    return energy_data
    



    
#--------------------------------------------------------------------------------------------------
#Define the different routes of the app
#--------------------------------------------------------------------------------------------------
@app.route('/')
def home():

	return render_template("index.html")

@app.route('/building2')
def building2():

    return render_template("building2.html")


#Get the maximum power at peak hour
@app.route('/punta/<site>/<mes>')
def total_punta(site,mes):
	df = powerDataFrame(site, mes)
	#Convert DataFrame to dictionary/json thingy
	json_thingy = [value for key, value in df.to_dict(orient = 'index').items()]
	return jsonify(json_thingy)


@app.route('/kpi/<site>/<mes>')
def totalKpi(site, mes):
    energy_dict = energyDataFrame(site, mes)
    energy_dict['energy(kWh)'] = energy_dict['energy(kWh)'][0]
    energy_dict['energy_cost'] = energy_dict['energy(kWh)'] * 2.7
    #kpiMXN = kpi * 364.9
    
    return jsonify(energy_dict)


@app.context_processor
def override_url_for():
    return dict(url_for=dated_url_for)

def dated_url_for(endpoint, **values):
    if endpoint == 'static':
        filename = values.get('filename', None)
        if filename:
            file_path = os.path.join(app.root_path,
                                 endpoint, filename)
            values['q'] = int(os.stat(file_path).st_mtime)
    return url_for(endpoint, **values) 


if __name__ == "__main__":
    app.run(debug=True)
    
from flask import Flask, render_template, url_for

import os

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


@app.route('/')
def home():

	return render_template("index.html")

@app.route('/building2')
def building2():

    return render_template("building2.html")


#Get the maximum power at peak hour
@app.route('/punta/<site>')
def total_punta(site):
    engine = create_engine("sqlite:///static/db/project.sqlite")
    inspector=inspect(engine)
    print(inspector.get_table_names())
    results = pd.read_sql('SELECT "measurement_time(UTC)", "power(W)"/1000 AS "power(kW)" FROM measurements WHERE device_id IN (SELECT device_id FROM dg WHERE dg1 = \'Total\' AND dg.site_id IN (SELECT site_id FROM sites WHERE site_id = {}))GROUP BY "measurement_time(UTC)"'.format(site), con = engine)
    
    #results = results.to_json()
    results = results.to_dict(orient='list')
    #return results
    return jsonify(results)


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
    
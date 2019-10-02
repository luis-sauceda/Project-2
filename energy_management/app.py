from flask import Flask, render_template

import os

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)

#################################################
# Database Setup
#################################################


app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/bellybutton.sqlite"
db = SQLAlchemy(app)

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(db.engine, reflect=True)

# Save references to each table
#CAMBIAR ESTO DE SER NECESATIO
Samples_Metadata = Base.classes.sample_metadata
Samples = Base.classes.samples


@app.route('/')
def home():
    return render_template("index.html")


#Get the maximum power at peak hour
@app.route('/punta')
def total_punta():
    
    return
    
    
    
    


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
    
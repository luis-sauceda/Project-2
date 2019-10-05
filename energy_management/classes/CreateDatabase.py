import pandas as pd
import datetime as dt
import csv

# Python SQL toolkit and Object Relational Mapper
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, inspect
from sqlalchemy import Table, Column, Integer, String, MetaData, ForeignKey, Float, DateTime

def createDb():
	path = "../static/data/"
	
	groupsDf = pd.read_csv(f"{path}dg.csv")
	measurementsDf = pd.read_csv(f"{path}measurements.csv")
	sitesDf = pd.read_csv(f"{path}sites.csv")
	horarioDf = pd.read_csv(f"{path}horario_gdmth.csv")

	#Create the database
	engine = create_engine("sqlite:///../static/db/project.sqlite")


	# Create the database schema definition
	metadata = MetaData()
	sites = Table("sites", metadata,
			Column("site_id", Integer, primary_key = True),
			Column("site_name", String, nullable = False),
			Column("latitude", Float(7), nullable = False),
			Column("longitude", Float(7), nullable = False)
		)

	groups = Table("dg", metadata,
			Column("device_id", Integer, primary_key = True),
			Column("site_id", Integer, ForeignKey("sites.site_id")),
			Column("device_name", String, nullable = False),
			Column("dg1", String),
			Column("dg2", String),
			Column("dg3", String)
		)

	measurements = Table("measurements", metadata,
			Column("device_id", Integer, ForeignKey("dg.device_id")),
			Column("measurement_time", DateTime, nullable = False),
			Column("power", Integer, nullable = False),
			Column("power_factor", Float, nullable = False),
			Column("energy", Integer, nullable = False)
		)

	horario = Table("horarios", metadata,
			Column("periodo_cfe", String, nullable = False),
			Column("Hora", DateTime, nullable = False),
			Column("Dia", Integer, nullable = False),
			Column("Temporada", String, nullable = False)
		)

	try:
		metadata.create_all(engine)
		print("Tables created")
	except Exception as e:
		print("Error occurred during Table creation!")
		print(e)

	conn = engine.connect()
	sitesDf.to_sql("sites", conn, if_exists = "replace", index = False)
	print("Data successfully loaded into Sites table!")
	groupsDf.to_sql("dg", conn, if_exists = "replace", index = False)
	print("Data successfully loaded into Dg table!")
	measurementsDf.to_sql("measurements", conn, if_exists = "replace", index = True, chunksize = 100 )
	print("Data successfully loaded into Measurements table!")
	horarioDf.to_sql("horarios", conn, if_exists = "replace", index = True, chunksize = 100)
	print("Data successfully loaded into Horarios table!")


createDb()
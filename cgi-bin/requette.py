#!/opt/anaconda3/bin/python3
# -*- coding: utf-8 -*-

import pandas as pd
import numpy
import cgi
import json
import cgitb
cgitb.enable()
import sys
print("Content-Type: applicatio/json")
print()
print()
data = pd.read_csv('data/tweets.csv')

form = cgi.FieldStorage()
name =form.getvalue("chaine")

rep  =data[data["text"].str.contains(name) == True] 
#faire la requette

reponse  = rep.to_json(orient="records")
print(reponse)



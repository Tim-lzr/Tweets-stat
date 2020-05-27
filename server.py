#conding:utf-8
import http.server
import socketserver
import os
 
import subprocess
# Serveur http de base delivrant le contenu du repertoire courant via le port indique.
PORT = 8888
## Python 3 :
class MyRequestHandler(http.server.CGIHTTPRequestHandler):
        pass
Handler = MyRequestHandler

httpd = http.server.HTTPServer(("",PORT), Handler)
print("a l'coute sur le port :", PORT)
httpd.serve_forever()

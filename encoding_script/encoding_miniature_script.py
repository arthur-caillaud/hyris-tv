import os
import sys
import shutil
import time
import pymysql
from ffmpy import FFmpeg

db = pymysql.connect(host="bigo.via.ecp.fr",port=4306, user="nx", passwd="OgSuVrTrBi", db="nx")
path_ffmpeg = "ffmpeg"
path_video_org = "/var/ftproot/videos/"
path_video_in = "encode_tmp/"
path_video_out = "encode_tmp/"

class encode :

    def __init__(self, id_encode, id_video, id, label, nom_video, time_pict):
        self.id_encode = id_encode
        self.id_video = id_video
        self.id = id
        self.label = label
        self.nom_video = nom_video
        if int(time_pict) < 10:
            time_pict = "0"+str(time_pict)
        time_pict = str(time_pict)
        self.time_pict = time_pict
        self.is_ok = 1

    def __str__(self):
        return "id_encode : " + str(self.id_encode) + "; id_video : " + str(self.id_video)+ " ; id : " + str(self.id)

    def make_encoding(self):
        if(not self.is_ok) :
            return

        ext = ".mp4"
        pathIn = path_video_org + self.nom_video + ext
        commande = ""
        path_vid = path_video_in
        # switch label and adapt path and command
        if(self.label == "miniature"):
            commande = " -ss 00:00:{} -vframes 1 -s 426x240".format(self.time_pict)
            path_vid = path_video_in + "miniature/"
            ext = "Pict.jpg"
        elif(self.label == "poster"):
            commande =  " -ss 00:00:{} -vframes 1 -s 1280x720".format(self.time_pict)
            path_vid = path_video_in + "poster/"
            ext = "Pict.jpg"
        else:
            print('ERROR, '+ str(self.nom_video) +' is using unkown label :' + str(self.label))
            exit()

        pathOut = path_vid + self.nom_video + ext

        ff = FFmpeg(
            executable= path_ffmpeg,
            inputs={pathIn : None},
            outputs={pathOut : commande}
        )
        print("commande : " + commande)
        print(ff.cmd)
        try:
            ff.run()
            return 1
        except:
            print ("error : [ff.run()]", sys.exc_info()[0])
            return 0

    def updateDb(self):
        if self.is_ok :
            try :
                cursorUp = db.cursor()
                cursorUp.execute("UPDATE Encode_video SET is_encode = 1 WHERE id = " + str(self.id))
                db.commit()
            except :
                db.rollback()
                print("Error while updating database")

def dbScan():
    cursor = db.cursor()
    cursor.execute("SELECT * FROM Encode_video JOIN Video ON Encode_video.id_video = Video.id JOIN Encode ON Encode.id = Encode_video.id_encode WHERE Encode_video.is_encode = 0 AND Encode.label IN ('miniature','poster') ORDER BY id_encode DESC, id_video DESC")
    datas = cursor.fetchall()

    if(len(datas)==0):
        print("Nothing to be done")
        return False

    else:
        return datas

#Boucle infinie qui scanne la base de données pour voir si il y a des miniatures à encoder
#Les miniatures sont encodées si le script en détecte sinon le thread dort 5 sec
while 1:
    datas = dbScan();
    if datas:
        toEncode = []
        for data in datas :
            toEncode.append(encode(data[0],data[1],data[3],data[17],data[6],data[14]))
        for toBeEncoded in toEncode :
            print(str(toBeEncoded))
            isEncoded = toBeEncoded.make_encoding()
            if isEncoded:
                toBeEncoded.updateDb()
    time.sleep(5)

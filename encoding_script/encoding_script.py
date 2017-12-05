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
        time_pict = int(time_pict)
        min_pict = time_pict // 60
        time_pict = time_pict%60
        h_pict = (time_pict // 3600)
        if min_pict < 10:
            min_pict = "0"+str(min_pict)
        if int(time_pict) < 10:
            time_pict = "0"+str(time_pict)
        time_pict = str(time_pict) 
        self.h_pict = h_pict
        self.min_pict = min_pict
        self.time_pict = time_pict
        self.is_ok = 1

    def __str__(self):
        return "id_encode : " + str(self.id_encode) + "; id_video : " + str(self.id_video)+ " ; id : " + str(self.id)

    def prepare_encoding(self):
        #verify that the video is in upload/completed
        # create the tmp dir for encoding file
        if os.path.isfile(path_video_org + self.nom_video + ".mp4") :
            shutil.copy2(path_video_org + self.nom_video+'.mp4',path_video_in)
            print("isFile")
        else :
            print("Error, Video not found in "+ path_video_in + self.nom_video + '.mp4')
            self.is_ok = 0

    def make_encoding(self):
        if(not self.is_ok) :
            return

        ext = ".mp4"
        pathIn = path_video_in + self.nom_video + ext
        commande = ""
        path_vid = path_video_in
        # switch label and adapt path and command
        if(self.label == "1080p"):
            commande = ' -c:v libx264  -profile:v high -preset veryslow  -b:v 10000k  -s hd1080 -r 25 -b:a 256k'
            path_vid = path_video_in + "1080p/"
        elif(self.label == "720p"):
            commande = ' -c:v libx264  -profile:v high -preset veryslow  -b:v 6500k  -s hd720 -r 25 -b:a 128k'
            path_vid = path_video_in + "720p/"
        elif(self.label == "480p"):
            commande = ' -c:v libx264  -profile:v high -preset veryslow  -b:v 2000k  -s hd480 -r 25 -b:a 128k'
            path_vid = path_video_in + "480p/"
        elif(self.label == "240p"):
            commande = ' -c:v libx264  -profile:v high -preset veryslow  -b:v 1000k  -s 426x240 -r 25 -b:a 128k'
            path_vid = path_video_in + "240p/"
        elif(self.label == "miniature"):
            commande = " -ss 0{}:{}:{} -vframes 1 -s 1280x720".format(self.h_pict,self.min_pict,self.time_pict)
            path_vid = path_video_in + "miniature/"
            ext = "Pict.jpg"
        elif(self.label == "poster"):
            commande =  " -ss 0{}:{}:{} -vframes 1 -s 1280x720".format(self.h_pict,self.min_pict,self.time_pict)
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

    def cleanTmp(self):
        try :
            os.remove("encode_tmp/"+self.nom_video+".mp4")
        except :
            print("error while removing file from encode_tmp")

cursor = db.cursor()

cursor.execute("SELECT * FROM Encode_video JOIN Video ON Encode_video.id_video = Video.id JOIN Encode ON Encode.id = Encode_video.id_encode WHERE Encode_video.is_encode = 0 AND active = 1 ORDER BY id_encode DESC, id_video DESC")


datas = cursor.fetchall()
#print(datas)

toEncode = []

if(len(datas)==0):
    print("Nothing to be done")
    exit()

data = datas[0]
print("id_encodo : {}\nid_video : {}\nid : {}\nlabel : {}\nnom_video : {}\ntime_pict:{}".format(data[0],data[1],data[3],data[18],data[6],data[14]))
print(datas[0])
for data in datas :
    toEncode.append(encode(data[0],data[1],data[3],data[18],data[6],data[14]))

timeStart = time.clock();
for a in toEncode :
    print(str(a))
    #make encoding
    a.prepare_encoding()
    isEncoded = a.make_encoding()
    if isEncoded:
        a.updateDb()
    a.cleanTmp()

print(time)
print(time.clock()-timeStart)

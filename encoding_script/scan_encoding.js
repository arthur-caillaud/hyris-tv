const Rx = require('rxjs');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const command = ffmpeg();

const Encodage = require("../models/Encodage.js");
const path_video_org = "/var/ftproot/videos/";
const path_video_in = "encode_tmp/";
const path_video_out = "encode_tmp/";

convertLabelToSize = function(label){
    if(label = "1080p"){
        return "1920x1080"
    }
    if(label = "720p"){
        return "1280x720"
    }
    if(label = "480p"){
        return "720x480"
    }
    if(label = "240p"){
        return "320x240"
    }
};
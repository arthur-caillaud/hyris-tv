const Rx = require('rxjs');
const fs = require('fs');
const mkdirp = require('mkdirp');
const ffmpeg = require('fluent-ffmpeg');
const gify = require('gify');
const async = require('async');
const db = require("../db_management/db");

const Encodage = require("../models/Encodage.js");
const path_video_org = "/var/ftproot/videos/";
const path_video_in = "encode_tmp/";
const path_video_out = "encode_tmp/";
const path_video_test = "encode_tmp/test/";

const giflength = 4; //time in seconds

function convertLabelToSize(label){
    if(label === "1080p"){
        return "1920x1080"
    }
    if(label === "720p"){
        return "1280x720"
    }
    if(label === "480p"){
        return "854x480"
    }
    if(label === "240p"){
        return "426x240"
    }
    if(label === "miniature"){
        return "426x240"
    }
    if(label === "poster") {
        return "1280x720"
    }
}

function updateDb(encodage){
    return Rx.Observable.create(obs => {
        const sqlQuery = "UPDATE Encode_video SET is_encode = 1 WHERE id = ?";
        const inserts = [encodage.id_encodevideo];
        db.formatedQuery(sqlQuery, inserts, function (err,res) {
            if(err){
                obs.onError(err);
            }
            if(res){
                console.log("Successfully updated database");
                obs.onComplete();
            }
        })
    });
}

function encodeVideoSync(encodageVideo,callback){
    if(fs.existsSync(path_video_org + encodageVideo.nom_video + ".mp4")){
        if(["1080p","720p","480p","240p"].includes(encodageVideo.label)){
            mkdirp(path_video_out + encodageVideo.label + "/", err => {
                if(err){
                    callback(null, true)
                }
                else{
                    console.log("Starting encoding video", encodageVideo.nom_video);
                    ffmpeg(path_video_org + encodageVideo.nom_video + ".mp4")
                        .videoCodec('libx264')
                        .audioCodec('copy')
                        .size(convertLabelToSize(encodageVideo.label))
                        .on('onError', function(err) {
                            console.log('An onError occurred: ' + err.message);
                            process.nextTick(() => {
                                callback(null, true);
                            })
                        })
                        .on('end', function() {
                            console.log('Processing finished !');
                            updateDb(encodageVideo).subscribe({
                                onError: err => {
                                    console.onError(err);
                                    process.nextTick(() => {
                                        callback(null, true);
                                    });
                                },
                                onComplete: () => {
                                    process.nextTick(() => {
                                        callback(null, true);
                                    })
                                }
                            });
                        })
                        .on('progress', function(progress) {
                            console.log('Processing ' + encodageVideo.nom_video + ' (' + encodageVideo.label + '):' + progress.percent + '% done');
                        })
                        .save(path_video_out + encodageVideo.label + "/" + encodageVideo.nom_video + ".mp4");
                }
            });
        }
        else{
            console.log("onError with label");
            callback(null, true);
        }
    }
    else {
        console.log("File does not exist");
        process.nextTick(() => {
            callback(null, true);
        });
    }
}

function encodePictSync(encodageVideo,callback){
    if(fs.existsSync(path_video_org + encodageVideo.nom_video + ".mp4")){
        if(["poster","miniature"].includes(encodageVideo.label)){
            mkdirp(path_video_out + encodageVideo.label + "/", err => {
                if(err){
                    callback(null, true)
                }
                else{
                    console.log("Starting encoding picture", encodageVideo.nom_video);
                    ffmpeg(path_video_org + encodageVideo.nom_video + ".mp4")
                        .screenshots({
                            timestamps: [encodageVideo.time_pict],
                            filename: encodageVideo.nom_video + "Pict.png",
                            folder: path_video_out + encodageVideo.label,
                            size: convertLabelToSize(encodageVideo.label)
                        })
                        .on('onError', function (err) {
                            console.log('An onError occurred: ' + err.message);
                            process.nextTick(() => {
                                callback(null, true);
                            });
                        })
                        .on('progress', function (progress) {
                            console.log('Processing ' + encodageVideo.nom_video + ' (' + encodageVideo.label + '):' + progress.percent + '% done');
                        })
                        .on('end', function () {
                            console.log('Processing finished !');
                            updateDb(encodageVideo).subscribe({
                                onError: err => {
                                    console.onError(err);
                                    process.nextTick(() => {
                                        callback(null, true);
                                    });
                                },
                                onComplete: () => {
                                    process.nextTick(() => {
                                        callback(null, true);
                                    })
                                }
                            });
                        });
                }
            });
        }
        else{
            console.log("onError with label");
            callback(null, true);
        }
    }
    else {
        console.log("File does not exist");
        process.nextTick(() => {
            callback(null, true);
        });
    }
}

function encodeGifSync(encodageVideo,callback){
    if(fs.existsSync(path_video_org + encodageVideo.nom_video + ".mp4")){
        if(encodageVideo.label === "gif"){
            mkdirp(path_video_out + encodageVideo.label + "/", err => {
                if(err){
                    callback(null, true)
                }
                let opts = {
                    start: encodageVideo.time_pict,
                    length: giflength
                };
                gify(
                    path_video_org + encodageVideo.nom_video + ".mp4",
                    path_video_org + "gif" + "/" + encodageVideo.nom_video + ".gif",
                    opts,
                    err => {
                        if (err) {
                            console.onError(err)
                            process.nextTick(() => {
                                callback(null, true);
                            });
                        }
                    });
                updateDb(encodageVideo).subscribe({
                    onError: err => {
                        console.onError(err);
                        process.nextTick(() => {
                            callback(null, true);
                        });
                    },
                    onComplete: () => {
                        process.nextTick(() => {
                            callback(null, true);
                        })
                    }
                });
            });
        }
    }
    else {
        console.log("File does not exist");
        callback(null, true)
    }
}

Encodage.getAllUnencodedVideos().subscribe({
    next: data => {
        console.log("Data received");
        let tasksArray = [];
        data.forEach(row => {
            let task;
            if(["1080p","720p","480p","240p"].includes(row.label)){
                task = function (callback) {
                    encodeVideoSync(row, callback);
                }
            }
            else{
                task = function(callback){
                    callback("onError with label",null);
                }
            }
            tasksArray.push(task);
        });
        console.log("Starting Video async series process...");
        async.series(tasksArray, function(err,res){
            console.log("Video Async process done.");
        });
    },
    onError: err => {
        console.onError(err);
    }
});

Encodage.getAllUnencodedMiniatures().subscribe({
    next: data => {
        console.log("Data received");
        let tasksArray = [];
        data.forEach(row => {
            let task;
            if(["poster","miniature"].includes(row.label)){
                task = function (callback){
                    encodePictSync(row, callback);
                }
            }
            else{
                task = function(callback){
                    callback("onError with label",null);
                }
            }
            tasksArray.push(task);
        });
        console.log("Starting Miniature async series process...");
        async.series(tasksArray, function(err,res){
            console.log("Miniature Async process done.");
        });
    },
    onError: err => {
        console.onError(err);
    }
});

Encodage.getAllUnencodedGif().subscribe({
    next: data => {
        console.log("Data received");
        let tasksArray = [];
        data.forEach(row => {
            let task;
            if(row.label === "gif"){
                task = function (callback){
                    encodeGifSync(row, callback);
                }
            }
            else{
                task = function(callback){
                    callback("onError with label",null);
                }
            }
            tasksArray.push(task);
        });
        console.log("Starting Gif async series process...");
        async.series(tasksArray, function(err,res){
            console.log("Gif Async process done.");
        });
    },
    onError: err => {
        console.onError(err);
    }
});

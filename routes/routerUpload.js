var express = require('express');
var router = express.Router();
var path = require('path');
var multer   =  require( 'multer' );
var upload   =  multer( { dest: 'uploads/tmp/' } );
var fs = require('fs');

module.exports = router;

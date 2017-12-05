var mysql = require('mysql');
var myConst = require('../configure/myConst');
var exports = module.exports = {};

var pool  = mysql.createPool(myConst.DEV_SQL_CREDIDENTIALS);

exports.get = function(){
	return pool;
}

exports.formatedQuery = function(query,inputs,callback,verbose){
	pool.getConnection( function(err, connection){
		if(err)
			callback(err,null,null);
		else{
			var sqlQuery = mysql.format(query,inputs);
			if(verbose !== undefined)
				console.log(sqlQuery)
			//console.log(sqlQuery);
			connection.query(sqlQuery, function(err, result, fields){
				if(err)
					callback(err,null,null);
				else
				    callback(null,result,fields);
			});
			connection.release();
		}
	});
}

exports.toStandardDate = function (date) {
	var dateDate = new Date(date)
	var day = dateDate.getDate() // 1-31
    var month = dateDate.getMonth() // 0-11
    var year = dateDate.getFullYear() // 1000 - 9999
    var calendar = ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"]
    standardMonth = calendar[month]
    date = day + " " + standardMonth + " " + year
    return date
}

exports.toPromoYear = function (date) {
    var dateDate = new Date(date)
    var day = dateDate.getDate() // 1-31
    var month = dateDate.getMonth() // 0-11
    var year = dateDate.getFullYear() // 1000 - 9999
    if (9 <= month && month <= 12){
        return year + "/" + (year+1);
    }
    return (year-1) + "/" + year;
}

exports.toMinifiedDescription = function (description) {
    if (description.length > 250){
        return description.slice(0,249)+"..."
    }
    return description
}

exports.toMinifiedTitle = function (title){
    if (title.length > 43){
        return title.slice(0,42)+"..."
    }
    return title
}

exports.toHashtagsTags = function (tagsString) {
    res = tagsString.split(",");
    return res
}

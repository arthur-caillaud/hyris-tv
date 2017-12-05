 /*
		Insert data on a JSON format in the database 
		 -> Use this to perform test on data in the DB
		 
		
 */
 
 
 var data = {
  tables: {
    User: [
     {login: "John", surnom: "bibi", mdp: "lolilol", is_myecs : 0, id: 1},
     {login: "Peter", surnom: "bibou",  mdp: "lolilol", is_myecs : 0, id: 2},
    ],
    Image: [
      {date: "01-02-2016", titre: "Cherokee", id: 1},
      {date: "01-03-2016", titre: "X5", id: 2},
      {date: "05-04-1996", titre: "Polo", id: 3},
    ],
  },
}

var db = require('./db')
db.connect(db.MODE_TEST, function() {
  db.fixtures(data, function(err) {
    if (err) return console.log(err)
    console.log('Data has been loaded...')
  })
})
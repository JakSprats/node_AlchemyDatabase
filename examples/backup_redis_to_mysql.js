var Gently  = require('gently');
var Client  = require('mysql').Client;
var redisql = require("redisql");

var mclient = new Client();
var gently  = new Gently();
var client  = redisql.createClient();

// PURPOSE:
//  this script will backup ALL (except string) redis data objects into
//    timestamped tables in the mysql DB "backupdb"
//
// USAGE FREQUENCY: daily
//
// REQUIREMENTS
//  PACKAGES: http://github.com/felixge/node-mysql (npm install mysql)
//  MYSQL: 1.) create database "backupdb"

var currentTime = new Date()
var month       = currentTime.getMonth() + 1
var day         = currentTime.getDate()
var year        = currentTime.getFullYear()
var date_string = day + "_" + month + "_" + year;

console.log("date_string: " + date_string);

mclient.user     = 'root';
mclient.password = '';
mclient.database = 'backupdb';

mclient.connect();

client.keys("*", function (err, keys) {
  keys.forEach(function (key) {
    client.type(key, function (err, keytype) {
      //console.log(key + " is type " + keytype);
      if (keytype != "index" && keytype != "string") {
        var backup_table = "backup_" + key;

        client.drop_table(backup_table, redisql.print);
        client.create_table_from_redis_object(backup_table,
                                              key,
                                              redisql.print);
        var mysql_backup_table = "redis_backup_" + key + "_" + date_string;

        client.dump_to_mysql(backup_table, mysql_backup_table,
                            function (err, mlines) { 
          mlines.forEach(function (mline) {
            var ml = String(mline);
            mclient.query(ml, gently.expect( function selectCb(err, rs, fs) {
                if (err) console.log("mysql error:" + err);
            }));
          });
        });
        client.drop_table(backup_table, redisql.print);
        console.log("Backed up: " + key +
                    " in Mysql table name: " + mysql_backup_table);
      }
    });
  });
});

// cleanup TODO
//mclient.end();
//client.quit();

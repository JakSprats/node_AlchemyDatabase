var redisql = require("redisql");
var client  = redisql.createClient();

client.select(15, redisql.print); /* for tests */
client.drop_table("actionlist", redisql.print);

client.create_table("actionlist", "id INT PRIMARY KEY, user_id INT, timestamp INT, action TEXT", redisql.print);

//USER 1
client.insert("actionlist", "(1,1,12345,account created)", redisql.print);
client.insert("actionlist", "(2,1,12346,first login)", redisql.print);
client.insert("actionlist", "(3,1,12347,became paid member)", redisql.print);
client.insert("actionlist", "(4,1,12348,posted picture)", redisql.print);
client.insert("actionlist", "(5,1,12349,filled in profile)", redisql.print);
client.insert("actionlist", "(6,1,12350,signed out)", redisql.print);

//USER 2
client.insert("actionlist", "(7,2,22345,signed in)", redisql.print);
client.insert("actionlist", "(8,2,22346,updated picture)", redisql.print);
client.insert("actionlist", "(9,2,22347,checked email)", redisql.print);
client.insert("actionlist", "(10,2,22348,signed in)", redisql.print);

//USER 3
client.insert("actionlist", "(11,3,32348,signed in)", redisql.print);
client.insert("actionlist", "(12,3,32349,contacted customer care)", redisql.print);
client.insert("actionlist", "(13,3,32350,upgraded account)", redisql.print);
client.insert("actionlist", "(14,3,32351,uploaded video)", redisql.print);

// select_store a query into many lists named "user_action_zset:$user_id" redspectively
console.log("select user_id, timestamp, action FROM actionlist WHERE id BETWEEN 1 AND 20 STORE ZADD user_action_zset$ ");
client.select_store("user_id, timestamp, action", "actionlist", "id BETWEEN 1 AND 20", "ZADD",  "user_action_zset$", redisql.print);

// Get user 1's last two actions
console.log("ZREVRANGE user_action_zset:1 0 1");
client.zrevrange("user_action_zset:1", 0, 1, redisql.print);

console.log("ZREVRANGE user_action_zset:2 0 1");
client.zrevrange("user_action_zset:2", 0, 1, function (err, res) {
    console.log("Reply: " + res);
    console.log("End of example, sending QUIT command");
    client.quit();
});

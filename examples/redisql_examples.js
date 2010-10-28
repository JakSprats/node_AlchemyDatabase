var redisql = require("./redisql");
var client  = redisql.createClient();

function last_command(err, res) {
    console.log("Last result: " + res.toString());
    client.quit();
}


function init_worker(redisql, client) {
    client.create_table("worker", "id int,division int,health int,salary TEXT, name TEXT", redisql.print);
    client.create_index("worker:division:index", "worker", "division", redisql.print);
    client.create_index("worker:health:index", "worker", "health", redisql.print);
}

function insert_worker(redisql, client) {
    client.insert("worker", "(1,11,2,60000.66,jim)", redisql.print);
    client.insert("worker", "(2,22,1,30000.33,jack)", redisql.print);
    client.insert("worker", "(3,33,4,90000.99,bob)", redisql.print);
    client.insert("worker", "(4,44,3,70000.77,bill)", redisql.print);
    client.insert("worker", "(6,66,1,12000.99,jan)", redisql.print);
    client.insert("worker", "(7,66,1,11000.99,beth)", redisql.print);
    client.insert("worker", "(8,11,2,68888.99,mac)", redisql.print);
    client.insert("worker", "(9,22,1,31111.99,ken)", redisql.print);
    client.insert_return_size("worker", "(10,33,4,111111.99,seth)", redisql.print);
}
 
function scanselect_worker(redisql, client) {
    client.scanselect("*", "worker", redisql.print);
    client.scanselect("*", "worker", "name=bill", redisql.print);
}

function update_worker(redisql, client) {
    client.select("*", "worker", "id=1", redisql.print);
    client.update("worker", "name=JIM", "id = 1", redisql.print);
    client.select("*", "worker", "id = 1", redisql.print);
}
 
function delete_worker(redisql, client) {
    client.select("*", "worker", "id = 2", redisql.print);
    client.delete("worker", "id = 2", redisql.print);
    client.select("*", "worker", "id = 2", redisql.print);
}
 
function desc_worker(redisql, client) {
    client.desc("worker", redisql.print);
}

function dump_worker(redisql, client) {
    client.dump("worker",  redisql.print);
    client.dump_to_mysql("worker",  redisql.print);
}
 
function drop_index_worker(redisql, client) {
    client.drop_index("worker:health:index", redisql.print);
    client.drop_index("worker:division:index", redisql.print);
}

function drop_table_worker(redisql, client) {
    client.drop_table("worker", redisql.print);
}

function istore_worker_name_list(redisql, client) {
    client.select_store("name", "worker", "division BETWEEN 11 AND 33",
                        "RPUSH", "l_worker_name", redisql.print);
    client.lrange("l_worker_name", 0, -1, redisql.print);
}

function create_table_from_redis_object_example(redisql, client) {
    client.zadd("zset_example", 3.3, "bob", redisql.print);
    client.zadd("zset_example", 1.1, "ted", redisql.print);
    client.zadd("zset_example", 2.2, "mac", redisql.print);
    client.create_table_from_redis_object("zset_example_table",
                                          "zset_example", redisql.print);
    client.dump("zset_example_table", redisql.print);
}

function create_table_as_example(redisql, client) {
    client.zadd("zset_example", 3.3, "bob", redisql.print);
    client.zadd("zset_example", 1.1, "ted", redisql.print);
    client.zadd("zset_example", 4.4, "ken", redisql.print);
    client.zadd("zset_example", 2.2, "mac", redisql.print);
    client.create_table_as("zset_beginning",
                           "ZREVRANGE", "zset_example", "0 1", redisql.print);
    client.dump("zset_beginning", redisql.print);
}

client.flushdb(redisql.print);
init_worker(redisql, client);
insert_worker(redisql, client);
scanselect_worker(redisql, client);
update_worker(redisql, client);
delete_worker(redisql, client);
desc_worker(redisql, client);
dump_worker(redisql, client);
istore_worker_name_list(redisql, client);
create_table_from_redis_object_example(redisql, client);
create_table_as_example(redisql, client);

//drop_index_worker(redisql, client);
//drop_table_worker(redisql, client);

client.ping(last_command); // final command to exit cleanly

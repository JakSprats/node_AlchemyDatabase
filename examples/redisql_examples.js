var redisql = require("redisql");
var client  = redisql.createClient();

function last_command(err, res) {
    console.log("Last result: " + res.toString());
    client.quit();
}

// INIT INIT INIT INIT INIT INIT INIT INIT INIT INIT INIT INIT INIT INIT
// INIT INIT INIT INIT INIT INIT INIT INIT INIT INIT INIT INIT INIT INIT
function init_worker(redisql, client) {
    client.create_table("worker", "id int,division int,health int,salary TEXT, name TEXT", redisql.print);
    client.create_index("worker:division:index", "worker", "division", redisql.print);
    client.create_index("worker:health:index", "worker", "health", redisql.print);
}

function init_external(redisql, client) {
    client.create_table("external", "id int primary key, division int, health int, salary TEXT, name TEXT", redisql.print);
    client.create_index("external:division:index", "external", "division", redisql.print);
    client.create_index("external:health:index",   "external", "health", redisql.print);
}

function init_healthplan(redisql, client) {
    client.create_table("healthplan", "id int primary key, name TEXT", redisql.print);
}

function init_division(redisql, client) {
    client.create_table("division", "id int primary key, name TEXT, location TEXT", redisql.print);
    client.create_index("division:name:index", "division", "name", redisql.print);
}

function init_subdivision(redisql, client) {
    client.create_table("subdivision", "id int primary key, division int, name TEXT", redisql.print);
    client.create_index("subdivision:division:index", "subdivision", "division", redisql.print);
}

function init_employee(redisql, client) {
    client.create_table("employee", "id int primary key, division int, salary TEXT, name TEXT", redisql.print);
    client.create_index("employee:name:index",     "employee", "name", redisql.print);
    client.create_index("employee:division:index", "employee", "division", redisql.print);
}

function init_customer(redisql, client) {
    client.create_table("customer", "id int primary key, employee int, name TEXT, hobby TEXT", redisql.print);
    client.create_index("customer:employee:index", "customer", "employee", redisql.print);
    client.create_index("customer:hobby:index",    "customer", "hobby", redisql.print);
}

function initer(redisql, client) {
    init_external(redisql, client);
    init_healthplan(redisql, client);
    init_division(redisql, client);
    init_subdivision(redisql, client);
    init_employee(redisql, client);
    init_customer(redisql, client);
    init_worker(redisql, client);
}

// INSERT INSERT INSERT INSERT INSERT INSERT INSERT INSERT INSERT INSERT
// INSERT INSERT INSERT INSERT INSERT INSERT INSERT INSERT INSERT INSERT

function insert_external(redisql, client) {
    client.insert("external", "(1,66,1,15000.99,marieanne)", redisql.print);
    client.insert("external", "(2,33,3,75000.77,rosemarie)", redisql.print);
    client.insert("external", "(3,11,2,55000.55,johnathan)", redisql.print);
    client.insert("external", "(4,22,1,25000.99,bartholemew)", redisql.print);
}
function insert_healthplan(redisql, client) {
    client.insert("healthplan", "(1,none)", redisql.print);
    client.insert("healthplan", "(2,kaiser)", redisql.print);
    client.insert("healthplan", "(3,general)", redisql.print);
    client.insert("healthplan", "(4,extended)", redisql.print);
    client.insert("healthplan", "(5,foreign)", redisql.print);
}
function insert_subdivision(redisql, client) {
    client.insert("subdivision", "(1,11,middle-management)", redisql.print);
    client.insert("subdivision", "(2,11,top-level)", redisql.print);
    client.insert("subdivision", "(3,44,trial)", redisql.print);
    client.insert("subdivision", "(4,44,research)", redisql.print);
    client.insert("subdivision", "(5,22,factory)", redisql.print);
    client.insert("subdivision", "(6,22,field)", redisql.print);
}
function insert_division(redisql, client) {
    client.insert("division", "(11,bosses,N.Y.C)", redisql.print);
    client.insert("division", "(22,workers,Chicago)", redisql.print);
    client.insert("division", "(33,execs,Dubai)", redisql.print);
    client.insert("division", "(55,bankers,Zurich)", redisql.print);
    client.insert("division", "(66,janitors,Detroit)", redisql.print);
    client.insert("division", "(44,lawyers,L.A.)", redisql.print);
}
function insert_employee(redisql, client) {
    client.insert("employee", "(1,11,10000.99,jim)", redisql.print);
    client.insert("employee", "(2,22,2000.99,jack)", redisql.print);
    client.insert("employee", "(3,33,30000.99,bob)", redisql.print);
    client.insert("employee", "(4,22,3000.99,bill)", redisql.print);
    client.insert("employee", "(5,22,5000.99,tim)", redisql.print);
    client.insert("employee", "(6,66,60000.99,jan)", redisql.print);
    client.insert("employee", "(7,77,7000.99,beth)", redisql.print);
    client.insert("employee", "(8,88,80000.99,kim)", redisql.print);
    client.insert("employee", "(9,99,9000.99,pam)", redisql.print);
    client.insert("employee", "(11,111,111000.99,sammy)", redisql.print);
}
function insert_customer(redisql, client) {
    client.insert("customer", "(1,2,johnathan,sailing)", redisql.print);
    client.insert("customer", "(2,3,bartholemew,fencing)", redisql.print);
    client.insert("customer", "(3,3,jeremiah,yachting)", redisql.print);
    client.insert("customer", "(4,4,christopher,curling)", redisql.print);
    client.insert("customer", "(6,4,jennifer,stamps)", redisql.print);
    client.insert("customer", "(7,4,marieanne,painting)", redisql.print);
    client.insert("customer", "(8,5,rosemarie,violin)", redisql.print);
    client.insert("customer", "(9,5,bethany,choir)", redisql.print);
    client.insert("customer", "(10,6,gregory,dance)", redisql.print);
}
function insert_worker(redisql, client) {
    client.insert_return_size("worker", "(1,11,2,60000.66,jim)", redisql.print);
    client.insert_return_size("worker", "(2,22,1,30000.33,jack)", redisql.print);
    client.insert_return_size("worker", "(3,33,4,90000.99,bob)", redisql.print);
    client.insert_return_size("worker", "(4,44,3,70000.77,bill)", redisql.print);
    client.insert_return_size("worker", "(6,66,1,10000.99,jan)", redisql.print);
    client.insert_return_size("worker", "(7,66,1,11000.99,beth)", redisql.print);
    client.insert_return_size("worker", "(8,11,2,68888.99,mac)", redisql.print);
    client.insert_return_size("worker", "(9,22,1,31111.99,ken)", redisql.print);
    client.insert_return_size("worker", "(10,33,4,111111.99,seth)", redisql.print);
}

function inserter(redisql, client) {
    insert_external(redisql, client);
    insert_healthplan(redisql, client);
    insert_subdivision(redisql, client);
    insert_division(redisql, client);
    insert_employee(redisql, client);
    insert_customer(redisql, client);
    insert_worker(redisql, client);
}

function selecter(redisql, client) {
     client.select("*", "division", "id = 22", redisql.print);
     client.select("name, location", "division", "id = 22", redisql.print);
     client.select("*", "employee", "id = 2", redisql.print);
     client.select("name,salary", "employee", "id = 2", redisql.print);
     client.select("*", "customer", "id = 2", redisql.print);
     client.select("name", "customer", "id = 2", redisql.print);
     client.select("*", "worker", "id = 7", redisql.print);
     client.select("name, salary, division", "worker", "id = 7", redisql.print);
     client.select("*", "subdivision", "id = 2", redisql.print);
     client.select("name,division", "subdivision", "id = 2", redisql.print);
     client.select("*", "healthplan", "id = 2", redisql.print);
     client.select("name", "healthplan", "id = 2", redisql.print);
     client.select("*", "external", "id = 3", redisql.print);
     client.select("name,salary,division", "external", "id = 3", redisql.print);
}

function updater(redisql, client) {
     client.select("*", "employee", "id = 1", redisql.print);
     client.update("employee", "salary=50000,name=NEWNAME,division=66", "id = 1", redisql.print);
     client.select("*", "employee", "id = 1", redisql.print);
     client.update("employee", "id=100", "id = 1", redisql.print);
     client.select("*", "employee", "id = 100", redisql.print);
}

function delete_employee(redisql, client) {
     client.select("name,salary", "employee", "id = 3", redisql.print);
     client.delete("employee", "id = 3", redisql.print);
     client.select("name,salary", "employee", "id = 3", redisql.print);
}
function delete_customer(redisql, client) {
     client.select("name, hobby", "customer", "id = 7", redisql.print);
     client.delete("customer", "id = 7", redisql.print);
     client.select("name, hobby", "customer", "id = 7", redisql.print);
}
function delete_division(redisql, client) {
     client.select("name, location", "division", "id = 33", redisql.print);
     client.delete("division", "id = 33", redisql.print);
     client.select("name, location", "division", "id = 33", redisql.print);
}

function deleter(redisql, client) {
    delete_employee(redisql, client);
    delete_customer(redisql, client);
    delete_division(redisql, client);
}

function iselecter_division(redisql, client) {
     client.select("id,name,location", "division", "name BETWEEN a AND z", redisql.print);
}
function iselecter_employee(redisql, client) {
     client.select("id,name,salary,division", "employee", "division BETWEEN 11 AND 55", redisql.print);
}
function iselecter_customer(redisql, client) {
     client.select("hobby,id,name,employee", "customer", "hobby BETWEEN a AND z", redisql.print);
}
function iselecter_customer_employee(redisql, client) {
     client.select("employee,name,id", "customer", "employee BETWEEN 3 AND 6", redisql.print);
}
function iselecter_worker(redisql, client) {
     client.select("id,health,name,salary,division", "worker", "health BETWEEN 1 AND 3", redisql.print);
}
function iselecter(redisql, client) {
  iselecter_division(redisql, client);
  iselecter_employee(redisql, client);
  iselecter_customer(redisql, client);
}

function iupdater_customer(redisql, client) {
     client.update("customer", "hobby=fishing,employee=6", "hobby BETWEEN v AND z", redisql.print);
}
function iupdater_customer_rev(redisql, client) {
     client.update("customer", "hobby=ziplining,employee=7", "hobby BETWEEN f AND g", redisql.print);
}
function ideleter_customer(redisql, client) {
     client.delete("customer", "employee BETWEEN 4 AND 5", redisql.print);
}


function join_div_extrnl(redisql, client) {
     client.select("division.name,division.location,external.name,external.salary", "division,external", "division.id=external.division AND division.id BETWEEN 11 AND 80", redisql.print);
}

function join_div_wrkr(redisql, client) {
     client.select("division.name,division.location,worker.name,worker.salary", "division,worker", "division.id = worker.division AND division.id BETWEEN 11 AND 33", redisql.print);
}

function join_wrkr_health(redisql, client) {
     client.select("worker.name,worker.salary,healthplan.name", "worker,healthplan", "worker.health = healthplan.id AND healthplan.id BETWEEN 1 AND 5", redisql.print);
     client.select("healthplan.name,worker.name,worker.salary", "healthplan,worker", "healthplan.id=worker.health AND healthplan.id BETWEEN 1 AND 5", redisql.print);
}

function join_div_wrkr_sub(redisql, client) {
     client.select("division.name,division.location,worker.name,worker.salary,subdivision.name", "division,worker,subdivision", "division.id = worker.division AND division.id = subdivision.division AND division.id BETWEEN 11 AND 33", redisql.print);
}

function join_div_sub_wrkr(redisql, client) {
     client.select("division.name,division.location,subdivision.name,worker.name,worker.salary", "division,subdivision,worker", "division.id = subdivision.division AND division.id = worker.division AND division.id BETWEEN 11 AND 33", redisql.print);
}

function joiner(redisql, client) {
    join_div_extrnl(redisql, client);
    join_div_wrkr(redisql, client);
    join_wrkr_health(redisql, client);
    join_div_wrkr_sub(redisql, client);
    join_div_sub_wrkr(redisql, client);
}

function works(redisql, client) {
    initer(redisql, client);
    inserter(redisql, client);
    selecter(redisql, client);
    iselecter(redisql, client);
    updater(redisql, client);
    iselecter_employee(redisql, client);
    deleter(redisql, client);
    iselecter(redisql, client);
    iupdater_customer(redisql, client);
    iselecter_customer(redisql, client);
    ideleter_customer(redisql, client);
    iselecter_customer_employee(redisql, client);
    joiner(redisql, client);
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

function create_table_as_example(redisql, client, callback) {
    client.zadd("zset_example", 3.3, "bob", redisql.print);
    client.zadd("zset_example", 1.1, "ted", redisql.print);
    client.zadd("zset_example", 4.4, "ken", redisql.print);
    client.zadd("zset_example", 2.2, "mac", redisql.print);
    client.create_table_as("zset_beginning",
                           "ZREVRANGE", "zset_example", "0 1", redisql.print);
    client.dump("zset_beginning", redisql.print, function (err, res) {
        if (typeof callback === "function") {
            callback(err, res);
        }
    });
}

function full_worker_test(redisql, client) {
    scanselect_worker(redisql, client);
    update_worker(redisql, client);
    delete_worker(redisql, client);
    desc_worker(redisql, client);
    dump_worker(redisql, client);
    drop_index_worker(redisql, client);
    drop_table_worker(redisql, client);
}

function istore_worker_hash_name_salary(redisql, client) {
     client.select_store("name,salary", "worker", "division BETWEEN 11 AND 33", "HSET", "h_worker_name_to_salary", redisql.print);
     client.hgetall("h_worker_name_to_salary", redisql.print);
}

function jstore_div_subdiv(redisql, client) {
     client.drop_table("normal_div_subdiv", redisql.print);
     client.select_store("subdivision.id,subdivision.name,division.name", "subdivision,division", "subdivision.division = division.id AND division.id BETWEEN 11 AND 44", "INSERT", "normal_div_subdiv", redisql.print);
     client.dump("normal_div_subdiv", redisql.print);
}

function jstore_worker_location_hash(redisql, client) {
     client.select_store("external.name,division.location", "external,division", "external.division=division.id AND division.id BETWEEN 11 AND 80", "HSET", "worker_city_hash", redisql.print);
     client.hgetall("worker_city_hash", redisql.print);
}

function jstore_worker_location_table(redisql, client) {
     client.drop_table("w_c_tbl", redisql.print);
     client.select_store("external.name,division.location", "external,division", "external.division=division.id AND division.id BETWEEN 11 AND 80", "INSERT", "w_c_tbl", redisql.print);
     client.dump("w_c_tbl", redisql.print);
}

function store_test(redisql, client) {
    istore_worker_name_list(redisql, client);
    istore_worker_hash_name_salary(redisql, client);
    jstore_div_subdiv(redisql, client);
    jstore_worker_location_hash(redisql, client);
    jstore_worker_location_table(redisql, client);
}


client.select(15, redisql.print); /* for tests */
client.flushdb(redisql.print);
works(redisql, client);

store_test(redisql, client);

//full_worker_test(redisql, client);

create_table_from_redis_object_example(redisql, client);
create_table_as_example(redisql, client, function (err, res) {
    console.log("End of example, sending QUIT command");
    client.quit();
});


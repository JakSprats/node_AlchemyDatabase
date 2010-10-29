var redisql = require("redisql");
var client  = redisql.createClient();
var init    = true;
var verbose = false;

redisql.debug_mode = true;

function print_response(obj) {
    var lines = [];
    Object.keys(obj).forEach(function (key) {
        lines.push("   " + key + ": " + obj[key].toString());
    });
    console.log("Response hash: \n" + lines.join("\n"));
}

function run_test() {
    if (init) {
        console.log("Initializing");
        client.flushdb();
        if (verbose) {
            console.log("First populate user:id:[name,age,status]");
        }
        client.set("user:1:name",   "bill", redisql.print);
        client.set("user:1:age",    "33", redisql.print);
        client.set("user:1:status", "member", redisql.print);

        if (verbose) {
            console.log("Then  populate user:id:address[street,city,zipcode]");
        }
        client.set("user:1:address:street",  "12345 main st", redisql.print);
        client.set("user:1:address:city",    "capitol city", redisql.print);
        client.set("user:1:address:zipcode", "55566", redisql.print);

        if (verbose) {
            console.log("Then  populate user:id:payment[type,account]");
        }
        client.set("user:1:payment:type",    "credit card", redisql.print);
        client.set("user:1:payment:account", "1234567890", redisql.print);

        client.set("user:2:name",           "jane", redisql.print);
        client.set("user:2:age",            "22", redisql.print);
        client.set("user:2:status",         "premium", redisql.print);
        client.set("user:2:address:street", "345 side st", redisql.print);
        client.set("user:2:address:city",    "capitol city", redisql.print);
        client.set("user:2:address:zipcode", "55566", redisql.print);
        client.set("user:2:payment:type",    "checking", redisql.print);
        client.set("user:2:payment:account", "44441111", redisql.print);

        client.set("user:3:name",            "ken", redisql.print);
        client.set("user:3:age",             "44", redisql.print);
        client.set("user:3:status",          "guest", redisql.print);
        client.set("user:3:address:street",  "876 big st", redisql.print);
        client.set("user:3:address:city",    "houston", redisql.print);
        client.set("user:3:address:zipcode", "87654", redisql.print);
        client.set("user:3:payment:type",    "cash", redisql.print);

        if (verbose) {
            console.log("Keys are now populated");
            console.log("");
            console.log("Finally search through all redis keys using ");
            console.log("  the primary wildcard:\"user\" ");
            console.log("  and then search through those results using:");
            console.log("    1.) the secondary wildcard: \"*:address\" ");
            console.log("    2.) the secondary wildcard: \"*:payment\" ");
            console.log("    3.) non matching stil match the primary wildcard");
            console.log("");
            console.log("The 3 results will be normalised into the tables:");
            console.log("  1.) user_address");
            console.log("  2.) user_payment");
            console.log("  3.) user");
        }
    }

    client.norm("user", "address,payment", function (err, res) {
        if (err) { throw err; }
        console.log("Response: " + res);
    });
    
    client.select("user.pk,user.name,user.status,user_address.city,user_address.street,user_address.pk,user_address.zipcode", "user,user_address", "user.pk = user_address.pk AND user.pk BETWEEN 1 AND 5", redisql.print);

    if (verbose) {
        console.log("\n\n");
        console.log("If pure lookup speed of a SINGLE column is the dominant use case");
        console.log("We can now denorm the redisql tables into redis hash-tables");
        console.log("which are faster for this use-case");
        console.log("");
        console.log("denorm user \user:* ");
    }
    client.denorm("user", 'user:*', redisql.print);

    console.log("HGETALL user:1 ");
    client.hgetall("user:1", function (err, res) {
        if (err) { throw err; }
        console.log("Printing response for user:1");
        print_response(res);
    });

    console.log("denorm user_payment \user:*:payment ");
    client.denorm("user_payment", 'user:*:payment', redisql.print);
    console.log("HGETALL user:2:payment ");
    client.hgetall("user:2:payment", function (err, res) {
        if (err) { throw err; }
        print_response(res);
    });

    console.log("denorm user \user:*:address ");
    client.denorm("user_address", 'user:*:address', redisql.print);
    console.log("HGETALL user:3:address ");
    client.hgetall("user:3:address", function (err, res) {
        if (err) { throw err; }
        print_response(res);
        client.quit();
    });
}

console.log("Connecting to RediSQL server...");
client.on("connect", run_test);
client.on("error", function (e) {
    console.warn("Error connecting to RediSQL server: " + e);
    process.exit(1);
});

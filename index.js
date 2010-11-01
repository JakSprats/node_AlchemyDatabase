var redis = require("redis");

//redis.debug_mode   = true;; // comment out
exports.debug_mode = redis.debug_mode;
var dbg            = redis.debug_mode;
var proto          = redis.RedisClient.prototype;

function to_array(args) { // helper borrowed from node_redis
    var i, len = args.length, arr = new Array(len);
    for (i = 0; i < len; i += 1) {
        arr[i] = args[i];
    }
    return arr;
}

function check_argc(command, args, argc) {
    var len = args.length - 1; // dont count the callback
    if (argc != len) {
        throw new Error("cmd: " + command + " argc: " + argc + " not: " + len);
    }
}

function rsql_send_command(args, command, obj, sargs, dbg) {
    sargs.unshift(command); // put command at the beginning
    if (typeof args[args.length - 1] === "function") {
        sargs.push(args[args.length - 1]);
    }
    if (dbg) console.log("Send: " + command + " args: " + JSON.stringify(sargs));
    obj.send_command.apply(obj, sargs);
}

// new commands that we'll be adding that require no modifications
var commands = ["CHANGEDB", "DUMP", "DESC", "NORM", "DENORM"];

// merge into RedisClient prototype (both upper & lower case)
commands.forEach(function (command) {
    proto[command] = function () {
        rsql_send_command("", command, this, to_array(arguments), dbg);
    };
    proto[command.toLowerCase()] = proto[command];
});

proto["CREATE_TABLE"] = function () {
    var command  = "CREATE";
    var args     = to_array(arguments);
    check_argc(command, args, 2);
    var mod_args = "TABLE " + args[0] + " (" + args[1] + ")";
    rsql_send_command(args, command, this, mod_args.split(' '), dbg);
};
proto["create_table"] = proto["CREATE_TABLE"];

proto["CREATE_TABLE_FROM_REDIS_OBJECT"] = function () {
    var command  = "CREATE";
    var args     = to_array(arguments);
    check_argc("CREATE_TABLE_FROM_REDIS_OBJECT", args, 2);
    var mod_args = "TABLE " + args[0] + " AS DUMP " + args[1];
    rsql_send_command(args, command, this, mod_args.split(' '), dbg);
};
proto["create_table_from_redis_object"] = proto["CREATE_TABLE_FROM_REDIS_OBJECT"];

proto["CREATE_TABLE_AS"] = function () {
    var command  = "CREATE";
    var args     = to_array(arguments);
    check_argc("CREATE_TABLE_AS", args, 4);
    var mod_args = "TABLE " + args[0] + " AS " +
                    args[1] + " " + args[2] + " " + args[3];
    rsql_send_command(args, command, this, mod_args.split(' '), dbg);
};
proto["create_table_as"] = proto["CREATE_TABLE_AS"];

proto["CREATE_INDEX"] = function () {
    var command  = "CREATE";
    var args     = to_array(arguments);
    check_argc(command, args, 3);
    var mod_args = "INDEX " + args[0] + " ON " + args[1] + " (" + args[2] + ")";
    rsql_send_command(args, command, this, mod_args.split(' '), dbg);
};
proto["create_index"] = proto["CREATE_INDEX"];

proto["DROP_TABLE"] = function () {
    var command = "DROP";
    var args     = to_array(arguments);
    check_argc(command, args, 1);
    var mod_args = "TABLE " + args[0];
    rsql_send_command(args, command, this, mod_args.split(' '), dbg);
};
proto["drop_table"] = proto["DROP_TABLE"];

proto["DROP_INDEX"] = function () {
    var command = "DROP";
    var args     = to_array(arguments);
    check_argc(command, args, 1);
    var mod_args = "INDEX " + args[0];
    rsql_send_command(args, command, this, mod_args.split(' '), dbg);
};
proto["drop_index"] = proto["DROP_INDEX"];

proto["SELECT"] = function () {
    var command = "SELECT";
    var args    = to_array(arguments);
    var mod_args;
    if (args.length > 2) { // rewrite Redisql SELECT * FROM tbl WHERE id = 4
        check_argc(command, args, 3);
        mod_args = args[0] + " FROM "  + args[1] + " WHERE " + args[2];
        rsql_send_command(args, command, this, mod_args.split(' '), dbg);
    } else {                // redis SELECT DB
        mod_args    = new Array(1);
        mod_args[0] = args[0];
        rsql_send_command(args, command, this, mod_args, dbg);
    }
};
proto["select"] = proto["SELECT"];

proto["SELECT_STORE"] = function () {
    var command  = "SELECT";
    var args     = to_array(arguments);
    check_argc("SELECT_STORE", args, 5);
    var mod_args = args[0] + " FROM "  + args[1] + " WHERE " + args[2] +
                   " STORE " + args[3] + " " + args[4];
    rsql_send_command(args, command, this, mod_args.split(' '), dbg);
};
proto["select_store"] = proto["SELECT_STORE"];

proto["SCANSELECT"] = function () {
    var command  = "SCANSELECT";
    var args     = to_array(arguments);
    var mod_args = args[0] + " FROM "  + args[1];;
    if (args.length > 3) {
        check_argc(command, args, 3);
        mod_args += " WHERE " + args[2];
    } else {
        check_argc(command, args, 2);
    }
    rsql_send_command(args, command, this, mod_args.split(' '), dbg);
};
proto["scanselect"] = proto["SCANSELECT"];

proto["INSERT"] = function () {
    var command  = "INSERT";
    var args = to_array(arguments);
    check_argc(command, args, 2);
    var mod_args = "INTO " + args[0] + " VALUES";
    var sargs    = mod_args.split(' ');
    sargs.push(args[1]);    // put val_list at end as single argument
    rsql_send_command(args, command, this, sargs, dbg);
};
proto["insert"] = proto["INSERT"];

proto["INSERT_RETURN_SIZE"] = function () {
    var command  = "INSERT";
    var args = to_array(arguments);
    check_argc("INSERT_RETURN_SIZE", args, 2);
    var mod_args = "INTO " + args[0] + " VALUES";
    var sargs    = mod_args.split(' ');
    sargs.push(args[1]);    // put val_list at end as single argument
    sargs.push("RETURN");
    sargs.push("SIZE");
    rsql_send_command(args, command, this, sargs, dbg);
};
proto["insert_return_size"] = proto["INSERT_RETURN_SIZE"];

proto["DELETE"] = function () {
    var command  = "DELETE";
    var args     = to_array(arguments);
    check_argc(command, args, 2);
    var mod_args = "FROM " + args[0] + " WHERE "  + args[1];
    rsql_send_command(args, command, this, mod_args.split(' '), dbg);
};
proto["delete"] = proto["DELETE"];

proto["UPDATE"] = function () {
    var command = "UPDATE";
    var args     = to_array(arguments);
    check_argc(command, args, 3);
    var mod_args = args[0] + " SET"
    var sargs    = mod_args.split(' ');;
    sargs.push(args[1]); // push val_list at end as single argument
    sargs.push("WHERE");
    var wargs = args[2].split(' ');
    for (var i = 0; i < wargs.length; i++) {
        sargs.push(wargs[i]);
    };
    rsql_send_command(args, command, this, sargs, dbg);
};
proto["update"] = proto["UPDATE"];

proto["DUMP_TO_MYSQL"] = function () {
    var command  = "DUMP";
    var args = to_array(arguments);
    var mod_args;
    if (args.length > 1) {
        check_argc("DUMP_TO_MYSQL", args, 2);
        mod_args = args[0] + " TO MYSQL " + args[1];
    } else {
        check_argc("DUMP_TO_MYSQL", args, 1);
        mod_args = args[0] + " TO MYSQL";
    }
    rsql_send_command(args, command, this, mod_args.split(' '), dbg);
};
proto["dump_to_mysql"] = proto["DUMP_TO_MYSQL"];

exports.createClient = function (port_arg, host_arg) {
    return redis.createClient(port_arg, host_arg);
};

exports.print = redis.print;

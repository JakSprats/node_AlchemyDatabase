node_Redisql
============

This is the [Node.js](http://nodejs.org/) client for [Redisql](http://code.google.com/p/redisql/).

## Prerequisites

To install `node_Redisql` you must first install:

1. [Node.js](http://nodejs.org/)
2. [npm](http://github.com/isaacs/npm)
3. [Redisql](http://code.google.com/p/redisql/)

## Installation

Installation is done with `npm`.

    npm install redisql

To test:

1. make sure ./redisql-server is running 
2. This test calls "FLUSHDB" on database 15 of redisql -> you will lose data in DB 15
3. type "node examples/redisql_examples.js"

The file node examples/redisql_examples.js is currently the best source of HOW-TO in this library.

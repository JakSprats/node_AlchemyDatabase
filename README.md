node_Redisql
============

This is the [Node.js](http://nodejs.org/) client for [Redisql](http://code.google.com/p/redisql/).

## Prerequisites

To install `node_Redisql` you must first install:

1. node
2. [npm](http://github.com/isaacs/npm)
3. Redisql

## Installation

Installation is done with `npm`.

    npm install redisql

To test:

1. make sure ./redisql-server is running 
2. THIS TEST WILL CALL "FLUSHDB" on database 0 of redisql -> you will lose data
3. type "node examples/redisql_examples.js"

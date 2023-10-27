"use strict";
import getDB from "./provider.js";

const DB = getDB(process.env.MONGODB_URL, "7FlexDB");
const table = DB.collection("user");

export default {
    updateSocket: async function(socket) {
        // assumes socket is unique
        return await table.updateOne( { socket: socket }, { $set: {socket: socket} } );
    },
    getall: async function() {
        return await table.find({}).toArray();        
    },
    get: async function(username) {
        return await table.findOne({username: username});
    },
    create: async function(set) {
        return await table.insertOne( { $set: set } );
    },
    update: async function(username, set) {
        return await table.updateOne( { username: username }, { $set: set }, { upsert: true } );
    },
    delete: async function(username) {
        return await table.deleteOne( { username: username }, { $set: set } );
    },
};
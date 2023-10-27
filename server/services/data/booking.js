"use strict";
import getDB from "./provider.js";
import { ObjectId } from "mongodb";

const DB = getDB(process.env.MONGODB_URL, "7FlexDB");
const table = DB.collection("booking");

/**
 * @typedef  {Object} Booking
 * @property {objectid} _id
 * @property {objectId} shiftId
 * @property {string}   storeId
 * @property {string}   username
 * @property {date}     startDate
 * @property {date}     endDate
 * 
 */

export default {
    getByUserName: async function(username) {
        return await table.find({username: username}).toArray();        
    },
    getByStore: async function(storeId) {
        return await table.find({storeId: storeId}).toArray();        
    },
    create: async function(set) {
        return await table.insertOne( set );
    },
    update: async function(id, set) {
        return await table.updateOne( { _id: new ObjectId(id) }, { set } );
    },
    delete: async function(id) {
        return await table.deleteOne( { _id: new ObjectId(id) }, { $set: set } );
    },
};
"use strict";
import getDB from "./provider.js";
import { ObjectId } from "mongodb";
const DB = getDB(process.env.MONGODB_URL, "7FlexDB");
const table = DB.collection("shift");

/**
 * @typedef {Object} Shift
 * @property {objectid} _id
 * @property {string}   storeId
 * @property {float}    payRate
 * @property {date}     startDate
 * @property {date}     endDate
 * @property {int32}    availableSlots
 * @property {int32}    headCount
 */

export default {
    getAvailable: async function() {
        return await table.find({availableSlots: { $gt: 0 }}).toArray();
    },
    getByStore: async function(storeId) {
        return await table.find({storeId: storeId}).toArray();
    },
    getAll: async function() {
        return await table.find({}).toArray();
    },
    get: async function(id) {
        return await table.findOne({_id: new ObjectId(id)});
    },
    create: async function(set) {
        return await table.insertOne( set );
    },
    update: async function(id, set) {
        return await table.updateOne( { _id: new ObjectId(id) }, { $set: set } );
    },
    delete: async function(id) {
        return await table.deleteOne( { _id: new ObjectId(id) }, { $set: set } );
    },
};
"use strict";
import getDB from "./provider.js";

const DB = getDB(process.env.MONGODB_URL, "7FlexDB");
const table = DB.collection("store");

/**
 * @typedef {Object} Gig
 * @property {objectid} _id
 * @property {string}   storeId
 * @property {string}   address
 * @property {Object}   {lat: numeric, lng: numeric}
 * @property {date}     startDate
 * @property {date}     endDate
 * @property {int32}    availableCount
 * @property {int32}    headCount
 */

export default {
    getAll: async function() {
        return await table.find({}).toArray();
    },
    get: async function(storeId) {
        return await table.findOne({storeId: storeId});
    },
    create: async function(set) {
        return await table.insertOne( { $set: set } );
    },
    update: async function(storeId, set) {
        return await table.updateOne( { storeId: storeId }, { $set: set }, { upsert: true } );
    },
    delete: async function(storeId) {
        return await table.deleteOne( { storeId: id }, { $set: set } );
    },
};
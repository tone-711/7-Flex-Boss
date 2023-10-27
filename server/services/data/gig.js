"use strict";
import getDB from "./provider.js";

const DB = getDB(process.env.MONGODB_URL, "7FlexDB");
const table = DB.collection("gig");

/**
 * @typedef {Object} Gig
 * @property {objectid} _id
 * @property {string}   storeId
 * @property {float}    rate
 * @property {date}     startDate
 * @property {date}     endDate
 * @property {int32}    availableCount
 * @property {int32}    headCount
 */

export default {
    getAvailable: async function() {
        return await table.find({availableCount: { $gt: 0 }}).toArray();
    },
    getByStore: async function(storeId) {
        return await table.find({storeId: storeId}).toArray();
    },
    get: async function(id) {
        return await table.findOne({_id: id});
    },
    create: async function(set) {
        return await table.insertOne( { $set: set } );
    },
    update: async function(id, set) {
        return await table.updateOne( { _id: id }, { $set: set } );
    },
    delete: async function(id) {
        return await table.deleteOne( { _id: id }, { $set: set } );
    },
};
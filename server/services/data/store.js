"use strict";
import getDB from "./provider.js";

const DB = getDB(process.env.MONGODB_URL, "7FlexDB");
const table = DB.collection("store");

/**
 * @typedef {Object} Gig
 * @property {objectid} _id
 * @property {string}   storeId
 * @property {float}    rate
 * @property {string}   address
 * @property {Object}   {lat: numeric, lng: numeric}
 * @property {date}     startDate
 * @property {date}     endDate
 * @property {int32}    availableCount
 * @property {int32}    headCount
 */

export default {
    getStores: async function() {
        return await table.find({availableCount: { $gt: 0 }}).toArray();
    },
    getGigsByStore: async function() {
        return await table.find({availableCount: { $gt: 0 }}).toArray();
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
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    utils = require('../../lib/commons'),
    Schema = mongoose.Schema;

/**
 * OAuthClient Schema
 */
var OAuthClientSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    name: {type:String},
    email: {type: String},
    callbackUrl: {type: String},
    clientKey: {type: String, unique: true},
    accessToken: {type: String, unique: true},
    expiryDate: {type: Date}
});

/**
 * Statics
 */
OAuthClientSchema.statics = {
    load: function(id, cb) {
        this.findOne({
            user: id
        }).exec(cb);
    }
};


mongoose.model('OAuthClient', OAuthClientSchema);

module.exports = mongoose.model('OAuthClient');
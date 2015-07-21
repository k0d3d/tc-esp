/**
 * Module dependencies.
 */
var
    // RequestToken = require('./oauth2/request_token'),
    // AccessToken = require('./oauth2/access_token'),
    OAuthClient = require('./oauth2/oauth_client'),
    Q = require('q'),
    utils = require('../lib/commons'),
    _ = require('lodash'),

oAuthFunctions = {
    findByClientId : function (id) {
        var d = Q.defer();

        OAuthClient.findOne({ _id: id })
        // .populate('roles', null, 'roles')
        .exec(function (error, client) {
            if (error) {
                return d.reject(error);
            }
            if (client) {
                return d.resolve(client);
            } else {
                return d.resolve(false);
            }
        });

        return d.promise;
    },
    findByClientKey : function (key) {
        var d = Q.defer();

        OAuthClient.findOne({ clientKey: key }, function (error, client) {
            if (error) {
                return d.reject(error);
            }
            if (client) {
                return d.resolve(client);
            } else {
                return d.resolve(false);
            }
        });

        return d.promise;
    },
    findByClientDeviceId : function (id) {
        var d = Q.defer();

        OAuthClient.findOne({ deviceId: id }, function (error, client) {
            if (error) {
                return d.reject(error);
            }
            if (client) {
                return d.resolve(client);
            } else {
                return d.resolve(false);
            }
        });

        return d.promise;
    },
    createClient : function (options) {
        var d = Q.defer();

        OAuthClient.findOneAndUpdate({
            email: options.email
        }, options, {upsert: true})
        .exec(function (err, doc) {
            if (err) {
                return d.reject(err);
            }
            if (doc) {
                return d.resolve(doc);
            }
        });

        return d.promise;
    },
    removeClientById : function (id) {
        var d = Q.defer();
        OAuthClient.remove({
            _id : id
        }, function (err, affectedRows) {
            if (err) {
                return d.reject(err);
            }
            if(affectedRows > 0) {
                return d.resolve(true);
            } else {
                return d.resolve(new Error ('failed to remove client'));
            }

        });

        return d.promise;
    },
    removeClientByKey : function(clientKey) {
        var d = Q.defer();

        OAuthClient.remove({
            clientKey : clientKey
        }, function (err, affectedRows) {
            if (err) {
                return d.reject(err);
            }
            if(affectedRows > 0) {
                return d.resolve(true);
            } else {
                return d.resolve(new Error ('failed to remove client'));
            }

        });
        return d.promise;
    },
    removeClientByDeviceId : function(id) {
        var d = Q.defer();

        OAuthClient.remove({
            deviceId : id
        }, function (err, affectedRows) {
            if (err) {
                return d.reject(err);
            }
            if(affectedRows > 0) {
                return d.resolve(true);
            } else {
                return d.resolve(new Error ('failed to remove client'));
            }

        });
        return d.promise;
    },

    findAllClients : function (options) {
        var clients = Q.defer();

        options = options || {};

        OAuthClient.find(options)
        .exec(function (err, i) {
            if (err) {
                return clients.reject(err);
            }
            if (i) {
                return clients.resolve(i);
            }
        });

        return clients.promise;
    }
};

/**
 * OAuth Class
 * @return {[type]} [description]
 */
function OAuthModel () {

}

OAuthModel.prototype.listOfClients = function (options) {
    var list = Q.defer();

    oAuthFunctions.findAllClients(options)
    .then(function (result) {
        return list.resolve(result);
    }, function (err) {
        return list.reject(err);
    });

    return list.promise;
};

OAuthModel.prototype.create = function (options) {
    console.log('Creating Client');
    var d = Q.defer();

    oAuthFunctions.createClient(options)
    .then(function (result) {
        return d.resolve(result);
    }, function (err) {
        return d.reject(err);
    });

    return d.promise;
};

/**
 * finds a  by its mongoose ObjectId or by the app client
 * key.
 * @param  {object} option an Object with id or key properties
 * @return {[type]}        return a promise
 */
OAuthModel.prototype.findClient  = function (option)  {
    console.log('Searching for Client');
    var d = Q.defer();

    if(option.id) {
        oAuthFunctions.findByClientId(option.id)
        .then(function (result) {
            d.resolve(result);
        })
        .catch(function (err) {
            d.reject(err);
        });
    }

    if (option.key) {
        oAuthFunctions.findByClientKey(option.key)
        .then(function (result) {
            d.resolve(result);
        })
        .catch(function (err) {
            d.reject(err);
        });
    }
    if (option.device) {
        oAuthFunctions.findByClientDeviceId(option.device)
        .then(function (result) {
            d.resolve(result);
        })
        .catch(function (err) {
            d.reject(err);
        });
    }

    return d.promise;
};

OAuthModel.prototype.findToken = function (accessToken) {
    var d = Q.defer();
    console.log('message');
    oAuthFunctions.findOneAccessToken({
        token : accessToken
    })
    .then(function (r) {
        return d.resolve(r);
    }, function (err) {
        return d.reject(err);
    });

    return d.promise;
};

OAuthModel.prototype.removeAClient = function (option) {
    var d = Q.defer();

    if(option.id) {
        oAuthFunctions.removeClientById(option.id)
        .then(function (result) {
            d.resolve(result);
        })
        .catch(function (err) {
            d.reject(err);
        });
    }

    if (option.key) {
        oAuthFunctions.removeClientByKey(option.key)
        .then(function (result) {
            d.resolve(result);
        })
        .catch(function (err) {
            d.reject(err);
        });
    }
    if (option.device) {
        oAuthFunctions.removeClientByDeviceId(option.device)
        .then(function (result) {
            d.resolve(result);
        })
        .catch(function (err) {
            d.reject(err);
        });
    }

    return d.promise;
};

module.exports = OAuthModel;


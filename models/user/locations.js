
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    encrypt = require('../../lib/commons.js').encrypt,
    _ = require('lodash'),
    uniqueValidator = require('mongoose-unique-validator');

var LocationImages = new Schema ({
  fileName: {type: String},
  locationId: {type: Schema.ObjectId},
  addedOn: {type: Date, default: Date.now},
  featured: {type: Boolean},
  type: {type: String},
  isVisible: {type: Boolean, default:true },
  uploader: {type: Schema.ObjectId}
});

var LocationSchema = new Schema({
    name:String,
    description:String,
    category: {type: String},
    specials: [{type: String}],
    tags: [{type: String}],
    dateAdded: {type: Date, default: Date.now},
    longitude: Number,
    latitude: Number,
    coords: {type: [Number, Number], index: '2d'},
    author: {type: Schema.ObjectId},
    verififiedCounts: {type: Number, default: 0 },
    upVotes: {type: Number},
    downVotes: {type: Number},
    address: {type: String},
    ward: {type: String},
    lga: {type: String},
    state: {type: String},
    machine_brand: {type: String},
    offsite_branch: {type: String},
    photos: [LocationImages]
});

var  CheckInSchema = new Schema ({
  locationId: {type: Schema.ObjectId},
  checkInTime: {type: Date, default: Date.now},
  checkOutTime: {type: Date},
  userId: {type: Schema.ObjectId},
  deviceId: {type: String},
  category: {type: String},
  questions: []
});

var ActionSchema = new Schema ({
  locationId: {type: Schema.ObjectId},
  checkId: {type: String},
  rating: {type: Number},
  comments: {typea: String}
});

var PointsSchema = new Schema ({
  actionPerformed: {type: String},
  pointsAwarded: {type: Number},
  dateAdded: {type: Date, default: Date.now},
  relationalData: [],
});


var FeedBackAnswers = new Schema ({

  addedOn: {type: Date},
  answer: {type: String},
  assignee:{type: String},
  checkInId: {type: String},
  dateTriggered: {type: String},
  decision: {type: String},
  hasComment: {type: String, default: 'None'},
  hasImage: {type: String, default: 'feedback-sample.jpg'},
  hasVideo: {type: String},
  listIndex: {type: Number},
  locationId: {type: String},
  locationName: {type: String},
  questions: {type: String},
  timeUpdated: {type: Date},
  title: {type: String},
  clientPrimaryId: {type: String}
});

module.exports = {
  "PointsHistory": mongoose.model('PointsHistory', PointsSchema),
  "Review": mongoose.model('Reviews', ActionSchema),
  "TCLocation": mongoose.model('Location', LocationSchema),
  "CheckLog": mongoose.model('Checklog', CheckInSchema),
  "FeedBackAnswer": mongoose.model('FeedBackAnswer', FeedBackAnswers)
};
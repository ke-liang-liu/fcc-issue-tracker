/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

  
module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      
      var project = req.params.project;
      let filter = req.query;
      console.log(filter);
      if (filter.open === 'true') {
        filter.open = true;
      } else if (filter.open === 'false') {
        filter.open = false;
      }
      MongoClient.connect(CONNECTION_STRING, (err, client) => {
        const db = client.db('fcc-issue-tracker')
        db.collection(project).find(filter).toArray((err, docs) => {
          if (err) { console.log(err) };
          res.json(docs);
          db.close();
        });
      })
    })
    
    .post(function (req, res){
      var project = req.params.project;
      console.log(req.body.issue_text);
      if (req.body.issue_title == undefined || req.body.issue_title.trim().length===0 ||
          req.body.issue_text == undefined || req.body.issue_text.trim().length===0 || 
          req.body.created_by == undefined || req.body.created_by.trim().length===0){
        res.send('missing required fields');
      } else {
        let issue = {
          issue_title: req.body.issue_title,
          issue_text: req.body.issue_text,
          created_by: req.body.created_by,
          assigned_to: req.body.assigned_to || "",
          status_text: req.body.status_text || "",
          created_on: new Date(),
          updated_on: new Date(),
          open: true
        }     
        
        MongoClient.connect(CONNECTION_STRING, (err, client) => {
          const db = client.db('fcc-issue-tracker');
          if(err) {
              console.log('Database error: ' + err);
          } else {
              console.log('Successful database connection');
              db.collection(project).insertOne(issue, (err, doc) => {
                if(err) { 
                  res.json(err) 
                } else {
                  res.json(doc.ops[0]);
                  db.close();
                }
              })
          }
        })        
      }
    })
    
    .put(function (req, res){
      var project = req.params.project;
      var _id = req.body._id;
      var filter = { _id: ObjectId(_id) }
      for (const property in req.body) {
        if (req.body[property] === '') {
          delete req.body[property];
        }
      }
      delete req.body['_id'];
      if (Object.keys(req.body).length === 0) {
        res.send('No body, please enter again!') 
      }
      MongoClient.connect(CONNECTION_STRING, (err, client) => {
        const db = client.db('fcc-issue-tracker');
        if(err) {
              console.log('Database error: ' + err);
        } else {
          console.log('Database connect sussessfully');
          db.collection(project).updateOne(filter, {$set: req.body}, { upsert: true }, function(err, doc) {
            if(err) {
              res.json(err)
            } else if (doc.result.n === 0) {
              res.json('update failed: ' + filter._id);
            } else {
              res.send('update succeeded: ' + filter._id);
              db.close();
            }
          })
        }
      })
    })
    
    .delete(function (req, res){
      var project = req.params.project;
      var _id = req.body._id;
      const regex = /^[0-9a-fA-F]{24}$/
      if (_id.match(regex) == null) {             
          res.json('_id error');
      }
      var filter = {_id: ObjectId(_id)} // Argument passed in must be a single String of 12 bytes or a string of 24 hex characters
      MongoClient.connect(CONNECTION_STRING, (error, client) => {
        const db = client.db('fcc-issue-tracker');
        db.collection(project).deleteOne(filter, function(err, doc) {
          if (err) {
            res.json('_id error');
            db.close();              
            console.log(err)
          };                   
          if (doc.deletedCount === 0) {
            res.json('could not delete '+ _id);
          } else {
            res.json('deleted '+ _id);
          }                    
          db.close();
        })
      })
    });
    
};

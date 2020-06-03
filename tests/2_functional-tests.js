/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var ObjectId = require("mongodb").ObjectID;
var _id;
var issueId = ObjectId(_id);
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/func_test')
        .send({
          issue_title: 'title',
          issue_text: 'text',
          created_by: 'Functional TestOne: Every field filled in',
          assigned_to: 'me',
          status_text: 'normal'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body, 'issue_title');
          assert.property(res.body, 'issue_text');
          assert.property(res.body, 'created_by');
          assert.property(res.body, 'assigned_to');
          assert.property(res.body, 'status_text');
          assert.property(res.body, 'created_on');
          assert.property(res.body, 'updated_on');
          assert.property(res.body, 'open');
          assert.property(res.body, '_id');
          assert.equal(res.body.issue_title, 'title');
          assert.equal(res.body.issue_text, 'text');
          assert.equal(res.body.created_by, 'Functional TestOne: Every field filled in');
          assert.equal(res.body.assigned_to, 'me');
          assert.equal(res.body.status_text, 'normal');
          assert.isBoolean(res.body.open);
          assert.isTrue(res.body.open);
         
          //fill me in too!
          done();
        });
      });
      
      test('Required fields filled in', function(done) {
        chai.request(server)
          .post('/api/issues/func_test')
          .send({
            issue_title: 'title',
            issue_text: 'text',
            created_by: 'Functional TestTwo: Required fields filled in',
          })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.property(res.body, 'issue_title');
            assert.property(res.body, 'issue_text');
            assert.property(res.body, 'created_by');
            assert.property(res.body, 'assigned_to');
            assert.property(res.body, 'status_text');
            assert.property(res.body, 'created_on');
            assert.property(res.body, 'updated_on');
            assert.property(res.body, 'open');
            assert.property(res.body, '_id');
            assert.equal(res.body.issue_title, 'title');
            assert.equal(res.body.issue_text, 'text');
            assert.equal(res.body.created_by, 'Functional TestTwo: Required fields filled in');
            assert.equal(res.body.assigned_to, '');
            assert.equal(res.body.status_text, '');
            assert.isBoolean(res.body.open);
            assert.isTrue(res.body.open);
            done();
          })
      });
      
      test('Missing required fields', function(done) {
        chai.request(server)
          .post('/api/issues/func_test')
          .send({
            issue_title: 'title',
            created_by: 'Functional TestThree: Missing required fields',
          })
          .end(function(err, res){
            // assert.equal(res.body.status_text, 'missing required fields');
            assert.equal(res.text, 'missing required fields')
            done();
          })
      });
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
        chai.request(server)
          .put('/api/issues/func_test')
          .send({_id: issueId})
          .end(function(err, res){
            assert.equal(res.text, 'No body, please enter again!')
            done();
          })
      });
      
      test('One field to update', function(done) {
        let _id = '5ec3a2193e5da50965b1f117';
        chai.request(server)
          .put('/api/issues/func_test')
          .send({_id: _id, issue_title: 'Functional test: One field to update3'})
          .end(function(err, res) {
            assert.equal(res.text, 'update succeeded: ' + _id);
            done();
          })
      });
      
      test('Multiple fields to update', function(done) {
        chai.request(server)
          .put('/api/issues/func_test')
          .send({
            _id: '5ec3a2193e5da50965b1f117',
            issue_title: 'title',
            issue_text: 'Functional text: Multiple fields to update',
            created_by: "created by me"
          })
          .end(function(err, res) {
            assert.equal(res.text, 'update succeeded: ' + '5ec3a2193e5da50965b1f117');
            done();
        })
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/func_test')  // get
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('One filter', function(done) {
        chai.request(server)
          .get('/api/issues/func_test')  // get
          .query({assigned_to: 'Alice1'})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], 'issue_title');
            assert.property(res.body[0], 'issue_text');
            assert.property(res.body[0], 'created_on');
            assert.property(res.body[0], 'updated_on');
            assert.property(res.body[0], 'created_by');
            assert.property(res.body[0], 'assigned_to');
            assert.property(res.body[0], 'open');
            assert.property(res.body[0], 'status_text');
            assert.property(res.body[0], '_id');
            assert.strictEqual(res.body[0].assigned_to, 'Alice1');
            done();
          });
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
          .get('/api/issues/func_test')  // get
          .query({assigned_to: 'Alice1', issue_title: 'title1', issue_text: 'text1'})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], 'issue_title');
            assert.property(res.body[0], 'issue_text');
            assert.property(res.body[0], 'created_on');
            assert.property(res.body[0], 'updated_on');
            assert.property(res.body[0], 'created_by');
            assert.property(res.body[0], 'assigned_to');
            assert.property(res.body[0], 'open');
            assert.property(res.body[0], 'status_text');
            assert.property(res.body[0], '_id');
            assert.strictEqual(res.body[0].assigned_to, 'Alice1');
            assert.strictEqual(res.body[0].issue_title, 'title1');
            assert.strictEqual(res.body[0].issue_text, 'text1');
            done();
        });
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai.request(server)
          .delete('/api/issues/func_test')
          .send({_id: ''})
          .end(function(err, res) {
            assert.equal(res.text, '"_id error"');
            done();
          })
      });
      
      test('Valid _id', function(done) {
        let _id = '5ec3aeb32f9aef71a1530673';
        chai.request(server)
          .delete('/api/issues/func_test')
          .send({_id: '5ec3aeb32f9aef71a1530673'})
          .end(function(err, res) {
            assert.equal(res.text, '"deleted ' + _id + '"');
            done();
          })
        
        
      });
      
    });

});

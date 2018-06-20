/* global it, describe, require, console */
const Kvass = require('../../src/main.js');
const assert = require('assert');

const request = require('../../src/utils/superagent');
const mock = require('superagent-mocker')(request);

const modelCreatedFile = require('../fetchmock/modelCreated.json');
const modelTrainingFile = require('../fetchmock/modelTraining.json');
const modelReadyFile = require('../fetchmock/modelReady.json');
const modelsFile = require('../fetchmock/models.json');
const recommendationsFile = require('../fetchmock/recommendations.json');

const endpoint = 'https://example.com/';
const sa = new Kvass({ apiKey: 'dummy', bearerToken: 'dummy', endpoint });
let url;

describe('AI related tests', () => {
  beforeEach(() => {
    // Guarantee each test knows exactly which routes are defined
    mock.clearRoutes();
  });

  describe('GET ai/models', () => {
    it('Should return a list of models', (done) => {
      url = `${endpoint}ai/models`;
      mock.get(url, () => ({ body: modelsFile, ok: true }));
      sa.aiModel().getAll({}, (err, models) => {
        if (err) throw err;
        assert.ok(Array.isArray(models));
        done();
      });
    });
  });

  describe('POST ai/models', () => {
    it('Should create a new ai model based on type, source and destination', (done) => {
      url = `${endpoint}ai/models`;
      mock.post(url, () => ({ body: modelCreatedFile, ok: true }));
      sa.aiModel().create({"model_type": "content_recommender", "source": "product", "destination": "product"}, (err, model) => {
        if (err) throw err;
        assert.ok(model.constructor.name === 'AIModel');
        assert.ok(model.training_status === 'CREATED');
        done();
      });
    });
  });

  describe('GET ai/models/<modelId>', () => {
    it('Should return details about one specific model', (done) => {
      url = `${endpoint}ai/models/:modelId:`;
      mock.get(url, () => ({ body: modelReadyFile, ok: true }));
      sa.aiModel(':modelId:').get({}, (err, model) => {
        if (err) throw err;
        assert.ok(model.constructor.name === 'AIModel');
        assert.ok(model.training_status === 'READY');
        done();
      });
    });
  });


  describe('POST ai/models/<modelId>/train', () => {
    it('Should train an existing ai model', (done) => {
      url = `${endpoint}ai/models/:modelId:/train`;
      mock.post(url, () => ({ body: modelTrainingFile, ok: true }));
      sa.aiModel(':modelId:').train({}, (err, model) => {
        if (err) throw err;
        assert.ok(model.constructor.name === 'AIModel');
        assert.ok(model.training_status === 'TRAINING');
        done();
      });
    });
  });

  describe('POST ai/models/<modelId>/invoke', () => {
    it('Should return recommendation for a given source based on a specific model', (done) => {
      url = `${endpoint}ai/models/:modelId/invoke`;
      mock.post(url, () => ({ body: recommendationsFile, ok: true }));
      sa.aiModel(':modelId:').getRecommendations({source: "5aec176d1f7cdc0008848f87", size: 4}, (err, recommendations) => {
        if (err) throw err;
        assert.ok(Array.isArray(recommendations.response));
        done();
      });
    });
  });

  describe('POST ai/models/invoke', () => {
    it('Should return recommendation for a given source based on set model type, source and destination', (done) => {
      url = `${endpoint}ai/models/invoke`;
      mock.post(url, () => ({ body: recommendationsFile, ok: true }));
      sa.aiModel().getRecommendations({"source": "5aec176d1f7cdc0008848f87", "size": 4, "model_type": "content_recommender", "source": "product", "destination": "product"}, (err, recommendations) => {
        if (err) throw err;
        assert.ok(Array.isArray(recommendations.response));
        done();
      });
    });
  });
});

/* global it, describe, require, console */
const Kvass = require('../../src/main.js');
const assert = require('assert');

const request = require('../../src/utils/superagent');
const mock = require('superagent-mocker')(request);

const modelFile = require('../fetchmock/model.json');
const modelsFile = require('../fetchmock/models.json');

const endpoint = 'https://example.com/';
const sa = new Kvass({ apiKey: 'dummy', bearerToken: 'dummy', endpoint });
let url;

describe('AI related tests', () => {
  beforeEach(() => {
    // Guarantee each test knows exactly which routes are defined
    mock.clearRoutes();
  });

  it('Should return a list of models', (done) => {
    url = `${endpoint}ai/models:`;
    mock.get(url, () => ({ body: modelsFile, ok: true }));
    sa.ai().get({}, (err, models) => {
      if (err) throw err;
      assert.ok(Array.isArray(orders));
      done();
    });
  });

  it('Should return details about one specific model', (done) => {
    url = `${endpoint}ai/models/:modelId:`;
    mock.get(url, () => ({ body: modelFile, ok: true }));
    sa.ai(':modelId:').get({}, (err, model) => {
      if (err) throw err;
      assert.ok(model.constructor.name === 'Model');
      done();
    });
  });

  it('Should create a model for product recommendation', (done) => {
    url = `${endpoint}ai/models/:modelId:`;
    mock.post(url, () => ({ body: modelFile, ok: true }));
    sa.ai(':modelId:').get({"model_type": "content_recommender", "source": "product", "destination": "product"}, (err, model) => {
      if (err) throw err;
      assert.ok(model.constructor.name === 'Model');
      assert.ok(model.training === 'READY');
      done();
    });
  });

  it('Should train a model', (done) => {
    url = `${endpoint}ai/models/:modelId:`;
    mock.put(url, () => ({ body: modelFile, ok: true }));
    sa.ai(':modelId:').get({}, (err, model) => {
      if (err) throw err;
      assert.ok(model.constructor.name === 'Model');
      assert.ok(model.training === 'TRAINING');
      done();
    });
  });

  it('Should return recommendation for a given user based on a specific model', (done) => {
  });

  it('Should return recommendation for a given user based on set of parameters', (done) => {
  });
});

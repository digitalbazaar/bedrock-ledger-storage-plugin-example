/*!
 * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const {ledgerAgent} = require('../ledger');
const {util: {uuid}} = require('bedrock');

describe('ledger storage plugin API', () => {
  it('is fully operational', async () => {
    should.exist(ledgerAgent.ledgerNode.storage.operations.plugins);
    const {plugins} = ledgerAgent.ledgerNode.storage.operations;
    plugins.should.be.an('object');
    plugins.should.have.property('example-storage-plugin');
    plugins['example-storage-plugin'].should.be.an('object');
    Object.keys(plugins['example-storage-plugin'])
      .should.have.same.members(['exampleQuery']);
    plugins['example-storage-plugin'].exampleQuery.should.be.a('function');
    const {exampleQuery} = plugins['example-storage-plugin'];

    const recordId = `urn:uuid:${uuid()}`;
    let error;
    let result;
    try {
      result = await exampleQuery({recordId});
    } catch(e) {
      error = e;
    }

    // a NotFoundError is expected since there are no records in the newly
    // created ledger
    should.not.exist(result);
    should.exist(error);
    error.name.should.equal('NotFoundError');

    // the recordId passed to the exampleQuery API should be reflected in the
    // error message
    error.details.recordId.should.equal(recordId);
  });
});

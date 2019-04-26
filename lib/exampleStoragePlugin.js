/*!
 * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

module.exports = {
  type: 'ledgerStoragePlugin',
  api: {
    expandIndexes: async ({createIndexes, collections}) => {
      // TODO: add indexes in support of expected queries
      await createIndexes([{
        collection: collections.operationCollection,
        fields: {'operation.record.type': 1},
        options: {unique: false, background: false, name: 'danubeIndex1'}
      }]);
    },
    storage: {
      // this property corresponds to the collection that should be extended
      // with the plugin API, other possibilities: events, blocks
      operations: {
        /* eslint-disable max-len */

        // NOTE: do not use arrow functions here because this function is to be
        // bound to the class instance. This method is bound to an instance
        // of the LedgerOperationStorage class. See the class definition for
        // available properties and methods.
        // https://github.com/digitalbazaar/bedrock-ledger-storage-mongodb/blob/master/lib/LedgerOperationStorage.js#L20

        /* eslint-enable */
        exampleQuery: async function({recordId}) {
          const {
            // NOTE: `collection` is the operations collection
            collection,
            util: {assert, dbHash, BedrockError}
          } = this;

          assert.string(recordId, 'recordId');

          const result = await collection.find({
            recordId: dbHash(recordId),
          }).toArray();

          if(result.length === 0) {
            throw new BedrockError(
              'Not Found.', 'NotFoundError',
              {httpStatusCode: 404, public: true, recordId});
          }
          return result;
        }
      }
    }
  }
};

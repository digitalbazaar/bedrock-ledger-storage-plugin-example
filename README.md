# bedrock-ledger-storage-plugin-example

[bedrock-ledger-storage-mongodb](https://github.com/digitalbazaar/bedrock-ledger-storage-mongodb/)
provides a core set of APIs for interacting with Bedrock ledgers.
Additional APIs may be defined through the use of storage plugins.
This module provides a template for such a plugin. A single plugin may define
multiple APIs and/or multiple plugins may be utilized.

## System Requirements
- Linux / macOS
- Node 10+ and a proper C/C++ compiler [toolchain](https://github.com/nodejs/node-gyp#on-unix)
    for building native dependencies.
- Redis 3+
- MongoDB 3.6+

## Run the Tests
```sh
# clone the repo
git clone https://github.com/digitalbazaar/bedrock-ledger-storage-plugin-example.git

# install dev dependencies
cd bedrock-ledger-storage-plugin-example
npm install

# install the test suite
cd test
npm install

# run the tests
npm test
```

## Add the Storage Plugin to a Bedrock Ledger
This code is extracted from the [test suite](./test/ledger.js). A `storage`
parameter is passed to the ledger agent `add` API. The string
`example-storage-plugin` corresponds to the name the plugin provided when
it registered itself via the `brLedgerNode.use` API
[as shown here](./lib/index.js). Whenever an instance of this ledger agent
is acquired through the bedrock-ledger-agent `add` or `get` APIs, the plugin
will be surfaced via the instance as shown below.

```js
// require the plugin which will self-register
require('bedrock-ledger-storage-plugin-example');

// when the ledger is initialized
const ledgerConfiguration = {
  '@context': constants.WEB_LEDGER_CONTEXT_V1_URL,
  type: 'WebLedgerConfiguration',
  ledger: '46c9382e-411f-4118-a8bb-830bacb747bc',
  consensusMethod: 'Continuity2017',
  electorSelectionMethod: {
    type: 'MostRecentParticipants',
  },
  sequence: 0,
};

const options = {
  ledgerConfiguration,
  genesis: true,
  public: true,
  owner: ledgerOwner.identity.id,
  storage: {
    plugin: 'mongodb',
    // specify one or more plugins here
    storagePlugins: ['example-storage-plugin'],
  }
};

const addAgent = promisify(brLedgerAgent.add);
const ledgerAgent = await addAgent(ledgerOwner.identity, null, options);

// get a handle for the `exampleQuery` function
const {exampleQuery} = ledgerAgent.ledgerNode.storage.operations
  .plugins['example-storage-plugin'];

// use the API
const result = await exampleQuery({
  recordId: 'urn:uuid:27a03583-b728-4ad0-9553-d303233b8611'
});  
```

## Use in Conjunction with Ledger Agent Plugins
[Ledger agent plugins](https://github.com/digitalbazaar/bedrock-ledger-agent-plugin-example)
are provided a ledger agent instance via `req.ledgerAgent` as
[shown here](https://github.com/digitalbazaar/bedrock-ledger-agent-plugin-example/blob/master/lib/exampleQueryService.js#L35).
Storage plugins may be accessed using the same technique demonstrated in the
example above.

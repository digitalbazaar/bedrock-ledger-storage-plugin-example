/*!
 * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const bedrock = require('bedrock');
require('bedrock-ledger-storage-plugin-example');

require('./ledger');

require('bedrock-test');
bedrock.start();

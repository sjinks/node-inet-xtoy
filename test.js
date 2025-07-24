const { describe, it } = require('node:test');
const { doesNotThrow, equal, notEqual, throws } = require('node:assert/strict')
const addon = require('./');

describe('Addon', function () {
  it('should export inet_ntop() and inet_ntop() symbols', function () {
    notEqual(addon.inet_ntop, undefined);
    notEqual(addon.inet_pton, undefined);
  });
});

describe('inet_pton', function () {
  it('should throw an Error on invalid arguments', function () {
    throws(() => { addon.inet_pton(); });
    throws(() => { addon.inet_pton(null); });
    throws(() => { addon.inet_pton(1, 2); });
  });

  it('should not throw an Error on string arguments', function (done) {
    doesNotThrow(() => { addon.inet_pton(''); });
    doesNotThrow(() => { addon.inet_pton('127.0.0.0.1'); });
    doesNotThrow(() => { addon.inet_pton('256.0.0.0'); });
  });

  it('should return null for invalid string arguments', function () {
    equal(addon.inet_pton(''), null);
    equal(addon.inet_pton('127.0.0.0.1'), null);
    equal(addon.inet_pton('256.0.0.0'), null);
  });

  it('should process IPv4 addresses', function () {
    equal(addon.inet_pton('127.0.0.1').toString('hex'), '7f000001');
    equal(addon.inet_pton('1.2.3.4').toString('hex'), '01020304');
  });

  it('should process IPv6 addresses', function () {
    equal(addon.inet_pton('::1').toString('hex'), '00000000000000000000000000000001');
    equal(addon.inet_pton('1::f').toString('hex'), '0001000000000000000000000000000f');
  });
});

describe('inet_ntop', function () {
  it('should throw an Error on invalid arguments', function () {
    throws(() => { addon.inet_ntop(); });
    throws(() => { addon.inet_ntop(null); });
    throws(() => { addon.inet_ntop(1, 2); });
    throws(() => { addon.inet_ntop('AAAAA'); });
    throws(() => { addon.inet_ntop('AAAAAAAABBBBBBBBC'); });
  });

  it('should not throw an Error on proper Buffers or Strings', function () {
    doesNotThrow(() => { addon.inet_ntop('AAAA'); });
    doesNotThrow(() => { addon.inet_ntop('AAAAAAAABBBBBBBB'); });
    doesNotThrow(() => { addon.inet_ntop(Buffer.from([127, 0, 0, 1])); });
    doesNotThrow(() => { addon.inet_ntop(Buffer.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1])); });
  });

  it('should process 4 byte strings', function () {
    equal(addon.inet_ntop('AAAA'), '65.65.65.65');
  });

  it('should process 16 byte strings', function () {
    equal(addon.inet_ntop('AAAAAAAABBBBBBBB'), '4141:4141:4141:4141:4242:4242:4242:4242');
  });

  it('should process 16 byte strings', function () {
    equal(addon.inet_ntop('AAAAAAAABBBBBBBB'), '4141:4141:4141:4141:4242:4242:4242:4242');
  });

  it('should process 4 byte buffers', function () {
    equal(addon.inet_ntop(Buffer.from([65, 65, 65, 65])), '65.65.65.65');
  });

  it('should process 16 byte buffers', function () {
    equal(addon.inet_ntop(Buffer.from([0x41, 0x41, 0x41, 0x41, 0x41, 0x41, 0x41, 0x41, 0x42, 0x42, 0x42, 0x42, 0x42, 0x42, 0x42, 0x42])), '4141:4141:4141:4141:4242:4242:4242:4242');
  });
});

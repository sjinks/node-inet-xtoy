const addon  = require('./');
const should = require('should');

describe('Addon', function() {
	it('should export inet_ntop() and inet_ntop() symbols', function(done) {
		should.exist(addon.inet_ntop);
		should.exist(addon.inet_pton);
		done();
	});
});

describe('inet_pton', function() {
	it('should throw an Error on invalid arguments', function(done) {
		(function() { addon.inet_pton(); }).should.throw();
		(function() { addon.inet_pton(null); }).should.throw();
		(function() { addon.inet_pton(1, 2); }).should.throw();
		done();
	});

	it('should not throw an Error on string arguments', function(done) {
		(function() { addon.inet_pton(""); }).should.not.throw();
		(function() { addon.inet_pton("127.0.0.0.1"); }).should.not.throw();
		(function() { addon.inet_pton("256.0.0.0"); }).should.not.throw();
		done();
	});

	it('should return null for invalid string arguments', function(done) {
		should(addon.inet_pton("")).equal(null);
		should(addon.inet_pton("127.0.0.0.1")).equal(null);
		should(addon.inet_pton("256.0.0.0")).equal(null);
		done();
	});

	it('should process IPv4 addresses', function(done) {
		should.equal(addon.inet_pton('127.0.0.1').toString('hex'), '7f000001');
		should.equal(addon.inet_pton('1.2.3.4').toString('hex'), '01020304');
		done();
	});

	it('should process IPv6 addresses', function(done) {
		should.equal(addon.inet_pton('::1').toString('hex'),  '00000000000000000000000000000001');
		should.equal(addon.inet_pton('1::f').toString('hex'), '0001000000000000000000000000000f');
		done();
	});
});

describe('inet_ntop', function() {
	it('should throw an Error on invalid arguments', function(done) {
		(function() { addon.inet_ntop(); }).should.throw();
		(function() { addon.inet_notp(null); }).should.throw();
		(function() { addon.inet_ntop(1, 2); }).should.throw();
		(function() { addon.inet_ntop("AAAAA"); }).should.throw();
		(function() { addon.inet_ntop("AAAAAAAABBBBBBBBC"); }).should.throw();
		done();
	});

	it('should not throw an Error on proper Buffers or Strings', function(done) {
		(function() { addon.inet_ntop("AAAA"); }).should.not.throw();
		(function() { addon.inet_ntop("AAAAAAAABBBBBBBB"); }).should.not.throw();
		(function() { addon.inet_ntop(Buffer.from([127, 0, 0, 1])); }).should.not.throw();
		(function() { addon.inet_ntop(Buffer.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1])); }).should.not.throw();
		done();
	});

	it('should process 4 byte strings', function(done) {
		should.equal(addon.inet_ntop('AAAA'), '65.65.65.65');
		done();
	});

	it('should process 16 byte strings', function(done) {
		should.equal(addon.inet_ntop('AAAAAAAABBBBBBBB'), '4141:4141:4141:4141:4242:4242:4242:4242');
		done();
	});

	it('should process 4 byte buffers', function(done) {
		should.equal(addon.inet_ntop(Buffer.from([65, 65, 65, 65])), '65.65.65.65');
		done();
	});

	it('should process 16 byte buffers', function(done) {
		should.equal(addon.inet_ntop(Buffer.from([0x41, 0x41, 0x41, 0x41, 0x41, 0x41, 0x41, 0x41, 0x42, 0x42, 0x42, 0x42, 0x42, 0x42, 0x42, 0x42])), '4141:4141:4141:4141:4242:4242:4242:4242');
		done();
	});
});

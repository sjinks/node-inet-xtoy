# node-inet-xtoy

[![Build Status](https://travis-ci.com/sjinks/node-inet-xtoy.svg?branch=master)](https://travis-ci.com/sjinks/node-inet-xtoy)

inet_ntop() and inet_pton() bindings for Node.js

# Installation

```sh
npm install inet_xtoy
```

# Example

```js
const { inet_ntop, inet_pton } = require('inet_xtoy');

console.log(inet_pton('127.0.0.1'));
console.log(inet_pton('::1'));
console.log(inet_ntop(inet_pton('127.0.0.1')));
console.log(inet_ntop(inet_pton('::1')));
```

# API

**inet_ntop(buf)** converts an IPv4 or IPv6 address `buf` from binary to text form.

`buf` is expected to be a 4 (IPv4) or 16 (IPv6) bytes long String or Buffer.

Returns the IP address as a string or throws an Error in case the call to [`inet_ntop(3)`](http://man7.org/linux/man-pages/man3/inet_ntop.3.html) fails.

Throws `TypeError` when the number of arguments is not 1, or when `buf` is neither String nor Buffer, or when the length of `buf` si neither 4 nor 16.

**inet_pton(ip)** converts an IPv4 or IPv6 address `buf` from text to binary form.

`ip` is expected to be a string. If `ip` is not a valid IP address, the function returns `null`.

Returns `Buffer` with binary form of the given `ip`, the length of the buffer is either 4 or 16 bytes.

Throws `TypeError` when the number of arguments is not 1, or when `ip` is not a string.

Throws `Error` when a call to [`inet_pton(3)`](http://man7.org/linux/man-pages/man3/inet_pton.3.html) fails.

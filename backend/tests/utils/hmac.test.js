const { generateHmac, verifyHmac } = require('../../src/utils/hmac');

describe('hmac utils', () => {
  it('should generate a valid HMAC', () => {
    const secret = 'mysecret';
    const data = 'somedata';
    const hmac = generateHmac(secret, data);

    expect(typeof hmac).toBe('string');
    expect(hmac.length).toBeGreaterThan(0);
  });

  it('should verify a valid HMAC', () => {
    const secret = 'mysecret';
    const data = 'somedata';
    const hmac = generateHmac(secret, data);

    expect(verifyHmac(secret, data, hmac)).toBe(true);
  });
});

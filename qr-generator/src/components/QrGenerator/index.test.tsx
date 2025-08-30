import { generateWifi, generateVCard, generateEmail, generateSms } from './utils';

describe('QR generator utils', () => {
  test('generateWifi formats WPA correctly', () => {
    const val = generateWifi({ ssid: 'MyNet', password: 'pass', encryption: 'WPA', hidden: false });
    expect(val).toContain('WIFI:T:WPA');
    expect(val).toContain('S:MyNet');
    expect(val).toContain('P:pass');
  });

  test('generateWifi with nopass omits password', () => {
    const val = generateWifi({ ssid: 'Open', password: '', encryption: 'nopass', hidden: false });
    expect(val).toContain('WIFI:T:;');
    expect(val).not.toContain('P:');
  });

  test('generateVCard builds vCard text', () => {
    const val = generateVCard({
      name: 'John Doe',
      organisation: 'ACME',
      title: 'CEO',
      phone: '123',
      email: 'john@example.com',
      website: 'https://example.com',
    });
    expect(val).toContain('BEGIN:VCARD');
    expect(val).toContain('FN:John Doe');
    expect(val).toContain('ORG:ACME');
    expect(val).toContain('TEL;TYPE=CELL:123');
    expect(val).toContain('END:VCARD');
  });

  test('generateEmail constructs mailto URI', () => {
    const val = generateEmail({ email: 'user@example.com', subject: 'Hello', body: 'World' });
    expect(val).toBe('mailto:user@example.com?subject=Hello&body=World');
  });

  test('generateSms constructs SMSTO URI', () => {
    const val = generateSms({ number: '1234567890', message: 'Hi' });
    expect(val).toBe('SMSTO:1234567890:Hi');
  });
});
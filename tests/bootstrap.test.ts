import Bootstrap from '../src/bootstrap';
import { assert, expect } from 'chai';

describe('We shall create a URL from environment', () => {
  it('We need a Bootstrap class', () => {
    assert.exists(Bootstrap);
  });

  it('We need to create the URL', () => {
    const serverUrl = Bootstrap.init();
    expect(serverUrl).to.satisfy(url => {
      return url.includes('http://') || url.includes('https://');
    });
  });
});

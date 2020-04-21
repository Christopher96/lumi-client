import { assert } from 'chai';
import Bootstrap from '../src/bootstrap';

describe('We shall be able to do something!', () => {
  it('Should be able to get bootstrap from the index file', () => {
    assert.exists(Bootstrap);
  });
});

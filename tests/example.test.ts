import { Bootstrap } from '../src/index';
import { assert } from 'chai';

describe('We shall be able to do something!', () => {
  it('Should be able to get bootstrap from the index file', () => {
    assert.exists(Bootstrap);
  });
});

//michael skriver test-text

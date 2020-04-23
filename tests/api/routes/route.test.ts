import { expect } from 'chai';
import { Route } from '../../../src/api/routes/route';
describe('We should be able to use the functionality of the route', () => {
  it('Should be able to parse a simple version command to url', () => {
    const command = 'version';
    const expectedUrl = 'version';
    const url = Route.getUrlFromCommands(command);

    expect(url).to.equals(expectedUrl);
  });

  it('Should be able to parse a command with params to url ', () => {
    const command = 'version --local';
    const expectedUrl = 'version?local=true';
    const url = Route.getUrlFromCommands(command);

    expect(url).to.equals(expectedUrl);
  });

  it('Should be able to parse a command with args to url ', () => {
    const command = 'echo test --reverse --repeat 5';
    const expectedUrl = 'echo/test?reverse=true&repeat=5';
    const url = Route.getUrlFromCommands(command);

    expect(url).to.equals(expectedUrl);
  });
});

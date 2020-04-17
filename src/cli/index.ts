import { InteractiveCLI } from './interactive';

export class CLI {
  constructor(private server: SocketIOClient.Socket) {
    // TODO Create a CLI with options instead of interactive

    // --interactive
    new InteractiveCLI(server);
  }
}

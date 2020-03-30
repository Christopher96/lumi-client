// Specification of socket payloads
export interface User {
  id: string;
}

export interface Message {
  fromUser: User;
  targetUser: User;
  message: string;
}

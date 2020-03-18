import { Request, ParamsDictionary } from 'express-serve-static-core';
import { Response } from 'express';

// Here we have a callback which is called
// when a users hits the end point configured
// at the top of the server see /src/index.boostrap
export const callback = (req: Request<ParamsDictionary, any, any>, res: Response<any>) => {
  // We can send information to the user.
  // If no status is specified 200 is used but we can send
  // any status code we wish
  res.status(200).send('👏 Hello world! 👏');
};

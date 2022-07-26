import { Logger } from 'utils';
import { Request, Response } from 'express';

// make express callback function
function makeExpressCallback(controller: any) {
  return function (req: Request, res: Response) {
    const result = controller(req, res);
    if (result instanceof Promise) {
      result
        .then(() => {
          res.send();
        })
        .catch((err) => {
          Logger.error(err);
          res.status(500).send(err);
        });
    } else {
      res.send();
    }
  };
}

export default makeExpressCallback;

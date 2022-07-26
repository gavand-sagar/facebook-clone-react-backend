import '../db';

import { User } from '../models';

User.find({})
  .then((users) => {
    console.log(users);
  })
  .catch((err) => {
    console.log(err);
  });

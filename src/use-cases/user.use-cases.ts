import { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from '../models';
import { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRES_IN, PUBLIC_DIR } from '../config';
import { UploadedFile } from 'express-fileupload';
import { Logger } from '../utils';

const authenticate = async (req: Request, res: Response) => {
  const body = req.body;

  try {
    const user = await User.findOne({ email: body.email });
    if (user) {
      let response;
      user.comparePassword(body.password, (_err: any, isMatch: boolean) => {
        if (_err) throw _err;
        if (isMatch) {
          const payload: JwtPayload['user'] = {
            _id: user._id + '',
            name: user.name,
            email: user.email,
            avatar: user.avatar
          };
          console.log({ payload });

          const token = jwt.sign(
            {
              user: payload
            },
            ACCESS_TOKEN_SECRET as string,
            { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
          );
          Logger.log(`User ${user.name} logged in`);

          response = res.status(200).json({
            success: true,
            token
          });
        } else {
          response = res.status(401).json({
            message: 'Invalid password'
          });
        }
      });
      return response;
    }

    return res.status(400).json({
      message: 'Invalid email or password'
    });
  } catch (error: any) {
    Logger.error(error);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

const register = async (req: Request, res: Response) => {
  const body = req.body;
  const files = req.files;
  try {
    //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
    //Use the mv() method to place the file in upload directory (i.e. "uploads")
    let avatar = files?.avatar as UploadedFile;
    const fileName = `${Date.now()}-${avatar?.name}`;
    if (avatar) {
      body.avatar = '/uploads/avatars/' + fileName;
    } else {
      body.avatar = null;
    }
    const user = new User({
      name: body.name,
      email: body.email,
      password: body.password,
      avatar: body.avatar
    });
    await user.save();
    // then move the file to the uploads folder
    if (avatar) {
      avatar.mv(PUBLIC_DIR + '/uploads/avatars/' + fileName);
    }
    Logger.log(`User ${user.name} registered`);
    return res.status(200).json({
      success: true,
      message: `User ${body.email} created`
    });
  } catch (error: any) {
    if (error.message.includes('E11000')) {
      return res.status(400).json({
        message: `User with email ${body.email} already exists`
      });
    }
    return res.status(400).json({
      message: error.message
    });
  }
};

const refresh = async (req: Request, res: Response) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      message: 'No token provided'
    });
  }
  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;
    Logger.log(`User ${decoded.user.name} refreshed token`);
    const userId = decoded.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({
        message: 'User not found from token'
      });
    }
    const _token = jwt.sign(
      {
        user: {
          userId: user._id + '',
          name: user.name
        }
      },
      ACCESS_TOKEN_SECRET as string,
      {
        expiresIn: ACCESS_TOKEN_EXPIRES_IN
      }
    );
    return res.status(200).json({
      success: true,
      token: _token
    });
  } catch (error: any) {
    Logger.error(error);
    return res.status(500).json({
      message: error.message
    });
  }
};

const logout = (req: Request, res: Response) => {
  // remove token from cookies if it exists and from jwt
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(200).json({
        success: true,
        message: 'No token provided or token expired so just logged out from the app'
      });
    }
    // clean cookie token from browser
    res.clearCookie('token');
  } catch (error: any) {
    Logger.error(error);
    return res.status(500).json({
      message: error.message
    });
  }
  return res.status(200).json({
    message: 'Logout successful'
  });
};

export default {
  authenticate,
  register,
  refresh,
  logout
};

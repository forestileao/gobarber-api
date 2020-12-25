import { request, response, Router } from 'express';
import multer from 'multer';
import User from '../models/User';
import uploadConfig from '../config/upload';

import CreateUserService from '../services/CreateUserService';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const usersRouter = Router();
const upload = multer(uploadConfig);

interface ResponseUser {
  name: string;
  email: string;
  password?: string;
}

usersRouter.post('/', async (request, response) => {
  try {
    const { name, email, password } = request.body;

    const createUser = new CreateUserService();

    const user = await createUser.execute({
      name,
      email,
      password,
    });

    const responseUser: ResponseUser = user;
    delete responseUser.password;

    return response.json(responseUser);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (request, response) => {
    try {
      const updateUserAvatar = new UpdateUserAvatarService();

      const { password, ...userResponse } = await updateUserAvatar.execute({
        userId: request.user.id,
        avatarFileName: request.file.filename,
      });

      return response.json(userResponse);
    } catch (err) {
      return response.json({ error: err.message });
    }
  },
);

export default usersRouter;

import { Router } from 'express';
import multer from 'multer';
import CreateUserService from '@modules/users/services/CreateUserService';
import uploadConfig from '@config/upload';

import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const usersRouter = Router();
const upload = multer(uploadConfig);

interface ResponseUser {
  name: string;
  email: string;
  password?: string;
}

usersRouter.post('/', async (request, response) => {
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
});

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (request, response) => {
    const updateUserAvatar = new UpdateUserAvatarService();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userResponse } = await updateUserAvatar.execute({
      userId: request.user.id,
      avatarFileName: request.file.filename,
    });

    return response.json(userResponse);
  },
);

export default usersRouter;

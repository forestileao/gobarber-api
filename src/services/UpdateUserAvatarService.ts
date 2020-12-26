import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';

import AppError from '../errors/AppError';

import User from '../models/User';
import uploadConfig from '../config/upload';

interface Request {
  userId: string;
  avatarFileName: string;
}

class UpdateUserAvatarService {
  public async execute({ userId, avatarFileName }: Request): Promise<User> {
    const usersRespository = getRepository(User);

    const user = await usersRespository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new AppError('Only authenticated users can change avatar.', 401);
    }

    if (user.avatar) {
      // Delete avatar
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      try {
        const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);
        if (userAvatarFileExists) {
          await fs.promises.unlink(userAvatarFilePath);
        }
      } catch (error) {
        this.stopError();
      }
    }

    user.avatar = avatarFileName;
    await usersRespository.save(user);

    return user;
  }

  private stopError(): boolean {
    return true;
  }
}

export default UpdateUserAvatarService;

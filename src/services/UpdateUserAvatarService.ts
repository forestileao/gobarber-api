import { getRepository, Timestamp } from 'typeorm';
import path from 'path';
import fs from 'fs';

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
      throw new Error('Only authenticated users can change avatar.');
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
        console.log(`[User]: ${user.avatar} does not exists.`);
      }
    }

    user.avatar = avatarFileName;
    await usersRespository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;

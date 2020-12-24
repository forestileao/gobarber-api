import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';

import User from '../models/User';

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
}

class AuthenticateUserService {
  public async execute({ email, password }: Request): Promise<Response> {
    const userRepository = getRepository(User);

    const user = await userRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw Error('Incorret email/password combination.');
    }

    const passwordMatched = await compare(password, user.password);
    if (!passwordMatched) {
      throw Error('Incorret email/password combination.');
    }

    // User athenticated
    return {
      user,
    };
  }
}

export default AuthenticateUserService;

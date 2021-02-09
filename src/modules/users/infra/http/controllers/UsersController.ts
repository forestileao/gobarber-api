import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateUserService from '@modules/users/services/CreateUserService';

interface IResponseUser {
  name: string;
  email: string;
  password?: string;
}

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;

    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute({
      name,
      email,
      password,
    });

    const responseUser: IResponseUser = user;
    delete responseUser.password;

    return response.json(responseUser);
  }
}

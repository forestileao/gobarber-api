import { Router } from 'express';

import SessionsControllers from '../controllers/SessionsController';

const sessionsRouter = Router();
const sessionsController = new SessionsControllers();

sessionsRouter.post('/', sessionsController.create);

export default sessionsRouter;

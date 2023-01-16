import { Router } from 'express'
import { MainPage } from './controllers/index.control';

const router = Router();

router.get('^/$|index(.html)?', MainPage);

export default router;
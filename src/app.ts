import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();
app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use('/api', routes);
app.get('/health', (_req, res) => res.json({ ok: true }));
app.use(errorHandler);
export default app;

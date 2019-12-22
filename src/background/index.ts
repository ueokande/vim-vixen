import 'reflect-metadata';
import { container } from 'tsyringe';
import Application from './Application';

const app = container.resolve(Application);
app.run();

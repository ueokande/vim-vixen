import 'reflect-metadata';
import { container } from 'tsyringe';
import Application from './Application';

let app = container.resolve(Application);
app.run();

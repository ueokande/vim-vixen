import "reflect-metadata";
import { container } from "tsyringe";
import Application from "./Application";
import "./di";

const app = container.resolve(Application);
app.run();

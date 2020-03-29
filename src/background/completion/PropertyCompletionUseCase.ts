import { injectable } from "tsyringe";
import Properties from "../../shared/settings/Properties";

type Property = {
  name: string;
  type: 'string' | 'boolean' | 'number';
}
@injectable()
export default class PropertyCompletionUseCase {
  async getProperties(): Promise<Property[]> {
    return Properties.defs().map(def => ({
      name: def.name,
      type: def.type,
    }));
  }
}
/* eslint-disable max-len */

import { LocalSettingRepository, SyncSettingRepository } from "./repositories/SettingRepository";
import { NotifierImpl } from "./presenters/Notifier";
import { CachedSettingRepositoryImpl } from "./repositories/CachedSettingRepository";
import { container } from 'tsyringe';

container.register('LocalSettingRepository', { useValue: LocalSettingRepository });
container.register('SyncSettingRepository', { useClass: SyncSettingRepository });
container.register('CachedSettingRepository', { useClass: CachedSettingRepositoryImpl });
container.register('Notifier', { useClass: NotifierImpl });

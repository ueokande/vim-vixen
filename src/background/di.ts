/* eslint-disable max-len */

import { LocalSettingRepository, SyncSettingRepository } from "./repositories/SettingRepository";
import { NotifierImpl } from "./presenters/Notifier";
import { CachedSettingRepositoryImpl } from "./repositories/CachedSettingRepository";
import { container } from 'tsyringe';
import HistoryRepositoryImpl from "./completion/impl/HistoryRepositoryImpl";
import BookmarkRepositoryImpl from "./completion/impl/BookmarkRepositoryImpl";

container.register('LocalSettingRepository', { useValue: LocalSettingRepository });
container.register('SyncSettingRepository', { useClass: SyncSettingRepository });
container.register('CachedSettingRepository', { useClass: CachedSettingRepositoryImpl });
container.register('Notifier', { useClass: NotifierImpl });
container.register('HistoryRepository', { useClass: HistoryRepositoryImpl });
container.register('BookmarkRepository', { useClass: BookmarkRepositoryImpl });

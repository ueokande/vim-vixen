/* eslint-disable max-len */

import { AddonEnabledRepositoryImpl } from "./repositories/AddonEnabledRepository";
import { AddonIndicatorClientImpl } from "./client/AddonIndicatorClient";
import { AddressRepositoryImpl } from "./repositories/AddressRepository";
import { ClipboardRepositoryImpl } from "./repositories/ClipboardRepository";
import { ConsoleClientImpl } from "./client/ConsoleClient";
import { ConsoleFramePresenterImpl } from "./presenters/ConsoleFramePresenter";
import { FindClientImpl } from "./client/FindClient";
import { FindMasterClientImpl } from "./client/FindMasterClient";
import { FindPresenterImpl } from "./presenters/FindPresenter";
import { FindRepositoryImpl } from "./repositories/FindRepository";
import { FocusPresenterImpl } from "./presenters/FocusPresenter";
import { FollowKeyRepositoryImpl } from "./repositories/FollowKeyRepository";
import { FollowMasterClientImpl } from "./client/FollowMasterClient";
import { FollowMasterRepositoryImpl } from "./repositories/FollowMasterRepository";
import { FollowPresenterImpl } from "./presenters/FollowPresenter";
import { FollowSlaveClientFactoryImpl } from "./client/FollowSlaveClientFactory";
import { FollowSlaveRepositoryImpl } from "./repositories/FollowSlaveRepository";
import { HintKeyRepositoryImpl } from "./repositories/HintKeyRepository";
import { KeymapRepositoryImpl } from "./repositories/KeymapRepository";
import { MarkClientImpl } from "./client/MarkClient";
import { MarkKeyRepositoryImpl } from "./repositories/MarkKeyRepository";
import { MarkRepositoryImpl } from "./repositories/MarkRepository";
import { NavigationPresenterImpl } from "./presenters/NavigationPresenter";
import { OperationClientImpl } from "./client/OperationClient";
import { ScrollPresenterImpl } from "./presenters/ScrollPresenter";
import { SettingClientImpl } from "./client/SettingClient";
import { SettingRepositoryImpl } from "./repositories/SettingRepository";
import { TabsClientImpl } from "./client/TabsClient";
import { container } from "tsyringe";

container.register("FollowMasterClient", {
  useValue: new FollowMasterClientImpl(window.top),
});
container.register("AddonEnabledRepository", {
  useClass: AddonEnabledRepositoryImpl,
});
container.register("AddonIndicatorClient", {
  useClass: AddonIndicatorClientImpl,
});
container.register("AddressRepository", { useClass: AddressRepositoryImpl });
container.register("ClipboardRepository", {
  useClass: ClipboardRepositoryImpl,
});
container.register("ConsoleClient", { useClass: ConsoleClientImpl });
container.register("ConsoleFramePresenter", {
  useClass: ConsoleFramePresenterImpl,
});
container.register("FindClient", { useClass: FindClientImpl });
container.register("FindMasterClient", { useClass: FindMasterClientImpl });
container.register("FindPresenter", { useClass: FindPresenterImpl });
container.register("FindRepository", { useClass: FindRepositoryImpl });
container.register("FocusPresenter", { useClass: FocusPresenterImpl });
container.register("FollowKeyRepository", {
  useClass: FollowKeyRepositoryImpl,
});
container.register("FollowMasterRepository", {
  useClass: FollowMasterRepositoryImpl,
});
container.register("FollowPresenter", { useClass: FollowPresenterImpl });
container.register("FollowSlaveClientFactory", {
  useClass: FollowSlaveClientFactoryImpl,
});
container.register("FollowSlaveRepository", {
  useClass: FollowSlaveRepositoryImpl,
});
container.register("HintKeyRepository", {
  useClass: HintKeyRepositoryImpl,
});
container.register("KeymapRepository", { useClass: KeymapRepositoryImpl });
container.register("MarkClient", { useClass: MarkClientImpl });
container.register("MarkKeyRepository", { useClass: MarkKeyRepositoryImpl });
container.register("MarkRepository", { useClass: MarkRepositoryImpl });
container.register("NavigationPresenter", {
  useClass: NavigationPresenterImpl,
});
container.register("OperationClient", { useClass: OperationClientImpl });
container.register("ScrollPresenter", { useClass: ScrollPresenterImpl });
container.register("SettingClient", { useClass: SettingClientImpl });
container.register("SettingRepository", { useClass: SettingRepositoryImpl });
container.register("TabsClient", { useClass: TabsClientImpl });

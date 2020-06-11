import { injectable, inject } from "tsyringe";
import ConsoleClient from "../client/ConsoleClient";

@injectable()
export default class AddonSendmessageUseCase {
    constructor(
        @inject("ConsoleClient") private consoleClient: ConsoleClient
    ) {}

    async sendMessage(extensionId: string, message: any) {
        const sending = browser.runtime.sendMessage(extensionId, message);
        sending.catch((reason: any) => {
            this.consoleClient.error(`Error on sending message to ${extensionId}: ${reason}`);
        });
        return sending;
    }
}

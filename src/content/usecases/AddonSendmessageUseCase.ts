import { injectable} from "tsyringe";


@injectable()
export default class AddonSendmessageUseCase {
    constructor() { }

    async sendMessage(extensionId: string, message: any) {
        const sending = browser.runtime.sendMessage(extensionId, message);
        sending.catch((reason: any) => {
            throw new Error(reason);
        });
        return sending;
    }
}
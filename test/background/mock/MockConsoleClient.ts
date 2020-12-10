import ConsoleClient from "../../../src/background/infrastructures/ConsoleClient";

export default class MockConsoleClient implements ConsoleClient {
  hide(_tabId: number): Promise<any> {
    throw new Error("not implemented");
  }

  showCommand(_tabId: number, _command: string): Promise<any> {
    throw new Error("not implemented");
  }

  showError(_tabId: number, _message: string): Promise<any> {
    throw new Error("not implemented");
  }

  showFind(_tabId: number): Promise<any> {
    throw new Error("not implemented");
  }

  showInfo(_tabId: number, _message: string): Promise<any> {
    throw new Error("not implemented");
  }
}

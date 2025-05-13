declare const contextBridge: any, ipcRenderer: any;
declare const isDev: boolean;
interface ElectronAPI {
    messageBus: {
        send: (channel: string, message: any) => Promise<any>;
        on: (channel: string, callback: (response: any) => void) => () => void;
    };
    isDev: boolean;
}

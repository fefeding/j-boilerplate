// declare let window: Window & typeof globalThis;
declare let EASY_ENV_IS_NODE: boolean;

interface Window {
    __INITIAL_STATE__: {
        config: {
            prefix?: string;
            adapter?: string;
            title?: string;
        };
        jvCommon: any;
        loginUser: Record<string, any>;
        env: 'development' | 'test' | 'local' | 'prod';
    };
    oo: any;
}

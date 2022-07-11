import { Application } from 'egg';

export default (app: Application) => {
    const { controller, router } = app;

    // 测试下commit
    router.get('/*', controller.home.index);
};

import * as path from 'path';
export default () => {
    return {
        view: {
            //默认view目录,本地开发目录必须在web下的，正式环境则是根目录下的view，因为web目录会被删
            rootDir: {
                default: path.join(__dirname, '../../web/view'),
            },
        },
    };
};

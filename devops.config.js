/**
 * 发布部署相关配置
 */
module.exports = {
    /**
     * 部署目录，与Nginx配置的域名相关
     * 例如： demo
     * 只有在正式环境才需要
     */
    // prefix: prefix
    prefix: process.env.NODE_ENV === 'development' ? '' : 'permission',
    title: '金腾统一权限管理',
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    'antd',
    '@ant-design',
    'rc-util',
    '@rc-component/util',
    'rc-pagination',
    'rc-picker',
    'rc-notification',
    'rc-tooltip',
    'rc-tree',
    'rc-table',
    // 如有用到其他 rc-xxx 也可一併加進來
  ],
};

module.exports = nextConfig; 
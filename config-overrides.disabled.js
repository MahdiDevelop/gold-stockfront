const TerserPlugin = require('terser-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');

module.exports = {
  webpack: function(config, env) {
    // اضافه کردن CircularDependencyPlugin به پلاگین‌های Webpack
    config.plugins.push(
      new CircularDependencyPlugin({
        exclude: /node_modules/, // نادیده گرفتن پوشه node_modules
        failOnError: true, // توقف در صورت وجود چرخه وابستگی
        allowAsyncCycles: false, // جلوگیری از چرخه‌های غیرهم‌زمان
        cwd: process.cwd(), // تنظیم پوشه اصلی پروژه
      })
    );

    // اضافه کردن TerserPlugin برای حذف console.log در تولید
    if (env === 'production') {
      config.optimization = {
        ...config.optimization, // حفظ تنظیمات قبلی
        minimizer: [
          new TerserPlugin({
            terserOptions: {
              compress: {
                drop_console: true, // حذف console.log
              },
            },
          }),
        ],
      };
    }

    return config;
  },
};

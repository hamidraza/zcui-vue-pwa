require('dotenv').config();

const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const ENV = process.env.NODE_ENV;
const isProd = ENV == 'production';
const pkgJson = require('./package.json');

const PUBLIC_PATH = process.env.PUBLIC_PATH + '/build/';

const webpackConfig = {
  mode: isProd ? 'production' : 'development',
  entry: {
    app    : '~/app',
    //lib    : [],
    vendor : ['vue', 'vuex', 'vue-router', 'vue-head'],
    //common : [],
  },
  output: {
    path: path.resolve(__dirname, 'public/build'),
    chunkFilename: '[name]-[chunkhash].chunk.js',
    filename: '[name]-bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        exclude: [/node_modules(?!\/\@zoomcarindia)/],
        loader: 'vue-loader',
      }, {
        test: /\.js$/,
        exclude: [/node_modules(?!\/\@zoomcarindia)/],
        use: 'babel-loader'
      }, {
        test: /\.(sa|sc|c)ss$/,
        exclude: [/node_modules(?!\/\@zoomcarindia)/],
        use: [
          isProd ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader?sourceMap',
          'postcss-loader?sourceMap',
          'sass-loader?sourceMap'
        ],
      }, {
        test: /\.(png|jpg|jpeg|gif|woff|woff2|eot|ttf|svg)$/,
        exclude: [/node_modules(?!\/\@zoomcarindia)/],
        use: 'file-loader'
      },
    ],
  },
  resolve: {
    alias:{
      '~': path.resolve(__dirname, 'src'),
      'vue$': `vue/dist/vue.runtime${isProd?'.min':''}.js`,
      'vue-router$': `vue-router/dist/vue-router${isProd?'.min':''}.js`,
      'vuex$': `vuex/dist/vuex${isProd?'.min':''}.js`,
    },
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': `"${ENV}"`
    }),
    new HtmlWebpackPlugin({
      template : './src/index.ejs',
      filename : isProd ? '../index.html': 'index.html',
      env      : process.env,
      pkg      : pkgJson,
      chunksSortMode(a, b) {
        const order = ['app', 'common', 'vendor', 'lib'];
        return order.indexOf(b.names[0]) - order.indexOf(a.names[0]);
      }
    }),
    new FriendlyErrorsWebpackPlugin(),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: isProd ? '[name].[contenthash].css' : '[name].css',
      chunkFilename: isProd ? '[id].[contenthash].css' : '[id].css',
    }),
  ],
  devtool: !isProd ? 'source-map' : false
};

/**
// WP Config for development environment
**/
if(!isProd) {
  webpackConfig.output.sourceMapFilename = '[file].map';
  //webpackConfig.output.publicPath = process.env.PUBLIC_PATH || '/';
  webpackConfig.output.publicPath = '/';
  webpackConfig.devServer = {
    host: '0.0.0.0',
    port: 9393,
    //https: true,
    inline: true,
    hot: true,
    contentBase: 'public',
    historyApiFallback: {
      index: 'index.html',
    },
    stats: {
      chunks: false
    }
  }
}


/**
// WP Config for production environment
**/
if(isProd) {
  webpackConfig.output.publicPath = PUBLIC_PATH;
}


webpackConfig.plugins.push(
  new SWPrecacheWebpackPlugin({
    cacheId: pkgJson.name,
    filepath: path.join(__dirname, '/public/sw.js'),
    maximumFileSizeToCacheInBytes: 4194304,
    minify: isProd,
    /*runtimeCaching: [{
      urlPattern: new RegExp('https://api.zoomcar.com/'),
      handler: 'networkFirst'
    }],*/
    staticFileGlobs: [
      './public/index.html',
      './public/{img,css,js,fav}/*.*',
      './public/build/*.*'
    ],
    stripPrefix: './public',
    navigateFallback: '/index.html'
  })
);


module.exports = webpackConfig;


require('dotenv').config();

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const PreloadWebpackPlugin = require('preload-webpack-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

const ENV = process.env.NODE_ENV;
const pkgJson = require('./package.json');

const webpackConfig = {
  entry: {
    app    : '~/app',
    //lib    : [],
    vendor : ['vue', 'vuex', 'vue-router', 'vue-head'],
    //common : [],
  },
  output: {
    path: path.resolve(__dirname, 'public/build'),
    publicPath: `${process.env.PUBLIC_PATH || ''}/build/`,
    chunkFilename: '[name]-[chunkhash].chunk.js',
    filename: '[name]-bundle.js',
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: [/node_modules/],
      use: 'babel-loader'
    }, {
      test: /\.vue$/,
      loader: 'vue-loader',
      options: {
        loaders: {
          scss: 'vue-style-loader!css-loader!sass-loader'
        }
      }
    }, {
      test: /\.(png|jpg|jpeg|gif|woff|woff2|eot|ttf|svg)$/,
      use: 'file-loader'
    }]
  },
  resolve: {
    alias:{
      '~': path.resolve(__dirname, 'src'),
      'vue$': 'vue/dist/vue.runtime.min.js',
      'vue-router$': 'vue-router/dist/vue-router.min.js',
      'vuex$': 'vuex/dist/vuex.min.js'
    }
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      names: [
        'app',
        //'common',
        'vendor',
        //'lib'
      ],
      filename: '[name]-[hash].bundle.js',
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': `"${ENV}"`
    }),
    new HtmlWebpackPlugin({
      template       : './src/index.ejs',
      filename       : ENV == 'production' ? '../index.html': 'index.html',
      env            : process.env,
      pkg            : pkgJson,
      chunksSortMode(a, b) {
        const order = ['app', 'common', 'vendor', 'lib'];
        return order.indexOf(b.names[0]) - order.indexOf(a.names[0]);
      }
    }),
    new PreloadWebpackPlugin({
      include: ['app', 'common', 'vendor', 'lib']
    }),
    new FriendlyErrorsWebpackPlugin()
  ],
  devtool: (ENV === 'development') ? 'source-map' : false
};

/**
// WP Config for development environment
**/
if(ENV == 'development') {
  webpackConfig.output.sourceMapFilename = '[file].map';
  //webpackConfig.output.publicPath = process.env.PUBLIC_PATH || '/';
  webpackConfig.output.publicPath = '/';
  webpackConfig.module.rules.push(...[{
    test: /\.(scss|css)$/,
    exclude: /node_modules/,
    use: ['style-loader', 'css-loader?sourceMap', 'sass-loader?sourceMap'],
  }])
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
if(ENV == 'production') {
  webpackConfig.output.publicPath = '/build/';
  webpackConfig.module.rules.push(...[{
    test: /\.scss$/,
    exclude: /node_modules/,
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: ['css-loader', 'sass-loader']
    })
  }]);
  webpackConfig.plugins.push(...[
    new ExtractTextPlugin('[name]-[hash].bundle.css')
  ])
}


webpackConfig.plugins.push(
  new SWPrecacheWebpackPlugin({
    cacheId: pkgJson.name,
    filepath: path.join(__dirname, '/public/sw.js'),
    maximumFileSizeToCacheInBytes: 4194304,
    minify: ENV == 'production',
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

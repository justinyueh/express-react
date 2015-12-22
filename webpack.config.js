var webpack = require('webpack');
var path = require('path');
var autoprefixer = require('autoprefixer');
var bower_dir = path.join(__dirname, 'bower_components');
var node_modules_dir = path.join(__dirname, 'node_modules');
var env = process.env.NODE_ENV || 'development';

var config = {
  addVendor: function (name, path) {
    this.resolve.alias[name] = path;
    this.module.noParse.push(path);
  },
  context: __dirname,
  entry: {
    app: env === 'production' ? ['./assets/main.js'] : ['webpack/hot/dev-server', './assets/main.js'],
    vendor: ["jquery", "react", "react-dom", "react-router", "normalize.css", "font-awesome.css", "createBrowserHistory"]
  },
  output: {
    publicPath: env === 'production' ? '/' : 'http://localhost:8080/',
    path: path.resolve(__dirname, env === 'production' ? './dist/' : './dist'),
    filename: env === 'production' ? "[name]-[chunkhash].js" : "[name].js",
    chunkFilename: env === 'production' ? "[name]-[chunkhash].js" : "[name].js"
  },
  resolve: {
    alias: {
      "createBrowserHistory": path.resolve(node_modules_dir, 'history/lib/createBrowserHistory'),
      "normalize.css": path.resolve(bower_dir, 'normalize-css/normalize.css'),
      "font-awesome.css": path.resolve(bower_dir, 'font-awesome/css/font-awesome.min.css')
    }
  },
  module: {
    noParse: [],
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel?presets[]=react,presets[]=es2015'
      },
      { test: /\.css$/, loader: 'style!css' },
      { test: /\.less$/, loader: 'style!css!postcss!less' },
      { test: /\.(jpg|jpeg|gif|png)$/i, loader: 'file' },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff" },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
    ]
  },
  postcss: [ autoprefixer({ browsers: ['last 2 versions'] }) ],
  devServer: {
    hot: true
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({"name": "vendor", "filename": null})
  ]
};

if (env == 'production' || env == 'staging') {
  config.plugins.push(function() {
    this.plugin("done", function(stats) {
      require("fs").writeFileSync(
        path.join(__dirname, "dist", "stats.json"),
        JSON.stringify(stats.toJson())
      );
    });
  });
}

//config.addVendor('react', path.resolve(bower_dir, 'react/dist/react.min.js'));
//config.addVendor('react-dom', path.resolve(node_modules_dir, 'react/lib/ReactDOM'));
config.addVendor('jquery', path.resolve(bower_dir, 'jquery/dist/jquery.min.js'));

module.exports = config;

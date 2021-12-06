const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require("copy-webpack-plugin");

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const filename = (ext) => isProd ? `[name].${ext}` : `[name].[contenthash].${ext}`;
const assetFilename = (ext) => isProd ? `[name].${ext}` : `[hash].${ext}`;

const plugins = () => {
  const basePlugins = [
    new HtmlWebpackPlugin({
      title: 'baSalt',
      template: path.resolve(__dirname, './src/template.html'),
      filename: 'index.html',
      minify: {
        collapseWhitespace: isProd
      }
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: `${filename('css')}`
    }),
    new CopyPlugin({
      patterns: [
        { from: './src/img/', to: '../dist/img/' },
      ],
    }),
  ];


  return basePlugins;
};

module.exports = {
  entry: {
    main: path.resolve(__dirname, './src/js/index.js'),
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: `${filename('bundle.js')}`,
    assetModuleFilename: `assets/${assetFilename('[ext]')}`,
  },
  devServer: {
    historyApiFallback: true,
    contentBase: path.resolve(__dirname, 'dist'),
    open: true,
    compress: true,
    hot: false,
    port: 3000,
  },
  devtool: isProd ? false : 'source-map',
  plugins: plugins(),
  module: {
    rules: [
      //JavaScript
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      //Images
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: 'asset/resource',
        generator: {
          filename: `img/${assetFilename('[ext]')}`
        }
      },
      //Fonts and SVG
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
        type: 'asset/inline',
      },
      //CSS, PostCSS, Sass
      {
        test: /\.(scss|css)$/,
        use: [
            //'style-loader',
            MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',
            'sass-loader'],
      },
    ],
  },
}

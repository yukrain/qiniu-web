var webpack = require('webpack');
var config = require("./webpack.config.js");


config.output.publicPath = '';
//config.devtool = 'cheap-module-source-map';
config.output.filename = '[name].js?[hash]';
config.output.chunkFilename = '[id].bundle.js?[hash]';
config.plugins = [
    //new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js'),
    new webpack.ProvidePlugin({
        "React": "react",
        "ReactDOM": "react-dom",
    }),

    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    }),

    new webpack.DefinePlugin({
        "process.env": {
            NODE_ENV: JSON.stringify(process.env.NODE_ENV)
        },
    }),


    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),

    new webpack.NoErrorsPlugin()
]


module.exports = config;

'use strict;';

const crypto = require('crypto');
const crypto_orig_createHash = crypto.createHash;
crypto.createHash = (algorithm) => crypto_orig_createHash(algorithm == 'md4' ? 'sha256' : algorithm);

const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const webpack = require('webpack');
const path = require('path');

const config = {
    entry: {
        main: './src/app/index.tsx',
    },
    output: {
        filename: '[name].[chunkhash].js',
        path: __dirname + '/../../dist/app',
    },

    devtool: 'source-map',

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json'],
        alias: {react: require.resolve('react')},
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [`ts-loader?allowTsInNodeModules=true&configFile=${path.resolve('./tsconfig.json')}`],
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'raw-loader', 'sass-loader'],
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'raw-loader'],
            },
            // https://github.com/fkhadra/react-toastify/issues/775#issuecomment-1149569290
            {
                test: /\.mjs$/,
                include: /node_modules/,
                type: 'javascript/auto',
            },
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            SYSTEM_INFO: JSON.stringify({
                version: process.env.VERSION || 'latest',
            }),
        }),
        new HtmlWebpackPlugin({template: 'src/app/index.html'}),
        new CopyWebpackPlugin({
            patterns: [
                {from: 'src/assets', to: 'assets'},
                {
                    from: 'node_modules/argo-ui/src/assets',
                    to: 'assets',
                },
                {
                    from: 'node_modules/@fortawesome/fontawesome-free/webfonts',
                    to: 'assets/fonts',
                },
            ],
        }),
    ],
};

module.exports = config;

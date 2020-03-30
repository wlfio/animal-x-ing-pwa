const path = require("path");
const CopyPlugin = require('copy-webpack-plugin');

//typings install dt~service_worker_api --global --save

module.exports = {
    entry: {
        app: './src/index.ts',
        serviceWorker: './src/service.ts',
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    plugins: [
        new CopyPlugin([
            { from: 'src/index.html', to: "index.html" },
            { from: 'src/manifest.webmanifest', to: "manifest.webmanifest" },
            { from: 'src/images/icons/**/*', to: "images/icons/", flatten: true },
            { from: 'src/data/**/*', to: "data/", flatten: true },
        ])
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    devtool: "source-map",
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: 9000,
        host: '0.0.0.0',
        https: true,
        http2: true,
    }
}
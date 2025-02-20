import { fileURLToPath } from 'url';
import path from 'path';
import HtmlWebPackPlugin from 'html-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    entry: './src/client/index.js',
    mode: 'development',
    devtool: 'source-map', // Source map enabled for debugging
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,  // Fixed regex issue
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.(css|sass|scss)/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                type: 'asset/resource',
            },
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/client/views/index.html",
            filename: "./index.html",
        }),
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['./dist/*']  // Clean entire dist folder
        }),
    ]
};

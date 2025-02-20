import { fileURLToPath } from 'url';
import path from 'path';
import HtmlWebPackPlugin from 'html-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import WorkboxPlugin from 'workbox-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    entry: './src/client/index.js',
    target: 'web',  // Ensures no Node.js dependencies
    mode: 'production',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/main.[contenthash].js',  // Hash added for caching
        assetModuleFilename: 'assets/[name].[contenthash][ext]',  // Optimized asset handling
        clean: true, // Cleans old build files automatically
    },
    devServer: {
        static: path.join(__dirname, 'dist'),
        compress: true,
        port: 8080,
        hot: true,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.(scss|css)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                type: 'asset/resource',  // Replaces deprecated file-loader
                generator: {
                    filename: 'images/[name].[hash][ext]',  // Optimized path
                },
            },
        ],
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin(), // Minifies JS
            new CssMinimizerPlugin(), // Minifies CSS
        ],
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                },
            },
        },
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: './src/client/views/index.html',
            filename: 'index.html',
            minify: true,
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: 'css/main.[contenthash].css',
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'src/client/images', to: 'images' },
            ],
        }),
        new WorkboxPlugin.GenerateSW({
            clientsClaim: true,
            skipWaiting: true,
        }),
    ],
};

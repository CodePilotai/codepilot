const path = require('path')
const webpack = require('webpack')
const aliases = require('./aliases.config').webpack

module.exports = {
    chainWebpack(config) {
        config.resolve.alias.merge(aliases)
        config.plugin('envVars').use(webpack.DefinePlugin, [{
            ...require('./env-variables.config').renderer,
            'global.GENTLY': false
        }])
        config.plugin('monaco-editor').use(require('monaco-editor-webpack-plugin'))
        if (process.env.NODE_ENV !== 'production') {
            config
                .plugin('monaco-editor-hack')
                .use(webpack.ContextReplacementPlugin, [
                    /monaco-editor(\\|\/)esm(\\|\/)vs(\\|\/)editor(\\|\/)common(\\|\/)services/,
                    path.resolve(__dirname, 'node_modules/monaco-editor/esm')
                ])
        }
        // Force mjs to just be interpreted as regular JS
        config.module
            .rule('mjs')
            .test(/\.mjs$/)
            .type('javascript/auto')
            .include.add(/node_modules/)
            // Make the default target electron-renderer
        config.target('electron-renderer')
    },
    pluginOptions: {
        electronBuilder: {
            builderOptions: require('./package.json').build,
            chainWebpackMainProcess(config) {
                config.module
                    .rule('files')
                    .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
                    .use('file-loader')
                    .loader('file-loader')
                    .options({
                        name: 'imgs/[name]--[folder].[ext]'
                    })
                addNodeSupport(config)
                config.resolve.alias.merge(aliases)
                config
                    .plugin('envVars')
                    .use(webpack.DefinePlugin, [require('./env-variables.config').main])
                return config
            },
            chainWebpackRendererProcess(config) {
                config
                    .entry('app')
                    .clear()
                    .add('./src/renderer/main.js')
                config.module.rule('svg').uses.delete('file-loader')
                config.module
                    .rule('svg')
                    .use('url-loader')
                    .loader('url-loader')
                addNodeSupport(config)
                return config
            },
            // Use this to change the entrypoint of your app's main process
            mainProcessFile: 'src/main/index.js'
                // Provide an array of files that, when changed, will recompile the main process and restart Electron
                // Your main process file will be added by default
                // mainProcessWatch: ['src/myFile1', 'src/myFile2']
        }
    },
    css: {
        loaderOptions: {
            css: {
                camelCase: true
            }
        }
    }
}

function addNodeSupport(config) {
    config.resolve.extensions
        .add('.js')
        .add('.vue')
        .add('.node')
    config.module
        .rule('node')
        .test(/\.node$/)
        .use('node-loader')
        .loader('node-loader')
}
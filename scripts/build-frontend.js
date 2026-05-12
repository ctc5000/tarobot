const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

// Пути
const modulesDir = path.join(__dirname, '..', 'modules');
const publicDir = path.join(__dirname, '..', 'public');
const buildDir = path.join(publicDir, 'build');

// Создаем директорию для сборки
if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, { recursive: true });
}

// Функция для поиска всех JS и CSS файлов в папке web модуля
function findModuleAssets(modulePath) {
    const webDir = path.join(modulePath, 'web');
    if (!fs.existsSync(webDir)) return { js: [], css: [] };

    const assets = { js: [], css: [] };

    function walkDir(dir, baseDir = '') {
        const files = fs.readdirSync(dir);

        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
                walkDir(filePath, path.join(baseDir, file));
            } else {
                const ext = path.extname(file).toLowerCase();
                if (ext === '.js') {
                    assets.js.push(filePath);
                } else if (ext === '.css') {
                    assets.css.push(filePath);
                }
            }
        }
    }

    walkDir(webDir);
    return assets;
}

// Сбор всех модулей
function collectModules() {
    const modules = [];

    if (!fs.existsSync(modulesDir)) {
        console.log('⚠️ Папка modules не найдена');
        return modules;
    }

    const moduleDirs = fs.readdirSync(modulesDir);

    // Core модуль первым
    const coreIndex = moduleDirs.indexOf('Core');
    if (coreIndex !== -1) {
        moduleDirs.splice(coreIndex, 1);
        moduleDirs.unshift('Core');
    }

    for (const moduleName of moduleDirs) {
        const modulePath = path.join(modulesDir, moduleName);
        const stat = fs.statSync(modulePath);

        if (stat.isDirectory() && moduleName !== 'AmeriaBank' && moduleName !== 'Payments') {
            const assets = findModuleAssets(modulePath);

            if (assets.js.length > 0 || assets.css.length > 0) {
                modules.push({
                    name: moduleName,
                    path: modulePath,
                    assets
                });
                console.log(`📦 Найден модуль: ${moduleName} (${assets.js.length} JS, ${assets.css.length} CSS)`);
            }
        }
    }

    return modules;
}

// Создание точек входа
function createEntries(modules) {
    const entries = {};

    // Точка входа для всех JS файлов
    const allJs = [];
    for (const module of modules) {
        allJs.push(...module.assets.js);
    }

    if (allJs.length > 0) {
        entries['main'] = allJs;
    }

    // Точка входа для всех CSS файлов
    const allCss = [];
    for (const module of modules) {
        allCss.push(...module.assets.css);
    }

    if (allCss.length > 0) {
        entries['styles'] = allCss;
    }

    return entries;
}

// Webpack конфигурация (без Babel!)
const webpackConfig = {
    mode: 'production',
    entry: createEntries(collectModules()),
    output: {
        path: buildDir,
        filename: (pathData) => {
            if (pathData.chunk.name === 'styles') return 'css/[name].[contenthash].min.css';
            return 'js/[name].[contenthash].min.js';
        },
        chunkFilename: 'js/[name].[contenthash].chunk.js',
        clean: true,
        publicPath: '/build/'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[name].[contenthash][ext]'
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name].[contenthash][ext]'
                }
            }
        ]
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({
            terserOptions: {
                compress: {
                    drop_console: true,
                    drop_debugger: true,
                },
                output: {
                    comments: false,
                },
            },
            extractComments: false,
        })],
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    priority: 10,
                    reuseExistingChunk: true,
                },
                common: {
                    minChunks: 2,
                    name: 'common',
                    priority: 5,
                    reuseExistingChunk: true,
                }
            },
        },
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash].min.css',
            chunkFilename: 'css/[id].[contenthash].css',
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
        }),
        // Плагин для создания манифеста
        {
            apply: (compiler) => {
                compiler.hooks.afterEmit.tap('ManifestPlugin', (compilation) => {
                    const manifest = {};

                    for (const chunk of compilation.chunks) {
                        for (const file of chunk.files) {
                            if (file.match(/\.(js|css)$/)) {
                                manifest[path.basename(file)] = `/build/${file}`;
                            }
                        }
                    }

                    // Добавляем информацию о модулях
                    const modules = collectModules();
                    manifest.modules = modules.map(m => m.name);

                    const manifestPath = path.join(publicDir, 'asset-manifest.json');
                    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
                    console.log(`\n📄 Манифест создан: ${manifestPath}`);
                });
            }
        }
    ],
    resolve: {
        extensions: ['.js', '.css']
    },
    performance: {
        hints: false
    },
    stats: {
        colors: true,
        chunks: false,
        modules: false,
        assets: true,
        errors: true,
        warnings: false
    }
};

// Запуск сборки
console.log('🔨 Начинаем сборку фронтенда...\n');
console.log('📁 Поиск модулей...\n');

const modules = collectModules();

if (modules.length === 0) {
    console.log('❌ Модули не найдены!');
    console.log(`   Проверьте путь: ${modulesDir}`);
    process.exit(1);
}

console.log(`\n✅ Найдено модулей: ${modules.length}\n`);
console.log('🏗️  Запуск webpack...\n');

webpack(webpackConfig, (err, stats) => {
    if (err) {
        console.error('❌ Ошибка сборки:', err);
        process.exit(1);
    }

    if (stats.hasErrors()) {
        console.error('❌ Ошибки при сборке:');
        console.error(stats.toString({
            colors: true,
            chunks: false,
            modules: false,
            errors: true,
            errorDetails: true
        }));
        process.exit(1);
    }

    console.log(stats.toString({
        colors: true,
        chunks: false,
        modules: false,
        assets: true,
        entrypoints: false
    }));

    console.log('\n✅ Сборка успешно завершена!');
    console.log(`📦 Файлы собраны в: ${buildDir}`);

    console.log('\n📋 Собранные модули:');
    for (const module of modules) {
        console.log(`   ✅ ${module.name}`);
    }

    console.log('\n📊 Итоговые файлы:');
    const outputFiles = fs.readdirSync(buildDir);
    const jsFiles = outputFiles.filter(f => f.endsWith('.js'));
    const cssFiles = outputFiles.filter(f => f.endsWith('.css'));
    console.log(`   📜 JS файлов: ${jsFiles.length}`);
    console.log(`   🎨 CSS файлов: ${cssFiles.length}`);
});
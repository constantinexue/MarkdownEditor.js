'use strict';
var path = require('path'),
    fs = require('fs'),
    fse = require('fs-extra'),
    _ = require('underscore');

function withDistDir(dir) {
    dir = dir || '';
    return path.join('./build/dist', dir);
}

function rewritePackageJson() {
    var packageJson = _.clone(require('./package')),
        distDir = withDistDir(),
        packageFile = withDistDir('package.json');
    if (!fs.existsSync(distDir)) {
        fs.mkdirsSync(distDir);
    }
    delete packageJson.devDependencies;
    packageJson.window.toolbar = false;
    fs.writeFileSync(packageFile, JSON.stringify(packageJson, null, 4), 'utf8');
}

function listProductionNodeModules() {
    var packageJson = _.clone(require('./package'));
    var moduleNames = [];
    _.chain(packageJson.dependencies).keys().each(function(element, index, list) {
        moduleNames.push(element + '/**/*');
    }).value();
    console.log(moduleNames);

    return moduleNames;
}

function buildCompressTask(platform) {
    return {
        options: {
            archive: './build/releases/MarkdownEditor-' + platform + '.zip'
        },
        files: [{
            expand: true,
            flatten: true,
            src: ['./build/releases/MarkdownEditor/' + platform + '/MarkdownEditor/**/*'],
            dist: '/MarkdownEditor/'
        }]
    };
}

var nwOptions = {
    app_name: 'MarkdownEditor',
    version: '0.8.4',
    build_dir: './build',
    mac: false,
    win: false,
    linux32: false,
    linux64: false
};
var nwSrc = ['./build/dist/**/*'];

module.exports = function(grunt) {

    grunt.initConfig({
        clean: {
            compile: './public/',
            build: withDistDir(),
            buildBin: withDistDir('bin')
        },
        jade: {
            compile: {
                options: {
                    pretty: true,
                    data: function(dest, src) {
                        var config = require('./config');
                        var metadata = require('./package');
                        return _.extend(config, metadata);
                    }
                },
                files: {
                    './public/splash.html': './src/jade/splash.jade',
                    './public/test.html': './src/jade/test.jade',
                    './public/index.html': './src/jade/index.jade',
                    './public/page-view.html': './src/jade/page-view.jade',
                    './public/page-code.html': './src/jade/page-code.jade',
                    './public/page-temp.html': './src/jade/page-temp.jade'
                }
            }
        },
        less: {
            compile: {
                files: {
                    './public/css/test.css': './src/less/test.less',
                    './public/css/splash.css': './src/less/splash.less',
                    './public/css/main.css': './src/less/main.less',
                    './public/css/page-code.css': './src/less/page-code.less',
                    // Themes
                    './public/css/theme-book-en.css': './src/less/theme-book-en.less',
                    './public/css/theme-book-zh.css': './src/less/theme-book-zh.less'
                    // './public/css/theme-article-en.css': './src/less/theme-article-en.less',
                    // './public/css/theme-article-zh.css': './src/less/theme-article-zh.less'
                }
            }
        },
        copy: {
            compile: {
                files: [{
                    expand: true,
                    cwd: './src/js/',
                    src: '**',
                    dest: './public/js/'
                }, {
                    expand: true,
                    cwd: './src/vendor/',
                    src: '**',
                    dest: './public/vendor/'
                }, {
                    expand: true,
                    cwd: './src/img/',
                    src: '**',
                    dest: './public/img/'
                }]
            },
            build: {
                files: [{
                    expand: true,
                    cwd: './node_modules/',
                    src: listProductionNodeModules(),
                    dest: withDistDir('node_modules/')
                }, {
                    expand: true,
                    cwd: './public/',
                    src: '**',
                    dest: withDistDir('public/')
                }]
            },
            buildWin: {
                files: [{
                    expand: true,
                    cwd: './bin/win32/',
                    src: '**',
                    dest: withDistDir('bin/win32/')
                }],
                options: {
                    mode: true
                }
            },
            buildMac: {
                files: [{
                    expand: true,
                    cwd: './bin/macos/',
                    src: '**',
                    dest: withDistDir('bin/macos/')
                }],
                options: {
                    mode: true
                }
            },
            buildL64: {
                files: [{
                    expand: true,
                    cwd: './bin/linux64/',
                    src: '**',
                    dest: withDistDir('bin/linux64/')
                }],
                options: {
                    mode: true
                }
            },
            buildL32: {
                files: [{
                    expand: true,
                    cwd: './bin/linux32/',
                    src: '**',
                    dest: withDistDir('bin/linux32/')
                }],
                options: {
                    mode: true
                }
            }
        },
        watch: {
            jade: {
                files: ['./src/jade/*.jade'],
                tasks: ['jade'],
                options: {
                    interrupt: true,
                }
            },
            less: {
                files: ['./src/less/*.less'],
                tasks: ['less'],
                options: {
                    interrupt: true,
                }
            },
            js: {
                files: ['./src/js/*.js'],
                tasks: ['copy:compile'],
                options: {
                    interrupt: true,
                }
            }
        },
        nodewebkit: {
            win: {
                options: _.extend(nwOptions, {
                    win: true
                }),
                src: nwSrc
            },
            linux64: {
                options: _.extend(nwOptions, {
                    linux64: true
                }),
                src: nwSrc
            },
            linux32: {
                options: _.extend(nwOptions, {
                    linux32: true
                }),
                src: nwSrc
            },
            mac: {
                options: _.extend(nwOptions, {
                    mac: true,
                    mac_icns: './public/img/icon.icns'
                }),
                src: nwSrc
            }
        },
        compress: {
            mac: buildCompressTask('mac'),
            win: buildCompressTask('win'),
            linux32: buildCompressTask('linux32'),
            linux64: buildCompressTask('linux64')
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-node-webkit-builder');

    grunt.registerTask('rewrite', '', rewritePackageJson);

    grunt.registerTask('compile', ['clean:compile', 'jade', 'less', 'copy:compile']);
    grunt.registerTask('build', ['compile', 'clean:build', 'copy:build', 'rewrite',
        'clean:buildBin', 'copy:buildWin', 'nodewebkit:win',
        'clean:buildBin', 'copy:buildMac', 'nodewebkit:mac',
        'clean:buildBin', 'copy:buildL64', 'nodewebkit:linux64',
        'clean:buildBin', 'copy:buildL32', 'nodewebkit:linux32',
        'compress'
    ]);
};
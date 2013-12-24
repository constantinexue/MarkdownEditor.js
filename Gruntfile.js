'use strict';
var path = require('path');

module.exports = function(grunt) {

    grunt.initConfig({
        // jshint: {
        //     files: ['controllers/**/*.js', 'lib/**/*.js', 'models/**/*.js'],
        //     options: {
        //         jshintrc: '.jshintrc'
        //     }
        // },
        clean: ['./public/', './dist/public'],
        jade: {
            compile: {
                options: {
                    pretty: true,
                    data: function(dest, src) {
                        return require('./config');
                    }
                },
                files: {
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
                    './public/css/main.css': './src/less/main.less',
                    './public/css/page-code.css': './src/less/page-code.less',
                    './public/css/style-default.css': './src/less/style-default.less',
                    './public/css/style-gfm.css': './src/less/style-gfm.less'
                }
            }
        },
        copy: {
            js: {
                files: [
                    {
                        expand: true,
                        cwd: './src/js/',
                        src: '**',
                        dest: './public/js/'
                    },
                    {
                        expand: true,
                        cwd: './src/vendor/',
                        src: '**',
                        dest: './public/vendor/'
                    }
                ]
            }
            // ,
            // dist: {
            //     files: [
            //         {
            //             expand: true,
            //             cwd: './',
            //             src: 'package.json',
            //             dest: './dist/'
            //         },
            //         {
            //             expand: true,
            //             cwd: './public/',
            //             src: '**',
            //             dest: './dist/public'
            //         },
            //         {
            //             expand: true,
            //             cwd: './bin/',
            //             src: '**',
            //             dest: './dist/bin'
            //         }
            //     ]
            // }
        },
        watch: {
            compile: {
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
                tasks: ['copy:js'],
                options: {
                    interrupt: true,
                }
            }
        },
        nodewebkit: {
            win: {
                options: {
                    version: '0.8.3',
                    build_dir: './build', // Where the build version of my node-webkit app is saved
                    mac: false, // We want to build it for mac
                    win: true, // We want to build it for win
                    linux32: false, // We don't need linux32
                    linux64: false, // We don't need linux64
                },
                src: ['package.json', './public/**/*', './node_modules/**/*', './bin/**/*']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-node-webkit-builder');
    // grunt.loadNpmTasks('grunt-contrib-jshint');
    // grunt.loadNpmTasks('grunt-mocha-cli');
    grunt.registerTask('default', ['clean', 'jade', 'less', 'copy']);
    grunt.registerTask('build', ['default', 'nodewebkit']);
    // grunt.registerTask('i18n', ['clean', 'makara', 'dustjs', 'clean:tmp']);
    // grunt.registerTask('build', ['jshint', 'less', 'requirejs', 'i18n']);
    // grunt.registerTask('test', ['jshint', 'mochacli', 'clean:tmp']);

};
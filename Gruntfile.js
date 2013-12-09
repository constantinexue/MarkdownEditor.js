'use strict';


module.exports = function(grunt) {

    grunt.initConfig({
        // jshint: {
        //     files: ['controllers/**/*.js', 'lib/**/*.js', 'models/**/*.js'],
        //     options: {
        //         jshintrc: '.jshintrc'
        //     }
        // },
        // requirejs: {
        //     compile: {
        //         options: {
        //             baseUrl: 'public/js',
        //             mainConfigFile: 'public/js/config.js',
        //             dir: '.build/js',
        //             optimize: 'uglify',
        //             modules: [{
        //                 name: 'app'
        //             }]
        //         }
        //     }
        // },
        // less: {
        //     compile: {
        //         options: {
        //             yuicompress: true,
        //             paths: ['public/css']
        //         },
        //         files: {
        //             '.build/css/app.css': 'public/css/app.less'
        //         }
        //     }
        // },
        // makara: {
        //     files: ['public/templates/**/*.dust'],
        //     options: {
        //         contentPath: ['locales/**/*.properties']
        //     }
        // },
        // dustjs: {
        //     compile: {
        //         files: [
        //             {
        //                 expand: true,
        //                 cwd: 'tmp/',
        //                 src: '**/*.dust',
        //                 dest: '.build/templates',
        //                 ext: '.js'
        //             }
        //         ],
        //         options: {
        //             fullname: function(filepath) {
        //                 var path = require('path'),
        //                     name = path.basename(filepath, '.dust'),
        //                     parts = filepath.split(path.sep),
        //                     fullname = parts.slice(3, -1).concat(name);

        //                 return fullname.join(path.sep);
        //             }
        //         }
        //     }
        // },
        clean: ['public/*.html'],
        jade: {
            compile: {
                options: {
                    pretty: true,
                    data: {
                        nodeEnv: 'development',
                        version: '1.0.0'
                    }
                },
                files: {
                    './public/index.html': './src/index.jade',
                    './public/page-editor.html': './src/page-editor.jade',
                    './public/preview.html': './src/preview.jade',
                    './public/htmlcode.html': './src/htmlcode.jade',
                }
            }
        },
        watch: {
            jade: {
                files: ['./src/*.jade'],
                tasks: ['default'],
                options: {
                    interrupt: true,
                }
            }
        }
    });

    // grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    // grunt.loadNpmTasks('grunt-contrib-jshint');
    // grunt.loadNpmTasks('grunt-mocha-cli');
    // grunt.loadNpmTasks('grunt-dustjs');
    // grunt.loadTasks('./node_modules/makara/tasks/');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.registerTask('default', ['clean', 'jade']);
    // grunt.registerTask('i18n', ['clean', 'makara', 'dustjs', 'clean:tmp']);
    // grunt.registerTask('build', ['jshint', 'less', 'requirejs', 'i18n']);
    // grunt.registerTask('test', ['jshint', 'mochacli', 'clean:tmp']);

};
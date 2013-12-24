'use strict';


module.exports = function(grunt) {

    grunt.initConfig({
        // jshint: {
        //     files: ['controllers/**/*.js', 'lib/**/*.js', 'models/**/*.js'],
        //     options: {
        //         jshintrc: '.jshintrc'
        //     }
        // },
        clean: ['./public/'],
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
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    // grunt.loadNpmTasks('grunt-contrib-jshint');
    // grunt.loadNpmTasks('grunt-mocha-cli');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.registerTask('default', ['clean', 'jade', 'less', 'copy']);
    // grunt.registerTask('i18n', ['clean', 'makara', 'dustjs', 'clean:tmp']);
    // grunt.registerTask('build', ['jshint', 'less', 'requirejs', 'i18n']);
    // grunt.registerTask('test', ['jshint', 'mochacli', 'clean:tmp']);

};
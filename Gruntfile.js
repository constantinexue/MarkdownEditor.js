'use strict';


module.exports = function(grunt) {

    grunt.initConfig({
        // jshint: {
        //     files: ['controllers/**/*.js', 'lib/**/*.js', 'models/**/*.js'],
        //     options: {
        //         jshintrc: '.jshintrc'
        //     }
        // },
        clean: ['./public/*.html', './public/css/*.css'],
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
                    './public/page-view.html': './src/page-view.jade',
                    './public/page-temp.html': './src/page-temp.jade'
                }
            }
        },
        less: {
            compile: {
                files: {
                    './public/css/main.css': './src/less/main.less',
                    './public/css/style-default.css': './src/less/style-default.less'
                }
            }
        },
        watch: {
            compile: {
                files: ['./src/*.jade', './src/less/*.less'],
                tasks: ['default'],
                options: {
                    interrupt: true,
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    // grunt.loadNpmTasks('grunt-contrib-jshint');
    // grunt.loadNpmTasks('grunt-mocha-cli');
    // grunt.loadNpmTasks('grunt-dustjs');
    // grunt.loadTasks('./node_modules/makara/tasks/');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.registerTask('default', ['clean', 'jade', 'less']);
    // grunt.registerTask('i18n', ['clean', 'makara', 'dustjs', 'clean:tmp']);
    // grunt.registerTask('build', ['jshint', 'less', 'requirejs', 'i18n']);
    // grunt.registerTask('test', ['jshint', 'mochacli', 'clean:tmp']);

};
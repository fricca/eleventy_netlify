module.exports = function(grunt) {

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    const sass = require('node-sass');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        paths: {
            css_in: 'css/_scss/',
            css_out: 'css/',

            eleventy_src: 'src/',
            eleventy_files: 'files/',
            eleventy_css: 'css/',
        },

        sass: {
            options: {
                sourceMap: true,
                implementation: sass,
            },
            dist: {
                files: {
                    '<%= paths.css_out %>style.css': '<%= paths.css_in %>style.scss',
                }
            }
        },
        cssmin: {
            options: {
                sourceMap: true,
            },
            add_banner: {
                options: {
                    noAdvanced: true,
                    // needed to keep rgba(255, 255, 255, 0) from being converted to transparent
                    compatibility: 'ie8',
                },
            files: {
                    '<%= paths.css_out %>style.min.css': ['<%= paths.css_out %>style.css'],
                }
            }
        },
        shell: {
            eleventy: {
                command: 'npx @11ty/eleventy --quiet',
                options: {
                    execOptions: {}
                }
            }
        },
        watch: {
            sass: {
                files: [
                    '<%= paths.css_in %>**/*.scss'
                ],
                tasks: [
                    'sass'
                ],
                options: {
                    spawn: false,
                    // livereload: true,
                }
            },
            css: {
                files: [
                    '<%= paths.css_out %>style.css'
                ],
                tasks: [
                    'cssmin'
                ],
                options: {
                    spawn: false,
                    // livereload: true,
                },
            },
            eleventy: {
                files: [
                    '<%= paths.eleventy_src %>**/*.html',
                    '<%= paths.eleventy_src %>**/*.njk',
                    '<%= paths.eleventy_src %>**/*.js',
                    '<%= paths.eleventy_src %>**/*.md',

                    '<%= paths.eleventy_files %>**/*',
                    '<%= paths.eleventy_css %>**/*'
                ],
                tasks: [
                    'eleventy'
                ],
                options: {
                    spawn: false,
                    livereload: true,
                },
            },
        }
    });

    grunt.registerTask('eleventy', ['shell:eleventy']);

    grunt.registerTask('default', ['newer:sass', 'newer:cssmin', 'newer:shell:eleventy', 'watch']);
    grunt.registerTask('build', ['sass', 'cssmin', 'eleventy']);
};
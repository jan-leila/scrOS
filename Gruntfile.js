module.exports = function(grunt){
    const config = require('./.config.json');

    const email = grunt.option('email') || config.email || 'email';
    const token = grunt.option('token') || config.token || 'token';
    const branch = grunt.option('branch') || config.branch || 'scros';
    const ptr = (grunt.option('ptr') || config.ptr) !== undefined;

    grunt.loadNpmTasks('grunt-screeps');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.initConfig({
        screeps: {
            options: {
                email,
                token,
                branch,
                ptr,
            },
            dist: {
                src: ['dist/*.js']
            }
        },
        clean: {
            'dist': ['dist']
        },
        copy: {
            // Pushes the game code to the dist folder so it can be modified before being send to the screeps server.
            screeps: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: '**',
                    dest: 'dist/',
                    filter: 'isFile',
                    rename: function (dest, src) {
                        // Change the path name utilize underscores for folders
                        return dest + src.replace(/\//g, '_');
                    }
                }],
            }
        },
    });

    grunt.registerTask('default', ['clean', 'copy:screeps', 'screeps', 'clean']);
}
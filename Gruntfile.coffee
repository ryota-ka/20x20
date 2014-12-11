module.exports = (grunt) ->

  grunt.initConfig

    coffee:
      compile:
        files:
          'main.js': 'main.coffee'

    watch:
      coffee:
        files: ['main.coffee']
        tasks: 'coffee'

  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-sass'
  grunt.loadNpmTasks 'grunt-contrib-jade'

  grunt.registerTask 'default', 'watch'

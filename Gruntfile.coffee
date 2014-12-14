module.exports = (grunt) ->

  grunt.initConfig

    coffee:
      compile:
        files:
          'main.js': 'main.coffee'

    sass:
      compile:
        files:
          'style.css': 'style.scss'

    jade:
      compile:
        files:
          'index.html': 'index.jade'

    watch:
      coffee:
        files: ['main.coffee']
        tasks: 'coffee'
      sass:
        files: ['style.scss']
        tasks: 'sass'
      jade:
        files: ['index.jade']
        tasks: 'jade'

  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-sass'
  grunt.loadNpmTasks 'grunt-contrib-jade'

  grunt.registerTask 'default', 'watch'

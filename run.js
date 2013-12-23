var command = require('command');
command.open('/')
    .on('stdout', command.writeTo(process.stdout))
    .on('stderr', command.writeTo(process.stderr))
    //.chdir('..')
    .exec('nw --enable-logging .')
    .then(function() {
        // var stdout = this.lastOutput.stdout;
        // if (!stdout.trim().length) {
        //     console.warn('No files found!');
        // }
    });
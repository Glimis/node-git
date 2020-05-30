var run = require('child_process').exec;


run('git checkout test',(err, data, stderr)=>{
    console.log(err, data, stderr)
})
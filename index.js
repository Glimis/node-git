var exec = require('child_process').exec;

function run(str){
    return new Promise((resolve,reject)=>{
        exec(str,(err, data, stderr)=>{
            if(err){
                reject(stderr)
            }else{
                resolve(data) 
            }
        })
    })
}

void async function(){
    try{
        let str = await run('git status')
        console.log(str.indexOf('Changes not staged for commit')>-1)
        console.log(str.indexOf('Changes to be committed:')>-1)
        
    }catch(e){
        // 可能git不存在
        console.log(e)
        return; 
    }
    try{
        await run('git checkout test')
    }catch(e){
        // 可能不存在test
        console.log(e)
        return; 
    }
    try{
        await run('git checkout pull')
    }catch(e){
        // 可能不存在test
        console.log(e)
        return; 
    }

}()

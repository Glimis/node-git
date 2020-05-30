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
        if(str.indexOf('nothing to commit, working tree clean') == -1){
            // 包含未提交部分
            console.log(str)
            return
        }
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

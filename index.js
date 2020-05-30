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
    // 1. 检测状态
    try{
        let str = await run('git status')
        if(str.indexOf('nothing to commit, working tree clean') == -1){
            // 包含未提交部分
           throw new Error(str)

        }else{
            if(str.indexOf(`use "git push" to publish your local commits`)>-1 ){
                // 主动提交
                await run('git push')
            }
        }
    }catch(e){
        // 处理push时,自行git push --set-upstream origin
        // 可能git不存在
        console.log('提交 -- 注意commit格式')
        console.log(e)
        return; 
    }
    // 2.读取当前分支名称
    let branch;
    try{
        branch = await run('git branch')
        branch = branch.match(/\* (.*)/)[1]
    }catch(e){
        console.log(e)
        return; 
    }

    // 3. 跳转测试分支
    try{
        await run('git checkout test')
    }catch(e){
        // 可能不存在test
        console.log(e)
        return; 
    }

    // 4. 拉取代码
    try{
        await run('git  pull')
    }catch(e){
        // 自行git push --set-upstream origin
        console.log(e)
        return; 
    }
    // test中理论只合并与解决冲突

}()

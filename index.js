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
        console.log('开启检测')
        let str = await run('git status')
        if(str.indexOf('nothing to commit, working tree clean') == -1){
            // 包含未提交部分
            console.log('包含未提交内容 -- 注意提交格式')
           throw new Error(str)
        }else{
            if(str.indexOf(`use "git push" to publish your local commits`)>-1 ){
                // 主动提交
                console.log('提交ing')
                await run('git push')
            }
        }

        // 2.读取当前分支名称
        console.log('读取分支名')
        let branch = await run('git branch')
            branch = branch.match(/\* (.*)/)[1]
        
        // 3. 跳转测试分支 -- 可能不存在test,catch捕获
        console.log('跳转test分支')
        await run('git checkout test')
        
        // 4. 拉去代码,自行git push --set-upstream origin
        console.log('拉去test代码')
        await run('git pull')
        // test中理论只合并与解决冲突,无视冲突 -- catch捕获
        // 5.合并代码
        console.log(`合并${branch}`)
        await run(`git  merge ${branch}`)

        // 6. 查看冲突
        console.log(`检测冲突`)
        str = await run(`git  status`)
        if(str.indexOf('both modified')>-1){
            throw new Error(str)
        }
        
        // 7. 推送到test -- 等待jenkins相应  
        // 自行git push --set-upstream origin
        console.log(`推送代码 -- 等待jenkins`)
        await run(`git  push`)
        
        // 8.返回原有分支
        console.log(`返回分支${branch}`)
        await run(`git checkout ${branch}`)
    }catch(e){
        console.log(e)
    }



}()

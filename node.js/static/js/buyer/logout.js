/**
 * Created by Administrator on 2017/11/4 0004.
 */


$(function(){
    $('#logout').on('click', function(){
        alert("是否退出");
        // 执行退出请求操作
        $.get('/api/logout', function(result){
            console.log(result);
            if(result.code == 0){
                window.location.reload();
            }else{
                alert('退出失败');
            }
        })
    })
    $('#search').on('click',function(){
        var keyword = $('#keyword')[0].value;
        window.location.href='/search?keyword='+keyword;
    })
})


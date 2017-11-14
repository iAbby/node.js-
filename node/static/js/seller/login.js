/**
 * Created by Administrator on 2017/11/4 0004.
 */


$('#login-btn').on('click', function(){
    var user = $('#user')[0].value;
    var psd = $('#psd')[0].value;
    console.log('11')
    //判断用户名、密码是否都不为空
    // 发送请求
    // 密码和确认密码是否相等

    $.post('/api/admin/login', {
        sellername: user,
        password: psd,
    }, function(result){
        //后台响应了注册
        console.log(result);
        if(result.code == 0){
            //跳转到登录页面
            window.location.href = '/admin/';
        }else{
            alert(result.message);
        }
    })


})

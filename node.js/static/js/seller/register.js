alert('商家注册页面的js');

$('#register-btn').on('click', function(){
    var user = $('#user')[0].value;
    var description = $('#description')[0].value;
    var psd = $('#psd')[0].value;
    var comfirmPsd = $('#comfirmPsd')[0].value;
    //判断用户名、密码、确认密码是否都不为空
    // 密码和确认密码是否相等
    // 发送请求
    $.post('/api/admin/register', {
        sellername: user,
        description: description,
        password: psd,
        comfirmPassword: comfirmPsd,
        logo: logoPath
    }, function(result){
        //后台响应了注册
        console.log(result);
        if(result.code == 0){
            //跳转到登录页面
            window.location.href = '/admin/login';
        }else{
            alert(result.message);
        }
    })

})

$('#logo').on('change',function(){
    alert('上传');
    //获得表单数据
    var formData = new FormData($('#upload-logo')[0]);

    //发送ajax请求，将图片传输给后台
    $.ajax({
        url:'/api/admin/upload-logo',
        type:'POST',
        processData:false,//没有设置processData，默认按照jq方式处理请求
        contentType:false,//才能识别到enctype="multipart/form-data"
        data:formData,
        success:function(data){
            alert('上传成功');
            console.log(data);
            //  document.querySelector('#logo-img').src = data.data.url;
            document.getElementById('logo-img').src = data.data.url;
            logoPath=data.data.url;
        },
        error:function(error){
            alert('上传失败');
        }


    })

})

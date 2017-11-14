// /**
//  * Created by Administrator on 2017/11/6 0006.
//  */

// let sizes = [];
// let styles = [];
// $("#size_cre").on('click',function(){
//     var div = $('<div class="size_cre"></div>').appendTo("#size");
//     $('<button class="btn btn-primary">'+$(".meter")[0].value+'</button>').appendTo(div);
//     $('<span id="del" style="color:#555555">x</span>').appendTo(div);
//     var sizeVal = $(".meter")[0].value;
//     sizes.push(sizeVal);
// })

// $("#size").on('click',"#del",function(){
//     $(this).parent().remove();
// })


// $("#color_cre").on('click',function(){
//     var div = $('<div class="size_cre"></div>').appendTo("#color");
//     $('<button class="btn btn-primary">'+$(".color")[0].value+'</button>').appendTo(div);
//     $('<span id="del" style="color:#555555">x</span>').appendTo(div);
//     var colorVal = $(".color")[0].value;
//     styles.push(colorVal);
// })

// $("#color").on('click',"#del",function(){
//     $(this).parent().remove();
// })

// $(".modify-btn").on('click',function(ev){
//     alert('111');
//     var color = $(".color")[0].value;
//     var meter = $(".meter")[0].value;
//     var descri = $("#descri")[0].value;
//     var name = $("#name")[0].value;
//     console.log(sizes)
//     $.post('/api/admin/modifygoods', {
//         color_cre:styles,
//         descri:descri,
//         name:name,
//         meter_cre:sizes,
//         goodsid:ev.target.id
//     }, function(result){
//         console.log('添加商品的结果：');
//         console.log(result);
//         //后台响应了注册
//         if(result.code == 0){
//             //跳转到登录页面
//             // window.location.href = '/admin/goodslist';
//         }else{
//             alert(result.message);
//         }
//     })
// })




var sizes = [];
var styles = [];
$("#size_cre").on('click',function(){
    var div = '';
    var div = $('<div class="size_cre"></div>').appendTo("#size");
    $('<button class="btn btn-primary">'+$(".meter")[0].value+'</button>').appendTo(div);
    $('<span id="del" style="color:#555555">x</span>').appendTo(div);
    var sizeVal = $(".meter")[0].value;
    sizes.push(sizeVal);
})
// var sizeval = $(".sizeVal")[0].value;
// var colorval = $(".colorVal")[0].value;
// var sizeVal = $(".meter")[0].value;
// sizes.push(sizeVal);

$("#size").on('click',"#del",function(){
    $(this).parent().remove();
})


$("#color_cre").on('click',function(){
    var div = $('<div class="size_cre"></div>').appendTo("#color");
    $('<button class="btn btn-primary">'+$(".color")[0].value+'</button>').appendTo(div);
    $('<span id="del" style="color:#555555">x</span>').appendTo(div); 
    var colorVal = $(".color")[0].value;
    styles.push(colorVal);
})
// var colorVal = $(".color")[0].value;
// styles.push(colorVal);

$("#color").on('click',"#del",function(){
    $(this).parent().remove();
})

$('#pic').on('change',function(){
    // alert('上传');
    //获得表单数据
    var formData = new FormData($('#upload-pic')[0]);

    //发送ajax请求，将图片传输给后台
    $.ajax({
        url:'/api/admin/upload-pic',
        type:'POST',
        processData:false,//没有设置processData，默认按照jq方式处理请求
        contentType:false,//才能识别到enctype="multipart/form-data"
        data:formData,
        success:function(data){
            // alert('上传成功');
            console.log(data);
            //  document.querySelector('#logo-img').src = data.data.url;
            document.getElementById('goods-img').src = data.data.url;
            picPath=data.data.url;
        },
        error:function(error){
            alert('上传失败');
        }


    })

})







$(".modify-btn").on('click',function(ev){
    var color = styles;
    // var color = $(".color")[0].value;styles;
    // var meter = $(".meter")[0].value;
    var meter = sizes;
    pic = picPath;
    var descri = $("#descri")[0].value;
    var name = $("#name")[0].value;

    $.post('/api/admin/modifygoods', {
        color_cre:styles,
        descri:descri,
        name:name,
        pic:picPath,
        meter_cre:sizes,
        goodsid:ev.target.id
    }, function(result){
        console.log('修改商品的结果：');
        console.log(result);
        //后台响应了注册
        if(result.code == 0){
            //跳转到登录页面
            // window.location.href = '/admin/goodslist';
        }else{
            alert(result.message);
        }
    })
})




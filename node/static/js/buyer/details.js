
var i = 1;
$('#buy').on("click",function(){
    var src = document.getElementById('detail_pic').src;
    // var person = $('#person').html();
    // var seller = $('#seller').html();
    var title = document.getElementById('title').innerHTML;    
    var descri = document.getElementById('descri').innerHTML;
    var seller = document.getElementById('seller').innerHTML;
    var color_cre = document.getElementById('color_cre').innerHTML;
    var meter_cre = document.getElementById('meter_cre').innerHTML;
    console.log(color_cre);
    console.log(src);
    console.log(seller);
    number = i++;
    console.log(number);
    $.get('/api/details_buy', {
        name:title,
        price:descri,
        selectSize:meter_cre,
        selectStyle: color_cre,
        pic:src,
        seller:seller,
        number:number
    }, function(result){
        //后台响应了购买
        console.log(typeof result);
        if(result.code==0){
             alert('已购买成功！')
            // window.location.href = "/details?id={{goods._id.toString()}}";
        }
        else{
            alert('请先登录！')
            console.log(result.message);
        }

    })
    // alert('购买成功！')
})



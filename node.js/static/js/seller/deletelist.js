$('.delete').on('click',function(ev){

    alert('点击了删除'+ev.target.id);
    $.get('/api/admin/deletegoods',{
        goodsid:ev.target.id
    },function(result){
        console.log(result);
        if(result.code==0){
            window.location.reload();
        }
    })
})
// console.log($('#style')[0].value);
// console.log($('#color')[0].value);
const layer = layui.layer
$(function() {


    // 初始化页面头像
    getUserInfo()


    //退出登录
    $('#logout').on('click', function() {
        layer.confirm('确定要退出吗?', { icon: 3, title: '提示' }, function(index) {
            localStorage.removeItem('token')
            location.href = '/login.html'
            layer.close(index);
        });
    })


})


//请求用户信息
function getUserInfo() {
    $.ajax({
        url: '/my/userinfo',
        success: function(res) {
            if (res.status != 0) return layer.msg(res.message)
            renderAvatar(res.data)
        }
    })
}


//渲染用户头像和欢迎信息
function renderAvatar(user) {
    //渲染欢迎信息
    let name = user.nickname || user.username
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)

    //渲染头像
    if (user.user_pic) {
        $('.layui-nav-img').attr('src', user.user_pic).show().next().hide()
    } else {
        let firstChar = name.slice(0, 1).toUpperCase()
        $('.avatar-text').text(firstChar).show().prev().hide()
    }
}
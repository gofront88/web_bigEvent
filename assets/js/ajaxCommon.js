$.ajaxPrefilter(function(options) {
    //拼接url的网址
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url

    //给需要token访问的接口添加token
    if (options.url.indexOf('/my') != -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    //当用户的token无法通过服务器验证时，清空其token，并跳转到登录页面
    options.complete = function(res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message == '身份认证失败！') { //使用res.responseJSON获取数据
            localStorage.removeItem('token')
            location.href = '/login.html'
        }
    }
})
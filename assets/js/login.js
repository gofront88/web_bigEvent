$(function() {


    //去注册
    $('#link_reg').on('click', function() {
        $('.reg_box').show().next().hide()
    })


    //去登录
    $('#link_login').on('click', function() {
        $('.login_box').show().prev().hide()
    })


    //自定义表单值的验证
    let form = layui.form
    form.verify({
        pwd: [/\S{6,12}/, '密码必须6~12位且不能有空格'],
        repwd: function(value) {
            if (value !== $('.reg_box [name=password]').val()) return '两次密码不一致'
        }
    })


    //监听注册表单的提交事件，并发送ajax请求
    layer = layui.layer
    $('#form_reg').on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/api/reguser',
            data: $('#form_reg').serialize(),
            success: function(res) {
                if (res.status != 0) return layer.msg(res.message);
                layer.msg('注册成功', {
                    icon: 1,
                    time: 1000
                }, function() {
                    $('#link_login').click()
                });
            }
        })
    })


    //监听登录表单的提交事件，并发送ajax请求
    $('#form_login').on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/api/login',
            data: $('#form_login').serialize(),
            success: function(res) {
                if (res.status != 0) return layer.msg(res.message)
                localStorage.setItem('token', res.token)
                location.href = '/index.html'
            }
        })
    })


})
let form = layui.form
let layer = layui.layer
$(function() {
    form.verify({
        nickname: [/^\S{2,6}$/, '用户昵称必须在2~6位之间，且不能出现空格']
    })

    //初始化表单信息
    initUserInfo()


    //重置按钮
    $('#resetBtn').on('click', function(e) {
        e.preventDefault()
        initUserInfo()
    })


    //监听表单提交事件
    $('#edit').on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status != 0) return layer.msg(res.message)
                layer.msg('修改信息成功')
                    //更新用户头像
                window.parent.getUserInfo()
            }
        })
    })


})


//获取用户信息
function initUserInfo() {
    $.ajax({
        url: '/my/userinfo',
        success: function(res) {
            //渲染到表单
            form.val('userinfo', res.data)
        }
    })
}
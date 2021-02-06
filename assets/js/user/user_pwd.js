$(function() {


    //自定义表单验证规则
    let form = layui.form
    form.verify({
        pwd: [/^\S{6,12}$/, '密码必须6到12位，且不能出现空格'],
        repwd: function(value) {
            if ($('[name=oldPwd]').val() == value) {
                return '原密码和新密码不能一致'
            }
            if ($('[name=repwd]').val() !== value) {
                return '两次新密码不一致'
            }
        }
    })


    //监听表单提交事件(修改密码)
    let layer = layui.layer
    $('#editPwd').on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status != 0) return layer.msg(res.message)
                layer.msg('修改密码成功')
                $('#editPwd')[0].reset()
            }
        })
    })


})
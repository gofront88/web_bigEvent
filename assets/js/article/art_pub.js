$(function() {
    // 初始化富文本编辑器
    initEditor()
        // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)
    initCate()


    //做一个好看的文件表单按钮
    $('#chooseImg').on('click', function() {
        $('#fileInp').click()
    })


    //监控文件列表的变化
    $('#fileInp').on('change', function() {
        if (this.files.length != 1) return
        var file = this.files[0]
        var newImgURL = URL.createObjectURL(file)
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    let state = '已发布'

    // 利用提交按钮，点击事件先触发，才会触发表单提交
    //此处利用点击后会跳转，所以只设置一个按钮，改变参数
    $('#draftBtn').on('click', function() {
        state = '草稿'
    })


    $('#form_pub').on('submit', function(e) {
        e.preventDefault()
        let fd = new FormData($('#form_pub')[0])
        fd.append('state', state)
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                fd.append('cover_img', blob)
                publishArticle(fd)
            })

    })


})

//发布文章函数
function publishArticle(fd) {
    $.ajax({
        method: 'post',
        url: '/my/article/add',
        data: fd,
        contentType: false,
        processData: false,
        success: function(res) {
            if (res.status != 0) return msg(res.message)
            location.href = '/article/art_list.html'
        }
    })
}
let { msg } = layui.layer

//初始化文章类别下拉框
function initCate() {
    $.ajax({
        url: '/my/article/cates',
        success: function(res) {
            if (res.status != 0) return msg(res.message)
            let str = template('tpl_cate', res)
            $('[name=cate_id]').html(str)
            layui.form.render('select')
        }
    })
}
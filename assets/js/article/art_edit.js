$(function() {

    //初始化富文本
    initEditor()

    //初始化下拉框
    initCate()

    //获取并渲染文章信息
    getArticleInfo()


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

    //点击草稿按钮
    $('#draftBtn').on('click', function() {
        state = '草稿'
    })

    //点击发布按钮
    $('#publishBtn').on('click', function() {
        state = '已发布'
    })

    //监听修改表单的提交
    $('#form_edit').on('submit', function(e) {
        e.preventDefault()
        let fd = new FormData(this)
        fd.append('state', state)
        fd.append('Id', id)
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                fd.append('cover_img', blob)
                editArticle(fd)
            })
    })
})
let state
let { msg } = layui.layer
let { form } = layui

var $image = $('#image')

// 2. 裁剪选项
var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview',
    autoCropArea: 1
}


//修改文章信息
function editArticle(fd) {
    $.ajax({
        method: 'post',
        url: '/my/article/edit',
        data: fd,
        contentType: false, //文件上传必须加上这两个选项
        processData: false,
        success: function(res) {
            if (res.status != 0) return msg(res.message)
            location.href = "/article/art_list.html"
        }
    })
}


let id
    //通过id获取用户信息
function getArticleInfo() {
    id = location.search.slice(1).split('=')[1]
    $.ajax({
        url: '/my/article/' + id,
        success: function(res) {
            initEditPage(res)
        }
    })
}

//初始化修改页面
function initEditPage(res) {
    form.val('edit', res.data)
    $image
        .attr('src', 'http://api-breakingnews-web.itheima.net' + res.data.cover_img)
        .cropper(options)
}


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
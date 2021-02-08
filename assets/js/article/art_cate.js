$(function() {
    initArtCateList()

    let addIndex
        //点击添加按钮弹出模态框
    $('#addBtn').on('click', function() {
        addIndex = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '250px'],
            content: $('#tpl_add').html()
        });
    })


    //监听添加模态框表单提交事件
    $('body').on('submit', '#form_add', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status != 0) return layer.msg(res.message)
                    //添加成功关闭弹出层
                layer.close(addIndex)
                    //将表格重新渲染
                initArtCateList()
            }
        })
    })


    //点击编辑按钮弹出模态框
    let editIndex
    let form = layui.form
    $('tbody').on('click', '#editBtn', function() {
        editIndex = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '250px'],
            content: $('#tpl_edit').html()
        });
        $.ajax({
            url: `/my/article/cates/${$(this).attr('data-id')}`,
            success: function(res) {
                if (res.status != 0) return layer.msg(res.message)
                form.val('edit', res.data)
            }
        })
    })

    //监听弹出层的修改表单提交事件
    $('body').on('submit', '#form_edit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status != 0) return layer.msg(res.message)
                layer.msg(res.message)
                layer.close(editIndex)
                initArtCateList()
            }
        })
    })


    //点击删除按钮时
    $('tbody').on('click', '#deleteBtn', function() {
        let id = $(this).attr('data-id')
        layer.confirm('确定要删除吗', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                url: `/my/article/deletecate/${id}`,
                success: function(res) {
                    if (res.status != 0) return layer.msg(res.message)
                    layer.msg('删除文章分类成功')
                    initArtCateList()
                    layer.close(index);
                }
            })
        });
    })
})


let layer = layui.layer

//初始化表格
function initArtCateList() {
    $.ajax({
        url: '/my/article/cates',
        success: function(res) {
            if (res.status != 0) return layer.msg(res.message)
            let str = template('tpl_table', res)
            $('tbody').html(str)
        }
    })
}
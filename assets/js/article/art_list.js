    //定义查询数据的配置
    let p = {
        pagenum: 1, //默认在第1页
        pagesize: 2, //默认一页显示2条数据
        cate_id: '',
        state: ''
    }
    let { msg } = layui.layer


    $(function() {


        //定义格式化时间过略器
        template.defaults.imports.dateFormat = function(dateStr) {
            let date = new Date(dateStr)
            let y = padZero(date.getFullYear())
            let m = padZero(date.getMonth() + 1)
            let d = padZero(date.getDate())
            let hh = padZero(date.getHours())
            let mm = padZero(date.getMinutes())
            let ss = padZero(date.getSeconds())
            return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
        }


        // 补0函数
        function padZero(value) {
            return value > 9 ? value : '0' + value
        }


        initTable()


        initCate()

        // 监听帅选表单提交事件
        $('#form_filter').on('submit', function(e) {
            e.preventDefault()
            p.cate_id = $('[name=cate_id]').val()
            p.state = $('[name=state]').val()
            p.pagenum = 1
            initTable()
        })

        //点击删除按钮
        $('tbody').on('click', '.deleteBtn', function() {
            let id = $(this).attr('data-id')
            layer.confirm('确定要删除吗?', { icon: 3, title: '提示' }, function(index) {
                $.ajax({
                    url: `/my/article/delete/${id}`,
                    success: function(res) {
                        if (res.status != 0) return msg(res.message)
                        msg('删除成功')
                            // 如果删除的是当前页最后一条数据
                        if ($('.deleteBtn').length == 1) {
                            p.pagenum = p.pagenum == 1 ? p.pagenum : p.pagenum - 1
                        }
                        initTable()
                        layer.close(index);
                    }
                })
            });
        })

        //点击修改按钮
        $('tbody').on('click', '#editBtn', function() {
            let id = $(this).attr('data-id')

            location.href = '/article/art_edit.html?id=' + id
        })

    })



    //初始化表格
    function initTable() {
        $.ajax({
            url: '/my/article/list',
            data: p,
            success: function(res) {
                if (res.status != 0) return msg(res.message)
                let str = template('tpl_table', res)
                $('tbody').empty().html(str)
                renderPage(res.total)
            }
        })
    }

    //初始化下拉框
    function initCate() {
        $.ajax({
            url: '/my/article/cates',
            success: function(res) {
                let str = template('tpl_cate', res)
                $('[name=cate_id]').html(str)
                layui.form.render('select')
            }
        })
    }

    // 渲染分页
    function renderPage(count) {
        let { laypage } = layui
        //执行一个laypage实例
        laypage.render({
            elem: 'test1',
            count: count, //数据总数，从服务端得到
            limit: p.pagesize, //每页的条数
            curr: p.pagenum, //渲染时处于哪一页
            limits: [2, 3, 5, 10], //下拉框能选中每页显示的条数
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'], //分页展示的组件
            jump: function(obj, first) {
                    p.pagenum = obj.curr
                    p.pagesize = obj.limit
                    first || initTable()

                }
                //点击下拉框(控制一页显示几条数据)，点击分页，点击确定跳转分页，都会触发jump函数。

        });
    }
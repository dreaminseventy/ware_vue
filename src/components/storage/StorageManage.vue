<template>
    <div>
        <!--查询界面/新增按钮-->
        <div style="padding-bottom: 5px">
            <el-input v-model="name" placeholder="请输入查询用户名"
                      @keydown.enter.native="loadPost"
                      suffix-icon="el-icon-search" style="width: 200px;padding-left: 10px"></el-input>
            <el-button type="primary" style="margin-left: 10px" @click="loadPost" >查询</el-button>
            <el-button type="warning" @click = "reset">重置</el-button>
            <el-button type="success" style="margin-left: 500px" @click="addNew" >新增</el-button>
        </div>
        <!--中间查询数据展示界面-->
        <el-table :data="tableData"
                  :header-cell-style="{ background:'#555d65',color:'#f2f2f2'}"
                  border style="width: 100%"
        >
            <el-table-column  type="index" width="50" label="序号">
            </el-table-column>
            <el-table-column prop="id" label="ID" width="60" >
            </el-table-column>
            <el-table-column prop="name" label="用户名" width="170">
            </el-table-column>
            <el-table-column prop="remark" label="备注" width="300">
            </el-table-column>
            <el-table-column prop="option" label="操作">
                <template slot-scope="scope">
                    <el-button size="small" type="primary" @click="showUpdate(scope.row)">编辑</el-button>
                    <!--button包裹在气泡框当中-->
                    <el-popconfirm title="真的要删除吗Σ(っ °Д °;)っ"
                                   @confirm="deleteUser(scope.row.id)"
                                   style="margin-left: 10px"
                    >
                        <el-button slot="reference" size="small" type="danger" >删除</el-button>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <!--分页-->
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageNum"
                :page-sizes="[5, 10, 50, 100]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
        <!--新增界面-->
        <el-dialog
                title="提示"
                :visible.sync="centerDialogVisible"
                width="30%"
                center>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="用户名" prop="name">
                    <el-col :span="20">
                        <el-input v-model="form.name"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-col :span="20">
                        <el-input v-model="form.remark"></el-input>
                    </el-col>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="centerDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="save">确 定</el-button>
            </span>
        </el-dialog>
        <!--编辑界面-->
        <el-dialog
                title="提示"
                :visible.sync="centerDialogVisible1"
                width="30%"
                center>
            <el-form ref="form1" :model="form1" :rules="rules" label-width="80px">
                <el-form-item label="用户名" prop="name">
                    <el-col :span="20">
                        <el-input v-model="form1.name"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-col :span="20">
                        <el-input v-model="form1.remark"></el-input>
                    </el-col>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="centerDialogVisible1 = false">取 消</el-button>
                <el-button type="primary" @click="update">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>


export default {
    name: "AdminManage",
    data() {
        //用于对账户是否以存在进行查询
        let checkDuplicate =(rule,value,callbacke)=>{
            if(this.form.id){
                return callbacke
            }
            this.$axios.get(this.$http+'/storage/findByName?name='+this.form.name).then(res=>res.data).then(res=>{
                //console.log(res)
                if (res.code!==200){
                    return callbacke
                }else {
                    return callbacke(new Error('仓库已存在'))
                }
            })
        };
        return {
            tableData: [],//查询的内容在这里展示
            menu:JSON.parse(sessionStorage.getItem('Menu')),
            pageSize: 5,
            pageNum: 1,
            total: 10,
            name: '',
            remark:'',
            centerDialogVisible1: false,
            centerDialogVisible: false,//将新增表单设为不可见
            //设置表单的form参数
            form: {
                id: '',
                name: '',
                remark: ''
            },
            form1: {
                id:'',
                name: '',
                remark: '',
            },
            //为新增添加规则
            rules: {
                name: [
                    {required: true, message: '请输入仓库名', trigger: 'blur'},
                    {min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur'},
                    {validator:checkDuplicate,trigger: 'blur'}
                ],
            },
        }
    },
    methods:{
        //保存新增用户方法
        save(){
            this.centerDialogVisible=false
            this.$axios.post(this.$http+"/storage/save ", this.form).then(res=>res.data).then(res=>{
                console.log(res)
                if (res.code===200){
                    this.$message({
                        showClose: true,
                        message: '成功新增仓库( •̀ ω •́ )y',
                        type: 'success'
                    });
                    this.loadGet()
                }
                else {
                    this.$message({
                        showClose: true,
                        message: '添加仓库失败，请重试(っ °Д °;)っ',
                        type: 'error'
                    });
                }
            })
        },
        //清除新增界面内容
        resetForm() {
            this.$refs.form.resetFields();
        },
        //显示新增界面，同时清除原有数据
        addNew(){
            this.centerDialogVisible=true
            this.$nextTick(()=>
                this.resetForm()
            )
        },
        //重制查询框内容，并使页面返回初始状态
        reset(){
            this.name=''
            this.pageNum=1
            this.pageSize=5
            this.loadGet()
        },
        //编辑功能
        //1.展示当前列中的内容
        showUpdate(row){
            //console.log(row)
            this.form1.id = row.id
            this.form1.name = row.name
            this.form1.remark = row.remark
            this.centerDialogVisible1=true
        },
        //3.修改信息
        update(){
            this.$axios.put(this.$http+'/storage/update',this.form1).then(res=>res.data).then(res=>{
                //console.log(res)
                if (res.code===200){
                    this.$message({
                        showClose: true,
                        message: '成功修改仓库( •̀ ω •́ )y',
                        type: 'success'
                    });
                    this.centerDialogVisible1=false
                    this.loadGet()
                }else {
                    this.$message({
                        showClose: true,
                        message: '修改仓库失败，请重试(っ °Д °;)っ',
                        type: 'error'
                    });
                }
            })
        },
        //删除功能
        deleteUser(id){
            //console.log(id)
            this.$axios.delete(this.$http+'/storage/delete?id='+id).then(res=>res.data).then(res=>{
                //console.log(res)
                if (res.code===200){
                    this.$message({
                        showClose: true,
                        message: '删除成功( •̀ ω •́ )y',
                        type: 'success'
                    });
                    this.loadGet()
                }else {
                    this.$message({
                        showClose: true,
                        message: '删除失败，请重试(╯‵□′)╯︵┻━┻',
                        type: 'error'
                    });
                }
            })
        },
        //主要查询（使用get查询全部数据,包含分页查询）
        loadGet(){
            this.$axios.get(this.$http+'/storage/page',{
                params:{
                    pageNum:this.pageNum,
                    pageSize:this.pageSize,
                }
            }).then(res=>res.data).then(res=>{
                //console.log(res)
                if (res.code===200){
                    this.tableData=res.data
                    this.total = res.total
                }else {
                    alert("获取数据失败")
                }
            })
        },
        //上方选择查询(使用post传递json数据对象，包含分页)
        loadPost(){
            if (this.name===''){
                this.$message({
                    showClose: true,
                    message: '搜索栏为空，请先输入值(。>︿<)_θ',
                    type: 'warning'
                });
                return
            }
            //创建一个json对象
            let SelectBean={
                name:this.name,
                pageNum:this.pageNum,
                pageSize:this.pageSize
            }
            //console.log(SelectBean)
            this.$axios.post(this.$http+"/storage/list1", SelectBean).then(res=>res.data).then(res=>{
                //console.log((res))
                if (res.code===200){
                    this.tableData = res.data
                    this.total=res.total
                    this.$message({
                        showClose: true,
                        message: '已经找到啦~( •̀ ω •́ )y',
                        type: 'success'
                    });
                }
                else {
                    this.$message({
                        showClose: true,
                        message: '查询失败，请重试(っ °Д °;)っ',
                        type: 'error'
                    });
                }
            })
        },
        //分页查询，规定每页的条数
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.pageNum=1
            this.pageSize=val
            if(this.name===''){
                this.loadGet()
            }
            else {
                this.loadPost()
            }

        },
        //分页查询，当前为第几页
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.pageNum=val
            if(this.name===''){
                this.loadGet()
            }
            else {
                this.loadPost()
            }
        }

    },
    //页面加载前先进行数据读取
    beforeMount() {
        this.loadGet();
        //this.loadPost();
    },
    // computed:{
    //     ...mapGetters(['getMenu']),
    //
    // },
    // watch:{
    //     getMenu(){
    //         console.log('我执行了'+this.menu)
    //         this.$store.commit("setMenu",this.menu)
    //     }
    // }
}
</script>

<style scoped>
.el-main{
    padding: 5px;
}
</style>
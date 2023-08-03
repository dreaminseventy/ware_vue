<template>
    <el-main style="height: 100%">
        <!--查询界面-->
        <div style="padding-bottom: 5px">
            <el-input v-model="account" placeholder="请输入查询账号"
                      @keydown.enter.native="loadPost"
                      suffix-icon="el-icon-search" style="width: 200px"></el-input>
            <el-input v-model="name" placeholder="请输入查询用户名"
                      @keydown.enter.native="loadPost"
                      suffix-icon="el-icon-search" style="width: 200px;padding-left: 10px"></el-input>
            <el-select v-model="sex" filterable placeholder="请选择性别"
                       @keydown.enter.native="loadPost"
                       style="padding-left: 10px">
                <el-option
                    v-for="item in sexs"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
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
            <el-table-column prop="account" label="账号" width="170" >
            </el-table-column>
            <el-table-column prop="name" label="用户名" width="170">
            </el-table-column>
            <el-table-column prop="password" label="密码" width="170">
            </el-table-column>
            <el-table-column prop="age" label="年龄" width="80">
            </el-table-column>
            <el-table-column prop="sex" label="性别" width="80">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.sex === 1" type="success" disable-transitions>男</el-tag>
                    <el-tag v-else-if="scope.row.sex === 2" type="primary" disable-transitions>女</el-tag>
                    <el-tag v-if="scope.row.sex === 3" type="success" disable-transitions>购物袋</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="phone" label="电话号码" width="180">
            </el-table-column>
            <el-table-column prop="roleId" label="角色权限" width="130">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.roleId === 1" type="warning" disable-transitions>管理员</el-tag>
                    <el-tag v-else-if="scope.row.roleId === 2" type="danger" disable-transitions>超级管理员</el-tag>
                    <el-tag v-if="scope.row.roleId === 0" type="primary" disable-transitions>用户</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="isValid" label="是否启用" width="100">
                <template slot-scope="scope">
                    <el-tag
                        :type="scope.row.isValid === 'Y' ? 'success' : 'danger'"
                        disable-transitions>{{scope.row.isValid === 'Y' ? '启用' : '禁用'}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="option" label="操作">
                <el-button size="small" type="primary">编辑</el-button>
                <el-button size="small" type="danger">删除</el-button>
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
                <el-form-item label="账号" prop="account">
                    <el-col :span="20">
                    <el-input v-model="form.account"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="用户名" prop="name">
                    <el-col :span="20">
                        <el-input v-model="form.name"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-col :span="20">
                        <el-input v-model="form.password"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="年龄" prop="age">
                    <el-col :span="20">
                        <el-input v-model="form.age"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                    <el-radio-group v-model="form.sex">
                        <el-radio label="1">男</el-radio>
                        <el-radio label="2">女</el-radio>
                        <el-radio label="3">沃尔玛购物袋</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="电话" prop="phone">
                    <el-col :span="20">
                        <el-input v-model="form.phone"></el-input>
                    </el-col>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="centerDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="save">确 定</el-button>
            </span>
        </el-dialog>
    </el-main>
</template>

<script>
export default {
    name: "wareMain",
    data() {
        //对年龄大于150的进行重新输入
        let checkAge = (rule,value,callback)=>{
            if(value>150){
                callback(new Error('太老了,请重试'));
            }else {
                callback();
            }
        };
        //用于对账户是否以存在进行查询
        let checkDuplicate =(rule,value,callbacke)=>{
            if(this.form.id){
                return callbacke
            }
            this.$axios.get(this.$http+'/user/findByAccount?account='+this.form.account).then(res=>res.data).then(res=>{
                console.log(res)
                if (res.code!==200){
                   return callbacke
                }else {
                    return callbacke(new Error('账号已存在'))
                }
            })
        };
        return {
            tableData: [],//查询的内容在这里展示
            pageSize: 5,
            pageNum: 1,
            total: 10,
            name: '',
            sex: '',
            account: '',
            sexs: [
                {
                    value: 1,
                    label: '男'
                },
                {
                    value: 2,
                    label: '女'
                },
                {
                    value: 3,
                    label: '沃尔玛购物袋'
                },
                {
                    value: '',
                    label: ''
                }
            ],
            centerDialogVisible: false,//将新增表单设为不可见
            //设置表单的form参数
            form: {
                account: '',
                name: '',
                password: '',
                age: '',
                sex: '3',
                phone: ''
            },
            //为新增添加规则
            rules: {
                account: [
                    {required: true, message: '请输入账号', trigger: 'blur'},
                    {min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur'},
                    {validator:checkDuplicate,trigger: 'blur'}
                ],
                name: [
                    {required: true, message: '请输入用户名', trigger: 'blur'},
                    {min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur'}
                ],
                password: [
                    {required: true, message: '请输入密码', trigger: 'blur'},
                    {min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur'}
                ],
                age: [
                    {required: true, message: '请输入年龄', trigger: 'blur'},
                    {min: 1, max: 3, message: '长度在 1 到 3 个字符', trigger: 'blur'},
                    {pattern: /^([1-9][0-9]*){1,3}$/,message: '年龄必须为正整数',trigger: 'blur'},
                    {validator:checkAge,trigger: 'blur'}
                ],
                phone: [
                    {required: true, message: '手机号码不能为空', trigger: 'blur'},
                    {pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,message: '请输入正确的手机号码',trigger: 'blur'}
                ]
            }
        }
    },
    methods:{
        //保存新增用户方法
        save(){
           this.centerDialogVisible=false
            this.$axios.post(this.$http+"/user/save ", this.form).then(res=>res.data).then(res=>{
                console.log((res))
                if (res.code===200){
                    this.$message({
                        showClose: true,
                        message: '成功新增用户( •̀ ω •́ )y',
                        type: 'success'
                    });
                    this.loadGet()
                }
                else {
                    this.$message({
                        showClose: true,
                        message: '添加用户失败，请重试(っ °Д °;)っ',
                        type: 'success'
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
        //主要查询（使用get查询全部数据,包含分页查询）
        loadGet(){
            this.$axios.get(this.$http+'/user/page',{
                params:{
                    pageNum:this.pageNum,
                    pageSize:this.pageSize
                }
            }).then(res=>res.data).then(res=>{
                console.log(res)
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
            if (this.name===''&&this.sex===''&&this.account===''){
                return
            }
            let SelectBean={
                name:this.name,
                pageNum:this.pageNum,
                pageSize:this.pageSize,
                sex:this.sex,
                account:this.account
            }
            this.$axios.post(this.$http+"/user/list1", SelectBean).then(res=>res.data).then(res=>{
                    console.log((res))
                if (res.code===200){
                    this.tableData = res.data
                    this.total=res.total
                }
                else {
                    alert("获取数据失败")
                }
                })
        },
        //分页查询，规定每页的条数
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.pageNum=1
            this.pageSize=val
                if(this.name===''&&this.sex===''&&this.account===''){
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
            if(this.name===''&&this.sex===''&&this.account===''){
                this.loadGet()
            }
            else {
                this.loadPost()
            }
        },
        //重制查询框内容，并使页面返回初始状态
        reset(){
            this.sex=''
            this.name=''
            this.pageNum=1
            this.pageSize=5
            this.loadGet()

        }
    //页面加载前先进行数据读取
    },
    beforeMount() {
        this.loadGet();
        //this.loadPost();
    }
}
</script>

<style scoped>
.el-main{
    padding: 5px;
}
</style>
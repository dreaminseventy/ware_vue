<template>
    <el-main style="height: 100%">
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
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageNum"
                :page-sizes="[5, 10, 50, 100]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        <el-dialog
            title="提示"
            :visible.sync="centerDialogVisible"
            width="30%"
            center>
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="账号">
                    <el-col :span="20">
                    <el-input v-model="form.account"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="用户名">
                    <el-col :span="20">
                        <el-input v-model="form.name"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="密码">
                    <el-col :span="20">
                        <el-input v-model="form.password"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="年龄">
                    <el-col :span="20">
                        <el-input v-model="form.age"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio-group v-model="form.sex">
                        <el-radio label="1">男</el-radio>
                        <el-radio label="2">女</el-radio>
                        <el-radio label="3">沃尔玛购物袋</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="电话">
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
        return {
            tableData:[],
            pageSize:5,
            pageNum:1,
            total:10,
            name:'',
            sex:'',
            account:'',
            sexs:[
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
            centerDialogVisible:false,
            form:{
                account: '',
                name:'',
                password:'',
                age: '',
                sex:'3',
                phone:''
            }
        }
    },
    methods:{
        save(){
           this.centerDialogVisible=false
            this.$axios.post(this.$http+"/user/save ", this.form).then(res=>res.data).then(res=>{
                console.log((res))
                if (res.code===200){
                    alert('新增成功')
                    this.loadGet()
                }
                else {
                    alert("添加数据失败")
                }
            })
        },
        addNew(){
            this.centerDialogVisible=true
        },
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
        reset(){
            this.sex=''
            this.name=''
            this.pageNum=1
            this.pageSize=5
            this.loadGet()

        }

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
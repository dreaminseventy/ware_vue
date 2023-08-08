<template>
    <div>
        <!--查询界面/新增按钮-->
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
        </div>
        <!--中间查询数据展示界面-->
        <el-table :data="tableData"
                  :header-cell-style="{ background:'#555d65',color:'#f2f2f2'}"
                  @current-change="getCurrent"
                  highlight-current-row
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
                    <el-tag v-if="scope.row.sex === 3" type="info" disable-transitions>购物袋</el-tag>
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
    </div>
</template>

<script>
export default {
    name: "Select",
    data() {
        //对年龄大于150的进行重新输入
        return {
            tableData: [],//查询的内容在这里展示
            pageSize: 5,
            pageNum: 1,
            bool:true,
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
            ]
        }
    },
    methods:{
        //重制查询框内容，并使页面返回初始状态
        reset(){
            this.account=''
            this.sex=''
            this.name=''
            this.bool=true
            this.pageNum=1
            this.pageSize=10
            this.loadGet()

        },
        //主要查询（使用get查询全部数据,包含分页查询）
        loadGet(){
            this.$axios.get(this.$http+'/user/page2',{
                params:{
                    pageNum:this.pageNum,
                    pageSize:this.pageSize,
                    roleId:0
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
            if (this.name===''&&this.sex===''&&this.account===''){
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
                pageSize:this.pageSize,
                sex:this.sex,
                account:this.account,
                roleId:0
            }
            this.$axios.post(this.$http+"/user/list1", SelectBean).then(res=>res.data).then(res=>{
                //console.log((res))
                if (res.code===200){
                    this.tableData = res.data
                    this.total=res.total
                    if(this.bool){
                        this.$message({
                            showClose: true,
                            message: '已经找到啦~( •̀ ω •́ )y',
                            type: 'success'
                        });
                        this.bool=false
                    }
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
            if(this.name===''&&this.sex===''&&this.account===''){
                this.loadGet()
                this.bool=true
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
                this.bool=true
            }
            else {
                this.loadPost()
            }
        },
        //单选取值
        getCurrent(val){
            // this.currentRow = val;
            this.$emit("selectUser",val)
        },

    },
    watch:{
        name(){
            this.bool = true;
        },
        storage(){
            this.bool=true;
        },
        goodstype(){
            this.bool=true;
        },
    },
    //页面加载前先进行数据读取
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
<template>
    <div>
        <!--查询界面/新增按钮-->
        <div style="padding-bottom: 5px">
            <el-input v-model="name" placeholder="请输入查询货物名"
                      @keydown.enter.native="loadPost"
                      suffix-icon="el-icon-search" style="width: 200px;padding-left: 10px"></el-input>
            <el-input v-model="storage" placeholder="请输入查询货物所属仓库"
                      @keydown.enter.native="loadPost"
                      suffix-icon="el-icon-search" style="width: 200px;padding-left: 10px"></el-input>
            <el-input v-model="goodstype" placeholder="请输入查询货物所属分类"
                      @keydown.enter.native="loadPost"
                      suffix-icon="el-icon-search" style="width: 200px;padding-left: 10px"></el-input>
            <el-button type="primary" style="margin-left: 10px" @click="loadPost" >查询</el-button>
            <el-button type="warning" @click = "reset">刷新</el-button>
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
            <el-table-column prop="name" label="货物名" width="150">
            </el-table-column>
            <el-table-column prop="storage" label="关联仓库" width="150">
            </el-table-column>
            <el-table-column prop="goodstype" label="货物分类" width="150">
            </el-table-column>
            <el-table-column prop="adminname" label="操作人" width="150">
            </el-table-column>
            <el-table-column prop="username" label="申请人" width="150">
            </el-table-column>
            <el-table-column prop="count" label="货物数量" width="70">
            </el-table-column>
            <el-table-column prop="createtime" label="操作时间" width="160"
                :formatter = 'formatTime'
            >
            </el-table-column>
            <el-table-column prop="manage" label="入库/出库" width="100">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.manage === 1" type="warning" disable-transitions>入库</el-tag>
                    <el-tag v-else-if="scope.row.manage === 2" type="success" disable-transitions>出库</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注">
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


import moment from "moment";

export default {
    name: "RecordManage",
    data() {
        return {
            tableData: [],//查询的内容在这里展示
            bool:true,
            user:JSON.parse(sessionStorage.getItem('User')),
            pageSize: 5,
            pageNum: 1,
            total: 10,
            name: '',
            storage:'',
            goodstype:'',
            centerDialogVisible1: false,
            centerDialogVisible: false,//将新增表单设为不可见
            //设置表单的form参数
            form: {
                id: '',
                name: '',
                remark: '',
                goodstype:'',
                storage:'',
                count:''
            },
            form1: {
                id:'',
                name: '',
                remark: '',
                goodstype:'',
                storage:'',
                count:''
            },
        }
    },
    methods:{
        formatTime(row){
            const createTime = row.createtime;
            return moment(createTime).format('yyyy-MM-DD hh:mm:ss');
        },

        //重制查询框内容，并使页面返回初始状态
        reset(){
            this.name=''
            this.goodstype = ''
            this.storage=''
            this.pageNum=1
            this.pageSize=5
            this.bool=true
            this.loadGet()
        },
        //主要查询（使用get查询全部数据,包含分页查询）
        loadGet(){
            this.$axios.get(this.$http+'/record/page',{
                params:{
                    pageNum:this.pageNum,
                    pageSize:this.pageSize,
                    roleId:this.user.roleId,
                    userId:this.user.id
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
            if (this.name===''&&this.storage===''&&this.goodstype===''){
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
                storage:this.storage,
                goodstype:this.goodstype,
            }

            //console.log(SelectBean)
            this.$axios.post(this.$http+"/record/list1", SelectBean).then(res=>res.data).then(res=>{
                //console.log((res))
                if (res.code===200){
                    this.tableData = res.data
                    this.total=res.total
                    if (res.total===0){
                        this.$message({
                            showClose: true,
                            message: '暂无相关数据(⊙ˍ⊙)',
                            type: 'warning'
                        });
                    }else
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
            if(this.name===''&&this.storage===''&&this.goodstype===''){
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
            if(this.name===''&&this.storage===''&&this.goodstype===''){
                this.loadGet()
                this.bool=true
            }
            else {
                this.loadPost()
            }
        }

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
        }
    },
    //页面加载前先进行数据读取
    beforeMount() {
        this.loadGet();
        //this.loadPost();
    },

}
</script>

<style scoped>
.el-main{
    padding: 5px;
}
</style>
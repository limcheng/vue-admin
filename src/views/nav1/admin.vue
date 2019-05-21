<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<!-- <el-form-item>
					<el-input v-model="filters.name" placeholder="请输入管理员名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getAdmin">查询</el-button>
				</el-form-item> -->
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="Admin" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
<!-- 			<el-table-column type="selection" width="55">
			</el-table-column> -->
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column label="姓名" prop="name" nin-width="100">
			</el-table-column>
			<el-table-column label="登录账户" prop="username" min-width="100">
			</el-table-column>
<!-- 			<el-table-column label="手机号码" prop="phone" min-width="160">
			</el-table-column> -->
			<el-table-column label="区域" prop="area">
			</el-table-column>
			<el-table-column label="创建时间" prop="createTime">
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button 
          size="small" 
          type="warning"
          @click="handleEdit(scope.$index, scope.row)"
          >修改</el-button>
					<el-button 
            type="danger" 
            size="small"
            :disabled="scope.row.role == 0"
            @click="handleDel(scope.$index, scope.row)"
          >删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
<!-- 			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
			<el-pagination
        layout="prev, pager, next"
        @current-change="handleCurrentChange" 
        :page-size="20" 
        :total="total"
        style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
        <el-form-item label="登录账户" disabled prop="username">
        	<el-input v-model="editForm.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
        	<el-input type="password" v-model="editForm.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="区域" prop="area" v-if="isSupAdmin">
        	<el-select v-model="editForm.area" placeholder="请选择活动区域">
        	  <el-option v-for="item in areaList" 
        	             :key="item.id" 
        	             :label="item.name" 
        	             :value="item.id">
        	  </el-option>
        	</el-select>
        </el-form-item>
<!--        <el-select v-model="addForm.role" placeholder="请选择管理员权限">
          <el-option :label="超级管理员" :value="0"></el-option>
          <el-option :label="管理员" :value="1"></el-option>
        </el-select> -->
				<el-form-item label="创建时间">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.createTime"></el-date-picker>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="登录账户" prop="username">
					<el-input v-model="addForm.username" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input v-model="addForm.password" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="区域" prop="area">
					<el-select v-model="addForm.area" placeholder="请选择区域">
					  <el-option v-for="item in areaList" 
					             :key="item.id" 
					             :label="item.name" 
					             :value="item.id">
					  </el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="创建时间">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.createTime"></el-date-picker>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getAdminListPage, removeAdmin, getAreaList, editAdmin, addAdmin } from '../../api/api';

	export default {
		data() {
			return {
				filters: {
					name: '',
          size: 20,
				},
        isSupAdmin: true,
				Admin: [],
        areaList: null,
        phone: '',
				total: 0,
				index: 1,
        size: 20,
				listLoading: false,
        isrole: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' },
					],
				},
				//编辑界面数据
				editForm: {
					area: "",
          createTime: "",
          name: "",
          // password: "",
          role: '',
          token: "",
          username: ""
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' },
					],
          phone: { required: true, message: '请输入手机号码', trigger: 'blur' },
          area: { required: true, message: '请输入区域', trigger: 'blur' },
          username: [
            { required: true, message: '请输入登录账户名', trigger: 'blur' },
            { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
          ],
          password: { required: true, message: '请输入登录密码', trigger: 'blur' },
				},
				//新增界面数据
				addForm: {
					area: "",
					createTime: "",
					name: "",
					password: "",
					role: '',
					token: "",
					username: ""
				}
			}
		},
		methods: {
			handleCurrentChange(val) {
				this.index = val;
				this.getAdmin();
			},
      //获取地区列表
      getArea() {
        let para = {
          name: this.filters.name,
        };
        //NProgress.start();
        getAreaList().then((res) => {
          let list = res.data.data
          this.areaList = list;
        });
      },
			//获取管理员列表
			getAdmin() {
				let para = {
					index: (this.index-1)*this.size, 
					size: this.size,
				};
        let user = sessionStorage.getItem("user");
        //let role = JSON.parse(user).role;
				this.listLoading = true;
				getAdminListPage(para).then((res) => {
          this.listLoading = false;
          let areaList = this.areaList
          let admin = res.data.data
          let code = res.data.code;
          this.total = res.data.total;
          if(code == "666") {
            that.$router.push({ path: '/Login' });
          }
          this.Admin = admin;
//           if(role == 0) {
//             this.isrole = true;
//             this.Admin = admin;
//           }else{
//             this.$notify.error({
//               title: '错误',
//               message: '您的权限不够，无法访问'
//             });
//           }
          //转换数据格式
          for (let item of admin) {
            let contents = item.content
            let area = item.area
            //let consult = item.campsite
            if(this.areaList) {
              for(let areaItem of this.areaList) {
                if(areaItem.id == area) {
                  item.area = areaItem.name
                }
              }
            }
            item.createTime = (!item.createTime || item.createTime == '') ? '' : util.formatDate.format(new Date(item.createTime), 'yyyy-MM-dd');
            if (item.status == '-2') {
              item.status = '离职'
            }else if(item.status == '-1') {
              item.status = '审核不过'
            }else if(item.status == '0') {
              item.status = '审核中'
            }else {
              item.status = '审核通过'
            }
          }
				});
			},
			
      //删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = row.username;
          console.log(para)
					removeAdmin(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getAdmin();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
        console.log(row)
        if (row.role === 0) {
          this.isSupAdmin = false;
        }else {
          this.isSupAdmin = true;
        }
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					area: "",
					createTime: "",
					name: "",
					password: "",
					role: '',
					token: "",
					username: ""
				};
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
          var that = this
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							let para = Object.assign({}, this.editForm);
              console.log(para)
              var admin = sessionStorage.getItem("user");
              //var role = JSON.parse(admin).role;
              //para.role = role;
              for(let item of this.areaList) {
                if(para.area === item.name) {
                  para.area = item.id;
                }
              }
              para.token = JSON.parse(admin).token;
							para.createTime = (!para.createTime || para.createTime == '') ? '' : util.formatDate.format(new Date(para.createTime), 'yyyy-MM-dd');
							editAdmin(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getAdmin();
							});
						});
					}
				});
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							let para = Object.assign({}, this.addForm);
//               for(let item of this.areaList) {
//                 if(para.area = item.name) {
//                   para.area = item.id
//                 }
//               }
							para.cteateTime = (!para.cteateTime || para.cteateTime == '') ? '' : util.formatDate.format(new Date(para.cteateTime), 'yyyy-MM-dd');
							addAdmin(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getAdmin();
							});
						});
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
// 			batchRemove: function () {
// 				var ids = this.sels.map(item => item.id).toString();
// 				this.$confirm('确认删除选中记录吗？', '提示', {
// 					type: 'warning'
// 				}).then(() => {
// 					this.listLoading = true;
// 					//NProgress.start();
// 					let para = { ids: ids };
// 					batchRemoveAdmin(para).then((res) => {
// 						this.listLoading = false;
// 						//NProgress.done();
// 						this.$message({
// 							message: '删除成功',
// 							type: 'success'
// 						});
// 						this.getAdmin();
// 					});
// 				}).catch(() => {
// 
// 				});
// 			}
		},
    beforeMount() {
      this.getArea();
    },
		mounted() {
      var that = this;
      let user = sessionStorage.getItem("user");
      let role = JSON.parse(user).role;
      if(role != 0) {
        this.$router.push({ path: '/noRole' });
      }
      setTimeout(function() {
        that.getAdmin();
      },500)
      
		}
	}

</script>

<style scoped>

</style>
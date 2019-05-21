<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
<!-- 				<el-form-item>
					<el-button type="primary" v-on:click="getArea">查询</el-button>
				</el-form-item> -->
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="area" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="60">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="name" label="名称" sortable>
			</el-table-column>
			<el-table-column label="操作" width="200">
				<template scope="scope">
     <!-- <el-button type="promary" size="small" @click="handleDel(scope.$index, scope.row)">查看</el-button> -->
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
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
				<el-form-item label="地区名" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
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
				<el-form-item label="地区名" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
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
	import { getAreaListPage, removeArea, editArea, addArea } from '../../api/api';

	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				area: [],
				total: 0,
				index: 1,
        size: 20,
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					],
                    id: { required: true, message: '请输入地址id', trigger: 'blur' }
				},
				//编辑界面数据
				editForm: {
                    //id: '',
					name: '',
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入地区名', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					name: '',
				}
			}
		},
		methods: {
			handleCurrentChange(val) {
				this.inxde = val;
				this.getArea();
			},
			//获取地区列表
			getArea() {
				let para = {
					index: (this.index-1)*this.size, 
					size: this.size,
				};
				this.listLoading = true;
				getAreaListPage(para).then((res) => {
          this.listLoading = false;
          this.total = res.data.total;
          this.area = res.data.data
          //let list = null;
          //let user = sessionStorage.getItem("user");
          //let role = JSON.parse(user).role
//           if(role === 0) {
//             list = res.data.data;
//           }else {
//             list = [];
//             this.$notify.error({
//               title: '错误',
//               message: '您权限不够，无法访问'
//             });
//           }
					//this.area = list;
				});
			},
      
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = { id: row.id };
					removeArea(para).then((res) => {
            console.log(para,res)
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getArea();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					name: '',
				};
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							let para = Object.assign({}, this.editForm);
							editArea(para).then((res) => {
								this.editLoading = false;
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getArea();
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
              console.log(para)
							addArea(para).then((res) => {
								this.addLoading = false;
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getArea();
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
// 					batchRemoveUser(para).then((res) => {
// 						this.listLoading = false;
// 						//NProgress.done();
// 						this.$message({
// 							message: '删除成功',
// 							type: 'success'
// 						});
// 						this.getArea();
// 					});
// 				}).catch(() => {
// 
// 				});
// 			}
		},
		mounted() {
      let user = sessionStorage.getItem("user");
      let role = JSON.parse(user).role;
      if(role != 0) {
        this.$router.push({ path: '/noRole' });
      }
			this.getArea();
		}
	}

</script>

<style scoped>

</style>
<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
        <el-form-item label="区域" prop="area" v-if="showArea">
        	<el-select 
            v-model="filters.area" 
            clearable 
            placeholder="全部" 
            @change="chooseArea"
          >
        	  <el-option v-for="item in areaList" 
        	             :key="item.id" 
        	             :label="item.name" 
        	             :value="item.id">
        	  </el-option>
        	</el-select>
        </el-form-item>
        <el-form-item label="咨询点" prop="consult">
        	<el-select 
            v-model="filters.consult"
            clearable 
            placeholder="全部">
        	  <el-option v-for="item in campsiteList" 
        	             :key="item.id" 
        	             :label="item.name" 
        	             :value="item.id">
        	  </el-option>
        	</el-select>
        </el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
<!-- 				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item> -->
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
      <el-table-column  type="expand">
        <template slot-scope="props">
          <el-form label-position="left">
            <el-form-item label="总咨询数:" sortable>
              {{ props.row.complaintNum }}
            </el-form-item>
            <el-form-item label="总接待数:" sortable>
              {{ props.row.receptionNum }}
            </el-form-item>
            <el-form-item label="总投诉数:" sortable>
              {{ props.row.consultNum }}
            </el-form-item>
            <el-form-item label="提交数:" sortable>
              {{ props.row.logNum }}
            </el-form-item>
            <!-- <el-form-item label="内容:" id="form-table">
              <el-table :data="content" highlight-current-row style="width: 100%;">
                <el-table-column  prop="name" label="投诉内容" sortable></el-table-column>
                <el-table-column  prop="name" label="反馈内容" sortable></el-table-column>
              </el-table>
            </el-form-item> -->
          </el-form>
        </template>
      </el-table-column>
			<!-- <el-table-column type="selection" width="55">
			</el-table-column> -->
			<el-table-column type="index" width="60">
			</el-table-column>
<!--      <el-table-column type="id" width="120">
      </el-table-column> -->
			<el-table-column prop="name" label="姓名" sortable>
			</el-table-column>
      <el-table-column prop="phone" label="电话" min-width="120">
      </el-table-column>
			<el-table-column prop="area" label="区域" min-width="100" sortable>
			</el-table-column>
      <el-table-column prop="campsite" label="咨询点" min-width="100" sortable>
      </el-table-column>
			<!-- <el-table-column prop="consultNum" label="咨询总数" width="120" sortable>
			</el-table-column>
      <el-table-column prop="receptionNum" label="接待总数" width="120" sortable>
      </el-table-column>
      <el-table-column prop="complaintNum" label="投诉总数" width="120" sortable>
      </el-table-column>
      <el-table-column prop="logNum" label="提交数" sortable>
      </el-table-column> -->
			<el-table-column prop="createTime" label="注册时间" min-width="120" sortable>
			</el-table-column>
      <el-table-column prop="status" label="状态" min-width="100" sortable>
      </el-table-column>
			<el-table-column label="操作" min-width="240">
				<template scope="scope">
          <el-button type="success" size="small" @click="pass(scope.$index, scope.row)">通过</el-button>
          <el-button size="small" @click="deny(scope.$index, scope.row)">不过</el-button>
					<el-button type="warning" size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
			<el-pagination
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :index-size="20"
        :total="total"
        style="float:right;"
      >
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="phone" prop="phone">
					<el-input v-model="editForm.phone" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="区域" prop="area">
					<el-select v-model="editForm.area" placeholder="请选择区域" @change="chooseArea" filterable >
					  <el-option v-for="item in areaList" 
					             :key="item.id" 
					             :label="item.name" 
					             :value="item.id">
					  </el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="咨询点" prop="campsite">
					<el-select v-model="editForm.campsite" placeholder="请选择咨询点" filterable >
					  <el-option v-for="item in campsiteList" 
					             :key="item.id" 
					             :label="item.name" 
					             :value="item.id">
					  </el-option>
					</el-select>
				</el-form-item>
        <el-form-item label="咨询数" prop="consultNum">
        	<el-input v-model="editForm.consultNum" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="接待数" prop="receptionNum">
        	<el-input v-model="editForm.receptionNum" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="投诉数" prop="complaintNum">
        	<el-input v-model="editForm.complaintNum" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="提交数" prop="logNum">
        	<el-input v-model="editForm.logNum" auto-complete="off"></el-input>
        </el-form-item>
        <!-- <el-form-item label="投诉内容"  prop="consultContent">
        	<el-input type="textarea" v-model="editForm.consultContent"></el-input>
        </el-form-item>
        <el-form-item label="反馈内容">
        	<el-input type="textarea" v-model="editForm.replyContent"></el-input>
        </el-form-item> -->
        <el-form-item label="状态" prop="status">
          <el-select v-model="editForm.status" placeholder="请选择用户状态">
          	<el-option label="离职" value="-2"></el-option>
          	<el-option label="未通过审核" value="-1"></el-option>
            <el-option label="审核中" value="0"></el-option>
            <el-option label="审核通过" value="1"></el-option>
          </el-select>
        </el-form-item>
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
        <el-form-item label="phone" prop="phone">
        	<el-input v-model="addForm.phone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="区域" prop="area">
        	<el-select v-model="addForm.area" placeholder="请选择区域" @change="chooseArea">
        	  <el-option v-for="item in areaList" 
        	             :key="item.id" 
        	             :label="item.name" 
        	             :value="item.id">
        	  </el-option>
        	</el-select>
        </el-form-item>
        <el-form-item label="咨询点" prop="campsite">
        	<el-select v-model="addForm.campsite" placeholder="请选择咨询点">
        	  <el-option v-for="item in campsiteList" 
        	             :key="item.id" 
        	             :label="item.name" 
        	             :value="item.id">
        	  </el-option>
        	</el-select>
        </el-form-item>
        <el-form-item label="创建时间">
        	<el-date-picker type="date" placeholder="选择日期" v-model="addForm.createTime"></el-date-picker>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="addForm.status" placeholder="请选择用户状态">
          	<el-option label="离职" value="-2"></el-option>
          	<el-option label="未通过审核" value="-1"></el-option>
            <el-option label="审核中" value="0"></el-option>
            <el-option label="审核通过" value="1"></el-option>
          </el-select>
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
	import { getUserListPage, removeUser, getPointList, getAreaList, editUser, addUser } from '../../api/api';

	export default {
		data() {
			return {
				filters: {
					name: ''
				},
        area: '',
				users: [],
        areaList: null,
        consultList: null,
        campsiteList: [],
				total: 0,
				index: 1,
        //size: 20,
				listLoading: false,
        showArea: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					],
          area: { required: true, message: '请输入地区', trigger: 'blur' },
          campsite: { required: true, message: '请输入咨询点', trigger: 'blur' },
				},
				//编辑界面数据
				editForm: {
					"area": "",
          "campsite": "",
          "complaintNum": 0,
          "consultNum": 0,
          "createTime": "2019-04-26T08:56:54.736Z",
          "id": "",
          "logNum": 0,
          "name": "",
          "openid": "",
          "phone": "",
          "receptionNum": 0,
          "status": 0,
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					],
          area: { required: true, message: '请输入地区', trigger: 'blur' },
          campsite: { required: true, message: '请输入咨询点', trigger: 'blur' },
				},
				//新增界面数据
        form: {
          "area": "",
          "campsite": ""
        },
				addForm: {
					"area": "",
          "campsite": "",
          "complaintNum": 0,
          "consultNum": 0,
          "createTime": "2019-04-26T08:56:54.736Z",
          "id": "",
          "logNum": 0,
          "name": "",
          "openid": "",
          "phone": "",
          "receptionNum": 0,
          "status": 0,
				}

			}
		},
		methods: {
			handleCurrentChange(val) {
        console.log(val)
				this.index = val;
				this.getUsers();
			},
			//获取用户列表
			getUsers() {
				let para = {
          index: this.index, 
          //size: this.size,
        };
        if(this.filters.area != '') {
          para.area = this.filters.area
        }
        if(this.filters.consult != '') {
          para.consult = this.filters.consult
        }
				this.listLoading = true;
				//NProgress.start();
				getUserListPage(para).then((res) => {
          let code = res.data.code;
          if(code == 201) {
            console.log(201)
            this.$notify.error({
              title: '错误',
              message: '请求内容为空'
            });
          }
          this.total = res.data.total;
          let data = res.data.data;
          let areaList = this.areaList
          let consultList = this.consultList
					this.listLoading = false;
          let user = sessionStorage.getItem("user");
          let role = JSON.parse(user).role
          let list = [];
          console.log(data)
          if(role === 0) {
            list = data;
            this.showArea = true;
          }else {
            let area = JSON.parse(user).area;
            for(let item of data) {
              if(item.area === area) {
                list.push(item);
              }
            }
            //
          }
          console.log(list)
          for (let item of list) {
            console.log(item)
            let contents = item.content
            let area = item.area
            let consult = item.campsite
            if(this.areaList) {
              for(let areaItem of this.areaList) {
                if(areaItem.id == area) {
                  item.area = areaItem.name
                }
              }
            }
            if(consultList) {
              for(let consultItem of consultList) {
                if(consultItem.id == consult) {
                  item.campsite = consultItem.name
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
          this.users = list;
					//NProgress.done();
				});
			},
      //获取地区列表
      getArea() {
        let para = {
          page: this.page,
          name: this.filters.name,
        };
        getAreaList().then((res) => {
          //console.log(res.data.data)
          let list = res.data.data
          this.total = list.total;
          this.areaList = list;
        });
      },
      //获取咨询点列表
      getConsult() {
        //console.log(this.area);
        let para = {
          page: this.page,
          name: this.filters.name,
        };
        getPointList(para).then((res) => {
          //console.log(res.data.data)
          let list = res.data.data;
          //console.log(list)
          this.consultList = list;
          let area = this.area;
          if(area == '') {
            let user = sessionStorage.getItem("user");
            area = JSON.parse(user).area
          }
          console.log(area)
          let campsite = this.campsiteList;
          for(let item of list) {
            if(item.area === area) {
              console.log(item.name)
              campsite.push(item);
            }
          }
          console.log(campsite)
        });
      },
      chooseArea(e) {
        let arealist = this.areaList;
        this.campsiteList = [];
        for(let item of arealist) {
          if(item.id === e) {
            this.area = item.id;
          }
        }
        this.getConsult();
      },
      //通过 pass
      pass: function (index, row) {
        this.listLoading = true;
        let para = {}
        para.id = row.id;
        para.status = 1;
        editUser(para).then((res) => {
          console.log(res)
          this.listLoading = false;
          this.$message({
            message: '审核成功',
            type: 'success'
          });
          this.getUsers();
        });
      },
      //不通过
      deny: function (index, row) {
        this.listLoading = true;
        let para = {}
        para.id = row.id;
        para.status = -1;
        editUser(para).then((res) => {
          console.log(res)
          this.listLoading = false;
          this.$message({
            message: '审核成功',
            type: 'success'
          });
          this.getUsers();
        });
      },
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = row.id;
					removeUser(para).then((res) => {
            console.log(res)
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUsers();
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
					"area": "",
					"campsite": "",
					"complaintNum": 0,
					"consultNum": 0,
					"createTime": "2019-04-26T08:56:54.736Z",
					"id": "",
					"logNum": 0,
					"name": "",
					"openid": "",
					"phone": "",
					"receptionNum": 0,
					"status": "",
				};
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm);
              
              //para.token = sessionStorage.getItem("token");
              let status = para.status;
              let typeofstatus = parseFloat(status).toString() 
              if(typeofstatus == "NaN" ) {
                if (para.status == '离职') {
                  para.status = -2;
                }else if(para.status == '审核不过') {
                  para.status = -1;
                }else if(para.status == '审核中') {
                  para.status = 0;
                }else {
                  para.status = 1;
                }
              }
							para.createTime = (!para.createTime || para.createTime == '') ? '' : util.formatDate.format(new Date(para.createTime), 'yyyy-MM-dd');
							console.log(para)
              editUser(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getUsers();
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
							//NProgress.start();
							let para = Object.assign({}, this.addForm);
							para.createTime = (!para.createTime || para.createTime == '') ? '' : util.formatDate.format(new Date(para.createTime), 'yyyy-MM-dd');
							addUser(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getUsers();
							});
						});
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
			batchRemove: function () {
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: ids };
					batchRemoveUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUsers();
					});
				}).catch(() => {

				});
			}
		},
		mounted() {
			this.getUsers();
      this.getArea();
      this.getConsult();
		}
	}

</script>

<style scoped>

</style>
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
				<el-form-item>
					<el-button type="primary" v-on:click="getPoint" v-if="showArea">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="points" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="60">
			</el-table-column>
			<el-table-column type="index" width="80">
			</el-table-column>
      <el-table-column prop="name" label="名称" sortable>
      </el-table-column>
			<el-table-column prop="area" label="所属区域" sortable>
			</el-table-column>
			<el-table-column prop="createTime" label="创建时间"  sortable>
			</el-table-column>
			<el-table-column prop="peopleNum" label="人数" sortable>
			</el-table-column>
			<el-table-column label="操作" >
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!-- 工具条 -->
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
				<el-form-item label="名称">
					<el-input v-model="editForm.name"></el-input>
				</el-form-item>
				<el-form-item label="所属区域">
					<el-select v-model="editForm.area" placeholder="请选择活动区域">
            <el-option v-for="item in areaList" 
                       :key="item.id" 
                       :label="item.name" 
                       :value="item.id">
            </el-option>
					</el-select>
				</el-form-item>
        <el-form-item label="人数">
        	<el-input-number
           v-model="editForm.peopleNum"
           :min="0" 
           :max="200"
          ></el-input-number>
        </el-form-item>
				<el-form-item label="创建时间">
					<el-col :span="11">
						<el-date-picker type="date" placeholder="选择日期" v-model="editForm.createTime" style="width: 100%;"></el-date-picker>
					</el-col>
					<el-col class="line" :span="2">-</el-col>
        </el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="100px" :rules="addFormRules" ref="addForm">
				<el-form-item label="名称">
					<el-input v-model="addForm.name"></el-input>
				</el-form-item>
				<el-form-item label="所属区域">
					<el-select
            v-model="addForm.area"
            clearable 
            placeholder="请选择活动区域"
          >
						<el-option v-for="item in areaList" 
						           :key="item.id" 
						           :label="item.name" 
						           :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="创建时间">
					<el-col :span="11">
						<el-date-picker type="date" placeholder="选择日期" v-model="addForm.createTime" style="width: 100%;"></el-date-picker>
					</el-col>
					<el-col class="line" :span="2">-</el-col>
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
	import NProgress from 'nprogress'
	import { getPointListPage, removePoint, editPoint, addPoint, getPointList, getAreaList } from '../../api/api';

	export default {
		data() {
			return {
				filters: {
					area: '',
          createTime: "",
				},
        form: {
        	"area": "",
          "createTime": "",
          "id": "",
          "name": "",
          "peopleNum": 0
        },
        allarea: null,
				points: [],
        areaList: [],
				total: 0,
				index: 1,
        size: 20,
        showArea: false,
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					"area": "",
          "createTime": "",
          "id": "",
          "name": "",
          "peopleNum": 0
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					"area": "",
          "createTime": "",
          "id": "",
          "name": "",
				}
			}
		},
		methods: {
			handleCurrentChange(val) {
				this.index = val;
				this.getPoint();
			},
       //获取地区列表
      getArea() {
        var that = this;
        let para = {
          name: that.filters.name,
        };
        getAreaList(para).then((res) => {
          let list = res.data.data
          that.areaList = list;
          that.allarea = list
        });
      },
      //获取查询时选中的地区
      chooseArea(e) {
        let arealist = this.areaList;
        this.campsiteList = [];
        for(let item of arealist) {
          if(item.id === e) {
            this.area = item.id;
          }
        }
      },
			//获取咨询点列表
			getPoint() {
        var that = this;
        that.listLoading = true;
				let para = {
          index: (this.index-1)*this.size, 
          size: this.size,
        };
        if(that.filters.area != '') {
          para.area = that.filters.area;
        }
        if(that.filters.createTime != '') {
          para.createTime = that.filters.createTime;
          para.createTime = (!para.createTime || para.createTime == '') ? '' : util.formatDate.format(new Date(para.createTime), 'yyyy-MM-dd'); 
        }
				for(let item of this.areaList) {
          if(para.area == item.name) {
            para.area = item.id
          }
        }
				getPointListPage(para).then((res) => {
          this.listLoading = false;
          let code = res.data.code;
          this.total = res.data.total;
          if(code == "666") {
            that.$router.push({ path: '/Login' });
          }
          if(code == 201) {
            this.points = [];
          }
          let data = res.data.data;
          let user = sessionStorage.getItem("user");
          let role = JSON.parse(user).role;  //获取用户权限
          let area = JSON.parse(user).area; //获取用户所在地区
          let list = [];  //用来暂存数据的数组
          let areaList = that.areaList;  //地区列表
          if(role === 0) {  //超级管理员显示所有咨询点信息
            list = data;
            that.showArea = true;
          }else {
            //根据用户的area 来添加咨询点
            for(let item of data) {
              if(item.area === area) {
                list.push(item);
              }
            }
            //将管理员所在地区 area 的id替换对应名称，用于在页面显示
//             if(areaList) {
//               for(let item of areaList) {
//                 if(item.id === area) {
//                   area = item.name;
//                 }
//               }
//             }
          }
          //将咨询点的列表中的 area 从 id 变为名称
          for(let item of list) {
            for(let a of that.areaList) {
              if(item.area == a.id) {
                item.area = a.name
              }
            }
            item.createTime = (!item.createTime || item.createTime == '') ? '' : util.formatDate.format(new Date(item.createTime), 'yyyy-MM-dd');  //格式化日期
          }
          setTimeout(() => {
            
          },500)
					this.points = list;  //将list赋值给绑定的咨询点列表
          //console.log(this.points)
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
          //console.log(para);
					removePoint(para).then((res) => {
						this.listLoading = false;
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getPoint();
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
					"createTime": "",
					"id": "",
					"name": "",
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
              //console.log(para)
              for(let item of this.areaList) {
                if(para.area == item.name) {
                  para.area = item.id
                }
              }
							para.createTime = (!para.createTime || para.createTime == '') ? '' : util.formatDate.format(new Date(para.createTime), 'yyyy-MM-dd');
							editPoint(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getPoint();
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
							addPoint(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getPoint();
							});
						});
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
		},
		mounted() {
      var that = this
      this.getArea();
      setTimeout(function() {
         that.getPoint();
      },500)
     
		}
	}

</script>

<style scoped>

</style>
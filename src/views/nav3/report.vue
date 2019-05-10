<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      
			<el-form :inline="true" :model="filters">
        <el-form-item label="开始时间">
        	<el-date-picker type="date" placeholder="选择日期" v-model="filters.startTime"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间">
        	<el-date-picker type="date" placeholder="选择日期" v-model="filters.endTime"></el-date-picker>
        </el-form-item>
        <el-form-item label="区域" prop="area" v-if="showArea">
        	<el-select 
            v-model="filters.area" 
            placeholder="全部" 
            clearable 
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
            placeholder="全部"
          >
        	  <el-option v-for="item in campsiteList" 
        	             :key="item.id" 
        	             :label="item.name" 
        	             :value="item.id">
        	  </el-option>
        	</el-select>
        </el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getReport">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>
    <!-- 总数 -->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="alldata">
          <el-form-item label="总咨询数: " class="totleitem">
            {{ alldata.consultTotal }}
          </el-form-item>
          <el-form-item label="总接待数: " class="totleitem">
            {{ alldata.receptionTotal }}
          </el-form-item>
          <el-form-item label="总投诉数: " class="totleitem">
            {{ alldata.complaintTotal }}
          </el-form-item>
        </el-form>
    </el-col>
		<!--列表-->
		<el-table :data="reports" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
      <el-table-column  type="expand">
        <template slot-scope="props">
          <el-form label-position="left" class="table-expand">
            <el-form-item label="" id="form-table" class="formtable">
              <ul v-for="item in props.row.content" class="">
                <li class="liItem">
                  <div>电话投诉内容: 
                    <p>{{item.consultContent}}</p>
                  </div>
                  <div>反馈内容: 
                    <p>{{item.replyContent}}</p>
                  </div>
                </li>
              </ul>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
			<el-table-column type="index" width="65">
			</el-table-column>
			<el-table-column prop="name" label="姓名" width="100" sortable>
			</el-table-column>
			<el-table-column prop="area" label="区域" sortable>
			</el-table-column>
			<el-table-column prop="consult" label="咨询点" sortable>
			</el-table-column>
      <el-table-column prop="consultNum" label="咨询数" width="100" sortable>
      </el-table-column>
      <el-table-column prop="receptionNum" label="接待数" sortable>
      </el-table-column>
      <el-table-column prop="complaintNum" label="投诉数" sortable>
      </el-table-column>
      <el-table-column prop="reportTime" label="上报日期" width="120" sortable>
      </el-table-column>
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
    <el-col :span="24" class="toolbar">
    	<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :index-size="20" :total="total" style="float:right;">
    	</el-pagination>
    </el-col>
		<!-- <el-col :span="24" class="toolbar">
			<el-pagination
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :page-size="20" 
        :total="total"
        style="float:right;">
			</el-pagination>
		</el-col> -->

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="区域" prop="area">
					<el-select v-model="editForm.area" placeholder="请选择区域" @change="chooseArea">
					  <el-option v-for="item in areaList" 
					             :key="item.id" 
					             :label="item.name" 
					             :value="item.id">
					  </el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="咨询点" prop="consult">
					<el-select v-model="editForm.consult" placeholder="请选择咨询点">
					  <el-option v-for="item in campsiteList" 
					             :key="item.id" 
					             :label="item.name" 
					             :value="item.id">
					  </el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="接待数">
					<el-input-number v-model="editForm.receptionNum" :min="0" :max="200"></el-input-number>
				</el-form-item>
        <el-form-item label="咨询数">
        	<el-input-number v-model="editForm.consultNum" :min="0" :max="200"></el-input-number>
        </el-form-item>
        <el-form-item label="投诉数">
        	<el-input-number v-model="editForm.complaintNum" :min="0" :max="200"></el-input-number>
        </el-form-item>
        <el-form-item label="上报日期">
        	<el-date-picker type="date" placeholder="选择日期" v-model="editForm.reportTime"></el-date-picker>
        </el-form-item>
<!-- 				<el-form-item label="投诉内容">
					<el-input type="textarea" v-model="editForm.consultContent" placeholder="投诉电话内容"></el-input>
				</el-form-item>
        <el-form-item label="反馈内容">
        	<el-input type="textarea" v-model="editForm.replyContent" placeholder="投诉反馈内容"></el-input>
        </el-form-item> -->
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<!-- <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
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
				<el-form-item label="咨询点" prop="consult">
					<el-select v-model="addForm.consult" placeholder="请选择咨询点">
					  <el-option v-for="item in campsiteList" 
					             :key="item.id" 
					             :label="item.name" 
					             :value="item.id">
					  </el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="接待数">
					<el-input-number v-model="addForm.receptionNum" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="咨询数">
					<el-input-number v-model="addForm.consultNum" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="投诉数">
					<el-input-number v-model="addForm.complaintNum" :min="0" :max="200"></el-input-number>
				</el-form-item>
        <el-form-item label="上报日期">
        	<el-date-picker type="date" placeholder="选择日期" v-model="addForm.reportTime"></el-date-picker>
        </el-form-item>
				<el-form-item label="投诉内容">
					<el-input type="textarea" v-model="addForm.consultContent" placeholder="投诉电话内容"></el-input>
				</el-form-item>
				<el-form-item label="反馈内容">
					<el-input type="textarea" v-model="addForm.replyContent" placeholder="投诉反馈内容"></el-input>
				</el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
      	<el-button @click.native="addFormVisible = false">取消</el-button>
      	<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
		</el-dialog> -->
	</section>
</template>

<script>
	import util from '../../common/js/util'
	import { getReportPage, removeReport, getAreaList, getPointList, editReport, addReport, getReportList } from '../../api/api';

	export default {
    inject: ['reload'],
		data() {
			return {
				filters: {
					name: '',
          area: '',
          consult: '',
          startTime: '',
          endTime: '',
				},
        area: 'null',  //选中的地区id
        alldata: {  //总数
          complaintTotal: 0,
        },
        areaList: null,  //地区列表
        campsiteList: null,  //页面绑定的咨询点列表
        consultList: null,  //咨询点列表
        data: {},  
				reports: null,  //报表项
				total: 0,
				index: 1,
				size: 10,
        showArea: false,  //根据权限判断是否显示area选项
				listLoading: false,  //加载状态
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,  
				editFormRules: {  //编辑页面规则
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					],
          area: { required: true, message: '请输入地区', trigger: 'blur' },
          consult: { required: true, message: '请输入咨询点', trigger: 'blur' },
				},
				//编辑界面数据
				editForm: { //编辑页面数据
					"area": "string",
          "complaintNum": 0,
          "consult": "string",
          "consultNum": 0,
          "content": [{},{}],
          "id": "string",
          "name": "string",
          "receptionNum": 0,
          "reportTime": "2019-04-27T08:12:36.448Z",
          "user": "string",
          "consultContent": "",
          "replyContent": "",
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: { //新增页面规则
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					],
					area: { required: true, message: '请输入地区', trigger: 'blur' },
					consult: { required: true, message: '请输入咨询点', trigger: 'blur' },
				},
				//新增界面数据
				addForm: {  
					"area": "",
          "complaintNum": 0,
          "consult": "",
          "consultNum": 0,
          "content": [{},{}],
          "id": "",
          "name": "",
          "receptionNum": 0,
          "reportTime": "2019-04-27T08:12:36.414Z",
          "user": "",
          "consultContent": "",
          "replyContent": "",
				}
			}
		},
		methods: {
			handleCurrentChange(val) {
				this.index = val;
        console.log()
				this.getReport();
			},
       getArea() {
        getAreaList().then((res) => {
          let list = res.data.data;
          this.areaList = list;
          this.getConsult()
        });
      },
      //获取咨询点列表
      getConsult() {
        let para = {
          index: this.index, 
          size: this.size,
        };
        getPointList(para).then((res) => {
          let list = res.data.data;
          this.consultList = list;  //地区列表
          let area = this.area;  //获得选中的地区
          let user = sessionStorage.getItem("user");
          user = JSON.parse(user)  //获取用户所在地区id
          let role = user.role;  //获取用户权限
          let pointlist = [];
          this.total = res.data.total;
          let campsite = this.campsiteList;
          if(role === 0) {
            pointlist = list;
            for(let item of pointlist) {
              if(item.area === area) {
                campsite.push(item);
              }
            }
            this.campsiteList = campsite;
          }else{
            let userareaid = user.area;
            for(let item of res.data.data) {
              if(item.area === userareaid) {
                pointlist.push(item);
              }
            }
            this.campsiteList = pointlist;
          } 
        });
      },
			//获取报表列表
			getReport() { 
        var that = this
        //判断请求是否携带参数---带参数为查询
				let para = {
          index: this.index, 
          size: this.size, 
        };
        if(that.filters.endTime != '') {
          para.end = that.filters.endTime;
          para.end = (!para.end || para.end == '') ? '' : util.formatDate.format(new Date(para.end),'yyyy-MM-dd');
        }
        if(that.filters.startTime != '') {
          para.start = that.filters.startTime;
          para.start = (!para.start || para.start == '') ? '' : util.formatDate.format(new Date(para.start),'yyyy-MM-dd');
        }
        if(that.filters.area != '') {
          para.area = that.filters.area;
        }
        if(that.filters.consult != '') {
          para.consult = that.filters.consult;
        }
        //发送获得报表请求
				getReportPage(para).then((res) => {
          let code = res.data.code;  //获取状态码
          let all = res.data.data;  //报表的所有数据--含总数
          this.total = res.data.total;
          if(code == "666") {
            that.$router.push({ path: '/Login' });
          }
          if(code == 201) {
            that.$notify.error({
              title: '错误',
              message: '请求内容为空'
            });
          }
          let list = res.data.data.reports;  //报表列
          let areaList = that.areaList ; //获得地区列表
          let consultList = that.consultList ; //获得咨询点列表
          let user = sessionStorage.getItem("user");  //获得管理员信息
          let role = JSON.parse(user).role;
          let reportList = [];  //定义所要显示的报表信息
          
          if(role === 0) {  //判断是否为超级管理员，  0为超级管理员
            reportList = list;
            that.showArea = true;
          }else {
            that.showArea = false;
            let area = JSON.parse(user).area;  //获取用户所在的地区id
            for(let item of list) {  //把报表中在该地区的报表显示
              if(item.area === area) {
                reportList.push(item);
              }
            }
          }
          that.alldata = all;
          for(let item of reportList) {
            let contents = item.content;  //投诉和反馈内容
            let area = item.area;
            let consult = item.consult;
            if(areaList){  //将地区从id转变为名称显示
              for(let areaItem of areaList) {
                if(areaItem.id == area) {
                  item.area = areaItem.name;
                }
              }
            }
            if(consultList) {  //将咨询点从id转变为名称显示
              for(let consultItem of consultList) {
                if(consultItem.id == consult) {
                  item.consult = consultItem.name;
                }
              }
            }
            item.content = JSON.parse(contents);  //将内容转成json对象
            item.reportTime = (!item.reportTime || item.reportTime == '') ? '' : util.formatDate.format(new Date(item.reportTime), 'yyyy-MM-dd');  // 转换时间的格式
          }
          that.reports = reportList;
					that.listLoading = false;
				});
			},
       //获取地区列表
     
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

			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = row.id;
					removeReport(para).then((res) => {
            //console.log(res)
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getReport();
					});
				}).catch((res) => {
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
          "complaintNum": 0,
          "consult": "",
          "content": null,
          "consultNum": 0,
          "id": "",
          "name": "",
          "receptionNum": 0,
          "reportTime": "2019-04-27T08:12:36.414Z",
          "user": "string",
          "consultContent": "",
          "replyContent": "",
				};
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							let para = Object.assign({}, this.editForm);
              //let content = {};
              var content = [{consultContent: para.consultContent, replyContent: para.replyContent}];
              content = JSON.stringify(content);
              para.content = content;
							para.reportTime = (!para.reportTime || para.reportTime == '') ? '' : util.formatDate.format(new Date(para.reportTime), 'yyyy-MM-dd');
              console.log(para);
							editReport(para).then((res) => {
								this.editLoading = false;
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getReport();
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
              //console.log(para);
              var content = [{consultContent: para.consultContent, replyContent: para.replyContent}];
              content = JSON.stringify(content);
              para.content = content;
							para.reportTime = (!para.reportTime || para.reportTime == '') ? '' : util.formatDate.format(new Date(para.reportTime), 'yyyy-MM-dd');
              console.log(para);
              //var par = JSON.stringify(para);
              //console.log(par);
							addReport(para).then((res) => {
                //console.log(para);
                //console.log(res);
								this.addLoading = false;
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getReport();
							});
						});
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
        //console.log(sels)
			},
		},
    beforeMount() {
      console.log(sessionStorage.getItem("token"))
    },
		mounted() {
      console.log(sessionStorage.getItem("token"))
      setTimeout(() => {
        this.getArea();
        this.getConsult();
        this.getReport();
       // this.reload();
      }, 1000)
      
		}
	}

</script>

<style scoped>
  .table-expand {
      font-size: 0;
  }
  .table-expand label {
      width: 90px;
      color: #99a9bf;
  }
  .table-expand .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      width: 100%;
  }
  .totleitem {
    margin-right: 3rem;
  }
  .formtable {
    font-size: 18px;
    font-weight: bold;
    color:
  }
  .formtable li:nth-child(0) {
    margin-top: 40px;
  }
  .formtable li {
    list-style: none;
    border-bottom: 2px solid #DFE6EC;
  }
  .formtable .liItem {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
  }
  .liItem div {
    width: 50%;
    paddng-right: 10px;
  }
  .liItem p {
    maring-right: 20px;
    padding-right: 20px;
    text-indent: 2em;
    color: #666;
  }
/*  .table-expand #form-table .el-form-item__content{
    display: block;
    width: 100%;
  } */
</style>

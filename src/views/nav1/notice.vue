<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
 <!--       <el-form-item label="创建时间">
        	<el-date-picker type="date" placeholder="选择日期" v-model="filters.createTime"></el-date-picker>
        </el-form-item> -->
<!-- 				<el-form-item>
					<el-button type="primary" v-on:click="getNotice">查询</el-button>
				</el-form-item> -->
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>
    <el-col :span="24" class="toolbar">
      <div>友情提示： 点击左侧箭头可查看公告内容； 新增时可点击H1/H2编写标题</div>
    </el-col>
		<!--列表-->
		<el-table :data="notice" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
     <el-table-column  type="expand">
        <template slot-scope="props">
          <el-form label-position="left" class="table-expand">
            <el-form-item>
              <div v-html="props.row.content.content"></div>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column> 
			<el-table-column type="index" width="80">
			</el-table-column>
    <!--  <el-table-column label="内容" prop="content" min-width="250">
      </el-table-column> -->
      <el-table-column prop="createTime" label="创建日期" sortable nim-width="115">
      </el-table-column>
      <el-table-column prop="updateTime" label="更新日期" sortable nim-width="115">
      </el-table-column>
      <el-table-column prop="status" label="展示">
      </el-table-column>
			<el-table-column label="操作" width="160">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
  <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
      </el-pagination>
    </el-col>

		<!--修改界面-->
		<el-dialog title="修改公告" class="dialog" v-model="editFormVisible" :close-on-click-modal="false" custom-class="dialog">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <!--使用编辑器-->
        <el-form-item label="内容">
          <div class="edit_container">
            <quill-editor 
              v-model="editForm.content"
              ref="myQuillEditor"
              class="editer"
              @ready="onEditorReady($event)"
            >
            </quill-editor>
          </div>
        </el-form-item>
        <el-form-item label="创建时间">
        	<el-date-picker type="date" placeholder="选择日期" v-model="editForm.createTime"></el-date-picker>
        </el-form-item>
        <el-form-item label="更新时间">
        	<el-date-picker type="date" placeholder="选择日期" v-model="editForm.updateTime"></el-date-picker>
        </el-form-item>
        <el-form-item label="是否展示" prop="status">
          <el-select v-model="editForm.status">
            <el-option label="展示" value="1"></el-option>
            <el-option label="隐藏" value="0"></el-option>
          </el-select>
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
        <!--使用编辑器-->
        <el-form-item label="内容">
          <div class="edit_container">
            <quill-editor 
              v-model="addForm.content"
              ref="myQuillEditor"
              class="editer"
              @ready="onEditorReady($event)"
            >
            </quill-editor>
          </div>
        </el-form-item>
        <el-form-item label="创建时间">
        	<el-date-picker type="date" placeholder="选择日期" v-model="addForm.createTime"></el-date-picker>
        </el-form-item>
        <el-form-item label="是否展示" prop="status">
          <el-select v-model="addForm.status">
            <el-option label="展示" value="1"></el-option>
            <el-option label="隐藏" value="0"></el-option>
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
  import { quillEditor } from 'vue-quill-editor' //调用富文本编辑器
	import { getNoticeListPage, removeNotice, editNotice, addNotice } from '../../api/api';
  //引入富文本样式
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'

	export default {
		data() {
			return {
				filters: {
					title: '',
          createTime: '',
				},
				notice: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列
        token: sessionStorage.getItem('token'),
        //editorOption: {},

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
// 					title: [
// 						{ required: true, message: '请输入标题', trigger: 'blur' }
// 					],
          // content: { required: true, message: '请输入内容', trigger: 'blur' }
				},
				//编辑界面数据
				editForm: {
          content: '',
          createTime: '',
          updateTime: '',
          editorOption: {},
          status: '',
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					title: [
						{ required: true, message: '请输入标题', trigger: 'blur' }
					],
					content: { required: true, message: '请输入内容', trigger: 'blur' }
				},
				//新增界面数据
				addForm: {
					content: '',
          createTime: '',
          editorOption: {},
          status: '',
				}
			}
		},
    computed: {
      editor() {
        return this.$refs.myQuillEditor.quill
      }
    },
		methods: {
      onEditorReady(editor) {
      },
			handleCurrentChange(val) {
				this.page = val;
				this.getNotice();
			},
			//获取公告列表
			getNotice() {
        //console.log(this.token)
				let para = {
					//page: this.page,
				};
        if(this.filters.createTime != '') {
          para.createTime = this.filters.createTime
          para.createTime = (!para.createTime || para.createTime == '') ? '' : util.formatDate.format(new Date(para.createTime),'yyyy-MM-dd');
        }
				this.listLoading = true;
				//NProgress.start();
				getNoticeListPage(para).then((res) => {
          //console.log(res);
          let data = res.data.data;         
					this.notice = data;
					this.listLoading = false;
          let noticeList = this.notice;
          console.log(noticeList)
          for(let item of noticeList) {
            item.content = JSON.parse(item.content)
            //console.log(typeof item.content)
            item.status = item.status == 0?"隐藏": "展示";
            item.createTime = (!item.createTime || item.createTime == '') ? '' : util.formatDate.format(new Date(item.createTime), 'yyyy-MM-dd') || '';
            item.updateTime = (!item.updateTime || item.updateTime == '') ? '' : util.formatDate.format(new Date(item.updateTime), 'yyyy-MM-dd') || '';
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
					let para = row.id;
          //console.log(para)
					removeNotice(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getNotice();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
        this.editForm.content = '';
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					title: "",
          content: "",
          createTime: "",
				};
			},
      
			//编辑
			editSubmit: function () {
        let that = this
				that.$refs.editForm.validate((valid) => {
					if (valid) {
						that.$confirm('确认提交吗？', '提示', {}).then(() => {
							that.editLoading = true;
							let para = Object.assign({}, that.editForm);  
              let content = {};
              let status = para.status;
              let typeofstatus = parseFloat(status).toString() 
              if(typeofstatus == "NaN" ) {
                if (para.status == '展示') {
                  para.status = 1;
                }else if(para.status == '隐藏') {
                  para.status = 0;
                }
              }
              content.content = para.content;
              para.content = JSON.stringify(content);
              para.token = that.token;
							para.createTime = (!para.createTime || para.createTime == '') ? '' : util.formatDate.format(new Date(para.createTime), 'yyyy-MM-dd');
              para.updateTime = (!para.updateTime || para.updateTime == '') ? '' : util.formatDate.format(new Date(para.updateTime), 'yyyy-MM-dd');
							editNotice(para).then((res) => {
								that.editLoading = false;
								that.$message({
									message: '提交成功',
									type: 'success'
								});
								that.$refs['editForm'].resetFields();
								that.editFormVisible = false;
								that.getNotice();
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
              //把标题和内容拼接
              let content = {};
              content.content = para.content;
              para.content = JSON.stringify(content);
              para.token = this.token;
							para.createTime = (!para.createTime || para.createTime == '') ? '' : util.formatDate.format(new Date(para.createTime), 'yyyy-MM-dd');
							addNotice(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getNotice();
							});
						});
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
		},
    computed: {
      editor() {
        return this.$refs.myQuillEditor.quill
      }
    },
		mounted() {
			this.getNotice();
		},
    components: {
    //使用编辑器
      quillEditor
    }
	}

</script>

<style scoped>
.dialog {
  width: 100%;
}
</style>

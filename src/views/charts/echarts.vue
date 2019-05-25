<template>
    <section class="chart-container">
        <el-row>
            <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            	<el-form :inline="true" :model="filters">
                <!-- <el-form-item label="开始时间">
                	<el-date-picker 
                        type="date" 
                        :picker-options="pickerOptions0"
                        placeholder="选择日期" 
                        v-model="filters.startTime"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间">
                	<el-date-picker 
                        type="date" 
                        :picker-options="pickerOptions0"
                        placeholder="选择日期" 
                        v-model="filters.endTime"
                    ></el-date-picker>
                </el-form-item> -->
                <el-form-item label="选择月份">
                    <el-date-picker
                      v-model="filters.month"
                      type="month"
                      :picker-options="pickerOptions0"
                      placeholder="选择月">
                    </el-date-picker>
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
            			<el-button type="primary" v-on:click="drawColumnChart">查询</el-button>
            		</el-form-item>
                <el-form-item>
                	<el-button type="primary" v-on:click="exportData">导出</el-button>
                </el-form-item>
            	</el-form>
            </el-col>
            <el-col :span="12">
                <div id="chartColumn" style="width:100%; height:400px;"></div>
            </el-col>
            <el-col :span="12">
                <div id="chartPie" style="width:100%; height:400px;"></div>
            </el-col>
        </el-row>
    </section>
</template>

<script>
    import echarts from 'echarts'
    import util from '../../common/js/util'
    import { getReportPage, removeReport, getAreaList, getPointList, getReportExcle } from '../../api/api';
    

    export default {
      data() {
          return {
              pickerOptions0: {
                disabledDate(time) {
                  return time.getTime() > Date.now() - 8.64e6;//如果没有后面的-8.64e6就是不可以选择今天的
                }
              }, 
              
              chartColumn: null,
              chartBar: null,
              chartLine: null,
              chartPie: null,
              
              filters: {
                name: '',
                area: '',
                consult: '',
                startTime: '',
                endTime: '',
                month: '',
              },
              
              showArea: false,
              areaList: null,  //地区列表
              campsiteList: null,  //页面绑定的咨询点列表
              consultList: null,  //咨询点列表
              area: 'null',  //选中的地区id
          }
      },

      methods: {
        //获取地区列表
        async getArea() {
            getAreaList().then((res) => {
              let list = res.data.data;
              this.areaList = list;
              sessionStorage.setItem("areaList", this.areaList)
              //this.getConsult()
            });
        },
        //获取咨询点列表
        async  getConsult() {
          let para = {};
          getPointList(para).then((res) => {
            let list = res.data.data;
            this.consultList = list;  //地区列表
            let area = this.area;  //获得选中的地区
            let user = sessionStorage.getItem("user");
            user = JSON.parse(user)  //获取用户所在地区id
            let role = user.role;  //获取用户权限
            let pointlist = [];
            console.log(this.consultList)
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
        /* 下载报表 */
        exportData() {
          var that = this
          //var url = "https://www.dingguangroup.com/test/workReport/Report/export"
          var url = "http://120.79.9.157:8080/workReport/Report/export"
          let nowdays = new Date();
          let year = nowdays.getFullYear();
          let month = nowdays.getMonth() + 1;
          if (month < 10) {
            month = "0" + month;
          }
          /* end 获取上个月的开始和结束日期 */
          let para = {}
          if(that.filters.month) {
              para = that.filters.month;
              para = (!para || para == '') ? '' : util.formatDate.format(new Date(para),'yyyy-MM');   
          }else {
            para = `${year}-${month}`
          }
          //url = `${url}?&index=0&size=1&month=${para}`
          url = `${url}?month=${para}`
          console.log(url)
          window.open(url)
        },

          
        /*选择区域*/
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
        /* 查询 、 绘制图表 */
        drawColumnChart() {
            var that = this;
            var list = [];
            let user = sessionStorage.getItem("user");  //获得管理员信息
            let role = JSON.parse(user).role;
            
            /* 获取上个月的开始和结束日期 */
            var nowdays = new Date();
            var year = nowdays.getFullYear();
            var month = nowdays.getMonth() + 1;
//                 if(month==0){
//                   month=12;
//                   year=year-1;
//                 }
            if (month < 10) {
              month = "0" + month;
            }
            /* end 获取上个月的开始和结束日期 */
            let para = {}
            console.log(that.filters.month)
            if(that.filters.month) {
                para.month = that.filters.month;
                para.month = (!para.month || para.month == '') ? '' : util.formatDate.format(new Date(para.month),'yyyy-MM');
                month = para.month.slice(5,7);
            }else {
              para.month = para.month = `${year}-${month}`
            }
//                 if(that.filters.startTime && that.filters.endTime ) {
//                     para.start = that.filters.startTime;
//                     para.end = that.filters.endTime;
//                     para.start = (!para.start || para.start == '') ? '' : util.formatDate.format(new Date(para.start),'yyyy-MM-dd');
//                     para.end = (!para.end || para.end == '') ? '' : util.formatDate.format(new Date(para.end),'yyyy-MM-dd');
//                     month = para.start.slice(5,7);
//                     console.log(month)
//                 }else {
//                   para.start = firstDay
//                   para.end = endDay
//                 }
            if(role === 0) {  //判断是否为超级管理员，  0为超级管理员
              that.showArea = true;
              if(that.filters.area != '') {
                para.area = that.filters.area;
              }
            }else{
                that.showArea = false;
                let area = JSON.parse(user).area;
                para.area = area;
            }
            if(that.filters.consult != '') {
              para.consult = that.filters.consult;
            }
            getReportPage(para).then((res) => {
              let data = res.data.data
              let code = res.data.code
              console.log(data)
              if(code == "666") {
                that.$router.push({ path: '/Login' });
              }
              if(res.data.code === 201) {
                list = []
              }
              if(!data) {
                list = []
              }else{
                list.push(data.consultTotal)
                list.push(data.receptionTotal)
                list.push(data.complaintTotal)
              }
              
              //开始柱状绘图
              this.chartColumn = echarts.init(document.getElementById('chartColumn'));
              const colors = ['#5793f3', '#675bba', '#d14a61'];
              this.chartColumn.setOption({
                color: colors,
                title: { text: `${year}年${month}月数据汇总` },
                tooltip: {},
                toolbox: {
                  //show: true,
                  feature: {
                    dataZoom: {
                      yAxisIndex: 'none'
                    },
                    dataView: {readOnly: false},
                    magicType: {type: ['bar', 'line']},
                    restore: {},
                  }
                },
                xAxis: {
                    type: 'category',
                    data: ["总咨询数", "总接待数", "总投诉数"]
                },
                yAxis: {
                    axisLabel: {
                        formatter: '{value}'
                    }
                },
                series: [{
                    name: `${year}年${month}月数据汇总`,
                    type: 'bar',
                    data: list,
                    itemStyle: {
                        normal: {
                            color: '#20A0FF',//设置柱子颜色
                            label: {
                                show: true,//柱子上显示值
                                position: 'top',//值在柱子上方显示
                                textStyle: {
                                    color: '#FD6B71'//值得颜色
                                }
                            }
                        }
                    },
                    barWidth: 30//设置柱子宽度，单位为px
                }],
              });
               //开始饼状绘图
              this.chartPie = echarts.init(document.getElementById('chartPie'));
              this.chartPie.setOption({
//                       title: {
//                           text: '饼状图',
//                           x: 'center'
//                       },
                  tooltip: {
                      trigger: 'item',
                      formatter: "{a} <br/>{b} : {c} ({d}%)"
                  },
                  legend: {
                      orient: 'vertical',
                      left: 'left',
                      data: ["总咨询数", "总接待数", "总投诉数"]
                  },
                  series: [
                      {
                          name: '访问来源',
                          type: 'pie',
                          radius: '55%',
                          center: ['50%', '60%'],
                          data: [
                              { value: list[0], name: '总咨询数' },
                              { value: list[1], name: '总接待数' },
                              { value: list[2], name: '总投诉数' }
                          ],
                          itemStyle: {
                              emphasis: {
                                  shadowBlur: 10,
                                  shadowOffsetX: 0,
                                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                              }
                          }
                      }
                  ]
              });
            })
        },
        async drawPieChart() {
            
        },
        async drawCharts() {
            this.drawColumnChart()
            this.drawPieChart()
        },
          
      },
      beforeMount: function() {
            this.getArea();
            this.getConsult();
      },
      mounted: function () {          
        setTimeout(() => {
          //this.getReport();
          this.drawCharts()
        }, 1000) 
      },
//         updated: function () {
//             this.drawCharts()
//         }
    }
</script>

<style scoped>
    .chart-container {
        width: 100%;
        float: left;
    }
    /*.chart div {
        height: 400px;
        float: left;
    }*/

    .el-col {
        padding: 30px 20px;
    }
</style>

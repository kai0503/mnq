<template>
	<view id="app">
		
			<uni-popup ref="popup" :mask-click="false">
				<view class="popup-box">
					<text>设备号: {{uuid}}</text>
					<radio-group @change="radioChange" style="width: 100%;height: 520rpx;overflow: auto;margin-top: 15rpx;">
						<label v-for="(item,index) in orgList" :key="index" class="radio-item">
							<radio :value="item.id" />
							<view>{{item.name}}</view>
						</label>
					</radio-group>
					<view class="popup-btu">
						<button @click="submit()">绑定设备</button>
						<!-- <button @click="Next()">下一步</button> -->
					</view>
				</view>
			</uni-popup>
			<view  class="hd">
				<view  class="tianqi">
					  <iframe scrolling="no" src="https://tianqiapi.com/api.php?style=ty&skin=pitaya&color=FFF"  frameborder="0" width="400px" height="105px size:8px" allowtransparency="true"></iframe>
				</view>
				<view class="wz">
					<h1>
					{{orgname}}
					</h1>
				</view>
				<view  class="time">{{dateFormat(date)}}</view>
			</view>
			<view v-if="dk">
				<image src="../../static/dk.png" style="width: 23px;height: 23px;position: absolute;left: 92%;top: 65px;"></image>
			</view>
			<header>
				<view class="lefts">
					<view class="left-top">
						<view style="display: flex;justify-content: space-between;">
							<view><h3 style="position: relative;top:10rpx">今日客流 <text v-if="this.baojingtype" style="color:#ff0004;" >(当前客流量超出预警范围)</text></h3></view>
						<view style="margin-right: 40px;width: 300px;"><view><image src="../../static/man.png" style="width:60px;height: 60px;margin-left: 30px;position: relative;top:50px"></image><image src="../../static/women.png" style="width:60px;height: 60px;margin-left: 150px;position: relative;top:50px"></image></view></view>
						</view>
						
						<ul>
							   
							<li v-for="(item,index) in dayPassengerNum">
								<view class="cards">
																	<view class="card" ref="card">
																	<view class="face front"  style="width:100%;height:100%;">
																<view class="frame"   style="background-color: #0144FD;color:#fff;width: 100%;height:40px;position: relative;top: -3px;">{{item}}</view>
																</view>
															<view class="face back cardAK"  style="width:100%;height:100%;">
															<view class="frame" style="background-color:#04A8FE;color: white;width: 100%;height:40px;position: relative;top: -3px;">{{item}}</view>
															</view>
															</view>		
														</view>
							</li>
						<li style="color: white;">{{info.manNum}}</li>
						<li style="color: white;">{{info.womanNum}}</li>
						</ul>
						<view class="left-top-nums">
							<view class="left-top-num">市场容量:<text style="color:#00ff00; margin-left: 5rpx;">{{dayPassengerNums.peoplevolume}}</text></view>
							<view class="left-top-num">回头客:<text style="color:#00ff00; margin-left: 5rpx;">{{dayPassengerNums.repeat}}</text></view>
							<view class="left-top-num" v-if="this.shebeino == '0'">去重人数:<text style="color:#00ff00; margin-left: 5rpx;">{{dayPassengerNums.duplicate}}</text></view>
							<view class="left-top-num" v-if="this.shebeino == '1'">离开人数:
								<text style="color:#00ff00; margin-left: 5rpx;">{{dayPassengerNums.exitPeople}}</text>
							</view>
							<view class="left-top-num" v-if="this.shebeino == '1'">当前人数:
								<text style="color:#00ff00; margin-left: 5rpx;">{{dayPassengerNums.currentPeople}}</text>
							</view>
							
						</view>
					</view>
					<view class="left" style="position: relative;top: 60rpx;">
						<h3 style="position: relative;top: 45rpx;left: -5rpx;font-size: 80rpx;">今日交易人次</h3>
						<ul style="margin-top: 70rpx;position: relative;">
							<li v-for="(item,index) in tradeNum">{{item}}</li>
						</ul>
						<view style="width: 100%;height:75%;margin-top: 20rpx;">
							<l-echart ref="tradePeople"></l-echart>
						</view>
					</view>
				</view>
				<view class="right">
					<view class="right-top">
						<view style="width: 20%;">
							<text style="color: #3dcba5;">{{info.allQuota}}</text>
							<text style="font-size: 60px;">本月交易额</text>
						</view>
						<view style="width: 15%;">
							<text style="color: #d23157;">{{info.paycount}}</text>
							<text>本月订单数</text>
						</view>
						<view style="width: 15%;">
							<text style="color: #e4a541;">{{info.registerUser}}</text>
							<text>已注册商户数</text>
						</view>
						<view style="width: 15%;">
							<text style="color: #638cfc;">{{shdatection.monthCount}}</text>
							<text style="color: #00e870;">本月检测</text>
						</view>
						<view style="width: 15%;">
							<text style="color: #638cfc;">{{shdatection.goodrate}}%</text>
							<text style="color: #00e870;">本月合格率</text>
						</view>
						<view style="width: 15%;">
							<text style="color: #638cfc;">{{shdatection.spcount}}</text>
							<text style="color: #00e870;">检测商品</text>
						</view>
					</view>
					<view class="right-bottom">
						<view>
							<h3 style="font-size: 80rpx;">热销分类占比</h3>
							<view style="width: 100%;height:90%;">
						
									<l-echart ref="HotCategory"></l-echart>
							
							</view>
						</view>
						<view>
							<h3 style="font-size: 80rpx;">7日商户热度榜</h3>
							<view style="width: 100%;height: 90%;">
								<!-- <view class="info3-jdt" v-for="(it,index) in HeatList"    :key="index">
								            
								            <view class="info3-title" >{{it.name}}</view>
								            <view class="info3-1">
								              <view class="info3-2">{{it.value}} (单)</view>
								              <view class="g-container">
								                <view class="g-progress"></view>
								              </view>
								            </view>
								          </view> -->
										<l-echart ref="Heat"></l-echart>
							</view>
						</view>
					</view>
				</view>
			</header>
			<footer>
				<view class="left" >
					<h3>今日客流趋势</h3>
					<view style="width: 100%;height: 100%;">
						<l-echart ref="dayPassenger"></l-echart>
					</view>
				</view>
				<view class="left">
					<h3>本月客流趋势</h3>
					<view style="width: 100%;height: 100%;">
						<l-echart ref="monthPassenger"></l-echart>
					</view>
				</view>
				<view class="left">
					<h3>7日交易额、交易数</h3>
					<view style="width: 100%;height: 90%;">
						<l-echart style="width: 100%;height: 100%;" ref="tradeAmount"></l-echart>
					</view>
				</view>
				<view class="right">
					<h3>实时交易订单</h3>
					<ul class="th" style="background-color: #0b6c8a;opacity: 0.9;border-radius: 10rpx;">
						<li style="width: 25%;line-height: 100px;">商户名称</li>
						<li style="width: 25%;line-height: 100px;">商品</li>
						<li style="width: 25%;line-height: 100px;">金额</li>
						<li style="width: 25%;line-height: 100px;">时间</li>
					</ul>
					<view style="width: 100%;height:1550rpx;">
						<view class="scroll_box">
							<swiper class="swiper" circular="true" vertical="true" display-multiple-items="7" :autoplay="autoplay" :interval="interval" :duration="duration">
								<swiper-item  v-for="(item,index) in biaogeshuju" :key="index">
										<ul class="td">
											<li style="width: 25%;font-size: 40px;margin-left: 10px;">{{item.name}}</li>
											<li style="width: 25%;font-size: 40px;margin-left: 10px;margin-left: 10px;margin-left: 10px;">{{item.commodity}}</li>
											<li style="width: 25%;font-size: 40px;margin-left: 10px;margin-left: 10px;">{{item.money}}</li>
											<li style="width: 25%;font-size: 40px;margin-left: 10px;">{{item.times}}</li>
										</ul>
								</swiper-item>
							</swiper>
						</view>
					</view>
				</view>
				<!-- <text class="sbh"> 
					设备号: {{uuid}}
				</text> -->
			</footer>

	</view>
</template>

<script>
	import * as echarts from '@/uni_modules/lime-echart/components/l-echart/echarts';
	import $ from '../../static/jquery.js' 
	// import '../../static/echarts-tooltip-carousel.js'bannai
	 //import '../../static/particles.js'
	 //import '../../static/js/app.js'
	 // import '../../static/js/lib/stats.js'
	export default {
		data() {
			return {
				orgname : '',
				socketTask: null,
				socketFlag: false,
				uuid: '',
				orgList: [],
				orgid: '',
				orgName: '',
				TradePeopleList: [], //今日交易人次
				HotCategoryList: [], //热销分类
				HeatList: [], //商户热度
				AmountList: [], //交易额
				AmountList2: [], //交易数
				info: {},
				tradeNum: [],
				dayPassengerNum: [],//日客流量总和
				dayPassengerNums:[],//去重客流 会员客流 回头客数据
				baojingtype:false,
				shebeino:'',
				dayPassengerdata:[], //日趋势图内容
				dayPassengerdate:[], //日趋势图时间
				MonthPassengerdata:[],//月趋势图内容
				MonthPassengerdate:[],//月趋势图时间
				biaogeshuju:[],
				shdatection:[],//检测
				top: 0,
				autoplay:true, //动画
				interval:2000, //动画
				duration:5000, //动画
				wlflag:true,
				nowTime: '',
				dk:null,
				times:'',
				date:new Date()
			}
		},
		created() {
			
		 
			// #ifdef APP-PLUS
			// uni.showLoading({
			// 	title: '加载中'
			// })
			
			plus.device.getInfo({
				success: (e) => {
					console.log(e)
					let str=e.uuid.split(",")
					
					this.uuid =str[0];
					this.login();
					// this.nowTimes();
					//this.flip()
				},
				fail: (e) => {}
			});
			// #endif 
			// #ifdef H5
				this.uuid = "sn001";
				this.login()
				this.biaoge();
				 //this.flip()
				// this.nowTimes();
			// #endif
			console.log(this.uuid,'ddddddddddddddddddddddddddddddddddddddddddddddd') 
		},
		mounted(){
			   //显示当前日期时间
			          let _this = this// 声明一个变量指向Vue实例this，保证作用域一致
			          this.timer = setInterval(() => {
			           _this.date = new Date(); // 修改数据date
			           }, 1000)
					   //this.flip()
		},
		 beforeDestroy() {
		       if (this.timer) {
		        clearInterval(this.timer); // 在Vue实例销毁前，清除我们的定时器
		      }
		      },
		methods: {
			
			 dateFormat(time) {
			          var date=new Date(time);
			          var year=date.getFullYear();
			          /* 在日期格式中，月份是从0开始的，因此要加0
			          * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
			          * */
			          var month= date.getMonth()+1<10 ? "0"+(date.getMonth()+1) : date.getMonth()+1;
			          var day=date.getDate()<10 ? "0"+date.getDate() : date.getDate();
			          var hours=date.getHours()<10 ? "0"+date.getHours() : date.getHours();
			          var minutes=date.getMinutes()<10 ? "0"+date.getMinutes() : date.getMinutes();
			          var seconds=date.getSeconds()<10 ? "0"+date.getSeconds() : date.getSeconds();
			          // 拼接
			          return year+"-"+month+"-"+day+" "+hours+":"+minutes+":"+seconds;
			      },
		
			 //时间显示效果 右边的时间
			 //显示当前时间（年月日时分秒）
			     // timeFormate (timeStamp) {
			     //   let year = new Date(timeStamp).getFullYear();
			     //   let month = new Date(timeStamp).getMonth() + 1 < 10 ? "0" + (new Date(timeStamp).getMonth() + 1) : new Date(timeStamp).getMonth() + 1;
			     //   let date = new Date(timeStamp).getDate() < 10 ? "0" + new Date(timeStamp).getDate() : new Date(timeStamp).getDate();
			     //   let hh = new Date(timeStamp).getHours() < 10 ? "0" + new Date(timeStamp).getHours() : new Date(timeStamp).getHours();
			     //   let mm = new Date(timeStamp).getMinutes() < 10 ? "0" + new Date(timeStamp).getMinutes() : new Date(timeStamp).getMinutes();
			     //   let ss = new Date(timeStamp).getSeconds() < 10 ? "0" + new Date(timeStamp).getSeconds() : new Date(timeStamp).getSeconds();
			     //   this.nowTime = year + "年" + month + "月" + date + "日" + " " + hh + ":" + mm + ':' + ss;
			     // },
			     // nowTimes () {
			     //   this.timeFormate(new Date());
			     //   this.times=setInterval(this.nowTimes, 1000);
			     //   this.clear()
			     // },
			     // clear () {    
			     //   clearInterval(this.times)
			     //   this.nowTimes = null;
			     // },
				 // 中间饼图的动态效果
			
			  flip() {
			        var timer = null;
			        var i = 0;
					var j = 0;
			       
			        function flipFn(arg1, arg2) {
						 var aFlip = $(".card");
						aFlip.eq(i).toggleClass('card-flipped'); 
						i++;
						if(i==4){
							i=0;
							console.log(i)
						}
			 
			        }
			        timer = setInterval(flipFn, 1000);
			    },
			
			
			jcwl(){
				setInterval(() => {
					uni.getNetworkType({
						success: function (res) {
							console.log(res.networkType)
							if(res.networkType == 'none') {
								this.wlflag=false;
								this.dk=true
								uni.showLoading({
									title: '网络断开，尝试重连'
								})
								console.log("连接出错")//
							}else{
								uni.hideLoading();
								this.dk=false
								console.log("网络正常");
								if(!wlflag){
									setTimeout(function() {
										that.SocketInit();
									}, 10000);
								}
							}
						}
					});
				},20000);
			},
			
			SocketInit() {
				let that = this;
				//let baseUrl = 'ws://82.157.29.129:8005/websocket/dpzsmessage/'; 
				let baseUrl = 'ws://manage.jmzhnm.cn:8015/websocket/dpzsmessage/';  
				// let baseUrl = 'ws://192.168.1.29:8005/websocket/dpzsmessage/';
				console.log(this.orgid,'iddddddddddddddd')
				this.socketTask = uni.connectSocket({
					url: baseUrl + this.orgid + '/' + this.uuid,
					// url: baseUrl + '30814b9cb12a468ba2185620c0391a67' + '/' + this.uuid,
					success(data) {
						console.log("websocket连接成功");   
					},
				});
				this.socketTask.onOpen((res) => {
					console.log("WebSocket连接正常打开中...！");
					this.socketFlag = true;
					this.wlflag = true;
					this.socketTask.onMessage((res) => {
						setTimeout(() => {
							let data = eval("(" + res.data + ")");
							
							console.log("收到来自服务器数据")
							if (data.type == 'trade-people') {
								//今日交易人次
								this.TradePeopleList = data.data;
								console.log(this.TradePeopleList,'trrrrrrrrrrrrrrrrrrrrrrrrrrrrrr')
								this.getTradePeople();
							} else if (data.type == 'Hot-category') {
								//热销分类占比
								this.HotCategoryList = data.data;
								this.getHotCategory();
							} else if (data.type == 'heat') {
								//7日商户热度榜
								this.HeatList = data.data;  
								this.HeatList.forEach(item=>{
									if(item.name=='蔬店'){
										this.HeatList.splice(i,1)
									}
								})
								console.log(this.HeatList,'hhhhhhhhh')
								this.getHeat();
							} else if (data.type == 'trade-amount') {
								//交易额、交易数	
								this.AmountList = data.data.quota; //交易额
								this.AmountList2 = data.data.num; //交易数
								this.getTradeAmount();
							
							} else if(data.type ==  'klfxdayquery'){
								//今日客流量
								let dayPassengerNum = (Array(6).join('0') + data.data.tatol).slice(-4);
							if(this.dayPassengerNum.length>4){
								this.dayPassengerNum=['9','9','9','9']
							}else{
								this.dayPassengerNum = dayPassengerNum.split("");
							}
								console.log(this.dayPassengerNum)
								this.dayPassengerNums = data.data;
								console.log(data.data)
								if(data.data.devcode){
									this.shebeino = data.data.devcode;
								}else{
									this.shebeino = '0';
								}
								if(this.dayPassengerNums.currentPeople > this.dayPassengerNums.peoplevolume){
									this.baojingtype = true;
								}
							}else if(data.type ==  'klfxChart_dayquery'){
								this.dayPassengerdata = data.data;
								this.dayPassengerdate = data.date;
								this.getDayPassenger();
							}else if(data.type ==  'klfxChart_monthdayquery'){
									this.MonthPassengerdata = data.data;
									this.MonthPassengerdate = data.date;
									this.getMonthPassenger();
							}else if(data.type ==  'shdatection'){
								this.shdatection = data.data;
							}
							else if (data.type == 'info') {
								//其他数据
								this.info = data.data;
								// console.log(this.info.Order,'gggggggggggggg')
								this.biaogeshuju=data.data.Order
								console.log(this.biaogeshuju,'gggggggggggggg')
								let tradeNum = (Array(6).join('0') + this.info.tradeNum).slice(-6);
								this.tradeNum = tradeNum.split("");
								if (this.info.Order.length > 6) {
									this.info.Order = this.info.Order.concat(this.info.Order);
									let timer = null;
									timer = setInterval(() => {
										this.top -= 2;
										if (this.top <= ~(this.info.Order.length) * 120) {
											this.top = 0;
										}
									},500);
								} 
							}
						}, 10);
					});
				})
				this.socketTask.onClose(() => {
					uni.showLoading({
						title: '接口被关闭，尝试重连'
					})
					console.log("已经被关闭了")
					if(this.socketFlag){
						setTimeout(function() {
							that.SocketInit();
						}, 10000);
					}
				})
				this.socketTask.onError((errMsg)=>{
					uni.showLoading({
						title: '网络断开，尝试重连'
					})
					console.log("连接出错")
					this.dk=true
					if(this.socketFlag){
						setTimeout(function() {
							that.SocketInit();
						}, 10000);
					}
				})
			},
			closeSocket() {
				this.socketTask.close({
					success(res) {
						this.socketFlag = false;
						console.log("关闭成功", res)
					},
					fail(err) {
						console.log("关闭失败", err)
					}
				})
			},
			login() {
				
				uni.request({
					// #ifdef APP-PLUS
					url: this.$url + '/login',
					// #endif
					// #ifdef H5
					url:  '/api/login',
					// #endif
					method: 'POST',
					data: {
						devsn: this.uuid
					},
					success: (res) => {
						uni.hideLoading();
						console.log(res)
						if (res.data.code == '0') {
							this.orgid = res.data.data.orgid;
							this.orgname = res.data.data.orgname;
							console.log(this.orgName)
							this.SocketInit();
							this.jcwl();
							// this.biaoge();b
						} else {
							this.orgList = res.data.data;
							if (!this.$refs.popup.open()) {
								this.$refs.popup.open();
							}
						}
					}
				});
			},
			saveDevsn(data) {
				uni.request({
					// #ifdef APP-PLUS
					url: this.$url + '/saveDevsn',
					// #endif
					// #ifdef H5
					url: '/api/saveDevsn',
					// #endif
					method: 'POST',
					data: data,
					success: (res) => {
						console.log(res);
						if (res.data.code == '0') {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							});
							this.$refs.popup.close();
							this.login();
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							});
						}
					}
				});
			},
			// biaoge() {
			// 	console.log("表格调用")
			// 	uni.request({
			// 		// #ifdef APP-PLUS
			// 		url: this.$url + '/findPosGoodPrice',
			// 		// #endif
			// 		// #ifdef H5
			// 		url: this.$url + '/findPosGoodPrice',
			// 		// #endif
			// 		method: 'GET',
			// 		data: {
			// 			orgid: this.orgid
			// 		},
			// 		success: (res) => {
			// 			if (res.data.code == '0') {
			// 				uni.showToast({
			// 					title: res.data.msg,
			// 					icon: 'none'
			// 				});
			// 				// this.biaogeshuju = res.data.data;
			// 				// console.log(this.biaogeshuju,'qqqqqqqqqqqqqqqqqqqqq')
			// 			} else {
			// 				uni.showToast({
			// 					title: res.data.msg,
			// 					icon: 'none'
			// 				});
			// 			}
			// 		}
			// 	});
			// },
			radioChange(e) {
				this.orgid = e.detail.value;
			},
			submit() {
				if (this.orgid == '') {
					uni.showToast({
						title: '请选择市场',
						icon: 'none'
					});
					return false;
				}
				for (let i = 0; i < this.orgList.length; i++) {
					if (this.orgList[i].id == this.orgid) {
						this.orgName = this.orgList[i].name;
					}
				}
				let data = {
					orgid: this.orgid,
					devsn: this.uuid,
					name: this.orgName,
					type:'0'
				}
				console.log("设备号："+this.uuid);
				this.saveDevsn(data);
			},
			//今日交易人次
			getTradePeople() {
				this.$refs.tradePeople.init(config => {
					const {
						canvas
					} = config;
					const chart = echarts.init(canvas, null, config);
					canvas.setChart(chart);
					let xAxisList = [];
					let barList = [];
					for (let i = 0; i < this.TradePeopleList.length; i++) {
						xAxisList.push(this.TradePeopleList[i].name);
						barList.push(this.TradePeopleList[i].value);
					}
					console.log(barList,'barlist')
					let option = {
						xAxis: {
							show: true,
							type: 'category',
							splitLine: {
								show: false
							},
							axisLabel: {
								show: true,
								color: '#fff',
								textStyle: {
									color: '#fff',
									fontSize: 35
								}
							},
							data: xAxisList
						},
						yAxis: {
							show: true,
							type: 'value',
							splitLine: {
								show: false
							},
							axisLabel: {
								show: true,
								color: '#fff',
								textStyle: {
									color: '#fff',
									fontSize: 35
								}
							},
						},
						grid: {
							x: 80,
							y: 40,
							x2: 80, 
							y2: 45 
						},
						series: [{
							data: barList,
							type: 'bar',
							 barMaxWidth: 20, // 每一个都要设置   
							itemStyle: {
								normal: {
									color: '#1890ff',
									barBorderRadius: [5, 5, 0, 0],
									label: {
										show: true,
										position: 'top',
										textStyle: {
											color: '#ffffff',
											fontSize: 40
										}
									}
								}
							},
							barWidth: '30%',
						}]
					};
					chart.setOption(option);
					return chart;
				});
			},
			//热销分类
			getHotCategory() {
				console.log(this.HotCategoryList)
				this.$refs.HotCategory.init(config => {
					const {
						canvas
					} = config;
					const chart = echarts.init(canvas, null, config);
					canvas.setChart(chart);
					let option = {
						animation:true,
						legend: {
							orient: 'vertical',
							left:'80%',
							textStyle: {
								color: '#ffffff',
								fontSize: 45,
							},
							icon: "circle",
						},
						tooltip: {
							show: true
						},
						series: [{
							name: '',
							type: 'pie',
							labelLine: {
								show: false
							},
							label: {
								show: true,
								position: 'inside',
								formatter: '{d}%',
								"textStyle": {
								                    "fontSize": 40 }
								
							},
							radius: '78%',
							center: ['50%', '40%'],
							avoidLabelOverlap:true,
							data: this.HotCategoryList 
						}]
					};
					chart.setOption(option);
					
					function createExample(option, tooltipOption) {
					                    // 基于准备好的dom，初始化echarts图表
					                        // 为echarts对象加载数据
					                        chart.setOption(option);
					                        tools.loopShowTooltip(chart, option, tooltipOption);
					                    }
					                createExample(option, {
					                    loopSeries:true
					                });  
					
					
					return chart;
				});
			},
			//商户热度
			getHeat() {
				this.$refs.Heat.init(config => {
					const {
						canvas
					} = config;
					const chart = echarts.init(canvas, null, config);
					canvas.setChart(chart);
					let yHeatList = [];
					let HeatLists = [];
					for (let i = 0; i < this.HeatList.length; i++) {
						yHeatList.push(this.HeatList[i].name);
						HeatLists.push(this.HeatList[i].value);
					}
					console.log(yHeatList,'753753')
					let option = {
  title: {
    show: false
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    },
    textStyle: { // 设置提示框的对齐方式
      align: 'left'
    }
  },
  legend: {
    show: false
  },
  grid: {
    left: '3%',
    right: '2%',
    top: '5px',
    bottom: '0',
    containLabel: true
  },
  xAxis: {
    type: 'value',
    boundaryGap: [0, 0.01],
    splitLine: { // 去除背景网格线
      show: false
    },
    axisTick: { // 刻度
      show: false // 不显示刻度线
    },
    axisLine: { // 设置轴线
      show: false
    },
    axisLabel: {
      show: false
    }
  },
  yAxis: [
    {
      type: 'category',
      data: yHeatList,
      axisTick: { // 刻度
        show: false // 不显示刻度线
      },
      axisLine: { // 设置轴线
        show: false
      },
      axisLabel: {
        formatter: function (data) {
          let valueTxt = ''
          if (data.length > 3) {
            valueTxt = data.substring(0, 4) + '...'
          } else {
            valueTxt = data
          }
          return valueTxt
        },
        textStyle: {
          fontFamily: 'MicrosoftYaHei',
          fontSize: '40',
          color: '#CBD9FF',
        }
      }
    },
    {
      type: 'category',
      data: HeatLists,
      axisTick: { // 刻度
        show: false // 不显示刻度线
      },
      axisLine: { // 设置轴线
        show: false
      },
      axisLabel: {
        textStyle: {
          fontFamily: 'ArialMT',
          fontSize: '40',
          color: '#86A5C3' // 坐标值的具体的颜色
        }
      }
    }
  ],
  series: [
    {
  
      type: 'bar',
      data: HeatLists,
      barWidth: 14,
	  
      itemStyle: { // 柱状图的背景色
        normal: {
			borderRadius: 30,
          // 每个柱子的颜色即为colorList数组里的每一项,如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
          color: function (params) {
            var index = params.dataIndex
            var colorList = [
              // 渐变颜色的色值和透明度
              // 透明度从0
              ['rgba(15,235,255,0.3)', 'rgba(15,235,255,0.3)', 'rgba(15,235,255,0.3)', 'rgba(15,235,255,0.3)', 'rgba(15,235,255,0.3)', 'rgba(15,235,255,0.3)', 'rgba(15,235,255,0.3)', 'rgba(13,94,208,0.3)', 'rgba(255,155,15,0)', 'rgba(253,103,96,0.3)'], // 到透明度1 ,如果需要不同的颜色直接修改不同颜色即可
              ['rgba(15,235,255,0.6)', 'rgba(15,235,255,0.6)', 'rgba(15,235,255,0.6)', 'rgba(15,235,255,0.6)', 'rgba(15,235,255,0.6)', 'rgba(15,235,255,0.6)', 'rgba(15,235,255,0.6)', 'rgba(13,94,208,0.6)', 'rgba(255,155,15,0.6)', 'rgba(253,103,96,0.6)']
            ]
            return {
              colorStops: [{
                offset: 0.3, // 颜色的开始位置
                color: colorList[0][index] // 0% 处的颜色
              },
              {
                offset: 0.6, // 颜色的结束位置
                color: colorList[1][index] // 100% 处的颜色
              }]
            }
          }
        }
      }
    }
  ]
}
					
					chart.setOption(option);
					return chart;
				});
			},
			//一天客流量趋势图
			//this.dayPassengerdate,
			//this.dayPassengerdata,
			getDayPassenger() {
				this.$refs.dayPassenger.init(config => {
					const {
						canvas
					} = config;
					const chart = echarts.init(canvas, null, config);
					canvas.setChart(chart);
					let option = {
						grid: {
						  left: '5%',
						  right: '5%',
						  bottom: '12%',
						  top:'3%',
						  containLabel: true
						},
  xAxis: [{
    type: 'category',
    boundaryGap: false,
    axisLine: {
      lineStyle: {
        color: 'white'
      }
    },
	axisLabel:{
		margin:20,
	  textStyle:{
	    color:"white", //刻度颜色
	    fontSize:30  //刻度大小
	    }
	},
    data: this.dayPassengerdate
  }, {

    axisLine: {
      lineStyle: {
        color: '#57617B',
	    width:1
      }
    },
  }],
  yAxis: [{
	  type: 'value',
    axisLabel: {
      show: true,
	  textStyle:{
	    color:"white", //刻度颜色
	    fontSize:30  //刻度大小
	    }
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(255,255,255,.1)'
      }
    }, axisLine: {
      lineStyle: {
        color: '#57617B',
	    width:1
      }
    },
  }],
  series: [{
    name: '今日',
    type: 'line',
    smooth: true,
    symbol: 'circle',
    symbolSize: 5,
    showSymbol: false,
    lineStyle: {
      normal: {
        width: 5
      }
    },
    areaStyle: {
      normal: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          offset: 0,
          color: 'rgba(24, 163, 64, 0.3)'
        }, {
          offset: 0.8,
          color: 'rgba(24, 163, 64, 0)'
        }], false),
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowBlur: 10
      }
    },
    itemStyle: {
      normal: {
        color: '#04A3FE',
        borderColor: 'rgba(137,189,2,0.27)',
        borderWidth: 30
      }
    },
    data: this.dayPassengerdata
  },]
};
					chart.setOption(option);
					return chart;
				});
			},
			//本月客流量趋势图
			//this.MonthPassengerdate
			//this.MonthPassengerdata,
			getMonthPassenger(){
				this.$refs.monthPassenger.init(config=> {
					const {
						canvas
					} = config;
					const chart = echarts.init(canvas, null, config);
					canvas.setChart(chart);
					
					let option = {
						grid: {
						  left: '3%',
						  right: '5%',
						  bottom: '12%',
						  top:'5%',
						  containLabel: true
						},
					        color: ['#3DB6FC'],
					        legend: {
					
					          data: ["店铺交易量"],
					          textStyle: {
					            color: '#ffffff'//字体颜色
					          },
					        },
					        tooltip: {
					          trigger: 'axis'
					        },
					        xAxis: {
					          type: 'category',
					          data: this.MonthPassengerdate,
					          axisLine: {
					            lineStyle: {
					              color: '#ffffff'
					            }
					          },
							  axisLabel:{
								  margin:20,
							    textStyle:{
							      color:"white", //刻度颜色
							      fontSize:30  //刻度大小
							      }
							  },
					        },
					      
					        yAxis: {
					          name: '单位:人',
					          type: 'value',
							  nameTextStyle:{
								fontSize:40 
							  },
					          splitLine: {
					            show: true,
					            lineStyle: {
					              type: 'dashed',
					              color: '#55b9b4'
					            }
					          },
							  axisLabel:{
							    textStyle:{
							      color:"white", //刻度颜色
							      fontSize:30  //刻度大小
							      }
							  },
					          axisLine: {
					            lineStyle: {
					              color: '#ffffff'
					            }
					          }
					
					        },
					        series: [
					          {
					            itemStyle: {
					              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
					                { offset: 0, color: '#05ACFF' },
					                { offset: 0.5, color: '#0381FA' },
					                { offset: 1, color: '#013FFE' }
					              ])
					            }, barWidth: 10,
					            data: this.MonthPassengerdata,
					            type: 'bar', smooth: true,
					            name: '人数'
					
					          }
					        ]
					      };
					chart.setOption(option);
					return chart;
				});
			},
			// this.MonthPassengerdate
			getDay(day) {
				let today = new Date();
				let targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
				today.setTime(targetday_milliseconds);
				let tMonth = today.getMonth() + 1;
				let tDate = today.getDate();
				return tMonth + "-" + tDate;
			},
			//交易额、交易数
			getTradeAmount() {
				this.$refs.tradeAmount.init(config => {
					const {
						canvas
					} = config;
					const chart = echarts.init(canvas, null, config);
					canvas.setChart(chart);
					let AmountList = [];
					let AmountList2 = [];
					let days = [];
					for (let i = 0; i < this.AmountList.length; i++) {
						days.push(this.AmountList[i].name);
						AmountList.push(this.AmountList[i].value);
					}
					for (let i = 0; i < this.AmountList2.length; i++) {
						AmountList2.push(this.AmountList2[i].value);
					}
					let option = {
      title: {
        text: ''
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        top:0,
        right:5,
		itemWidth:30,
		itemHeight:30,
        textStyle:{
          color:'white',
		  fontSize:50
        },
        orient:'vertical',
        data:[
            {name:'交易额',icon:'circle'},
            {name:'交易数',icon:'circle'},
          ]
      },
      grid: {
        left: '1%',
        right: '10%',
        bottom: '3%',
        top:'3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        axisTick:{show:false},
        axisLabel:{
			margin:20,
          textStyle:{
            color:"white", //刻度颜色
            fontSize:30  //刻度大小
            }
        },
        axisLine:{
          show:true,
          lineStyle:{
            color: '#0B3148',
            width: 10,
            type: 'solid'
          }
        },
        data:days
      },
      yAxis: {
        type: 'value',
        axisTick:{show:false},
        axisLabel:{
          textStyle:{
            color:"white", //刻度颜色
            fontSize:30  //刻度大小
            }
        },
        axisLine:{
          show:true,
          lineStyle:{
            color: '#0B3148',
            width: 10,
            type: 'solid'
          }
        },
        splitLine:{
          show:false
        }
      },
      series: [
            {
              name:'交易额',
              type:'line',
              itemStyle : {  
                  normal : {  
                  color:'#F3891B'
                },
				label:{
					"textStyle": {
					                    "fontSize": 30 }
				},
                lineStyle:{
                  normal:{
                  color:'#F3891B',
                  opacity:1
                    }
                }
              },  
              data:AmountList2
            },
            {
              name:'交易数',
              type:'line',
              itemStyle : {  
                  normal : {  
                  color:'#006AD4',
				  
                },
                lineStyle:{
                  normal:{
                  color:'#F3891B',
                  opacity:1
                    }
                }
              },
              data:AmountList
            }
          ]
    }  
					chart.setOption(option);
					return chart;
				});
			},
		}
	}
</script>

<style scoped lang="scss">
 @import url('../../static/default.css');
 @import url('../../static/normalize.css'); 
	#app {
		width: 3840px;
		height: 2160px;
		zoom: 44.5%; 
		//background-color: #161f38;
		background-image: url(../../static/shetu.gif); 
		background-repeat: no-repeat;
		background-size: 100% 100%;
		 background-attachment: fixed;
		padding: 20rpx;
	}

	.popup-box {
		width: 1000rpx;
		height: auto;
		padding: 25rpx;
		background-color: #FFFFFF;
		border-radius: 15px;
	}

	.popup-box>text {
		font-size: 30rpx;
	}
	.popup-box .radio-item {
		width: 100%;
		height: 65rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		font-size: 25rpx;
		border: 1px solid #DCDCDC;
		border-top: none;
		padding-left: 25rpx;
	}

	.popup-box .radio-item:nth-child(1) {
		border-top: 1px solid #DCDCDC;
	}

	/deep/ uni-radio .uni-radio-input {
		width: 25rpx;
		height: 25rpx;
		margin-right: 15rpx;
	}

	.popup-btu {
		display: flex;
		flex-direction: row;
	}

	.popup-btu button {
		width: 200rpx;
		height: 60rpx;
		line-height: 60rpx;
		border-radius: 50px;
		margin-top: 20rpx;
		border: none;
		color: #FFFFFF;
		font-size: 25rpx;
		background-color: #007AFF;
	}

	h1,
	h3 {
		color: #FFFFFF;
		margin: 30rpx 60rpx;
	}

	h1 {
		font-size: 180rpx;
		height: 120rpx;
		line-height: 120rpx;
		// text-align: center;
		
	}

	h3 {
		font-size: 100rpx;
	}
	

	header,
	footer {
		width: 100%;
		height: 1030px;
		padding: 30rpx 20rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
	header>.lefts{
		width: 30%;
		height: 100%;
		padding: 0 15rpx;

	}
	header>.lefts>.left {
		width: 100%;
		height: 66%;
		padding: 0 15rpx;
		background-image: url(/static/borderss.png);
		background-size: 100% 100%;
	
		
	}
	
	header>.lefts>.left-top {
		width: 100%;
		height: 30%;
		padding: 0 15rpx;
		background-image: url(/static/borders.png);
		background-size: 100% 100%;
		margin-bottom: 29rpx;
		position: relative;
	
	}
	header>.lefts>.left-top>ul {
		width: 100%;
		display: flex;
		margin-top: 30rpx;
		flex-direction: row;
		justify-content: space-around;
	}
	
	header>.lefts>.left-top>ul>li {
		width: 15%;
		height: 150rpx;
		line-height: 140rpx;
		text-align: center;
		font-size: 70rpx;
		color: #000000;
		 border: 5px solid #FFFFFF;
		 background-color: #0144FD;
		border-radius: 5rpx;
	}
	header>.lefts>.left-top>.left-top-nums{
		width: 100%;
		height: 300rpx;
		display: flex;
		line-height: 100rpx;
		padding-top: 70rpx;
		font-size: 80rpx;
		flex-direction: row;
		justify-content: space-between;
	 
	}
	header>.lefts>.left-top>.left-top-nums>.left-top-num{
		margin-top: 20rpx;
		width: 33.3%;
		color: #FFFFFF;
		text-align: center;
		
	}
	header>.lefts>.left-top>.left-top-nums>.left-top-num:nth-child(2){
		text-align: center;
	}
	header>.lefts>.left-top>.left-top-nums>.left-top-num:nth-child(3){
		text-align: center;
	}
	header>.lefts>.left>ul {
		width: 100%;
		margin: 0 auto;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
	}

	header>.lefts>.left>ul>li {
		width: 15%;
		height: 90rpx;
		line-height: 90rpx;
		text-align: center;
		font-size: 80rpx;
		color: #FFFFFF;
		background-color: #052ac0; 
		border:5px solid #FFFFFF;
	}

	header>.right {
		width: 70%;
		height: 100%;
		padding-left: 15rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	header>.right>.right-top,
	header>.right>.right-bottom {
		width: 100%;
		height: 30%;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	header>.right>.right-top>view {
		background-image: url(/static/borders.png);
		background-size: 100% 100%;
		padding: 15rpx;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	header>.right>.right-top>view>text:nth-child(1) {
		font-size: 150rpx;
	}

	header>.right>.right-top>view>text:nth-child(2) {
		font-size: 100rpx;
		color: #cfcfcf;
	}

	header>.right>.right-bottom {
		height: 66%;
	}

	header>.right>.right-bottom>view {
		width: 49.5%;
		height: 100%;
		background-image: url(/static/borderss.png);
		background-size: 100% 100%;
		padding: 15rpx;
	}

	footer {
		padding-top: 20rpx;
	}

	footer>view {
		width: 49.5%;
		height: 100%;
		margin-right: 20rpx;
		padding: 0 30rpx;
		background-image: url(/static/borders.png);
		background-size: 100% 100%;
	}
	footer>view:nth-child(4){
		margin: 0;
	}

	.th,.td {
		width: 100%;
		height: 180rpx;
		display: flex;
	}

	footer>.right>.th>li,
	.td>li {
		font-size: 100rpx;
		color: #FFFFFF;
		vertical-align:middle;
		text-align: center;
		white-space: nowrap;/*内容超宽后禁止换行显示*/
		overflow: hidden;/*超出部分隐藏*/
        text-overflow:ellipsis;/*文字超出部分以省略号显示*/
	}


	.scroll_box{
		width: 100%;
		height: 100%;
	    border-radius: 10rpx;
	    .swiper{
			width: 100%;
			height: 100%;
	    }
	}
	
	.sbh{
		position: absolute;
		top:96%;
		font-size: 40px; 
		color: #fff;
	}
	
	
	
	
	
	.contaier{width: 640px; margin: 30px auto;}
		.card {
			perspective: 1000;
		    -webkit-perspective: 1000;
		    width: 100%;
		    margin-bottom: 3px;
		
		}
		.face{
		    position: absolute;
		    border-radius:5px;
		    -webkit-transition: all 1s ease;
		    -moz-transition: all 1s ease;
		    transition: all 1s ease;
		    backface-visibility: hidden;
		    -ms-backface-visibility: hidden;
		    -moz-backface-visibility: hidden;
		    -webkit-backface-visibility: hidden;
		    -o-backface-visibility: hidden;
	 	}
		.front {
		    z-index: 10;
		}
		.back{
		    transform:rotate3d(0,1,0,-180deg);
		    -ms-transform:rotate3d(0,1,0,-180deg);	/* IE 9 */
		    -moz-transform:rotate3d(0,1,0,-180deg);	/* Firefox */
		    -webkit-transform:rotate3d(0,1,0,-180deg); /* Safari 和 Chrome */
		    -o-transform:rotateY(0,1,0,-180deg);	/* Opera */
		    z-index: 8;
		}
		.card-flipped .front{
		    transform:rotate3d(0,1,0,180deg);
		    -ms-transform:rotate3d(0,1,0,180deg);/* IE 9 */
		    -moz-transform:rotate3d(0,1,0,180deg);/* Firefox */
		    -webkit-transform:rotate3d(0,1,0,180deg);/* Safari 和 Chrome */
		    -o-transform:rotate3d(0,1,0,180deg);	/* Opera */
		    z-index: 8;
		}
		.card-flipped .back{
		    transform:rotate3d(0,1,0,0deg);
		    -ms-transform:rotate3d(0,1,0,0deg);/* IE 9 */
		    -moz-transform:rotate3d(0,1,0,0deg);/* Firefox */
		    -webkit-transform:rotate3d(0,1,0,0deg);/* Safari 和 Chrome */
		    -o-transform:rotate3d(0,1,0,0deg);	/* Opera */
		    z-index: 10;
		}
		#left{width:500px;}
		.hd{
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			background-image: url('../../static/top.png');
			background-size: 100% 160%;
		}
		.tianqi{
			position: relative;
			top:-15rpx;
			left: 50rpx;
		}
		.time{
			color: #ffffff;
			  font-size: 60px;
			  position: relative;
			  right: 10rpx;
			  top: 50rpx;
			  z-index: 9999;
		}
		.wz{
			position: relative;
			left: 150rpx;
		}
		.info3-jdt {
		  width: 90%;
		  margin: 5px auto;
		  display: flex;
		  flex-direction: row;
		  justify-content: space-between;
		}
		.info3-jdt:nth-child(1) {
		  margin: 30rpx auto 10rpx auto;
		}
		.info3-title {
		  width: 120px;
		  text-align: center;
		  line-height: 38px;
		  font-size: 13px;    
		  color: #20bdfa;
		  background-image: url(../../static/nm-xts.png);
		  text-overflow: ellipsis;
		      white-space: nowrap;
		      overflow: hidden;
		}
		.info3-1 {
		  color: #ffffff;
		  width: 75%;
		  height: 15px;
		}
		.g-container {
		  width: 100%;
		  height: 15px;
		  border-radius: 25px;
		  background-image: linear-gradient(90deg,#87f 40%,#f78 60%);
		
		  margin-top: -5px;
		}
		
		.g-progress {
		  width: 50%;
		
		  height: inherit;
		  border-radius: 25px 0 0 25px;
		}
		.info3-2{
		  padding-bottom: 5px;
		  font-size: 14px;
		}
		
</style>

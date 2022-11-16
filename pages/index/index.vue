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
		<h1>
		{{orgname}}
		</h1>
		<header>
			<view class="lefts">
				<view class="left-top">
					<h3>今日客流 <text v-if="this.baojingtype" style="color:#ff0004;" >(当前客流量超出预警范围)</text></h3>
					<ul>
						
						<li v-for="(item,index) in dayPassengerNum">{{item}}</li>
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
				<view class="left">
					<h3>今日交易人次</h3>
					<ul>
						<li v-for="(item,index) in tradeNum">{{item}}</li>
					</ul>
					<view style="width: 100%;height: 74%;">
						<l-echart ref="tradePeople"></l-echart>
					</view>
				</view>
			</view>
			<view class="right">
				<view class="right-top">
					<view style="width: 20%;">
						<text style="color: #3dcba5;">{{info.allQuota}}</text>
						<text>本月交易额</text>
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
						<h3>热销分类占比</h3>
						<view style="width: 100%;height:90%;">
							<l-echart ref="HotCategory"></l-echart>
						</view>
					</view>
					<view>
						<h3>7日商户热度榜</h3>
						<view style="width: 100%;height: 90%;">
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
				<h3>商品价格公示</h3>
				<ul class="th" style="background-color: #0b6c8a;">
					<li style="width: 45%;">商户名称</li>
					<li style="width: 25%;">商品</li>
					<li style="width: 25%;">单价</li>
				</ul>
				<view style="width: 100%;height:725rpx;">
					<view class="scroll_box">
						<swiper class="swiper" circular="true" vertical="true" display-multiple-items="7" :autoplay="autoplay" :interval="interval" :duration="duration">
							<swiper-item  v-for="(item,index) in biaogeshuju" :key="index">
									<ul class="td">
										<li style="width: 45%;">{{item.name}}</li>
										<li style="width: 25%;">{{item.spname}}</li>
										<li style="width: 25%;">{{item.newout}}</li>
									</ul>
							</swiper-item>
						</swiper>
					</view>
				</view>
			</view>
			<text class="sbh"> 
				设备号: {{uuid}}
			</text>
		</footer>
	</view>
</template>

<script>
	import * as echarts from '@/uni_modules/lime-echart/components/l-echart/echarts';
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
			}
		},
		created() {
			// #ifdef APP-PLUS
			uni.showLoading({
				title: '加载中'
			})
			plus.device.getInfo({
				success: (e) => {
					console.log(e)
					this.uuid = e.uuid;
					this.login();
				},
				fail: (e) => {}
			});
			// #endif
			// #ifdef H5
				this.uuid = "sn001";
				this.login()
				this.biaoge();
			// #endif
			
		},
		methods: {
			jcwl(){
				setInterval(() => {
					uni.getNetworkType({
						success: function (res) {
							console.log(res.networkType)
							if(res.networkType == 'none') {
								this.wlflag=false;
								uni.showLoading({
									title: '网络断开，尝试重连'
								})
								console.log("连接出错")
							}else{
								uni.hideLoading();
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
				let baseUrl = 'ws://82.157.29.129:8005/websocket/dpzsmessage/';
				//let baseUrl = 'ws://192.168.1.52:8005/websocket/dpzsmessage/';  
				// let baseUrl = 'ws://192.168.1.29:8005/websocket/dpzsmessage/';
				this.socketTask = uni.connectSocket({
					url: baseUrl + this.orgid + '/' + this.uuid,
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
								this.getTradePeople();
							} else if (data.type == 'Hot-category') {
								//热销分类占比
								this.HotCategoryList = data.data;
								this.getHotCategory();
							} else if (data.type == 'heat') {
								//7日商户热度榜
								this.HeatList = data.data;
								this.getHeat();
							} else if (data.type == 'trade-amount') {
								//交易额、交易数	
								this.AmountList = data.data.quota; //交易额
								this.AmountList2 = data.data.num; //交易数
								this.getTradeAmount();
							
							} else if(data.type ==  'klfxdayquery'){
								//今日客流量
								let dayPassengerNum = (Array(6).join('0') + data.data.tatol).slice(-6);
								this.dayPassengerNum = dayPassengerNum.split("");
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
					url: '/api/login',
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
							this.SocketInit();
							this.jcwl();
							this.biaoge();
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
			biaoge() {
				console.log("表格调用")
				uni.request({
					// #ifdef APP-PLUS
					url: this.$url + '/findPosGoodPrice',
					// #endif
					// #ifdef H5
					url: this.$url + '/findPosGoodPrice',
					// #endif
					method: 'GET',
					data: {
						orgid: this.orgid
					},
					success: (res) => {
						if (res.data.code == '0') {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							});
							this.biaogeshuju = res.data.data;
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							});
						}
					}
				});
			},
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
					name: this.orgName
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
									fontSize: 20
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
									fontSize: 20
								}
							},
						},
						grid: {
							x: 40,
							y: 40,
							x2: 20,
							y2: 45
						},
						series: [{
							data: barList,
							type: 'bar',
							itemStyle: {
								normal: {
									color: '#1890ff',
									barBorderRadius: [5, 5, 0, 0],
									label: {
										show: true,
										position: 'top',
										textStyle: {
											color: '#ffffff',
											fontSize: 20
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
				this.$refs.HotCategory.init(config => {
					const {
						canvas
					} = config;
					const chart = echarts.init(canvas, null, config);
					canvas.setChart(chart);
					let option = {
						legend: {
							orient: 'vertical',
							left:'80%',
							textStyle: {
								color: '#ffffff',
								fontSize: 15,
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
								formatter: '{d}%'
							},
							radius: '80%',
							center: ['50%', '40%'],
							avoidLabelOverlap:true,
							data: this.HotCategoryList
						}]
					};
					chart.setOption(option);
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
					let option = {
						grid: {
							x: '25%',
							y: 5,
							x2: '10%',
							y2: 5
						},
						xAxis: {
							show: false
						},
						yAxis: {
							type: 'category',
							axisLabel: {
								show: true,
								formatter: function(value) {
									let ret = "";
									let maxLength = 5;
									let valLength = value.length;
									let rowN = Math.ceil(valLength / maxLength);
									if (rowN > 1) {
										for (let i = 0; i < rowN; i++) {
											let temp = "";
											let start = i * maxLength;
											let end = start + maxLength;
											temp = value.substring(start, end) + "\n";
											ret += temp;
										}
										return ret;
									} else {
										return value;
									}
								},
								textStyle: {
									color: '#fff',
									fontSize: 15
								}
							},
							axisLine: {
								show: false
							},
							axisTick: {
								show: false
							},
							splitLine: {
								show: false
							},
							data: yHeatList
						},
						series: [{
							name: 'Direct',
							type: 'bar',
							stack: 'total',
							label: {
								show: true
							},
							itemStyle: {
								normal: {
									color: '#1890ff',
									barBorderRadius: [2, 2, 2, 2],
									color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
										offset: 0,
										color: '#24e3fe'
									}, {
										offset: 1,
										color: '#f4b140'
									}]),
									label: {
										show: true,
										position: 'right',
										textStyle: {
											color: '#ffffff',
											fontSize: 20
										}
									}
								}
							},
							barWidth: '50%',
							data: HeatLists
						}]
					};
					chart.setOption(option);
					return chart;
				});
			},
			//一天客流量趋势图
			getDayPassenger() {
				this.$refs.dayPassenger.init(config => {
					const {
						canvas
					} = config;
					const chart = echarts.init(canvas, null, config);
					canvas.setChart(chart);
					let option = {
						xAxis: {
							type: 'category',
							data: this.dayPassengerdate,
							axisLine: {
								lineStyle: {
									color: '#ffffff'
								}
							},
							axisLabel: {
								color: '#ffffff'
							}
						},
						yAxis: {
							type: 'value',
							axisLine: {
								lineStyle: {
									color: '#ffffff'
								}
							},
							axisLabel: {
								color: '#ffffff'
							}
						},
						series: [{
							data: this.dayPassengerdata,
							type: 'line',
							areaStyle: {
								color: '#8bff9d', //阴影颜色
							},
							itemStyle:{
								color: '#8bff9d', //线条颜色
							}
						}]
					};
					chart.setOption(option);
					return chart;
				});
			},
			//本月客流量趋势图
			getMonthPassenger(){
				this.$refs.monthPassenger.init(config=> {
					const {
						canvas
					} = config;
					const chart = echarts.init(canvas, null, config);
					canvas.setChart(chart);
					let option = {
						xAxis: {
							type: 'category',
							data: this.MonthPassengerdate
						},
						yAxis: {
							type: 'value'
						},
						series: [{
							data: this.MonthPassengerdata,
							type: 'bar'
						}]
					};
					chart.setOption(option);
					return chart;
				});
			},
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
						grid: {
							x: 80,
							y: 60,
							x2: 0,
							y2: 50
						},
						legend: {
							data: ['交易额', '交易数'],
							textStyle: {
								color: '#ffffff',
							},
						},
						xAxis: [{
							type: 'category',
							axisLabel: {
								show: true,
								color: '#fff',
								textStyle: {
									color: '#fff',
									fontSize: 20
								}
							},
							axisLine: {
								show: false
							},
							axisTick: {
								show: false
							},
							data: days
						}],
						yAxis: [{
							type: 'value',
							nameTextStyle: {
								color: '#ffffff'
							},
							axisLabel: {
								show: true,
								textStyle: {
									color: '#fff',
									fontSize: 20
								}
							},
							axisLine: {
								show: false
							},
							axisTick: {
								show: false
							},
							splitLine: {
								show: false
							}
						}],
						series: [{
							name: '交易额',
							data: AmountList,
							type: 'line',
							areaStyle: {
								color: '#1e6a73'
							},
							itemStyle: {
								normal: {
									color: '#0ae4e4',
									lineStyle: {
										color: '#0ae4e4'
									}
								}
							},
						}, {
							name: '交易数',
							data: AmountList2,
							type: 'line',
							areaStyle: {
								color: '#22505f'
							},
							itemStyle: {
								normal: {
									color: '#0fc26a',
									lineStyle: {
										color: '#0fc26a'
									}
								}
							},
						}]
					};
					chart.setOption(option);
					return chart;
				});
			},
		}
	}
</script>

<style scoped lang="scss">
	#app {
		width: 1920px;
		height: 1080px;
		zoom: 100%;
		background-color: #161f38;
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
		margin: 10rpx 0;
	}

	h1 {
		font-size: 100rpx;
		height: 120rpx;
		line-height: 120rpx;
		text-align: center;
	}

	h3 {
		font-size: 50rpx;
	}
	

	header,
	footer {
		width: 100%;
		height: 480px;
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
		height: 65%;
		padding: 0 15rpx;
		background-image: url(/static/border.png);
		background-size: 100% 100%;
	}
	
	header>.lefts>.left-top {
		width: 100%;
		height: 30%;
		padding: 0 15rpx;
		background-image: url(/static/border.png);
		background-size: 100% 100%;
		margin-bottom: 36rpx;
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
		height: 90rpx;
		line-height: 90rpx;
		text-align: center;
		font-size: 35rpx;
		color: #000000;
		background-color: #04b1c0;
		border: 1px solid #FFFFFF;
		border-radius: 5rpx;
	}
	header>.lefts>.left-top>.left-top-nums{
		width: 100%;
		height: 70rpx;
		display: flex;
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
		font-size: 35rpx;
		color: #FFFFFF;
		background-color: #052ac0;
		border: 1px solid #FFFFFF;
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
		background-image: url(/static/border.png);
		background-size: 100% 100%;
		padding: 15rpx;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	header>.right>.right-top>view>text:nth-child(1) {
		font-size: 80rpx;
	}

	header>.right>.right-top>view>text:nth-child(2) {
		font-size: 60rpx;
		color: #cfcfcf;
	}

	header>.right>.right-bottom {
		height: 66%;
	}

	header>.right>.right-bottom>view {
		width: 49.5%;
		height: 100%;
		background-image: url(/static/border.png);
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
		background-image: url(/static/border.png);
		background-size: 100% 100%;
	}
	footer>view:nth-child(4){
		margin: 0;
	}

	.th,.td {
		width: 100%;
		height: 90rpx;
		display: flex;
	}

	footer>.right>.th>li,
	.td>li {
		font-size: 50rpx;
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
		font-size: 20px;
		color: #fff;
	}
</style>

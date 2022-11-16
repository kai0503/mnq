<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			plus.screen.lockOrientation("landscape-primary"); 
			
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	@import url('./static/default.css');
	@import url('./static/normalize.css');
	* {
		margin: 0;
		padding: 0;
		list-style: none;
		text-decoration: none;
		box-sizing: border-box;
	}
</style>

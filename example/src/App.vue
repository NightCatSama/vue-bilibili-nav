<template>
	<div id="app">
		<ul class="section white">
			<li v-for="(item, index) in data" :id="'section' + index" :class="item.color">
				<h3>{{ item.name }}</h3>
				<p>{{ item.pingyin }}</p>
			</li>
		</ul>
		<footer>
			<a href="https://github.com/NightCatSama">NightCat</a>
		</footer>
		<sortable-nav :options="options"></sortable-nav>
	</div>
</template>

<script>
import sortableNav from 'components/index.js'
export default {
	name: 'app',
	components: {
		sortableNav
	},
	data() {
		return {
			data: [{
				number: 0,
				name: '动画',
				pingyin: 'DongHua',
				color: 'bg-blue'
			}, {
				number: 1,
				name: '番剧',
				pingyin: 'FanJu',
				color: 'bg-light-black'
			}, {
				number: 2,
				name: '游戏',
				pingyin: 'YouXi',
				color: 'bg-green'
			}, {
				number: 3,
				name: '鬼畜',
				pingyin: 'GuiChu',
				color: 'bg-roseate'
			}, {
				number: 4,
				name: '音乐',
				pingyin: 'YinYue',
				color: 'bg-light-blue'
			}, {
				number: 5,
				name: '舞蹈',
				pingyin: 'WuDao',
				color: 'bg-gray'
			}, {
				number: 6,
				name: '科技',
				pingyin: 'KeJi',
				color: 'bg-brown'
			}, {
				number: 7,
				name: '生活',
				pingyin: 'ShengHuo',
				color: 'bg-sliver'
			}, {
				number: 8,
				name: '广告',
				pingyin: 'GuangGao',
				color: 'bg-dark-red'
			}, {
				number: 9,
				name: '直播',
				pingyin: 'ZhiBo',
				color: 'bg-dark-green'
			}, {
				number: 10,
				name: 'TV剧',
				pingyin: 'TVJu',
				color: 'bg-orange'
			}, {
				number: 11,
				name: '电影',
				pingyin: 'DianYing',
				color: 'bg-pink'
			}]
		}
	},
	watch: {
		data: function(arr) {
			let cache = Array.from(arr, (obj) => obj.number)
			window.localStorage['nav'] = JSON.stringify(cache)
		}
	},
	computed: {
		options: function() {
			let options = {
				offset: 150,
				bindData: this.data,
				backToTop: 0
			}
			options.data = this.data.map((obj, i) => {
				return {
					name: obj.name,
					target: `section${i}`
				}
			})
			return options
		}
	},
	mounted() {
		let cache = window.localStorage['nav']
		if (cache) {
			cache = JSON.parse(cache)
			let arr = []
			Array.from(cache, (number) => {
				arr.push(this.data[number])
			})
			this.data = arr
		}

	}
}
</script>

<style lang="scss">
@import './style/common/core';
#app {
    font-family: "Segoe UI", 'Microsoft Yahei', Helvetica, Arial;
	color: #2c3e50;
}

.section {
	list-style: none;

	li {
		width: 100%;
		height: 400px;
		font-size: 30px;
		background-color: $blue;
		@include flex-center;
		flex-direction: column;
		margin-bottom: 20px;
	}
}

footer {
	height: 1000px;
	width: 100%;
	@include flex-center;
	color: $white;
	background-color: $light-gray;

	a {
		text-decoration: none;
		font-size: 60px;
		color: $font-color;
	}
}
</style>

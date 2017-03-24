<template>
	<div id="app">
		<ul class="section white">
			<li v-for="(item, index) in data" :id="`section${index}`" :class="item.color">
				<h3>{{ item.name }}</h3>
				<p>{{ item.spell }}</p>
			</li>
		</ul>
		<footer>
			<a href="https://github.com/NightCatSama">
				NightCat
			</a>
			<small>此区域用于测试超出导航范围</small>
		</footer>
		<sortable-nav :options="options"></sortable-nav>
	</div>
</template>

<script>
import sortableNav from 'components/'

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
				spell: 'DongHua',
				color: 'bg-blue'
			}, {
				number: 1,
				name: '番剧',
				spell: 'FanJu',
				color: 'bg-light-black'
			}, {
				number: 2,
				name: '游戏',
				spell: 'YouXi',
				color: 'bg-green'
			}, {
				number: 3,
				name: '鬼畜',
				spell: 'GuiChu',
				color: 'bg-roseate'
			}, {
				number: 4,
				name: '音乐',
				spell: 'YinYue',
				color: 'bg-light-blue'
			}, {
				number: 5,
				name: '舞蹈',
				spell: 'WuDao',
				color: 'bg-gray'
			}, {
				number: 6,
				name: '科技',
				spell: 'KeJi',
				color: 'bg-brown'
			}, {
				number: 7,
				name: '生活',
				spell: 'ShengHuo',
				color: 'bg-sliver'
			}, {
				number: 8,
				name: '广告',
				spell: 'GuangGao',
				color: 'bg-dark-red'
			}, {
				number: 9,
				name: '直播',
				spell: 'ZhiBo',
				color: 'bg-dark-green'
			}, {
				number: 10,
				name: 'TV剧',
				spell: 'TVJu',
				color: 'bg-orange'
			}, {
				number: 11,
				name: '电影',
				spell: 'DianYing',
				color: 'bg-pink'
			}]
		}
	},
	watch: {
		//  保存位置到localStorage
		data: function(arr) {
			let cache = Array.from(arr, (obj) => obj.number)
			window.localStorage['nav'] = JSON.stringify(cache)
		}
	},
	computed: {
		options: function() {
			//  导航配置
			let options = {
				offset: 150,  //  滚动检测偏移值
				bindData: this.data,  //  与this.data绑定值
				backToTop: 0
			}
			//  根据this.data生成导航的配置[{ name: 名字, target: 对应的元素id }]
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
		//  从localStorage读取this.data
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
	flex-direction: column;
	color: $white;
	background-color: $light-gray;

	a {
		text-decoration: none;
		font-size: 60px;
		color: $dark-blue;
	}

	small {
		font-size: 22px;
	}
}
</style>

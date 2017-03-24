# vue-bilibili-nav
使用vue2仿写bilibili的侧边导航

[live demo](https://nightcatsama.github.io/vue-bilibili-nav/example/dist/)

## options

```js
let options = {
	offset: 150,          //  滚动监测偏移值
	bindData: this.data,  //  绑定可排序数组数据
	backToTop: 0,         //  距离顶部多少距离时显示backtotop按钮
	data: [{              //  导航条数据，基于this.data生成
		name: '动画',
		target: 'id1'
	}, {
		name: '番剧',
		target: 'id2'
	},
	...
	]
}
```

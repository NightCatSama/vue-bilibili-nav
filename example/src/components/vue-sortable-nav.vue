<template>
	<span class="vue-sortable-nav">
		<transition name="fade">
			<span v-if="mode === 'sortable'">
				<div class="tip"></div>
				<div class="custom-bg"></div>
			</span>
		</transition>
		<ul ref="ul" :class="['sortable-nav', (isDrag ? 'isDraging' : 'noDraging'), { 'sortable-mode': mode === 'sortable' }]">
			<template v-for="(item, index) in data">
				<li v-if="isDrag && index === exchangeId && exchangeId <= dragId" :class="['sortable-item']">
					<div class="sortable-item-name"></div>
				</li>
				<li v-if="isDrag && index === dragId" :class="['sortable-item', 'drag-block']" :style="dragStyles">
					<div class="sortable-item-name">{{ item.name }}</div>
				</li>
				<li v-else :class="['sortable-item', { 'active': mode === 'navigation' && index === current }]" @click="setActive(index)" @mousedown="dragStart($event, index)">
					<div class="sortable-item-name">{{ item.name }}</div>
				</li>
				<li v-if="isDrag && index === exchangeId && exchangeId > dragId" :class="['sortable-item']">
					<div class="sortable-item-name"></div>
				</li>
			</template>
			<li v-if="isDrag && exchangeId === data.length" :class="['sortable-item']">
				<div class="sortable-item-name"></div>
			</li>
			<li class="sortable-btn" @click="toggleMode">
				<i class="sort-icon"></i><br>
				排序
			</li>
			<li v-if="!noInScope && mode === 'navigation'" class="pointer-block" :style="{ top: `${current * height}px` }">
			</li>
		</ul>
		<div v-if="scrollTop >= this.options.backToTop || 0" class="vue-backtotop-btn" @click="scrollToTop(time)">
			<i class="backtotop-icon"></i>
		</div>
	</span>
</template>

<script>
import scrollMixin from './smooth-scroll.js'
import { getOffsetTop, sortArr } from './util.js'

export default {
	mixins: [scrollMixin],
	components: {
	},
	data() {
		return {
			mode: 'navigation',
			data: [],
			isClickScroll: false,
			targetValue: 0,
			_screenHeight: 0,
			_left: 0,
			_top: 0,
			time: 800,
			height: 32,
			queueNumber: 0,
			scrollTop: 0,
			isDrag: false,
			dragId: 0,  //  拖拽的id
			x: 0,
			y: 0,
			offsetX: 0,
			offsetY: 0
		}
	},
	props: {
		options: {
			type: Object
		}
	},
	computed: {
		//  偏移值
		offset: function() {
			return this.options.offset || 100
		},
		//  动态当前值（根据滚动距离判断）
		active: function() {
			if (this.noInScope) {
				return false
			}
			let active = null
			for (let i = 0, len = this.data.length; i < len; i++) {
				if (this.scrollTop >= this.data[i].offsetTop - this.offset) {
					active = i
				}
			}
			return active
		},
		//  静态当前值（如果在点击滚动过程中则为目标值）
		current: function() {
			return this.isClickScroll ? this.targetValue : this.active
		},
		//  是否在滚动检测的范围中
		noInScope: function() {
			if (!this.data.length || this.scrollTop < (this.data[0].offsetTop - this._screenHeight) || this.scrollTop > this.data[this.data.length - 1].offsetTop + this.data[this.data.length - 1].height) {
				return true
			}
			return false;
		},
		//  要交换的目标ID
		exchangeId: function() {
			let id = Math.floor(this.y / this.height)
			if (id > this.data.length - 1)
				id = this.data.length
			if (id < 0)
				id = 0
			return id
		},
		//  鼠标位置 => 拖拽体的位置style
		dragStyles: function() {
			return {
				left: `${this.x}px`,
				top: `${this.y}px`
			}
		}
	},
	watch: {
		//  根据options变化做出改变
		options: {
			deep: true,
			handler: function(newVal, oldVal) {
				this.getData()
			}
		}
	},
	methods: {
		/*  初始化  */
		init() {
			this.getData()
			this.bindEvent()
			this._screenHeight = window.screen.availHeight
			this._left = this.$refs.ul.getBoundingClientRect().left
			this._top = this.$refs.ul.getBoundingClientRect().top
		},
		/*  点击设置当前区域  */
		setActive(i, bool) {
			if (i === this.current || (!bool && this.mode === 'sortable'))
				return false
			let target = this.data[i].elem
			this.isClickScroll = true
			this.targetValue = i
			this.queueNumber++
			this.scrollToElem(target, this.time, this.offset || 0).then(() => {
				this.queueNumber--
				if (this.queueNumber === 0) {
					this.isClickScroll = false
				}
			})
		},
		/*  绑定事件  */
		bindEvent() {
			document.addEventListener('scroll', this.scroll, false)
			document.addEventListener('mousemove', this.dragMove, false)
			document.addEventListener('mouseup', this.dragEnd, false)
			document.addEventListener('mouseleave', this.dragEnd, false)
		},
		/*  解除绑定事件  */
		unbindEvent() {
			document.removeEventListener('scroll', this.scroll, false)
			document.removeEventListener('mousemove', this.dragMove, false)
			document.removeEventListener('mouseup', this.dragEnd, false)
			document.removeEventListener('mouseleave', this.dragEnd, false)
		},
		/*  切换模式  */
		toggleMode() {
			this.mode = this.mode === 'navigation' ? 'sortable' : 'navigation'
		},
		/*  配置初始数据  */
		getData() {
			this.data = sortArr(Array.from(this.options.data, (obj) => {
				let elem = document.getElementById(obj.target)
				if (!elem)
					return console.error(`[vue-sortable-nav]: Unable to find the corresponding elements(Please make sure that there is id for the elements of ["${obj.target}]")`)
				let offsetTop = getOffsetTop(elem)
				return {
					name: obj.name,  //  名字
					elem: elem,  //  对应的元素
					offsetTop: offsetTop,  //  距离页面顶部的距离
					height: elem.offsetHeight   //  元素的高度
				}
			}), 'offsetTop')
		},
		/*  滚动时同步设置this.scrollTop  */
		scroll(e) {
			this.scrollTop = window.pageYOffset || (document.documentElement.scrollTop + document.body.scrollTop)
		},
		/*  得到鼠标位置  */
		getPos(e) {
			this.x = e.clientX - this._left - this.offsetX
			this.y = e.clientY - this._top - this.offsetY
		},
		/*  拖拽开始  */
		dragStart(e, i) {
			if (this.mode === 'navigation')
				return false

			this.isDrag = true
			this.dragId = i
			this.offsetX = e.offsetX
			this.offsetY = e.offsetY
			this.getPos(e)
		},
		/*  拖拽中得到鼠标位置  */
		dragMove(e) {
			if (this.isDrag) {
				this.getPos(e)
			}
			e.preventDefault()
		},
		/*  排序拖拽结束  */
		dragEnd(e) {
			if (this.isDrag) {
				this.isDrag = false
				if (this.exchangeId !== this.dragId) {
					this.options.bindData.splice(this.exchangeId, 0, this.options.bindData.splice(this.dragId, 1)[0])
				}
				else {
					this.setActive(this.dragId, true)
				}
			}
		}
	},
	mounted() {
		this.init()
	},
	beforeDestroy() {
		this.unbindEvent()
	}
}
</script>

<style scope lang="scss">
$item-width: auto;
$item-height: 32px;
$bg-zIndex: 5;
$ul-zIndex: 9;
.vue-sortable-nav {
	position: fixed;
	top: 50px;
	right: 50px;
	min-width: 48px;
	width: $item-width;
	font-size: 12px;
    font-family: "Segoe UI", 'Microsoft Yahei', Helvetica, Arial;
    user-select: none;

    .sortable-nav {
    	position: relative;
    	border: 1px solid #e5e9ef;
    	border-radius: 5px;
    	overflow: hidden;
	    cursor: pointer;
	    z-index: $ul-zIndex;

    	&.sortable-mode {
    		cursor: move;
    	}

	    li {
			text-align: center;
			background-color: #f6f9fa;
	    }

	    &.noDraging li:hover{
	    	background-color: #3498db;
	    	color: #fff;
	    }

	    .pointer-block {
	    	position: absolute;
	    	top: 0;
	    	left: 0;
	    	width: 100%;
			height: $item-height;
			background-color: #3498db;
			transition: top .3s;
	    }

	    .drag-block {
	    	position: absolute;
	    	width: 100%;
			height: $item-height;
			color: #fff;
			z-index: $ul-zIndex + 1;
			background-color: #3498db;
	    }

		.sortable-item {
			height: $item-height;
			line-height: $item-height;

	    	&.active {
	    		transition: color .3s;
	    		color: #fff;
	    	}

	    	.sortable-item-name {
	    		position: relative;
	    		z-index: 9;
	    	}
		}

		.sortable-btn {
			border-top: 1px solid #e5e9ef;
			padding: 5px 0;

			.sort-icon {
				margin-top: 2px;
				display: inline-block;
				height: 16px;
				width: 16px;
				background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAHdElNRQfgChwKAzMThfanAAAAZklEQVQoz4XOIQ7AIBBE0c+Gw5LUIDFVVbgVFdy2FZAUUYZVJG/CTGC6nLwB5BPAL4Aw8cHtASA/AP1tM/NzpnkE1gymGSwnxRC90b7ly5GiYheIa+qlux+KDhSvpllVFK9qw2B4AZaSGqX9mNwmAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE2LTEwLTI4VDEwOjAzOjUxKzA4OjAwl9tGywAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNi0xMC0yOFQxMDowMzo1MSswODowMOaG/ncAAAAASUVORK5CYII=") no-repeat;
			}

			&:hover {
				.sort-icon {
	    			background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAHdElNRQfgChwKDjVPSC3fAAAAZklEQVQoz4WPwQ2AIBAE94zFklgAfnzZhN2ODwU5ENjXJjPZy5mKEOySJA5JslM+bPA2IHWHB8KDu0LCHeHDvwIBRoLlHSTJrO6LJpkKax89h2YLe+HXXwDRDTZCdFuNEKtjlZDxDf9pklrJglkmAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE2LTEwLTI4VDEwOjE0OjUzKzA4OjAwIxaTWwAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNi0xMC0yOFQxMDoxNDo1MyswODowMFJLK+cAAAAASUVORK5CYII=") no-repeat;
				}
			}
		}
    }

	.vue-sortable-btn {
		height: 40px;
		line-height: 40px;
		text-align: center;
		background-color: #f6f9fa;
		cursor: default;
	}

	$gap: 10px;
	.vue-backtotop-btn {
		height: 40px;
		line-height: 40px;
		width: 110%;
		position: relative;
		left: -5%;
		text-align: center;
    	border-radius: 3px;
		background-color: #f6f9fa;
    	border: 1px solid #e5e9ef;
		margin-top: $gap;
		font-size: 22px;
		z-index: $ul-zIndex;
	    cursor: pointer;

	    &::before {
	    	content: '';
	    	position: absolute;
	    	top: -$gap;
	    	left: 20%;
	    	width: 2px;
	    	height: $gap;
	    	background-color: #ccc;
	    }

	    &::after {
	    	content: '';
	    	position: absolute;
	    	top: -$gap;
	    	left: 80%;
	    	width: 2px;
	    	height: $gap;
	    	background-color: #ccc;
	    }

	    .backtotop-icon {
	    	width: 24px;
	    	height: 24px;
	    	display: inline-block;
	    	background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAQAAABKfvVzAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAHdElNRQfgChwKHShNoQCUAAABIElEQVQ4y+2RP0sDURDEf3fxX6VY2gl2KWy02ELBK2IhiKCCqGCdcq+SaGWwkGDxQFCwsRFELSQoMRFTaCGP9H4NSwsx0cIFL/EkH0CneTM7MyyPhX90R5A21D6qRNwx7946vTAl3ssNETDLlfZ0LWiGS3Im5jjTTLvfITXklOXEIMuolP1vGzTgmFUTm/ZucKRB6gaFA/Imtt2ewAwAkwxJzXcWFErEJnZdEeSBAaYAEPql7tsLssOW0X0KHvBInWEEgGla/jFR0AJFix8SO6MeqTHCBACRvPonK2hMyTIn5N3H9788UmGMcQBy8uIbAWiWZ/PPWXOtlMtcsPjFXRACg+Zcs/4zDq7JCtXkHRrcAhWWXJNUuHcWuAfK/E18ApbQR4QXc6mEAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE2LTEwLTI4VDEwOjI5OjQwKzA4OjAwskhk6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNi0xMC0yOFQxMDoyOTo0MCswODowMMMV3FUAAAAASUVORK5CYII=") no-repeat;
	    }

		&:hover {
    		background-color: #3498db;
    		color: #fff;

    		.backtotop-icon {
    			background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAQAAABKfvVzAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAHdElNRQfgChwKHShNoQCUAAAAuklEQVQ4y+2S3woBQRSHZ2b/PIwn8FIuXFCUJEVxQUlRUpuSktrUEsqrfS52nd1l/8il/K5mvvOdaaYzSv3zZXC5Axfcz3SHK2EC7HLdwifOHqtYN2xJx0Pn65qViE1ZLXJaUMxEaitFV3YTMvWRCP2IDIUM3lroSXFMfMhUaCett6QwT94YzVIqjRjXBa5fH4hhI9VaiCoCdpjMyRyeQgiq0e6YNyRszskGwwkIcAoG6nID/NKP8pt5AGRd/AuW3ERwAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE2LTEwLTI4VDEwOjI5OjQwKzA4OjAwskhk6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNi0xMC0yOFQxMDoyOTo0MCswODowMMMV3FUAAAAASUVORK5CYII=") no-repeat;
    		}
		}
	}

	.tip {
		background: url(https://s2.ax1x.com/2019/11/13/MGRS3T.png) 0 0 no-repeat;
		position: absolute;
		left: -117px;
		top: 0;
		width: 117px;
		height: 333px;
		z-index: $bg-zIndex + 1;
		transition: all .3s
	}

	.custom-bg {
		position: absolute;
		top: -15px;
		left: -130px;
		height: 100%;
		width: 200px;
		padding-bottom: 35px;
		box-sizing: content-box;
		background: rgba(255,255,255,0.8);
		border-radius: 4px;
		z-index: $bg-zIndex;
		transition: all .3s
	}
}

.fade-enter-active, .fade-leave-active {
	transition: opacity .3s
}
.fade-enter, .fade-leave-active {
	.tip {
		top: 50px;
		opacity: 0;
	}
	.custom-bg {
		top: 150px;
		left: -70px;
		height: 100px;
		width: 100px;
		opacity: 0;
   	}
}
</style>

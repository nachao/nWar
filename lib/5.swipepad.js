/**
*  @name 宫格
*
*  @depict
*  
*/
(function(){

	// nSwipepad.fn = nSwipepad.prototype = {};


	/************************************
		全部变量
	************************************/

	var
		// dom元素
		els = {

			main: $('#swipepad'),

			template: $('#swipepad-template')
		},

		// 单元位置
		// { id: '1234567890123', place: '11', remark: '', el: null };
		items = [],

		// 内置
		datas = {

			// 窗口尺寸
			body: {
				width: 0,
				height: 0
			},

			// 宫格尺寸
			size: {
				width: 800,
				height: 800
			},

			// 横纵数量
			quantity: {
				x: 4,
				y: 4
			},

			// 全部坐标
			places: [],
		},

		// 外置
		conf = {

			// 总数量
			total: 10,

			// 显示名称
			ownerClassName: 'swipepad-owner',

			// 已被拥有的名称
			activeClassName: 'swipepad-active',

			// 单元格名称
			itemClassName: 'swipepad-item',
		};

	function nSwipepad () {}

	// 实例后的方法
	nSwipepad.fn = nSwipepad.prototype = {
		create: function(){
			return nSwipepad.create();
		},
		owner: function (value, id) {
			return nSwipepad.owner(value, id);
		},
		quit: function (id) {
			return nSwipepad.quit(id);
		}
	};

	// 构造本身方法
	$.extend(nSwipepad, {

		datas: items,

		// 初始化容器样式
		initMain: function () {
			els.main
				.width(datas.size.width)
				.height(datas.size.height);
		},

		// 初始化全部坐标
		initPlace: function () {
			for ( var x=1; x<=datas.quantity.x; x++ ) {
				for ( var y=1; y<=datas.quantity.y; y++ ) {
					datas.places.push({
						id: x + '' + y,
						x: x,
						y: y
					});
				}
			}
		},

		// 根据横纵值随机一个位置，不得和已生成的重复
		getPlace: function () {
			return datas.places.splice( parseInt( Math.random() * datas.places.length), 1 )[0];
		},

		// 获取单个元素的尺寸
		getSize: function () {
			return {
				width: datas.size.width / datas.quantity.x,
				height: datas.size.height / datas.quantity.y
			};
		},

		// 生成一个位置的数据
		createData: function () {
			var result,
				place = nSwipepad.getPlace();

			if ( place )
				result = {
					id: place.id,
					x: place.x,
					y: place.y,
					bg: '',
					value: '1',
					remark: '',		// 拥有者
					confirm: 0		// 是否锁定，最大值为1，当大于0时，则表明要盈动次位置
				};

			return result;
		},

		// 获取元素参数
		getElParam: function ( data ) {
			var size = nSwipepad.getSize(),
				result = {
					// width: size.width + 'px',
					// height: size.height + 'px',
					top: size.height * ( data.y - 1 ) + 'px',
					left: size.width * ( data.x - 1 ) + 'px'
				}

			return result;
		},

		// 生成一个位置的元素，并将元素放置到指定的容器内
		createEl: function ( data ) {
			var el = els.template.clone(),
				size = nSwipepad.getSize();

			// 重置特性
			el.removeAttr('id').removeClass('swipepad-template');
			el.addClass('swipepad-temp');
			el.find('.item').css('backgroundColor', data.bg);

			// 设置尺寸
			el.width(size.width).height(size.height);

			// 设置位置
			el.css({
				top: size.height * ( data.y - 1 ),
				left: size.width * ( data.x - 1 ),
			})

			// el.click(function(){
			// 	console.log(data.id);
			// })

			// 插入元素
			els.main.append(el);
			return el;
		},

		// 获取指定位置的中点像素位置
		getCenter: function ( id ) {
			var size = nSwipepad.getSize(),
				data = items.$get('id=' + id)[0];

			return {
				top: size.height * data.y - size.height / 2,
				left: size.width * data.x - size.width / 2
			}
		},

		// 计算两个位置（对象数据）之间的像素距离
		getRange: function ( aid, bid ) {
			var size = nSwipepad.getSize(),
				length = 0,
				width = 0;

			var ab = items.$get('id=' + aid + '|' + bid),
				a = ab[0],
				b = ab[1]

			if ( a.x && b.x )
				length = ( a.x - b.x ) * size.width;

			if ( a.y && b.y )
				width = ( a.y - b.y ) * size.height;

			return Math.sqrt( Math.pow(length, 2) + Math.pow(width, 2) );
		},

		// 随机生成指定数量的单元格
		create: function () {
			var data;

			$.each(new Array(conf.total), function(i){
				data = nSwipepad.createData();

				if ( data ) {
					data.el = nSwipepad.createEl(data);
					// data.style = nSwipepad.getElParam(data);
					items.push(data);
				}
			});

			return items;
		},

		// 随机拥有者
		// @param {obecjt} value 详细为 name = 名称，color = 选择的颜色
		owner: function ( value, id ) {
			var data = items.$get('remark='),
				selected = data[parseInt(Math.random() * data.length)];

			if ( id )
				selected = items.$get('id=' + id)[0];

			selected.remark = value && value.name ? value.name : items.$get('remark!=').length + 1;
			selected.bg = value.color;
			selected.el.addClass(conf.activeClassName);
			selected.el.find('.' + conf.itemClassName).css('backgroundColor', value.color);
			selected.el.find('.' + conf.ownerClassName).html(value.name);
		},

		// 撤销拥有
		quit: function ( id ) {
			var data = items.$get('id=' + id)[0];

			data.remark = '';
			data.bg = '';
			data.el.removeClass(conf.activeClassName);
			data.el.find('.' + conf.itemClassName).css('backgroundColor', '');
			data.el.find('.' + conf.ownerClassName).html('');
		}

	});


	nSwipepad.initMain();

	nSwipepad.initPlace();

	// 生成布局
	// nSwipepad.create();

	
	window.nW5 = nSwipepad;

})();

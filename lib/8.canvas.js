/**
*  @name 宫格
*
*  @depict
*  
*  主要管理全部元素，包括对元素显示样式的更新和其他操作管理。
*/
(function(){

	// nWCanvas.fn = nWCanvas.prototype = {};


	/************************************
		全部变量
	************************************/

	var
		canvas = document.getElementById('myCanvas'),

		context = canvas.getContext('2d'),

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

	function nWCanvas () {}

	// 实例后的方法
	nWCanvas.fn = nWCanvas.prototype = {
		conf: conf,
		create: function(){
			return nWCanvas.create();
		},
		owner: function (value, id) {
			return nWCanvas.setOwnerStyle(value, id);
		},
		quit: function (id) {
			return nWCanvas.quit(id);
		},
		random: function () {
			return nWCanvas.getRandomPlace();
		},
		user: function ( place, user ) {
			return nWCanvas.setUserStyle(place, user);
		},
		set: function ( place, value ) {
			return nWCanvas.setShowValue(place, value);
		},
		move: function ( source, target, number ) {
			return nWCanvas.createPoint(source, target, number);
		},
		icon: function ( place ) {
			return nWCanvas.createGade(place, place.params.user);
		}
	};

	// 构造本身方法
	$.extend(nWCanvas, {

		datas: items,

		canvas: canvas,

		// 初始化
		initMain: function () {
			canvas.width = datas.size.width;
			canvas.height = datas.size.height;
		},

		// 初始化全部坐标
		initPlace: function () {
			for ( var x=0; x<datas.quantity.x; x++ ) {
				for ( var y=0; y<datas.quantity.y; y++ ) {
					datas.places.push({
						id: x + '' + y,
						x: x * 200,
						y: y * 200,
						width: 200,
						height: 200
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
				style = nWCanvas.getPlace();

			if ( style )
				result = {
					id: style.id,	// 唯一标识
					el: null,		// 对应的元素

					// 所有参数
					params: {

						// 样式数据
						style: style,

						// 操作或资源数据
						resource: {
							confirm: 0		// 是否锁定，最大值为1，当大于0时，则表明要盈动次位置	
						},

						// 对应的用户数据
						user: {
							uid: '',		// 所有者ID
							bg: '',
							name: '',
							remark: '',		// 备注
						}
					},

					// 所有事件
					motion: {}
				};

			return result;
		},

		// 获取元素参数
		getElParam: function ( data ) {
			var size = nWCanvas.getSize(),
				result = {
					top: size.height * ( data.params.style.y - 1 ) + 'px',
					left: size.width * ( data.params.style.x - 1 ) + 'px'
				}

			return result;
		},

		// 绘制圆角矩形
		roundedRect: function( cornerX, cornerY, width, height, cornerRadius ) {

			if ( width > 0 )
				context.moveTo(cornerX + cornerRadius, cornerY);
			else 
				context.moveTo(cornerX - cornerRadius, cornerY);

			context.arcTo(cornerX+width,cornerY,cornerX + width,cornerY+height,cornerRadius);

			context.arcTo(cornerX+width,cornerY + height,cornerX,cornerY+height,cornerRadius);
			context.arcTo(cornerX,cornerY+height,cornerX,cornerY,cornerRadius);

			if ( width > 0 )
				context.arcTo(cornerX,cornerY,cornerX+cornerRadius,cornerY,cornerRadius);
			else
				context.arcTo(cornerX,cornerY,cornerX-cornerRadius,cornerY,cornerRadius);
		},

		// 生成一个位置的元素，并将元素放置到指定的容器内
		createEl: function ( data ) {
			// var el = els.template.clone(),
				// size = nWCanvas.getSize();

			var style = data.params.style;



		    nWCanvas.roundedRect( style.x + style.width/4, style.y + style.height/4, style.width/2, style.height/2, 3 );
			context.fillStyle='#eee';
		    context.fill();

			context.font = '12px';
			context.fillText("文字", style.x + style.width/4, style.y + style.width/4 - 6);

			// context.fillText("文字2",200,300);

			// 重置特性
			// el.removeAttr('id').removeClass('swipepad-template');
			// el.addClass('swipepad-temp');
			// el.find('.item').css('backgroundColor', data.params.user.bg);

			// // 设置尺寸
			// el.width(size.width).height(size.height);

			// // 设置位置
			// el.css({
			// 	top: size.height * ( data.params.style.y - 1 ),
			// 	left: size.width * ( data.params.style.x - 1 ),
			// })

			// 插入元素
			// els.main.append(el);
			// return el;
		},

		// 获取指定位置的中点像素位置
		getCenter: function ( id ) {
			var size = nWCanvas.getSize(),
				data = items.$get('id=' + id)[0];

			return {
				top: size.height * data.params.style.y - size.height / 2,
				left: size.width * data.params.style.x - size.width / 2
			}
		},

		// 计算两个位置（对象数据）之间的像素距离
		getRange: function ( aid, bid ) {
			var size = nWCanvas.getSize(),
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
				data = nWCanvas.createData();

				if ( data ) {
					data.el = nWCanvas.createEl(data);
					// data.opt = data.el.find('.growups-value');
					// data.style = nWCanvas.getElParam(data);
					items.push(data);
				}
			});

			return items;
		},

		// 随机获取一个空位置
		getRandomPlace: function () {
			var data = items.$get('uid=');
			return data.$path[parseInt(Math.random() * data.length)].value[1];
		},

		// 设置一个位置的所有者信息
		// 给定位置对象和用户数据，并将此位置所有设置为此用户的信息
		// @param {obecjt} value 详细为 name = 名称，color = 选择的颜色
		setUserStyle: function ( place, user ) {

			// 更新数据
			// [place.params.user].$update(user);
			place.params.user.color = user.color;
			place.params.user.name = user.name;
			place.params.user.uid = user.uid;

			// 如果是用户则显示功能，电脑则不显示
			if ( !user.auto )
				place.el.addClass(conf.activeClassName);

			// 生成图标
			nWCanvas.createGade(place, user);

			// 更新样式
			place.el.find('.' + conf.itemClassName).css('backgroundColor', user.color);
			place.el.find('.' + conf.ownerClassName).html(user.name);

			return place;
		},

		// 设置一个位置的所有相关信息（除了资源值之外的）
		setShowValue: function ( id ) {
			var place = items.$get('id=' + id)[0];

			$(place.el).find('.swipepad-name').html(place.params.resource.level);
			$(place.el).find('.swipepad-owner').html(place.params.user.name);

			return place;
		},

		// 生成对应的级别动画
		createGade: function ( place, user ) {
			var level = place.params.resource.level;

			// 清除原有图标
			place.el.find('.swipepad-grade').empty();

			// 生成图标
			for ( var i=0; i< parseInt(Math.random() * 3) + 3; i++ ) {
				place.el.find('.swipepad-grade').append('<span class="icon-nWar_'+ level +'" level="'+ level +'" ></span>');
			}

			// 设置样式
			place.el.find('.swipepad-grade span').each(function(i, el){
				var size = parseInt(Math.random() * 10) + 12;
				$(el).css({
					color: user.color,
					fontSize: size,
					left: i * size
				});
			});
		},

		// 随机拥有者
		// @param {obecjt} value 详细为 name = 名称，color = 选择的颜色
		setOwnerStyle: function ( value, id ) {
			var data = items.$get('remark='),
				selected = data[parseInt(Math.random() * data.length)];

			if ( id )
				selected = items.$get('id=' + id)[0];

			// 更新数据
			[selected.user].$update(value);

			// 更新样式
			selected.el.addClass(conf.activeClassName);
			selected.el.find('.' + conf.itemClassName).css('backgroundColor', value.color);
			selected.el.find('.' + conf.ownerClassName).html(value.name);

			return selected;
		},

		// 生成点，并移动到目标位置
		createPoint: function ( source, target, number ) {
			var sourceuid = source.params.user.uid;

			for ( var i=0; i<number; i++ ) {
				setTimeout(function(){
					nWCanvas.movePoint(source, sourceuid, target);
				}, 1000/number*i);
			}
		},

		// 生成点，并移动到目标位置
		movePoint: function ( source, sourceuid, target ) {

			var size = parseInt(Math.random() * 5) + 3;

			// 获取距离
			var x = target.params.style.x - source.params.style.x,
				y = target.params.style.y - source.params.style.y,
				distance = Math.sqrt(Math.pow(Math.abs(x), 2) + Math.pow(Math.abs(y), 2));

			// 如果在调遣过程中被占领，则不无法做派遣
			// if ( source.params.user.uid != sourceuid )
			// 	return;

			// 如果没有资源了，则不做派遣
			if ( source.params.resource.value <= 0 )
				return;

			// 派遣
			source.motion.detach(1);

			// 生成元素点
			source.el.find('.swipepad-point').append('<i class="swipepad-movePoint"></i>');

			// 初始化样式
			source.el.find('.swipepad-movePoint:last').css({
				width: size,
				height: size,
				position: 'absolute',
				borderRadius: '50%',
				zIndex: 3,
				top: parseInt(Math.random() * 90),
				left: parseInt(Math.random() * 90),
				backgroundColor: source.params.user.color //'black'

			// 移动到目标位置的动画
			}).animate({
				left: x * 200 + parseInt(Math.random() * 90),
				top: y * 200 + parseInt(Math.random() * 90)

			// 到达目标位置后
			}, distance * 1000, function(){
				$(this).remove();
				target.motion.into(source, sourceuid, 1);
			});
		},

		// 撤销拥有
		quit: function ( id ) {
			var place = items.$get('id=' + id)[0];

			place.params.user.uid = '';
			place.params.user.remark = '';
			place.params.user.bg = '';

			place.el.removeClass(conf.activeClassName);
			place.el.find('.' + conf.itemClassName).css('backgroundColor', '');
			place.el.find('.' + conf.ownerClassName).html('');

			// 图标
			if ( place.el.find('.swipepad-grade span').length )
				place.el.find('.swipepad-grade span').css({ color: '' });
		}

	});


	nWCanvas.initMain();

	nWCanvas.initPlace();

	// 生成布局
	nWCanvas.create();

	
	window.nW8 = nWCanvas;

})();

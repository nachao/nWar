/**
*  @name 扩散
*
*  @depict
*  


	Math.sin()	// 获取y坐标	半径 * Math.sin(2 * Math.PI / 360 * 角度)	= x
	Math.cos()	// 获取x坐标	半径 * Math.sin(2 * Math.PI / 360 * 角度)	= y




*/
(function(){



	/************************************
		全部变量
	************************************/

	var 

		// 全部关联数据
		items = [],

		// 配置
		conf = {

			els: $('.spreads'),

			// 扩散元素名
			iClassName: 'spread-i',

			// 扩散元素宽度
			iSize: 5,

			// 过程时长
			time: 1000

		};


	function nSpread () {}

	$.extend(nSpread, {

		// 公布数据
		datas: items,


		// 将目标元素绑定数据
		bindEl: function () {
			$(conf.els).each(function(i, el){
				var id = new Date().getTime().toString(36);

				items.push({
					id: id,
					el: $(el),
					bg: '',
					radius: $(el).width() / 2,
					margin: 10,		// 距离元素边缘间距
					angle: 90		// 指定扩散角度
				});

				$(el).click(function(){
					nSpread.setStart(id, 10);
				})
			});
		},

		// 生成指定个点元素
		dotCreate: function ( id ) {
			var data = items.$get(id)[0],
				el;

			if ( data.el.css('position') == 'static' )
				data.el.css('position', 'relative');

			data.el.append('<i class="'+ conf.iClassName +'"></i>');

			el = data.el.find('i.' + conf.iClassName + ':last');
			el.css(nSpread.dotSource(id)).animate(nSpread.dotTarget(id), function(){
				el.animate(nSpread.dotVanish(id), function(){
					el.remove();
				});
			});
		},

		// 获取随机扩散生成点
		dotPlace: function ( id, margin ) {
			var data = items.$get(id)[0],
				size = data.el.width(),
				result;

			margin = margin || 0;

			// 获取元素的最大范围
			if ( data.el.height() > size )
				size = data.el.height();

			// 随机值
			var radius = size / 2 + margin,				// 半径
				angle= parseInt(Math.random() * 360);	// 角度

			// 随机角度
			if ( typeof data.angle == 'number' )
				angle = data.angle + parseInt(Math.random() * 10) * ( Math.random() > 0.5 ? -1 : 1 );	// 角度

			// 计算后
			var left = parseInt(radius * Math.cos(2 * Math.PI / 360 * angle)),
				top = parseInt(radius * Math.sin(2 * Math.PI / 360 * angle));

			result = {
				top: top + size / 2,
				left: left + size / 2
			};

			return result;
		},

		// 初始化点元素样式
		dotSource: function ( id ) {
			var data = items.$get(id)[0],
				place = nSpread.dotPlace(id),
				bg = data.bg || data.el.css('backgroundColor');

			return {
				width: 1,
				height: 1,
			    display: 'inline-block',
				borderRadius: '50%',
				position: 'absolute',
				top: place.top,
				left: place.left,
				backgroundColor: bg
			};
		},

		// 扩散点移动到目标位置
		dotTarget: function ( id ) {
			var data = items.$get(id)[0],
				place = nSpread.dotPlace(id, data.margin);

			return {
				width: conf.iSize,
				height: conf.iSize,
				top: place.top,
				left: place.left
			};
		},

		// 扩散点消失动画
		dotVanish: function ( id ) {
			var data = items.$get(id)[0];

			return {
				width: conf.iSize *2,
				height: conf.iSize *2,
				opacity: 0
			};
		},

		// 扩散指定的元素
		setStart: function ( id, number ) {
			var time = conf.time;

			for ( var i=0; i<number; i++ ) {
				setTimeout(function(){
					nSpread.dotCreate(id);
				}, time / number * i);
			}
		}

	});


	nSpread.bindEl();


	window.nW3 = nSpread;

})();

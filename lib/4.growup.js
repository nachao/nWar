/**
*  @name 自增
*
*  @depict
*  
*/
(function(){



	/************************************
		全部变量
	************************************/

	var 

		// 全部关联数据
		items = [],

		// max: 10,20,40,70,100
		rules = [
			{
				value: 1,
				min: 0,
				max: 10,
				consume: 10,
				timegap: 1500,
				timeout: null
			},
			{
				value: 2,
				min: 0,
				max: 20,
				consume: 20,
				timegap: 1300,
				timeout: null
			},
			{
				value: 3,
				min: 0,
				max: 40,
				consume: 40,
				timegap: 1100,
				timeout: null
			}
		],

		// 配置
		conf = {

			// 所有关联元素的样式名称
			className: 'growups',

			// 显示在指定的子集，没有则显示在 html 或 value 中。
			displayClassName: '.growups-value',

			// 开启自增后的样式名
			activeClassName: 'growups-act',

			// 自增间隔（ms）
			time: 1000,

			// 每次自增值 +1
			number: 1,
		};


	function nGrowup () {}

	// 实例后的方法
	nGrowup.fn = nGrowup.prototype = {
		init: function(){
			return nGrowup.initData();
		},
		bind: function (value) {
			return nGrowup.bindData(value);
		},
		start: function ( id ) {
			return nGrowup.setStart(id);
		},
		end: function ( id ) {
			return nGrowup.setEnd(id);
		},
		goto: function (id, number) {
			return nGrowup.setGoto(id, number);
		},
		get: function () {
			return nGrowup.getInitData();
		},
		data: items
	};


	$.extend(nGrowup, {

		// 公布数据
		datas: items,

		// 根据关联元素，返回全部数据
		initData: function () {
			var els = $(conf.className),
				id;

			$.each(els, function(i, el){
				id = Math.random().toString(36).substr(2);
				items.push({
					id: id,
					number: parseInt(Math.random() * 10),
					timegap: (parseInt(Math.random() * 10) + 1) * 100,
					timeout: null,
					max: parseInt(Math.random() * 100) + 1,
					min: 0,
					el: $(el)
				});
				nGrowup.elEvent(id);
			});

			return items;
		},

		// 获取初始数据
		getInitData: function () {
			return rules[0];
		},

		// 初始元素数据
		bindData: function ( datas ) {
			$(datas).each(function(i, data){
				data.growup = {
					number: 0,//parseInt(Math.random() * 10),
					timegap: (parseInt(Math.random() * 10) + 1) * 100,
					timeout: null,
					max: parseInt(Math.random() * 100) + 1,
					min: 0
				};
				items.push(data);
			});
			return datas;
		},

		// 指定显示值
		setGoto: function ( id, number ) {
			var data = items.$get('id=' + id)[0];

			if ( data ) {
				data.number = number;

				nGrowup.elShow(id);
			}
		},

		// 判断数据是否达到限制
		setNormal: function ( id ) {
			var data = items.$get('id=' + id)[0];

			if ( data ) {
				if ( data.number < data.min )
					data.number = data.min;

				else if ( data.number > data.max )
					data.number = data.max;
			}
		},

		// 判断数据是否达到限制
		isNormal: function ( id, number ) {
			var data = items.$get('id=' + id)[0],
				result;

			if ( data ) {
				if ( !number )
					number = data.number;

				result = number >= data.min && number <= data.max;
			}

			return result;
		},

		// 指定开始 - 自增（默认）/自减
		// @param {boolean} type = true为自增，false为自减
		setStart: function ( id, type ) {
			var data = items.$get('id=' + id)[0],
				number;

			if ( typeof type != 'boolean' )
				type = true;

			// 没有所有者，不开始
			if ( !data.uid )
				return;

			if ( data ) {
				// nGrowup.setNormal(id);

				// 清除之前的循环
				if ( data.timeout )
					clearTimeout(data.timeout);

				// 开始循环
				data.timeout = setInterval(function(){
					data = items.$get('id=' + id)[0];

					// if ( !data.number )
					// 	data.number = 0;

					number = type?
						data.number + conf.number:
						data.number - conf.number;

					if ( nGrowup.isNormal(id, number) )
						data.number = number;
					else
						nGrowup.setEnd(id);

					nGrowup.elShow(id);
				}, data.timegap);

				nGrowup.elShow(id);
				nGrowup.elStyle(id);
			}
		},

		// 指定结束 - 自增/自减
		setEnd: function ( id ) {
			var data = items.$get('id=' + id)[0];

			console.log(data);

			if ( data ) {
				clearTimeout(data.timeout);
				data.timeout = null;

				nGrowup.elStyle(id);
			}
		},

		// 指定元素开始自增
		elShow: function ( id ) {
			var data = items.$get('id=' + id)[0],
				el = data.el;

			if ( conf.displayClassName )
				el = el.find(conf.displayClassName);

			if ( data )
				if ( data.uid )
					el.html(data.number);
				else
					el.html('');
		},

		// 指定元素的样式切换
		elStyle: function ( id ) {
			var data = items.$get('id=' + id)[0];

			if ( data ) {
				if ( data.timeout )
					data.el.addClass(conf.activeClassName);
				else
					data.el.removeClass(conf.activeClassName);
			}
		},

		// 给元素绑定事件
		elEvent: function ( data ) {
			// var data = items.$get('id=' + id)[0];

			// 切换开始和结束自增
			data.el.click(function(){
				if ( data.timeout ) {
					nGrowup.setEnd(data.id);
				}
				else {
					if ( data.number >= data.max )
						nGrowup.setStart(data.id, false);
					else
						nGrowup.setStart(data.id);
				}
			});
		}
	});


	// nGrowup.initData();


	window.nW4 = nGrowup;

})();

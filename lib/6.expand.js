/**
*  @name 扩展
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

		// 全部关联元素
		els = '.nexpand',

		// max: 10,20,40,70,100
		rules = [
			{
				value: 1,
				min: 0,
				max: 10,
				consume: 10,
				timegap: 1500,
			},
			{
				value: 2,
				min: 0,
				max: 20,
				consume: 20,
				timegap: 1300,
			},
			{
				value: 3,
				min: 0,
				max: 40,
				consume: 40,
				timegap: 1100,
			}
		],

		// 配置
		conf = {

			// 范围名称
			regionClassName: 'nexpand-btns',

			// 容器名称
			containerClassName: '.nexpand-contain',

			// 按钮名称
			btnClassName: 'nexpand-btn',

			// 按钮范围(px)
			btnRange: 100
		};


	function nExpand () {}

	// 实例后的方法
	nExpand.fn = nExpand.prototype = {
		init: function(){
			return nExpand.initData();
		},
		bind: function(value){
			return nExpand.bindData(value);
		},
		click: function (callback) {
			return nExpand.bindClick(callback);
		},
		up: function (id, callback) {
			return nExpand.setRule(id, true, callback);
		},
		down: function (id, callback) {
			return nExpand.setRule(id, false, callback);
		},
		data: items,
		rule: rules
	};

	// 构造本身方法
	$.extend(nExpand, {

		// 公布数据
		datas: items,

		// 初始元素数据
		initData: function (value) {
			$(els).each(function(i, el){
				var id = new Date().getTime().toString(36);
					data = {
						id: id,
						el: $(el),
						btns: [],
						container: null
					};

				// 初始化
				data.container = nExpand.initContainer(data);
				data.btns = nExpand.initBtns(data);

				// 保存数据
				items.push(data);

				// 给元素绑定事件
				$(el).mouseenter(function(){
					nExpand.showBtns(id);
				}).mouseleave(function(){
					nExpand.hideBtns(id);
				});
			});
		},

		// 初始元素数据
		bindData: function ( datas ) {
			$(datas).each(function(i, data){
				$.extend(data, {
					container: nExpand.initContainer(data)
				})
				$.extend(data, {
					btns: nExpand.initBtns(data)
				})

				// 给元素绑定事件
				data.el.mouseenter(function(){
					nExpand.showBtns(data.id);
				}).mouseleave(function(){
					nExpand.hideBtns(data.id);
				});

				// 绑定一个点击事件
				data.el.find('.expand-up').click(function(){
					conf.callback(data.id, 'up');
				});

				// 保存数据
				items.push(data);
			});
		},

		// 给目标元素生成范围容器
		initContainer: function ( data ) {
			var el = data.el,
				container;

			el.find(conf.containerClassName).append('<i class="'+ conf.regionClassName +'"></i>');
			container = el.find('.' + conf.regionClassName);

			return container;
		},

		// 给目标元素生成全部被定义的按钮
		initBtns: function ( data ) {
			var els = [],
				actions = nExpand.btnAction();

			$.each(actions, function(i, btn){
				data.container.append('<a class="'+ conf.btnClassName +'" href="#">'+ btn.name +'</a>');
				var el = data.container.find('.' + conf.btnClassName + ':last');
				// el.css(btn.place);	// 初始化样式
				el.click(function(){
					conf.callback(data.id, btn.name);
				});
				els.push(el);
			});

			return els;
		},

		// 给元素绑定关联操作
		btnAction: function () {
			return [
				{
					name: '25%',
					place: {
						left: '127px',
						top: '31px'
					},
					click: function () {
						console.log(111);
					}
				},
				{
					name: '50%',
					place: {
						left: '154px',
						top: '63px'
					},
					click: function () {
						console.log(2);
					}
				},
				{
					name: '75%',
					place: {
						left: '159px',
						top: '99px'
					},
					click: function () {}
				},
				{
					name: '100%',
					place: {
						left: '144px',
						top: '134px'
					},
					click: function () {}
				}
			];
		},

		// 显示全部按钮
		showBtns: function ( id ) {
			var data = items.$get(id)[0];

			data.container.show();
		},

		// 隐藏全部按钮
		hideBtns: function ( id ) {
			var data = items.$get(id)[0];

			data.container.hide();
		},

		// 绑定点击事件
		bindClick: function ( callback ) {
			conf.callback = callback;
		},

		// 设置自增规则
		setRule: function ( id, isup, callback ) {
			var data = items.$get(id)[0],
				rule = rules[data.value-1],
				result;

			if ( isup && rules[data.value] ) {
				result = data.number >= rule.consume;
			}
			else {
				rule = rules[value-2];
			}

			if ( result ) {
				data.number -= rule.consume;
				[data].$update(rules[data.value]);
				callback();
			}
		},

	});


	// nExpand.initData();

	window.nW6 = nExpand;

})();

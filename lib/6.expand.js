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
		els = $('.nexpand'),

		// 配置
		conf = {

			// 范围名称
			regionClassName: 'nexpand-region',

			// 容器名称
			containerClassName: 'nexpand-container',

			// 按钮名称
			btnClassName: 'nexpand-btn',

			// 按钮范围(px)
			btnRange: 100
		};


	function nExpand () {}

	$.extend(nExpand, {

		// 公布数据
		datas: items,


		// 初始元素数据
		initData: function () {
			$(els).each(function(i, el){
				var id = new Date().getTime().toString(36);

				// 定义数据
				items.push({
					id: id,
					el: $(el),
					btns: [],
					container: nExpand.initContainer($(el))
				});

				// 初始化
				// items.container = nExpand.initContainer(id);
				items.btns = nExpand.initBtns(id);

				// 给元素绑定事件
				$(el).mouseenter(function(){
					nExpand.createContainer(id);
				}).mouseleave(function(){

				});
			});
		},

		// 给目标元素生成范围容器
		initContainer: function ( el ) {
			var container;

			el.append('<i class="'+ conf.regionClassName +'"></i>');
			container = el.find('.' + conf.regionClassName);

			// 初始化样式
			container.css({
				width: el.width() + conf.btnRange,
				height: el.height() + conf.btnRange,
				position: 'absolute',
				top: -conf.btnRange / 2,
				left: -conf.btnRange / 2,
				background: 'rgba(0,0,0,.3)',
				borderRadius: el.css('border-radius')
			});

			return container;
		},

		// 给目标元素生成全部被定义的按钮
		initBtns: function ( id ) {
			var data = items.$get(id)[0],
				els = [],
				actions = nExpand.btnAction();

			$.each(actions, function(i, btn){
				data.container.append('<a class="'+ conf.btnClassName +'" href="#">'+ btn.name +'</a>');

				var btn = data.container.find('.' + conf.btnClassName + ':last');

				btn.css({
					// 'float': 'left',
					
				});

				// 初始化样式
				// el.css({
				// 	width: data.el.width() + conf.btnRange,
				// 	height: data.el.height() + conf.btnRange,
				// 	position: 'absolute',
				// 	top: -conf.btnRange / 2,
				// 	left: -conf.btnRange / 2,
				// 	background: 'rgba(0,0,0,.3)',
				// 	borderRadius: data.el.css('border-radius')
				// });

				// els.push(el);
			});

			return els;
		},

		// 给元素绑定关联操作
		btnAction: function () {
			return [
				{
					name: '111',
					action: function () {}
				},
				{
					name: '222',
					action: function () {}
				},
				{
					name: '333',
					action: function () {}
				}
			];
		},

		// 显示全部按钮
		showBtns: function ( id ) {
			var data = items.$get(id)[0];

			
		},

		// 隐藏全部按钮
		hideBtns: function ( id ) {
			var data = items.$get(id)[0];
		},

	});


	nExpand.initData();

	window.nW6 = nExpand;

})();

/**
*  @name 自增（资源）
*
*  @depict
*  
*  主要用于管理数据，对数据的所有操作。
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
				level: 1,
				value: 0,
				min: 0,
				max: 10,
				consume: 10,
				timegap: 500
			},
			{
				level: 2,
				max: 20,
				consume: 20,
				timegap: 1300
			},
			{
				level: 3,
				max: 40,
				consume: 40,
				timegap: 1100
			}
		],


		// 监听
		callbacks = [],

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
		bind: function (place) {
			return nGrowup.bindData(place);
		},
		start: function ( id ) {
			return nGrowup.setStart(id);
		},
		end: function ( id ) {
			return nGrowup.setEnd(id);
		},
		set: function ( id, number, remark ) {
			return nGrowup.setGoto(id, number, remark);
		},
		get: function () {
			return nGrowup.getInitData();
		},
		on: function ( callback ) {
			if ( callback )
				return nGrowup.onSet(callback);
		},
		up: function (id, callback) {
			return nGrowup.setRule(id, callback, true);
		},
		total: function ( uid ) {
			return nGrowup.getTotal(uid);
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

		// 初始元素数据
		bindData: function ( place ) {
			$.extend(place.params.resource, rules[0]);

			items.push(place);

			return place;
		},

		// 监听数据变化
		onSet: function ( callback ) {
			callbacks.push(callback);
		},

		// 指定显示值
		setGoto: function ( id, number, action ) {
			var data = items.$get('id=' + id)[0],
				that = this;

			if ( data ) {
				data.params.resource.value = number;
				nGrowup.elShow(id);

				// 执行监听
				$.each(callbacks, function(i, callback){
					callback({
						from: data,
						action: action,
						// user: data.params.user,
						// total: that.getTotal(data.params.user.uid)
					});
				});
			}
		},

		// 计算制定用户的全部资源总值
		getTotal: function ( uid ) {
			var result = 0;

			$.each(items.$get('uid=' + uid).$path, function(index, item){
				result += item.value[2].resource.value;
			});

			return result;
		},

		// 判断数据是否达到限制
		setNormal: function ( id ) {
			var data = items.$get('id=' + id)[0];

			if ( data ) {
				if ( data.params.resource.value < data.params.resource.min )
					data.params.resource.value = data.params.resource.min;

				else if ( data.params.resource.value > data.params.resource.max )
					data.params.resource.value = data.params.resource.max;
			}
		},

		// 判断数据是否达到限制
		isNormal: function ( id, number ) {
			var data = items.$get('id=' + id)[0],
				result;

			if ( data ) {
				if ( !number )
					number = data.params.resource.value;

				result = number >= data.params.resource.min && number <= data.params.resource.max;
			}

			return result;
		},

		// 指定开始 - 自增（默认）/自减
		// @param {boolean} type = true为自增，false为自减
		setStart: function ( id, type ) {
			var data = items.$get('id=' + id)[0],
				that = this,
				number;

			if ( typeof type != 'boolean' )
				type = true;

			// 没有所有者，不开始
			if ( !data.params.user.uid )
				return;

			// 清除之前的循环
			if ( data.params.resource.timeout )
				clearTimeout(data.params.resource.timeout);

			// 开始循环
			data.params.resource.timeout = setInterval(function(){
				data = items.$get('id=' + id)[0];

				number = type?
					data.params.resource.value + conf.number:
					data.params.resource.value - conf.number;

				if ( nGrowup.isNormal(id, number) )
					that.setGoto(id, number, '增长');
				else
					nGrowup.setEnd(id);

				nGrowup.elShow(id);
			}, data.params.resource.timegap);

			nGrowup.elShow(id);
			nGrowup.elStyle(id);
		},

		// 指定结束 - 自增/自减
		setEnd: function ( id ) {
			var data = items.$get('id=' + id)[0];

			if ( data ) {
				clearTimeout(data.params.resource.timeout);
				data.params.resource.timeout = null;

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
				if ( data.params.user.uid )
					el.html(data.params.resource.value);
				else
					el.html('');
		},

		// 指定元素的样式切换
		elStyle: function ( id ) {
			var data = items.$get('id=' + id)[0];

			if ( data ) {
				if ( data.params.resource.timeout )
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
				if ( data.params.resource.timeout ) {
					nGrowup.setEnd(data.id);
				}
				else {
					if ( data.params.resource.value >= data.params.resource.max )
						nGrowup.setStart(data.id, false);
					else
						nGrowup.setStart(data.id);
				}
			});
		},

		// 设置自增规则
		setRule: function ( id, callback, isup ) {
			var place = items.$get('id=' + id)[0],
				resource = place.params.resource;

			// 是否有下一等级
			// 是否升级
			if ( isup && rules[resource.level] ) {

				// 判断升级所需的消耗是否足够
				if ( resource.value >= resource.consume ) {

					// 更新资源值
					nGrowup.setGoto(id, resource.value - resource.consume, '升级');

					// 更新资源上限等规则
					[place.params.resource].$update(rules[resource.level]);

					// 回调
					callback();
				}
			}

			// 降级
			// else {
			// 	level = rules[level-2];
			// }

			return place;
		},

	});


	// nGrowup.initData();


	window.nW4 = nGrowup;

})();

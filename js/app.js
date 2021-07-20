 ;(function () {
 	Vue.directive('focus',{
 		inserted:function(el,binding){
 			el.focus()
 		}
 	})
 		Vue.directive('todo-focus',{
 		update:function(el,binding){
 			if(binding.value){
 				el.focus()
 				
 			}
 		}
 	})
	// const todos=[
	// 	{ id: 1,
	// 	  title: '吃饭',
	// 	  completed: true
	// 	},
	// 	{ id: 2,
	// 	  title: '上课',
	// 	  completed: false
	// 	},
	// 	{ id: 3,
	// 	  title: '学代码',
	// 	  completed: false
	// 	}
	// ]

	window.app=new Vue({
		data: {
		  todos:JSON.parse(window.localStorage.getItem('todos')||'[]'),
		  currentediting: null,
		  filterText:'all'
		},
		computed:{
			// computed  n次使用只调用1次  它缓存
			// methods   n次使用调用n次   它不缓存
			// 计算属性是vue提供的一大特色
			// 顾名思义：是一种行为的属性，本质是方法但是不能当做方法来调用，必须当作属性来使用
			// 它相比于方法的优势就在于会缓存计算的结果，效率很高
			// 计算属性只能当作属性来使用，不能用于事件处理函数
		// 简写方式，一个函数，作为get方法
			// remaningCount(){
			// 	// 该成员就是一个方法，但是在使用的时候必须当成一个属性来用
			// 	return this.todos.filter(t=>!t.completed).length
			// }
			remaningCount:{
				// 当你访问remaningCount会自动调用get方法
				get(){
					return this.todos.filter(t=>!t.completed).length
				}
				// 当你 实例.remaningCount=xxx的时候会自动调用set方法
				// 以下只是为了演示set语法
				// set(){
				// 	console.log('qqq')
			},
			toggleAllStat:{
				// 计算属性知道它依赖了todos  
				// 当todos发生变化，计算属性会重新计算
				get(){
					return this.todos.every(t=>t.completed)
				},
				set(){
					// 表单控件checked双向绑定了toggleAllStat
					// 所以checkbox的变化会调用set方法
					// 在set方法中我们要做的就是
					//    1.得到当前checked得选中状态
					//    2.把所有任务项的选项状态都设置为toggleAllStat的选中状态
			// 在set方法中访问自己就是调用自己的get方法
					// console.log(!this.toggleAllStat)
				 	const checked=!this.toggleAllStat
					// const checked=e.target.checked
				 	this.todos.forEach(item=>{
				 		item.completed=checked
				 	})
				 }
		    },
		    filterTodos(){
		    		// 如果all return todos
		    		// active todos.filter(t=>!t.completed)
		    		//  completed todos.filter(t=>t.completed)
		    		
		    		// all
		    		// return this.todos
		    		
		    		
		    		// active
		    		// return this.todos.filter(t=>!t.completed)
		    		
		    		// completed
		    	    // return this.todos.filter(t=>t.completed)
		   			switch(this.filterText){
		   				case 'active':
		   				return this.todos.filter(t=>!t.completed)
		   				break
		   				case 'completed':
		   				return this.todos.filter(t=>t.completed)
		   				break
		   				default:
		   				return this.todos
		   				break

		   			}


				}		
		}  ,
		watch:{
			// 监视todos的改变，当todos发生改变的时候做业务定制处理
			// 引用类型只能监视一层，无法监视内部成员的子成员的改变
			todos:{
				// 当监视到todos改变的时候会自动调用handler方法
				// val为变化过后的新值，oldVal变化之前的值
				handler(val,oldVal){
					
					// 当监视到todos改变，存储本次todos的状态到本地
					// window.localStorage.setItem('todos',JSON.stringify(this.todos))
					// 这里既可以通过this.todos来访问，也可以通过val来得到最新的todos
					window.localStorage.setItem('todos',JSON.stringify(val))
				},
				deep:true  //深度监视，只有这样才能监视到数组或者对象子成员的改变  //只有todos改变才会调用
				// immediate: true   //无论变化与否上来就调用一次
			}
		},
		methods:{
				
				helandkeydown(e){
						//注册按下的回车事件
						//获取文本框的内容
						//数据校验
						//添加到todos列表
				// console.log(this.todoText) 不需要双向绑定的时候不要滥用
					const target=e.target
					const value=e.target.value.trim()//trim去掉首尾空格
					  if(!value.length){
					  	return
					  }
					  const todos=this.todos
					  todos.push({
					  		id:todos.length?todos[todos.length-1].id+1:1,
					  		title:value,
					  		complete:false
					  })
					  target.value=''
				 },
				 handleToggleAllChange(e){
				 	// 绑定checkbox的change事件
				 	// 获取checkbox的选中的状态
				 	// 直接循环所有的子任务项的选中状态设置为toggleAll的状态
				 	
				 	const checked=e.target.checked
				 	this.todos.forEach(item=>{
				 		item.completed=checked
				 	})
				 },
				 handleRemoveTodoClick(index){
				 		this.todos.splice(index,1)
				 },
				 dblclick(todo){
				 	// 把当前变量等于当前双击的todo
				 	// console.log(todo)
				 	this.currentediting=todo
				 },
				 handlesavekeydown(todo, index, e){
				 	// 注册绑定事件处理函数
				 	// 获取编辑文本的数据
				 	// 数据校验
				 	// 如果数据是空的，则直接删除该元素
				 	// 否则保存编辑
				 	const target=e.target
				 	const value=target.value.trim()
				 	//数据被编辑为空的了，直接删除
				 	if(!value.length){
				 			this.todos.splice(index,1)
				 	}else{
				 		todo.title=value
				 		this.currentediting=null
				 	}

				 },
				 hanglecanceleditesc(){
				 	this.currentediting=null
				 },
				 handlclearalldownclick(){
				 	//  错误写法
				 	// this.todos.forEach((item,index)=>{
				 	// if(item.completed){
				 	// 	this.todos.splice(index,1)
				 	// 	下标错乱
				 	
				 	//手动控制索引的方式 	
				 	for(let i=0;i<this.todos.length;i++){
				 		if(this.todos[i].completed){
				 	    this.todos.splice(i,1),
				 	    // 删除元素后让我们遍历的索引倒退一次
				 	    // 纠正索引的遍历
				 	    i--


                  // 过滤出来需要的 
                  // 这里还有一个办法是把需要的结果过滤出来重新赋值到todos中
                  // this.todos=this.todosfilter(t=>!t.completed)    
				 	 }
				 	} 
                  },
                //获取剩余的任务数量 
               getRemaningCount(){
               		return this.todos.filter(t=>!t.completed).length
               }
            }  
	}).$mount('#app')
 
 	 // 1.注册点击事件
      // 2.当点击all active complete
      // 修改Vue实例的filterText
 
 		// // 该事件页面初始化的时候不会执行，只有change的时候才会执行
 		// // 注册hash（锚点）的改变事件
 		// // 该方法是根据hash过滤数据的输出
 		// window.onhashchange=function(){
 		// 		app.filterText=window.location.hash.substr(2)
 		// }

 		// // 页面初始化的时候调用一次，保持路由路径的状态
 		// // 这样在刷新是才会保持数据过滤后的状态
 		// window.onhashchange()
 		
 		// 写成以下形式
 		handlehashchange()
 		window.onhashchange=handlehashchange 
 		function handlehashchange(){
 			app.filterText=window.location.hash.substr(2)
 		}


})();
 
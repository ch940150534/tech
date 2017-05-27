Vue.component('menudemo', {
  template: `<div class="col-sm-3 col-md-2">
	<ul class="list-unstyled text-center menu">
		<li v-for="(item,index) in menuList" :class="{'active':index==curIndex}" @click="menuFun(index)">
			<a :href="item.url">{{item.text}}<i v-if="item.sublist" class="fa fa-chevron-up"></i></a>
			<ul v-if="item.sublist" class="list-unstyled submenu collapse in" :id="'memberManagement'+index">
				<li v-for="(subitem,subindex) in item.sublist" :class="{'active':subindex==item.subCurIndex}" @click="submenuFun(index,subindex,$event)"><a :href="subitem.url">{{subitem.text}}</a>
				</li>
			</ul>
		</li>			
	</ul>
	<div>
		<img :src="imgUrl" alt="" class="img-responsive center-block">
	</div>
  </div>`,
  data:function(){
  	return {
  		curIndex:-1,
  		imgUrl:"../img/tel.png",
  		menuList:[
  		{
  			url:"javascript:void(0)",
  			// url:"/blade/publish",
  			text:"我的发布"
  		},
  		{
  			url:"javascript:void(0)",
  			// url:"/blade/vipscore/manager",
  			text:"我的订单"
  		},
  		{
  			url:"javascript:void(0)",
  			// url:"/blade/message/manager",
  			text:"站内信"
  		},
  		{
  			url:"javascript:void(0)",
  			// url:"#memberManagement",
  			text:"账号管理",
  			spread:true,//submenu是否是展开状态
  			subCurIndex:-1,
	  		sublist:[
	  		{
	  			url:"javascript:void(0)",
	  			// url:"/blade/account/changePWD",
	  			text:"修改密码"
	  		}]
  		}]
  	}
  },
  methods:{
  	// menuSlide:function(index){
  	// 	if(!this.submenuList[index].spread){
  	// 		$('.submenuLi').addClass('active');
  	// 		$('.menu > li.active:not(.submenuLi)').removeClass('active');
  	// 	}
  	// 	this.submenuList[index].spread = !this.submenuList[index].spread;
  	// 	$('#memberManagement').slideToggle();
  	// 	$('.submenuLi i').toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
  	// },
  	// addActive:function(item){
  	// 	if(typeof item.isActive =='undefined'){
  	// 		this.$set(item,"isActive",true);
  	// 	}else{
  	// 		item.isActive = !item.isActive;
  	// 	}
  	// },
  	menuFun:function(index){
  		this.curIndex=index;
  		if(this.menuList[index].sublist){//有子菜单
  			if(this.menuList[index].spread){	
  				this.curIndex = -1;
  			}else{

  			}
  			this.slideFun(index);
  		}else{
  			this.menuList.forEach((item)=>{
  			if(item.sublist){
  				item.subCurIndex = -1;
  			}
  		});
  		}
  	},
  	submenuFun:function(index,subindex,event){
  		this.curIndex=index;
  		this.menuList[index].subCurIndex = subindex;
  		this.menuList.forEach((item,mindex)=>{
  			if(item.sublist){
  				if(mindex!=index){
	  				item.subCurIndex = -1;
	  				if(this.menuList[mindex].spread){
		  				this.slideFun(mindex);
			  		}
	  			}
  			}else{
  				//$('#memberManagement'+mindex).slideToggle();
  			}
  		});
  		event.stopPropagation();
  	},
  	slideFun:function(index){
  		$('#memberManagement'+index).slideToggle();
			this.menuList[index].spread=!this.menuList[index].spread;
			$('.menu').children('li:eq('+index+')').find('i').toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
  	}
  }
})
var vm = new Vue({
    el: "#menu"
})
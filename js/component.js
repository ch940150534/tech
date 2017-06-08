/**
 * Created by Caster on 2017/5/9.
 */
Vue.component('sms-code', {
    template: '<button class="btn btn-zxzx" v-on:click.prevent="getCode()" :disabled="disabled">{{btnText}}</button>',
    data: function() {
        return {
            path: '/tech',
            smsUrl: '/account/sendsms',
            btnText: '获取短信验证码',
            coolDown: 90,
            disabled: false,
            phoneRule: /^1[34578]\d{9}$/,
            accountRule: /^[a-zA-Z]\w{3,15}$/,
            form: {
                'phone': '',
                'account': '',
            }
        }
    },
    props: ['phone', 'account'],
    methods: {
        getCode: function() {
            var self = this;
            if (this.phone.match(this.phoneRule)) {
                if (this.account.match(this.accountRule)) {
                    this.form.phone = this.phone;
                    this.form.account = this.account;
                    this.settime();
                    $.ajax({
                        url: self.path + self.smsUrl,
                        type: 'POST',
                        data: self.form,
                        dataType: 'json',
                        traditional: true,
                        success: function(data) {
                            if (data.code === 0) {

                            } else {
                                if (data.data.field) {
                                    for (var name in vue.tips) {
                                        vue.$data.tips[name] = false
                                    }
                                    vue.tips[data.data.field] = data.message;
                                } else {
                                    alert(data.message);
                                }
                            }
                        }
                    })
                } else {
                    alert('请填写正确的用户名')
                }
            } else {
                alert('请填写正确的安全手机');
            }
        },
        settime: function() {
            var self = this;
            if (self.coolDown == 0) {
                self.disabled = false;
                self.btnText = "获取短信验证码";
                self.coolDown = 90;
                return;
            } else {
                self.disabled = true;
                self.btnText = "重新发送(" + this.coolDown + ")"
                self.coolDown--;
            }
            setTimeout(function() {
                self.settime()
            }, 1000)
        }
    }
})
Vue.component('pingpp-pay', {
	template: '<div class="modal fade" id="pingpp" tabindex="-1" role="dialog" aria-hidden="true" data-toggle="modal" data-backdrop="static">' +
	'            <div class="modal-dialog">' +
	'                <div class="modal-content">' +
	'                    <div class="modal-header">' +
	'                        <button class="close" type="button" data-dismiss="modal" aria-hidden="true" v-on:click="goto">' +
	'                            &times;' +
	'                        </button>' +
	'                        <h5 class="modal-title">' +
	'                        支付方式' +
	'                    </h5>' +
	'                    </div>' +
	'                    <div class="modal-body">' +
	'                    <h1 class="text-center">友情提示</h1>' +
	'                       <div v-if="order_info.subject==\'图纸审核\'">' +
	'                        <div v-if="pay_way==\'isBank\'">' +
	'                           <p>图纸审核人工费为<span class="text-hot">1000</span>元/次，使用对公付款方式时，需在交易备注里写明您的账户名称，示例<span class="text-hot">（前沿技术：订单编号）</span>，订单编号请在“<span class="text-hot">我的订单</span>”里查阅。' +
	'                           <p>由于银行间付款不会实时到账，还请提前安排。我们将在收到款项后为您安排审图事宜，届时请在“<span class="text-hot">我的发布</span>”里点击 <span class="text-success">“下载审批意见”</span>获取</p>' +
	'                        </div>' +
	'                        <div v-else>' +
	'                           <p>*   图纸审核人工费为<span class="text-hot">1000</span>元/次，审核结果将在3个工作日内完成，届时请在“<span class="text-hot">我的发布</span>”里点击 <span class="text-success">“下载审批意见”</span>获取</p>' +
	'                           <p>*   未缴纳图纸审核费的企业及个人请前往“<span class="text-hot">我的订单</span>”缴费</p>' +
	'                        </div>' +
	'                       </div>' +
	'                       <div v-else>' +
	'                           <p>*   企业及个人备案费为<span class="text-hot"></span>100元/次，付款成功后请点击“<span class="text-hot">我的发布</span>”提交消防图纸，我们将在3个工作日内完成图纸审核</p>' +
	'                           <p>*   未备案的企业及个人请前往“<span class="text-hot">我的订单</span>”缴纳备案费后上传消防图纸</p>' +
	'                       </div>' +
	'                        <div v-if="pay_way==\'isBank\'">' +
	'                           <p><b>公司名称：</b><span>上海中消网络科技有限公司</span></p>' +
	'                           <p><b>开户银行：</b><span>交通银行上海第一支行</span></p>' +
	'                           <p><b>银行账号：</b><span>310066726018800051881</span></p>' +
	'                        </div>' +
	'                        <form class="form-horizontal">' +
	'                            <div class="form-group" v-if="pay_way==\'isBank\'">' +
	'                                <label class="control-label col-auto"><span class="text-hot">*</span>请确认您的订单编号：</label>' +
	'                                <div class="input-group col-sm-7">' +
	'                                   <input id="orderId" type="text" class="form-control" v-model="order"/>' +
	'                                </div>' +
	'                            </div>' +
	'                            <div class="form-group">' +
	'                                <label class="control-label col-auto">支付方式:</label>' +
	'                                <div class="col-sm-3 radio">' +
	'                                    <label>' +
	'                                        <input name="payw" type="radio" v-model="pay_way" value="alipay_pc_direct">支付宝支付' +
	'                                    </label>' +
	'                                </div>' +
	'                                <div class="col-sm-3 radio">' +
	'                                    <label>' +
	'                                        <input name="payw" type="radio" v-model="pay_way" value="wx_pub_qr">微信支付' +
	'                                    </label>' +
	'                                </div>' +
	'                                <div class="col-sm-3 radio">' +
	'                                    <label>' +
	'                                        <input name="payw" type="radio" v-model="pay_way" value="isBank">银行汇款' +
	'                                    </label>' +
	'                                </div>' +
	'                            </div>' +
	'                            <div class="form-group text-center"><div id="qrcode" class="text-center" style="display:none" v-if="pay_way==\'wx_pub_qr\'"></div>' +

	'                                <button v-if="pay_way!=\'isBank\'&&show_btn" class="btn btn-zxzx" v-on:click.prevent="pay">{{(pay_way==\'wx_pub_qr\')?\'显示付款二维码\':\'去支付\'}}</button>' +
	'                                <button v-else-if="pay_way==\'isBank\'" class="btn btn-zxzx" v-on:click.prevent="bankFun">汇款成功</button>' +
	'                                <button class="btn btn-zxzx" v-on:click.prevent="goto">稍后付款</button>'+
	'                            </div>' +
	'                        </form>' +
	'                    </div>' +
	'                </div>' +
	'            </div>' +
	'        </div>',
	data: function() {
		return {
			path: '/tech',
			orderUrl: '/zxOrder/getinfo',
			bankPayUrl: '/zxOrder/update',
			pay_statusUrl:'/pay/status/',
			nextHref:'/zxOrder/manager',
			pay_way: '',
			order_info: '',
			show_btn: true
		}
	},
	methods: {
		pay: function() {
			var self = this;
			if (this.pay_way) {
				$.ajax({
					url: this.path + '/pay/' + this.pay_way + '/' + this.order,
					type: 'POST',
					dataType: 'json',
					mimeType: 'multipart/form-data',
					cache: false,
					traditional: true,
					success: function(data) {
						if (self.pay_way == 'wx_pub_qr') {
							$('#qrcode').qrcode({ width: 250, height: 250, text: data.data.credential.wx_pub_qr }).slideDown();
							self.show_btn = false;
							self.pay_status();
						} else {
							pingpp.createPayment(data.data, function(result, err) {
								console.log(result);
								console.log(err.msg);
								console.log(err.extra);
								if (result == "success") {
									console.log('aasds')
									// 只有微信公众账号 wx_pub 支付成功的结果会在这里返回，其他的支付结果都会跳转到 extra 中对应的 URL。
								} else if (result == "fail") {
									// charge 不正确或者微信公众账号支付失败时会在此处返回
								} else if (result == "cancel") {
									// 微信公众账号支付取消支付
								}
							});
						}
					}
				})
			} else {
				alert('请选择支付方式！')
			}

		},
		pay_status: function() {
			var self = this;
			$.ajax({
				url: this.path + this.pay_statusUrl + this.order,
				type: 'POST',
				dataType: 'json',
				mimeType: 'multipart/form-data',
				cache: false,
				traditional: true,
				success: function(data) {
					if(data.data.pay_state=='未付款'){
						setTimeout(function(){
							self.pay_status()
						},1000)
					}
					else{
						location.href=this.path+this.nextHref;
					}
				}
			})
		},
		load: function() {
			var self = this;
			$.ajax({
				type: 'POST',
				url: this.path + this.orderUrl + '?id=' + this.order,
				dataType: 'json',
				traditional: true,
				success: function(data) {
					self.order_info = data.data;
				}
			})
		},
		goto: function() {
			if(this.closehref!='1'){
				window.location.href = this.path+this.nextHref;
			}
		},
		bankFun: function() {
			if (this.order) {
				$.ajax({
					type: 'POST',
					url: this.path + this.bankPayUrl + '/' + this.order,
					dataType: 'json',
					traditional: true,
					success: function(data) {
						if (data.code != 0) {
							console.log(data.message);
						}
						$('#pingpp').modal('hide');
					}
				})
			} else {
				alert('请填写您的订单编号！');
			}
		}
	},
	watch: {
		order: function() {
			this.load();
		},
		pay_way: function() {
			this.show_btn = true;
		}
	},
	props: ['order','closeHref'],
})

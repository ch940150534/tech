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
        '                        <button class="close" type="button" data-dismiss="modal" aria-hidden="true">' +
        '                            &times;' +
        '                        </button>' +
        '                        <h5 class="modal-title">' +
        '                        支付方式' +
        '                    </h5>' +
        '                    </div>' +
        '                    <div class="modal-body">' +
        '                    <h1 class="text-center">友情提示</h1>' +
        '                        <div v-if="order_info.subject==\'图纸审核\'">' +
        '                        <p>*   图纸审核人工费为<span class="text-hot">1000</span>元/次，审核结果将在3个工作日内完成，届时请在“<span class="text-hot">我的发布</span>”里点击 <span class="text-success">“下载审批意见”</span>获取</p>' +
        '                        <p>*   未缴纳图纸审核费的企业及个人请前往“<span class="text-hot">我的订单</span>”缴费</p>' +
        '                        </div>' +
        '                        <div v-else>' +
        '                        <p>*   企业及个人备案费为<span class="text-hot"></span>100元/次，付款成功后请点击“<span class="text-hot">我的发布</span>”提交消防图纸，我们将在3个工作日内完成图纸审核</p>' +
        '                        <p>*   未备案的企业及个人请前往“<span class="text-hot">我的订单</span>”缴纳备案费后上传消防图纸</p>' +
        '                        </div>' +
        '                        <form class="form-horizontal">' +
        '                            <div class="form-group">' +
        '                                <label class="control-label col-sm-4">支付方式：</label>' +
        '                                <div class="col-sm-8 radio">' +
        '                                    <label>' +
        '                                        <input type="radio" v-model="pay_way" value="alipay_pc_direct">支付宝网页支付' +
        '                                    </label>' +
        '                                </div>' +
        '                            </div>' +
        '                            <div class="form-group">' +
        '                                <button class="btn btn-zxzx center-block" v-on:click.prevent="pay">去支付</button>' +
        '                            </div>' +
        '                        </form>' +
        '                    </div>' +
        '                </div>' +
        '            </div>' +
        '        </div>',
    data: function() {
        return {
            path: '/tech',
            smsUrl: '/account/sendsms',
            orderUrl: '/zxOrder/getinfo',
            pay_way: '',
            order_info: '',
        }
    },
    methods: {
        pay: function() {
            $.ajax({
                url: this.path + '/pay/' + this.pay_way + '/' + this.order,
                type: 'POST',
                dataType: 'json',
                mimeType: 'multipart/form-data',
                cache: false,
                traditional: true,
                success: function(data) {
                    pingpp.createPayment(data.data, function(result, err) {
                        console.log(result);
                        console.log(err.msg);
                        console.log(err.extra);
                        if (result == "success") {
                            // 只有微信公众账号 wx_pub 支付成功的结果会在这里返回，其他的支付结果都会跳转到 extra 中对应的 URL。
                        } else if (result == "fail") {
                            // charge 不正确或者微信公众账号支付失败时会在此处返回
                        } else if (result == "cancel") {
                            // 微信公众账号支付取消支付
                        }
                    });
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
        }
    },
    watch: {
        order: function() {
            this.load();
        }
    },
    props: ['order'],
})

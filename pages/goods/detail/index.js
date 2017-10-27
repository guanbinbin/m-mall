const App = getApp()

Page({
    data: {
        indicatorDots: !0,
        vertical: !1,
        autoplay: !1,
        interval: 3000,
        duration: 1000,
        current: 0,
        goods: {
            item: {}
        },
        isHidden: 0,
        showModalStatus: false,//显示遮罩
        goodNum: 1,//商品数量
        select: 0,//商品详情、参数切换
    },
    swiperchange(e) {
        this.setData({
            current: e.detail.current, 
        })
    },
    onLoad(option) {
        this.goods = App.HttpResource('/goods/:id', {id: '@id'})
        this.setData({
            id: option.id
        })
    },
    onShow() {
        this.getDetail(this.data.id)
    },
    addCart(e) {
        const goods = this.data.goods.item._id
        App.HttpService.addCartByUser(goods)
        .then(res => {
            const data = res.data
            console.log(data)
            if (data.meta.code == 0) {
                this.showToast(data.meta.message)
            }
        })
    },
    previewImage(e) {
        const urls = this.data.goods && this.data.goods.item.images.map(n => n.path)
        const index = e.currentTarget.dataset.index
        const current = urls[Number(index)]
        
        App.WxService.previewImage({
            current: current, 
            urls: urls, 
        })
    },
    showToast(message) {
        App.WxService.showToast({
            title   : message, 
            icon    : 'success', 
            duration: 1500, 
        })
    },
    getDetail(id) {
    	// App.HttpService.getDetail(id)
        this.goods.getAsync({id: id})
        .then(res => {
            const data = res.data
            console.log(data)
        	if (data.meta.code == 0) {
                data.data.images.forEach(n => n.path = App.renderImage(n.path))
        		this.setData({
                    'goods.item': data.data, 
                    total: data.data.images.length, 
                })
        	}
        })
    },
    /*************************************************/
    /**点击选择花色按钮、显示页面 */
    viewFlowerArea: function (data) {
      var that = this;
      var animation = wx.createAnimation({//动画
        duration: 500,//动画持续时间
        timingFunction: 'linear',//动画的效果 动画从头到尾的速度是相同的
      })
      animation.translateY(0).step()//在Y轴偏移tx，单位px

      this.animation = animation
      that.setData({
        showModalStatus: true,//显示遮罩       
        animationData: animation.export()
      })
      that.setData({//把选中值，放入判断值中
        isHidden: 1,
      })
    },
    /**隐藏选择花色区块 */
    hideModal: function (data) {

      var that = this;
      that.setData({//把选中值，放入判断值中
        showModalStatus: false,//显示遮罩       
        isHidden: 0,
      })

    },
    goodAdd: function (data) {

      var that = this;
      var goodCount = that.data.goodNum + 1;
      that.setData({//商品数量+1
        goodNum: goodCount
      })

    },
    goodReduce: function (data) {

      var that = this;
      var goodCount = that.data.goodNum - 1;
      that.setData({//商品数量+1
        goodNum: goodCount
      })

    },
    /**商品详情、参数切换 */
    changeArea: function (data) {
      var that = this;
      var area = data.currentTarget.dataset.area;
      that.setData({ "select": area });

    },
})
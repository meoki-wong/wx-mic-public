// pages/classification/classification.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hostUrl: app.globalData.hostUrl,
    navList: [
      {title: "租房1", id:1},
      {title: "租房2", id:2},
      {title: "租房3", id:3},
    ],
    activeNav: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getListData(1)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 生命周期函数--监听页面显示
    var that = this;
    that.getType();//读取分类
  },
  getType: function () {//读取广告
    var that = this;
    wx.request({
      url: app.globalData.apiUrl,
      data: {
        opt: 'getType',
        parentId: 0,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data != null) {
          that.setData({
            typeList: res.data,
          })
        }
      }
    })
  },
  
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  //输入内容时
  searchActiveChangeinput: function (e) {
    const val = e.detail.value;
    app.globalData.word = val;
  },
  //搜索提交
  searchSubmit: function () {
    wx.navigateTo({
      url: '/pages/goods_list/goods_list'
    })
  },
  clickNavItem: function(index){
    this.setData({
      activeNav: index.currentTarget.dataset.order
    })
    this.getListData(index.currentTarget.dataset.order + 1)
      
  },
  getListData(index){
    var that = this;
    wx.request({
      url: app.globalData.apiUrl,
      data: {
        opt: 'getHousePageList',
        where: `accountState=${index}`,
        page: 1,
        size: 3,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data != null) {
          res.data.map(item=>{
            let year = new Date(item.contractStartDate).getFullYear()
            let month = new Date(item.contractStartDate).getMonth() + 1
            let day = new Date(item.contractStartDate).getDate()
            item.contractStartDate = `${year}-${month}-${day}`
          })
          that.setData({
            Housedaipai: res.data,
          })
        }
      },
      fail: (err)=>{
        console.log('接口报错', err);
      }
    })
  }
})
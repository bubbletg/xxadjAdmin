// pages/user/user.js
//获得数据库引用
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '../../images/user-unlogin.png',
    userInfo: '',
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    /**
     * 获得缓存 dengluchenggong 
     * 值为 ture  表示登录
     * 值为 false  表示没有登录
     */
    wx.getStorage({
      key: 'dengluchenggong',
      success(res) {
        if (res.data == 'ture') {
          console.log("user----------dengluchenggong 登录");
          wx.getUserInfo({
            success(res) {
              that.setData({
                ifdengluchenggong: 1,
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo,
              })
            }
          })
        }
      },
      /**
      * 没有缓存，表示获取失败，则没有登录过
      */
      fail(res) {
        if (res.data != 'ture') {
          console.log("user----------dengluchenggong 没有登录")
        }
      }
    })
    //执行云涵数，获得openid作为id
    wx.cloud.callFunction({
      name: 'login',
      complete: (res) => {
        this.setData({
          isopenid: res.result.openid,
        })
      }
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  //登录授权
  onGetUserInfo: function(e) {
    console.log("---点击登录授权---", e)
    var thiss = this;
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo,
        openid: e.target.dataset.openid,
      })
    }
  //登录成功后通过缓存来设置登录成功标记
    wx.setStorage({
      key: 'dengluchenggong',
      data: 'ture',
    })

    //登录成功后，向数据库里面添加一个表，表示用户信息
    db.collection('user').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        _id: '' + e.target.dataset.openid,
        name: '' + this.data.userInfo.nickName, //默认
        phone: '17863273072', //电话
        age: '0', //年龄
        jialing: '0', //驾龄
        suozaidi: '北京', //所在地
        spe_i: '未实名认证', //实名认证
        jiashi: '未驾驶认证', //驾驶认证
        region: ['山东省', '枣庄市', '市中区'],
      },
      success(res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        console.log("插入成功", res)
      }
    })
  },
  // 点击设置
  setting: function() {
    console.log("---------------setting")
    wx.openSetting()
  },

  //判断是否登录
  ifLongin: function(e) {
    if (this.data.userInfo != '') {
      return true;
    } else {
      return false;
    }

  },
  //cutInterface 切换界面
  cutInterface: function(e) {
    var interfaceZ = '' + e.currentTarget.dataset.interface; //要切换的页面
    var openidZ = '' + e.currentTarget.dataset.openid; //获得openid
    console.log(interfaceZ)
    //先判断是否登录，当是设置，或者关于我们时，则不用判断
    if (interfaceZ == 'setting') {
      return;
    } else if (interfaceZ == 'regard') {
      return;
    } else if (this.ifLongin(e)) {
      //跳转编辑信息页面
      wx.navigateTo({
        url: interfaceZ + '/' + interfaceZ + '?openid=' + openidZ,
      })
    } else {
      wx.showToast({
        title: "请先登录！",
        icon: "none",
        duration: 2000
      });
      return;
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
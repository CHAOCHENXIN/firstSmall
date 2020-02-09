// pages/movies/more/more.js

import { getStarsArr,http } from '../../../utils/util.js'
const app = getApp()
const { BASEURL } = app.globalData

Page({

  data: {
    myTitle: "",
    movies: [], //页面渲染的数据
    currentPage: '', //当前页面的请求
    start: 0, //请求起始位置
    count: 20, //请求的个数
  },

  // 生命周期函数--监听页面加载
  onLoad: function (query) {
    this.setData({
      myTitle: query.type
    })
  },

  // 生命周期函数--监听页面初次渲染完成
  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.myTitle
    })

    //页面初始化的请求  
    switch (this.data.myTitle) {
      case '正在热映':
        this.setData({
          currentPage: `${BASEURL}/v2/movie/in_theaters`
        })
        http(`${BASEURL}/v2/movie/in_theaters`, this.finalData)
        break;
      case '即将上映':
        this.setData({
          currentPage: `${BASEURL}/v2/movie/coming_soon`
        })
        http(`${BASEURL}/v2/movie/coming_soon`, this.finalData)
        break;
      case '豆瓣Top250':
        this.setData({
          currentPage: `${BASEURL}/v2/movie/top250`
        })
        http(`${BASEURL}/v2/movie/top250`, this.finalData)
        break;
    }
  },

  //下拉事件
  onPullDownRefresh: function() {
    http(`${this.data.currentPage}`, this.finalData)
    this.setData({
      movies: []
    })
  },

  //上拉触底事件
  onReachBottom: function() {
    http(`${this.data.currentPage}?start=${this.data.start}&count=${this.data.count}`, this.finalData)
  },

  finalData(data) {
    wx.showNavigationBarLoading()


    let arr, setmovies = data.subjects.map(item => ({
      postImgUrl: item.images.large,
      name: item.original_title,
      score: item.rating.average,
      stars: getStarsArr(item.rating.stars)
    }))

    arr = this.data.movies.concat(setmovies);

    this.setData({
      movies: arr,
      start: this.data.start + this.data.count
    })

    //关闭导导航条加载动画
    wx.hideNavigationBarLoading()
    //关闭下拉框动画
    wx.stopPullDownRefresh()
  }

})
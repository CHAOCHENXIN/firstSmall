// pages/movies/movies.js

const app = getApp()
import { getStarsArr,http } from '../../utils/util.js'
let index = 0
Page({

  // 页面的初始数据
  data: {
    movies: [],
    value: '111',
    inputAccord: true,
    mainAccord: true,
    setMovies: []
  },

  // 生命周期函数--监听页面初次渲染完成
  onReady: function () {
    const { BASEURL } = app.globalData
    http(`${BASEURL}/v2/movie/in_theaters?start=0&count=3`, this.finalData, "正在热映")
    http(`${BASEURL}/v2/movie/coming_soon?start=0&count=3`, this.finalData, "即将上映")
    http(`${BASEURL}/v2/movie/top250?start=0&count=3`, this.finalData, "豆瓣Top250")
  },

  //input获取焦点时
  handleFocus() {
    this.setData({
      inputAccord: true,
      mainAccord: false
    })
  },
  
  //input提交时
  handleBtn(ev) {
    http(`http://t.yushu.im/v2/movie/search?q=${ev.detail.value}`, this.cd)
  },

  cd(data) {
    let a = ""
    a = data.subjects.map(item => ({
      postImgUrl: item.images.large,
      name: item.original_title,
      score: item.rating.average,
      stars: getStarsArr(item.rating.stars)
    }))

    this.setData({
      setMovies: a
    })

  },

  finalData(data,type) {
    let a = ""
    a = data.subjects.map(item => ({
      postImgUrl: item.images.large,
      name: item.original_title,
      score: item.rating.average,
      stars: getStarsArr(item.rating.stars)
    }))

    this.setData({
      [`movies[${index}]`]: {
        type,
        movies: a
      }
    })
    index++
  },
  
  goMore(ev) {
    wx.navigateTo({
      url: `/pages/movies/more/more?type=${ev.currentTarget.dataset.type}`,
    })
  }
})
import React, { Component } from 'react'
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { BASE_URL, IMAGE_BASE_URL } from '@/config'
import { reqDelectImg } from '@/api'
function getBase64(file) {
   return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
   });
}

export default class PicturesWall extends Component {
   state = {
      previewVisible: false, //是否展示预览窗
      previewImage: '',     //要预览的图片的url或base64编码
      previewTitle: '',    //储存图片文件的名字
      fileList: [],         //用户上传图片文件列表  
   };
   //  关闭预览窗
   handleCancel = () => this.setState({ previewVisible: false });
   // 展示预览窗
   handlePreview = async file => {
      // 如果图片没有url也没有转换过base64,则调用下面的方法转换
      if (!file.url && !file.preview) {
         file.preview = await getBase64(file.originFileObj);
      }
      this.setState({
         previewImage: file.url || file.preview,
         previewVisible: true,
         previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
      });
   };
   // 控制图片文件状态变化
   handleChange = ({ file, fileList }) => {
      // 用户上传图片完成后，拿到服务器的响应和当前照片的状态
      const { status, response } = file
      if (status === 'done') {
         // 当图片的状态变化为done时，在当前图片对象上添加url属性和修改name属性为服务器响应的
         fileList[fileList.length - 1].url = response.data.url
         fileList[fileList.length - 1].name = response.data.name
      } else
         if (status === 'removed')  //当用户删除图片，联系服务器删除图片
            this.DelectImg(file.name)
      this.setState({ fileList });
   }
   // 请求删除图片的方法
   DelectImg = async (name) => {
      let result = await reqDelectImg(name)
      if (result.status === 0) message.success('删除成功')
      else message.error(result.msg)
   }
   // 从fileList中汇总所有图片名为数组，供新增商品使用
   imagesArr = () => {
      const { fileList } = this.state
      let result = []
      fileList.forEach(item => {
         result.push(item.name)
      })
      return result
   }
   // 根据图片信息，创建fileList数组用于修改商品回显图片
   setFileList = (imgs) => {
      let fileList = []
      imgs.forEach((item, index) => {
         fileList.push({
            uid: -index,
            name: item,
            url: IMAGE_BASE_URL + item,
            status: 'done'
         })
      })
      this.setState({ fileList })
   }
   render() {
      const { previewVisible, previewImage, fileList, previewTitle } = this.state;
      const uploadButton = (
         <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
         </div>
      );
      return (
         <>
            <Upload
               action={`${BASE_URL}/manage/img/upload`}  //请求地址,不设置method默认为post
               name="image"  //autd默认处理好参数了，你只需写字符串的key就行
               listType="picture-card"  //控制照片墙的展示样式
               fileList={fileList}      //展示图片列表，数组对象
               onPreview={this.handlePreview}   //点击预览按钮的回调
               onChange={this.handleChange} //图片状态改变的回调（上传中，删除，上传成功， error）
            >
               {/* 隐藏上传按钮根据图片数量 */}
               {fileList.length >= 4 ? null : uploadButton}
            </Upload>
            <Modal
               visible={previewVisible}
               title={previewTitle}
               footer={null}
               onCancel={this.handleCancel}
            >
               <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
         </>
      );
   }
}


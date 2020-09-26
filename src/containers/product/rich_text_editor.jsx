import React, { Component } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'


export default class RichTextEditor extends Component {
   state = {
      editorState: EditorState.createEmpty(),  //构建一个初始化状态的编辑器+内容
   }

   onEditorStateChange = (editorState) => {
      this.setState({
         editorState,
      });
   };
   // 获取富文本编辑器内的编辑好的内容
   getRichText = () => {
      const { editorState } = this.state;
      return draftToHtml(convertToRaw(editorState.getCurrentContent())) //转换为富文本的方法
   }
   // 修改商品回显数据富文本编辑
   setRichText = (html) => {
      const contentBlock = htmlToDraft(html);
      if (contentBlock) {
         const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
         const editorState = EditorState.createWithContent(contentState);
         this.setState({
            editorState,
         })
      }
   }
   render() {
      const { editorState } = this.state;
      return (
         <div>
            <Editor
               editorState={editorState}
               // wrapperClassName="demo-wrapper" //  最外侧容器的样式
               // editorClassName="demo-editor"  //编辑区域的样式
               editorStyle={{      //编辑区域的样式，内联样式形式      
                  minHeight: "200px",
                  border: "1px solid #ccc",
                  padding: '15px',
                  lineHeight: '15px'
               }}
               onEditorStateChange={this.onEditorStateChange}
            />
         </div>
      );
   }
}
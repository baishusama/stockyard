import { Component, OnInit } from '@angular/core';
import { PosService } from './pos.service';

@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.css']
  // providers: [PosService]
})
export class PosComponent implements OnInit {

  // @Input
  // @Input
  // @Input
  // @Input
  // @Input
  // @Input
  // @Input
  // @Input
  // @Input

  constructor(private posService: PosService) { /* temp import service way.. */ }

  ngOnInit() {
  }

  status = 'view';

  private posWordsBackup: object = {};

  addToUpdatedPosList = function(pos){
      var added = false;
      // angular.forEach(this.updatePosList,function(value){});
      this.updatePosList.forEach((value) => {
          if(pos.content == value.content){
              pos.type = value.type;
              added = true;
          }
      });
      if(!added){
          this.updatePosList.push(pos);
      }
  }

  // [dxy][???] 下面这段代码放哪里（执行）合适啊。。
  this.posService.listChoicesPromise()
  .then(function(response){
      this.pos_choices_dict = response;
  })
  .then(function(){
      this.posListList = this.posService.setPosDisplay(
          this.posListList
      );
      this.posWordsBackup = { ...this.posListList };
  });


  //清空制定word的pos值
  clearPosList = function (sentence_word_list){
      // angular.forEach(sentence_word_list,function(value){});
      sentence_word_list.forEach((value) => {
          var sentence_index = value.sentence_index;
          var word_index = value.word_index;
          this.posListList[sentence_index][word_index].pos = 'unknown';
          this.posListList[sentence_index][word_index].pos_display = '未知';
      });
  };

  //筛选结束
  selectDone = function($event){
      this.select_pos = {};
      var range0 = window.getSelection().getRangeAt(0);
      var select_dom = range0.cloneContents();
      var pos_list = $(select_dom).find('.pos');
      var letter_list;

      //选中的文字属于一个词语
      if(pos_list.length == 0){
          pos_list = $(range0.commonAncestorContainer)
              .closest('.pos');
      }
      letter_list = $(select_dom).find('.letter');
      //只选中了一个字
      if(letter_list.length == 0){
          letter_list = $(range0.commonAncestorContainer)
              .closest('.letter');
      }
      //去除选择元素选到的是空的内容的pos
      angular.forEach(pos_list,function(pos,index){
          if(!pos.children[0].innerHTML){
              pos_list.splice(index,1);
          }
      });
      if(pos_list.length==0){
          return;
      }
      //去除选择元素选到的是空的内容的letter
      angular.forEach(letter_list,function(letter,index){
          if(!letter.innerHTML.trim()){
              letter_list.splice(index,1);
          }
      });
      if(letter_list.length==0){
          return;
      }
      //所在句子
      var sentence_index = parseInt($(pos_list[0]).data('sentence-index'));
      var sentence = this.posListList[sentence_index];
      //开始，结束词语在句子list中的index
      var start_pos_word_index = parseInt(
          pos_list[0].getAttribute('data-pos-word-index')
      );
      var end_pos_word_index = parseInt(
          pos_list[pos_list.length-1].getAttribute('data-pos-word-index')
      );
      //第一个/最后一个字在词中字的偏移
      //$(letter_list[0]).data('letter-index')
      //$(letter_list[letter_list.length - 1]).data('letter-index')
      var start_letter_index = parseInt(
          letter_list[0].getAttribute('data-letter-index')
      );
      var end_letter_index = parseInt(
          letter_list[letter_list.length-1].getAttribute('data-letter-index')
      );

      //第一个/最后一个词语
      var start_pos_word = sentence[start_pos_word_index];
      var end_pos_word = sentence[end_pos_word_index];

      //最后一个词被分隔
      if(end_pos_word.word.length > end_letter_index + 1){
          var seg_word = end_pos_word.word.slice(
              end_letter_index + 1,
              end_pos_word.word.length
          );
          console.log(seg_word);
          sentence.splice(
              end_pos_word_index + 1,
              0,
              {
                  'pos':'unknown',
                  'pos_display':'未知',
                  'word':seg_word,
                  'updated':true
              }
          );
      }

      //第一个词被分隔
      if(start_letter_index > 0){
          sentence.splice(
              start_pos_word_index,
              0,
              {
                  'pos':'unknown',
                  'pos_display':'未知',
                  'word':start_pos_word.word.slice(
                      0,
                      start_letter_index
                  ),
                  'updated':true
              }
          );
          //前面添加了一个词,start_word的index应该加1
          start_pos_word_index += 1;
          end_pos_word_index += 1
      }

      //获得选择的词
      var word_select_str = "";
      angular.forEach(letter_list,function(value){
          word_select_str += $.trim(value.innerText);
      });

      //替换选择的第一个word的内容
      sentence[start_pos_word_index].word = word_select_str;
      sentence[start_pos_word_index].updated = true;

      //删除多余的词
      sentence.splice(
          start_pos_word_index + 1,
          end_pos_word_index - start_pos_word_index
      );

      //选择词性
      menu.show(
          $event.pageX + 10 + 'px',
          $event.pageY + 10 + 'px',
          this.pos_choices_dict
      )
      .then(function(response){
          sentence[start_pos_word_index].pos = response.key;
          sentence[start_pos_word_index].pos_display = response.value;
          this.addToUpdatedPosList({
              pos:response.key,
              content:word_select_str
          });
      })
      .then(function(){
          menu.hide();
      });
  };

  //检查是否有unknown状态的pos
  checkUnknownPos = function(pos_word_sentence_list){
      var ret = false;
      angular.forEach(pos_word_sentence_list,function(words_list){
          angular.forEach(words_list,function(word){
              if(word.pos == 'unknown'){
                  ret = true;
              }
          });
      });
      return ret;
  }

  predictPosWords = function(){
      this.wordsService.wordCutPromise({
          'para_list':this.cleanedContent.split('\n')
      })
      .then(function(response){
          this.wordListList = response;
          return this.posService.updatePosPromise({
              'word_list_list':response
          });
      })
      .then(function(response){
          this.posListList = this.posService.setPosDisplay(
              response
          );
          this.posConfirm = 'init'
          // toaster.pop('success', "预测成功");
          console.log('success', "预测成功");
      });
  };

  this.$watch('posListList',function(new_value,old_value){
      this.posService.setPosDisplay(
          new_value
      );
  })

  searchEntity = function(pos,word){
      var url = "";
      if(pos == 'nt'){
          url = $state.href('companies',{
              'similar_search':word,
              'word':word
          });
          window.open(url,'_blank');
      }
      else if(pos == 'ns'){
          url = $state.href('governments',{
              'similar_search':word,
              'word':word
          });
          window.open(url,'_blank');
      }
      else{
          this.updatePosWords('update');
      }
  };

  updatePosWords = function(method){
      if(this.status == 'view' && method == 'update'){
          this.status = 'update';
          return;
      }

      if(checkUnknownPos(this.posListList)){
          alert('当前存在还没有指定词性的词语(unknown类型)');
          return;
      }

      this.updatePromise({
          id:this.id,
          pos:this.posListList,
          words:this.wordListList
      })
      .then(function(response){
          this.posConfirm = 'confirmed';
      })
      .then(function(){
          var promise_list = [];
          angular.forEach(this.updatePosList,function(pos){
              promise_list.push(
                  this.wordsService.createPromise(pos)
              );
          });
          return $q.all(promise_list);
      })
      .then(function(){
          this.updatePosList.length = 0;
          this.status = 'view';
          // toaster.pop('success', "更新成功");
          console.log('success', "更新成功");
      },function(){
          // toaster.pop('error', "更新失败");
          console.log('error', "更新失败");
      });
  };

  // [dxy] changed
  cancelUpdate = function(){
      this.posListList = { ...this.posWordsBackup };
      this.updatePosList.length = 0;
      this.status = 'view';
  };

}

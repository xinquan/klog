define("klog/admin/common/markdown-editor",["./attach-uploader","./attach-uploader/swfupload-config","./attach-uploader/attach","./attach-uploader/attach-list-view","./attach-uploader/attach-view","./textarea-pos","_","$","tab","gallery/modal/src/modal","backbone","swfupload"],function(a){var b=a("_"),c=a("$"),d=a("tab"),e=a("gallery/modal/src/modal"),f=a("../common/attach-uploader"),g=a("../common/textarea-pos"),h=function(a){b.bindAll(this),a=a||{},this.textarea=c(".markdown-editor textarea"),this.previewWrapper=c(".markdown-editor .preview-wrapper"),this.uploader=new f("#uploadHolder",a.uploader),this.textarea.focus(this.startSaveTaPos),this.textarea.blur(this.stopSaveTaPos),this.previewWrapper.height(this.textarea.height()+this.uploader.height()).width(this.textarea.width()),this.uploader.on("insertCode",this.insertImgCode),this.initTab(),this.initTipModal()};return h.prototype={constructor:h,initTab:function(){var a=new d(".editor-tabs");a.on("shown",this.changeTab)},initTipModal:function(){var a=new e("#markdownTip");c("#popMarkdownTip").click(function(){a.show()}),c(document).keydown(function(b){77===b.which&&b.shiftKey&&a.show()})},changeTab:function(a){"#markdown_edit"===a.attr("href")?this.showEditor():"#markdown_preview"===a.attr("href")&&this.renderPreview()},showEditor:function(){this.textarea.focus(),this.previewXHR&&this.previewXHR.abort()},renderPreview:function(){this.previewWrapper.html("Loading...");var a=this.textarea.val(),d=function(a){this.previewWrapper.html(a)};this.previewXHR=c.post("/admin/preview",{content:a},b.bind(d,this),"json")},startSaveTaPos:function(){this.posTimer=setInterval(b.bind(function(){var a=g.get(this.textarea[0]);this.textarea.data("rangeData",a)},this))},stopSaveTaPos:function(){clearInterval(this.posTimer)},saveTextareaPos:function(){this.textarea[0].selectionEnd&&this.textarea.data("insertPos",this.textarea[0].selectionEnd)},insertImgCode:function(a){var b=this.textarea.data("rangeData")||{start:0,end:0};g.insertText(this.textarea[0],b,a)}},h}),define("klog/admin/common/attach-uploader",["./attach-uploader/swfupload-config","./attach-uploader/attach","./attach-uploader/attach-list-view","./attach-uploader/attach-view","_","$","backbone","swfupload"],function(a){function b(){var a={};return a[d("meta[name=csrf-param]").attr("content")]=d("meta[name=csrf-token]").attr("content"),a[d("meta[name=session-key]").attr("content")]=d("meta[name=session-value]").attr("content"),a}var c=a("_"),d=a("$"),e=a("backbone");a("swfupload");var f=a("./attach-uploader/swfupload-config"),g=a("./attach-uploader/attach"),h=a("./attach-uploader/attach-list-view"),i=function(a,b){c.bindAll(this),this.attaches=new g.List(attaches_json),this.attachListView=new h({collection:this.attaches}),this.attachListView.on("insertCode",function(a){this.trigger("insertCode",a)},this),this.initSwfUpload(a,b)};return i.prototype={constructor:i,initSwfUpload:function(a,e){var g=c.extend(f,{upload_url:"/admin/attaches",file_post_name:"attach[file]",file_size_limit:"5 MB",file_types:"*.jpg;*.jpeg;*.gif;*.png;*.txt;*.zip;*.rar;*.ppt;*.pptx;",button_placeholder:d(a)[0],post_params:b(),upload_start_handler:this.handleStartUpload,upload_progress_handler:this.handleUploadProgress,upload_success_handler:this.handleUploadSuccess});e&&e.post_params&&c.extend(g.post_params,e.post_params),this.swfu=new SWFUpload(g)},handleStartUpload:function(a){this.attaches.add({file_name:a.name})},handleUploadProgress:function(a,b,c){var d=parseInt(100*b/c),e=this.attaches.last();e.set({percent:d})},handleUploadSuccess:function(a,b){var c=d.parseJSON(b),e=this.attaches.last();"success"==c.status?e.set(c.attach):e.destroy()},height:function(){return d(".upload-wrapper").height()}},c.extend(i.prototype,e.Events),i}),define("klog/admin/common/attach-uploader/swfupload-config",["swfupload"],function(a){var b=a("swfupload");return{flash_url:b.defaultFlashUrl,button_action:b.BUTTON_ACTION.SELECT_FILE,button_cursor:b.CURSOR.HAND,button_image_url:"/assets/upload_button.png",button_text_style:".text{text-align:center;}",button_text_top_padding:7,button_text:"<span class='text'>上传附件</span>",button_width:80,button_height:30,button_window_mode:b.WINDOW_MODE.TRANSPARENT,file_dialog_complete_handler:function(a,b){a>0&&b>0&&(this.startUpload(),this.setButtonDisabled(!0))},upload_error_handler:function(){alert("服务器错误！")},upload_complete_handler:function(){this.setButtonDisabled(!1)},file_queue_error_handler:function(a,c){var d;switch(c){case b.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:d="文件不能超过"+this.settings.file_size_limit;break;case b.QUEUE_ERROR.ZERO_BYTE_FILE:d="不能上传空文件！";break;case b.QUEUE_ERROR.INVALID_FILETYPE:d="文件类型有误！"}alert(d)}}}),define("klog/admin/common/attach-uploader/attach",["_","backbone"],function(a){a("_");var b=a("backbone");b.emulateHTTP=!0;var c=b.Model.extend({defaults:{percent:0,is_complete:!1},getCode:function(){var a=this.get("url");if(this.get("is_image"))var b="![]("+a+")";else var b="["+this.get("file_name")+"]("+a+")";return b}});return c.List=b.Collection.extend({model:c,url:"/admin/attaches"}),c}),define("klog/admin/common/attach-uploader/attach-list-view",["./attach-view","_","$","backbone"],function(a){var b=a("_"),c=a("$"),d=a("backbone"),e=a("./attach-view"),f=d.View.extend({el:c(".upload-list"),initialize:function(){b.bindAll(this),this.collection.on("add",this.add),this.collection.on("destroy",this.handleChildDelete),this.collection.each(this.add)},add:function(a){var b=new e({model:a});this.$el.append(b.$el).show(),b.on("insertCode",function(a){this.trigger("insertCode",a)},this)},handleChildDelete:function(){0===this.collection.size()&&this.$el.hide()}});return f}),define("klog/admin/common/attach-uploader/attach-view",["_","backbone"],function(a){var b=a("_"),c=a("backbone"),d='<div class="filename pull-left"><%= file_name %></div><% if(!is_complete) { %><div class="progress progress-striped active pull-left"><div class="bar" style="width:<%= percent %>%"></div></div><% } else { %><div class="handle pull-left" style=""><a href="javascript:void(0);" class="insert">插入</a>&nbsp;&nbsp;|&nbsp;<a href="<%= url %>" target="_blank" class="view">查看</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="javascript:void(0);" class="delete" data-method=\'delete\' data-remote="true" data-confirm="确定删除这个附件？">删除</a><input type="hidden" name="attach_ids[]" value="<%= id %>"/></div><% } %>',e=c.View.extend({className:"upload-item clearfix",template:b.template(d),events:{"click .insert":"insertCode","click .delete":"delete"},initialize:function(){b.bindAll(this),this.model.on("change:percent",this.renderProcess),this.model.on("change:is_complete",this.render),this.render()},render:function(){this.$el.html(this.template(this.model.toJSON()))},renderProcess:function(){var a=this.model.get("percent");this.$(".bar").width(a+"%")},"delete":function(){return confirm("确定删除？")&&(this.model.destroy(),this.$el.hide("fast",this.remove)),!1},insertCode:function(){var a=this.model.getCode();this.trigger("insertCode",a)}});return e}),define("klog/admin/common/textarea-pos",[],function(){return{get:function(a){var b={text:"",start:0,end:0};if(a.setSelectionRange)b.start=a.selectionStart,b.end=a.selectionEnd,b.text=b.start!=b.end?a.value.substring(b.start,b.end):"";else if(document.selection){var c,d=document.selection.createRange(),e=document.body.createTextRange();for(e.moveToElementText(a),b.text=d.text,b.bookmark=d.getBookmark(),c=0;0>e.compareEndPoints("StartToStart",d)&&0!==d.moveStart("character",-1);c++)"\r"==a.value.charAt(c)&&c++;b.start=c,b.end=b.text.length+b.start}return b},set:function(a,b){var c;a.focus(),a.setSelectionRange?a.setSelectionRange(b.start,b.end):a.createTextRange&&(c=a.createTextRange(),a.value.length===b.start?(c.collapse(!1),c.select()):(c.moveToBookmark(b.bookmark),c.select()))},insertText:function(a,b,c){var d,e,f,g,h,i;this.set(a,b),a.setSelectionRange?(d=a.value,e=d.substring(0,b.start)+c+d.substring(b.end),g=h=b.start+c.length,i=a.scrollTop,a.value=e,a.scrollTop!=i&&(a.scrollTop=i),a.setSelectionRange(g,h)):a.createTextRange&&(f=document.selection.createRange(),f.text=c,f.setEndPoint("StartToEnd",f),f.select())},focus:function(a){if(a.setSelectionRange)a.focus(),a.setSelectionRange(0,0);else if(a.createTextRange){var b=a.createTextRange();b.collapse(!0),b.moveEnd("character",0),b.moveStart("character",0),b.select()}}}}),define("klog/admin/blogs/form",["../common/markdown-editor","../common/attach-uploader","../common/attach-uploader/swfupload-config","../common/attach-uploader/attach","../common/attach-uploader/attach-list-view","../common/attach-uploader/attach-view","../common/textarea-pos","$","_","tab","gallery/modal/src/modal","backbone","swfupload","jquery-ujs"],function(a){a("$");var b=a("../common/markdown-editor");a("jquery-ujs"),new b});
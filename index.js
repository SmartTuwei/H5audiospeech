
$(function(){
		var Gtoken = getToken("tokeninfo",1000*60*60*24*7);
		var recorder;
		var audio = $("#reply")[0];
		//获取token
		function setToken(key){
			$.ajax({
					url : "/token",  //param.api.voiceUrl,
					type : 'GET',
					data : {
						'grant_type':"",
						'client_id':"",
						'client_secret':""
					},
					success : function(token) {
						var curTime = new Date().getTime();
						localStorage.setItem(key,JSON.stringify({token:token,time:curTime}));
						return token.access_token;
					},
					error : function(error) {
						console.log("error 获取toktn失败"+error);
					}
			});
		}
        //从本地获取token
		function getToken(key,exp){
			var data = localStorage.getItem(key);
			var dataObj = JSON.parse(data);
			if(data == null){
				 return setToken("tokeninfo"); 	
			}
			if (new Date().getTime() - dataObj.time>exp) {
				console.log('信息已过期');
			    setToken("tokeninfo"); 
			}else{
				//console.log("data="+dataObj.data);
				//console.log(JSON.parse(dataObj.data));
				return dataObj.token.access_token;
			}
		}


		$("#stop").click(function(){
			//停止录音
			recorder.stop();
		})
		$("#play").click(function(){
			//播放录音
			recorder.play(audio);
		})
	 
		$("#upload").on({
			　　touchstart: function(e){
			　　　　var that = this;
			　　　　timeOutEvent = setTimeout(function () {
			　　　　　　//长按触发事件
			　　　		timeOutEvent=0;
				  	$("#addval").val();
						HZRecorder.get(function (rec) {
								recorder = rec;
								recorder.start();
								//开始录音后就可以实时监视声音录制过程
								recorder.onProgress(function(vol){
									console.log(vol);
								})
							});
						//开始录音，其中replay是一个音频对象
			　　　　},500);
				//e.preventDefault();
			　　},
			　　touchmove: function(){
			　　　　clearTimeout(timeOutEvent);
			　　　　timeOutEvent = 0;
			　　},
			　　touchend: function(){
						clearTimeout(timeOutEvent);
						if(recorder){
								recorder.stop();
								recorder.upload(function (data) {
									//data 对象为录音后的音频数据
										var fd = new FormData();
										fd.append("audioData", data);
										$.ajax({
											url : "/api?dev_pid=1536&cuid=94-B8-6D-FE-A2-2D&token="+Gtoken,  //param.api.voiceUrl,
											type : 'POST',
											data : fd,
											// 告诉jQuery不要去处理发送的数据
											processData : false,
											// 告诉jQuery不要去设置Content-Type请求头
											contentType : "audio/wav;rate=16000",//Raw 方式上传rate = 16000固定格式
											success : function(res) {
												console.log(res);
												if(res.result){
													$("#addval").val(res.result)
												}else{
													$("#addval").val("未识别请重新录入")
												}
												 
											},
											error : function(error) {
												console.log("error");
											}
										});
							 });
						}else{
							console.log("录音时间较短 少于500");
							$("#addval").val("录入时间少于500毫秒")
						}
				 　}
			 })
	})
 
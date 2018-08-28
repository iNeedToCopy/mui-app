mui.init();

mui("header").on('tap','.confirm',function(){
	var username = mui("#content input")[0].value;
	mui.ajax('http://app.zhonglaiwang.com/my/user/name',{
		headers:{
			token: app.get_item("token")
		},
		data:{
			uid: app.get_item("uid"),
			username: username
		},
		datatype: 'json',
		type: 'post',
		success: function(data) {
			console.log(data)
			mui.toast(data.desc)
		},
		error: function(error) {
			console.log(error);
		}
	});
})

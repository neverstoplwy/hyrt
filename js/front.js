$(function() {
	//下载页面
	$('.sample #down a').click(function() {
		/*
		if(!/^http(|s):\/\/[a-z0-9]+\.[a-z0-9]+\.[a-z0-9]+\/.*$/.test($(this).attr('href'))) {
			alert('您当前要下载的应用没有最新版本');

			return false;
		}
		*/
		if(!$(this).attr('href') || $(this).attr('href') == 'javascript:void(0);') {
			alert('您当前要下载的应用没有最新版本');

			return false;
		}
	});

	$('#slider li .video').live('click', function() {
		var href = $(this).attr('clstag');

		if(!href || href.substr(href.lastIndexOf('.'), 4) != '.flv') {
			alert('此视频无法播放');

			return false;
		}

		var flashHtml = "<object classid='clsid:D27CDB6E-AE6D-11cf-96B8-444553540000' width='600' height='420'>";
		flashHtml += "<param name='movie' value='" + href.substr(0, href.lastIndexOf('/swf')) + "/swf/player.swf' />";
		flashHtml += "<param name='quality' value='high' />";
		flashHtml += "<param name='allowFullScreen' value='true' />";
		flashHtml += "<param name='FlashVars' value='vcastr_file=" + href + "&amp;LogoText=www.rtmap.com&amp;BufferTime=3' />";
		flashHtml += "<embed width='600' height='420' quality='high' allowfullscreen='true' src='" + href.substr(0, href.lastIndexOf('/swf')) + "/swf/player.swf' type='application/x-shockwave-flash' flashvars='vcastr_file=" + href + "&amp;LogoText=www.rtmap.com&amp;BufferTime=3' />";
		flashHtml += "</object>";

		$('#masker').show();

		$('#dialog').show().css('width', '600px');

		$('#dialog #thead h1').html('视频播放');

		$('#dialog #tbody').html(flashHtml);

		return false;
	});

	$('#close').click(function() {
		$('#masker').hide();

		$('#dialog').hide();

		$('#dialog #tbody').html('');
	});

	//视频播放
	window.onload = window.onresize = function() {
		var width = $(window).width();

		var height = $(window).height();

		$('#masker').css({'width': width, 'height': height});

		var boxWidth = $('#dialog #thead h1').html() ? 600 : 470;

		var boxHeight = $('#dialog #thead h1').html() ? 455 : 670;

		$('#dialog').css({'top': (height - boxHeight) / 2 < 0 ? 0 : (height - boxHeight) / 2 * 0.6, 'left': (width - boxWidth) / 2 < 0 ? 0 : (width - boxWidth) / 2});

		$('#message').css('right', ($(window).width() - 900) / 2 - 155 > 0 ? ($(window).width() - 900) / 2 - 155 : 0);
	};

	$('#message #about').click(function() {
		var width = $(window).width();

		var height = $(window).height();

		$.get('/index.php?m=ajax&a=temp', function(htmlTemp) {
			$('#masker').show();

			$('#dialog').show().css('width', '470px');

			$('#dialog #thead h1').html('');

			$('#dialog #tbody').html(htmlTemp);

			var boxWidth = $('#dialog #thead h1').html() ? 600 : 470;

			var boxHeight = $('#dialog #thead h1').html() ? 455 : 670;

			$('#dialog').css({'top': (height - boxHeight) / 2 < 0 ? 0 : (height - boxHeight) / 2 * 0.6, 'left': (width - boxWidth) / 2 < 0 ? 0 : (width - boxWidth) / 2});
		});
	});

	var feedSetting = {
		uname: false,
		phone: false,
		company: false,
		describe: false
	};

	$('#uname').live('blur', function() {
		if(/^[\d\w\\u4e00-\u9fa5]{2,20}$/.test($(this).val())) {
			feedSetting.uname = true;

			$('#unotice').html('');

			return false;
		}

		feedSetting.uname = false;

		$('#unotice').html('请输入正确姓名');
	});

	$('#company').live('blur', function() {
		if(/^[\d\w\\u4e00-\u9fa5]{2,50}$/.test($(this).val())) {
			feedSetting.company = true;

			$('#cnotice').html('');

			return false;
		}

		feedSetting.company = false;

		$('#cnotice').html('请输入正确公司名称');
	});

	$('#phone').live('blur', function() {
		if(/^(13\d|15([0-3]|[5-9])|18(0|2|[5-9])|147)\d{8}$/.test($(this).val())) {
			feedSetting.phone = true;

			$('#pnotice').html('');

			return false;
		}

		feedSetting.phone = false;

		$('#pnotice').html('请输入正确手机号');
	});

	$('#describe').live('blur', function() {
		if($.trim($(this).val())) {
			feedSetting.describe = true;

			$('#dnotice').html('');

			return false;
		}

		feedSetting.describe = false;

		$('#dnotice').html('请输入需求描述');
	});

	$('#service ul li').live('click', function() {
		if($(this).attr('class') == 'on') {
			$(this).removeClass('on');

			return false;
		}

		$(this).addClass('on');
	});

	$('#submit').live('click', function() {
		$('#uname').blur();

		$('#phone').blur();

		$('#company').blur();

		$('#describe').blur();

		if(!feedSetting.uname || !feedSetting.phone || !feedSetting.company || !feedSetting.describe) {
			return false;
		}

		var serviceArray = new Array();

		$('#service ul li.on').each(function(key, val) {
			serviceArray[key] = $(this).html();
		});

		$.ajax({
			url: 'index.php?m=ajax&a=send',
			data: {
				uname: $('#uname').val(),
				phone: $('#phone').val(),
				service: serviceArray.join('_'),
				company: $('#company').val(),
				industry: $('#industry').val(),
				describe: $('#describe').val()
			},
			type: 'POST',
			async: false,
			success: function(jsonData) {
				if(jsonData == '100') {
					alert('反馈成功');

					$('#close').click();

					return false;
				}

				if(jsonData == '101') {
					alert('反馈失败');

					return false;
				}

				if(jsonData == '102') {
					alert('检查所要填写的信息');

					return false;
				}

				alert('发生未知错误');

				return false;
			}
		});
	});

	var circleSetting = {
		sliderWidth: 0,
		sliderLength: 0,
		sliderOutTimerHezuo: null,
		sliderOutTimerJigou: null
	};

	var circleSlider = {
		init: function(element) {
			circleSlider.initData(element);

			circleSlider.fillImage(element);

			circleSlider.createButton(element);

			$(element + ' .imgbox ul').css('width', circleSetting.sliderWidth * circleSetting.sliderLength * 2);

			circleSetting.sliderOutTimerHezuo = setTimeout(function() {
				if($('#hezuo .numbox span').index('#hezuo .numbox span.active') == 0) {
					circleSlider.moveHezuo(1, 0);
				}
			}, 8000);

			circleSetting.sliderOutTimerJigou = setTimeout(function() {
				if($('#jigou .numbox span').index('#jigou .numbox span.active') == 0) {
					circleSlider.moveJigou(1, 0);
				}
			}, 8000);
		},

		initData: function(element) {
			circleSetting.sliderWidth = $(element + ' .imgbox ul li').width();

			circleSetting.sliderLength = $(element + ' .imgbox ul li').length;
		},

		fillImage: function(element) {
			if($(element + ' ul li').length % 2 != 0) {
				var elementLength = $(element + ' ul li').length % 2;

				for(var i = 0; i < 2 - elementLength; i++) {
					$(element + ' ul').append("<li>" + $(element + ' ul li').eq(i).html() + "</li>");
				}
			}

			$(element +' ul').append($(element + ' ul').html());
		},

		moveHezuo: function(currIndex, offsetLeft) {
			clearTimeout(circleSetting.sliderOutTimerHezuo);

			$('#hezuo .numbox span').removeClass('active').eq(currIndex).addClass('active');

			offsetLeft = offsetLeft + $('#hezuo ul li').width() * 2;

			$('#hezuo ul').stop().animate({'left': -offsetLeft}, 3000, function() {
				if(offsetLeft - ($('#hezuo ul').width() / 2) >= 0) {
					$('#hezuo ul').css('left', 0);

					offsetLeft = 0;
				}
			});

			currIndex = currIndex + 1 >= Math.ceil($('#hezuo ul li').length / 4) ? 0 : currIndex + 1;

			circleSetting.sliderOutTimerHezuo = setTimeout(function() {
				circleSlider.moveHezuo(currIndex, offsetLeft);
			}, 8000);
		},

		moveJigou: function(currIndex, offsetLeft) {
			clearTimeout(circleSetting.sliderOutTimerJigou);

			$('#jigou .numbox span').removeClass('active').eq(currIndex).addClass('active');

			offsetLeft = offsetLeft + $('#jigou ul li').width() * 2;

			$('#jigou ul').stop().animate({'left': -offsetLeft}, 3000, function() {
				if(offsetLeft - ($('#jigou ul').width() / 2) >= 0) {
					$('#jigou ul').css('left', 0);

					offsetLeft = 0;
				}
			});

			currIndex = currIndex + 1 >= Math.ceil($('#jigou ul li').length / 4) ? 0 : currIndex + 1;

			circleSetting.sliderOutTimerJigou = setTimeout(function() {
				circleSlider.moveJigou(currIndex, offsetLeft);
			}, 8000);
		},

		createButton: function(element) {
			for(var i = 1; i <= Math.ceil($(element + ' ul li').length / 4); i++) {
				var active = (i == 1) ? 'active' : '';

				$(element + ' .numbox').append("<span class='" + active + "'></span>");
			}
		},

		stopTimer: function(timer) {
			clearTimeout(timer);
		}
	};

	$('.slider .numbox span').live('click', function() {
		var sliderId = $(this).parent('div').parent('div').parent().attr('id');

		var currIndex = $('#' + sliderId + ' .numbox span').index(this);

		if(sliderId == 'hezuo') {
			circleSlider.moveHezuo(currIndex, (currIndex - 1) * $('#hezuo ul li').width() * 2);
		}

		if(sliderId == 'jigou') {
			circleSlider.moveJigou(currIndex, (currIndex - 1) * $('#jigou ul li').width() * 2);
		}
	});

	circleSlider.init('#hezuo');

	circleSlider.init('#jigou');
});
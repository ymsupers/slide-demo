// JavaScript Document
(function (context, factory) {
	typeof module !== "undefined" && typeof exports !== "undefined" ? module.exports = factory() :
	Object.prototype.slide = factory();
} (this === window ? this : window, function () {
	var generateElement = function (tagName, props) {
		var $el = document.createElement(tagName);
		for (name in props) {
			if ( typeof props[name] === 'string' ) {
				$el.setAttribute(name, props[name]);	
			}
		}
		return $el;
	}
	var plan = function () {
		this.oSlide = generateElement('div', {'class': 'slide'});
		this.oSlide.style.width = this.offsetWidth * this.options.imgUrl.length + 'px';
		this.options.width = this.offsetWidth;
		var oUl = generateElement('ul');
		this.options.imgUrl.forEach(function (item, index) {
			var oLi = generateElement('li');
			var oImg = new Image();
			oImg.src = item;
			oLi.appendChild(oImg);
			oUl.appendChild(oLi);
		});
		this.oSlide.appendChild(oUl);
		this.appendChild(this.oSlide);
		if (this.options.badgeBtn) {
			this.oSlideLight = generateElement('div', {'class': 'light'});
			oUl = generateElement('ul');
			this.options.imgUrl.forEach(function (item, index) {
				var oLi = generateElement('li', {'class': 'btn_'+ ++index});
				index == 1 && oLi.classList.add('active');
				oUl.appendChild(oLi);
			});
			this.oSlideLight.appendChild(oUl);
			this.appendChild(this.oSlideLight);
		}
		if (this.options.flipBtn) {
			this.oSlideFlip = generateElement('div', {'class': 'flip'});
			oUl = generateElement('ul');
			var flipBtnClass = ['next', 'prev'];
			for (var i = 0; i < 2; i++) {
				var oLi = generateElement('li',{'class': flipBtnClass[i]});
				oLi.innerText = '';
				oUl.appendChild(oLi);
			}
			this.oSlideFlip.appendChild(oUl);
			this.appendChild(this.oSlideFlip);
		}
	}
	var Animate = function () {
		var timer$1 = null;
		var timer$2 = null;
		var oSlide = this.oSlide ? this.oSlide : null;
		var oSlideLight = this.oSlideLight ? this.oSlideLight : null;
		var options = this.options;
		var UniformMotion = function () {
			var badge = function (index) {
				var oLi = oSlideLight.getElementsByTagName('li');
				for (var i = 0; i < oLi.length; i++) {
					oLi[i].classList.remove('active');	
				}
				oLi[index].classList.add('active');
			};
			this.motion = function () {
				this.index = this.index >= options.imgUrl.length ? 0 : this.index;
				clearInterval(timer$2);
				oSlideLight && badge(this.index);
				var uniMot = function (target) {
					var speed = (target - Math.abs(oSlide.offsetLeft)) / options.speed;
					speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
					Math.abs(speed) > 0 ? oSlide.style.left  = oSlide.offsetLeft - speed + 'px' : clearInterval(timer$2);	
				};
				timer$2 = setInterval(uniMot.bind(null,this.index * options.width), 30);
			};
		}
		UniformMotion.prototype = {
			index: 0,
			autoPlay: function () {
				timer$1 = setInterval(function () {							
					this.index++;
					this.motion();								
				}.bind(this), 5000);	
			}
			, play: function () {
				clearInterval(timer$1);
				this.motion();
				options.autoPlay && this.autoPlay();
			}
			, stop: false
			, prev: function () {
				this.play();
			}
			, next: function() {
				this.play();
			}
		};
		// 将构造函数重新指向 `UniformMotion`
		UniformMotion.prototype.constructor = UniformMotion;
		return new UniformMotion();
	}
	var events = function (uni) {
		if (this.options.badgeBtn) {
			var oLi = this.oSlideLight.getElementsByTagName('li');
			for (var i = 0; i < oLi.length; i++) {
				oLi[i].index = i;
				oLi[i].addEventListener('mouseover', function () {
					uni.index = this.index;
					uni.play();
				});
			}
		}
		if (this.options.flipBtn) {
			var oPrev = this.oSlideFlip.querySelector('.prev');
			var oNext = this.oSlideFlip.querySelector('.next');
			oPrev.addEventListener('click', function () {
				uni.index--;
				uni.index < 0 ? uni.index = this.options.imgUrl.length - 1 : uni.index;
				uni.prev();
				
			});
			oNext.addEventListener('click', function () {
				uni.index++;
				uni.next();
			});
		}
	}
	var Slide$1 = function Slide$1(opt) {
		this.options = Object.create(null);
		this.options.imgUrl = [];
		this.options.speed = 8; // 速度
		this.options.autoPlay = false; // 自动播放
		this.options.badgeBtn = false; // 自动生成标记按钮
		this.options.flipBtn = true; // 自动生成翻页按钮
		this.options = Object.assign(this.options, opt)
		this.style.overflow = 'hidden';
		plan.call(this);
		var uni = Animate.call(this);
		this.options.autoPlay && uni.autoPlay();
		[this.options.badgeBtn || this.options.flipBtn] && events.call(this,uni);
	}
	return Slide$1;
}));
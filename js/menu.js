/**
 * Created by Caster on 2017/3/23.
 */
$('#menu a').on('click', function () {
	var $this = $(this)
	$this.parent().addClass('active');
	$this.parent().siblings().removeClass('active');
	if ($this.attr('data-toggle') === 'collapse') {
		var i = $this.parent().find('i.fa');
		flag = $($this.attr('href')).hasClass('in');
		if (!flag) {
			$this.parent().addClass('active');
			i.attr('class', 'fa fa-chevron-up')
		} else {
			$this.parent().removeClass('active');
			i.attr('class', 'fa fa-chevron-down')
		}
		;
	}
});
$("a").each(function () {
	$this = $(this);
	if ($this[0].href == String(window.location)) {
		$this.parentsUntil('ul').siblings().removeClass('active');
		$this.parent().addClass("active");
		if($this.parentsUntil('ul').parent().hasClass('submenu')){
			$this.parentsUntil('ul').parent().parent().addClass('active')
		}
	}
});
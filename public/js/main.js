$(document).ready(function(){
	$('.delete-recipe').on('click', function(){
		var id = $(this).data('id');
		var url = '/remove/' + id;
		if(confirm('Delete Recipe?')){
			$.ajax({
				url: url,
				type:'DELETE',
				success: function(result) {
					window.location.href = '/';
				}, error: function(err) {
					console.error(err);
					window.location.href = '/';
				}
			});
		}
	});

	$('.edit-recipe').on('click', function(){
		$('#edit-form-id').val($(this).data('id'));
		$('#edit-form-name').val($(this).data('name'));
		$('#edit-form-ingredients').val($(this).data('ingredients'));
		$('#edit-form-directions').val($(this).data('directions'));
	});

	$('.edit-form').on('submit', function(){
		var url = '/edit/';
		if(confirm('Edit Recipe?')) {
			$.ajax({
				url: url,
				type:'POST'
			});
		}
	});
});
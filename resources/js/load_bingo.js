var content;
var contentCounter = 0;
var rows = $(".row");

loadContent("fireside");

function buildRows(){
	rows.each(function(index){
		addCells(this);
	});
}

function addCells(row){
	var CELL_PROTO = "<div class='cell'><div class='cell_content'><a href='#'>CONTENT_PROTO</a></div></div>"
	for(var i = 0; i < 5; i++){
		$(row).append(CELL_PROTO.replace("CONTENT_PROTO", content[contentCounter]))
		contentCounter++;
	}
}

function loadContent(name){
	$.get("/resources/bingo/" + name + ".bingo", function(data){
		content = data.split("\n");
		shuffle(content);
		buildRows();
		bindHandlers();
		loadInput();
	});
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i -= 1) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}

function bindHandlers(){
		var cells = $(".cell_content");
		$(cells).click(function(){
			if($(this).hasClass("active")){
				$(this).removeClass("active");
			} else {
				$(this).addClass("active");
				checkForBingo(this);
			}
			
		});
	}

function checkForLine(ele){
	row = $(ele).parent().parent()
	if($(row).find(".active").length == 5){
		var audio = new Audio('/resources/sound/son.mp3');
		audio.play();
	}
}

function checkForBingo(ele){
	var IS_BINGO = true;
	rows.each(function(index){
		if($(this).find(".active").length != 5)
			IS_BINGO = false;
		});

	if(IS_BINGO){
		var audio = new Audio('/resources/sound/weed.mp3');
		audio.play();
	} else {
		checkForLine(ele);
	}
}

function loadInput(){

	var input = $("#bingo_selector");
	var inputProto = "<option value='PROTO'>PROTO</option>"
	if($(input).children().length == 0){
		$.get("/resources/bingo/BINGO_CONFIG.config", function(data){
			var bingo_files = data.split("\n")
			$(bingo_files).each(function(){
				$(input).append(inputProto.replace(/PROTO/g, this))
			});
		});

		$(input).change(function(){
			var changeTo = $(this).val();
			cleanUp();
			loadContent(changeTo);
		})
	}
}

function cleanUp(){
	contentCounter=0;
	rows.each(function(index){
		$(this).empty();
	});
}

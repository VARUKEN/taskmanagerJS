// makes sure jquery & jquery UI are around
$ = require('jquery');
require("jquery-ui");

//	---------------------------------------------------------------------------------------------------------------------------------------------
//	init
//	---------------------------------------------------------------------------------------------------------------------------------------------
"use strict";
//	set some defaults
var defaults = {
// CSS selectors and attributes that would be used by the JavaScript functions
todoTask: "todo-task",
todoHeader: "task-header",
todoDate: "task-date",
todoDescription: "task-description",
taskId: "task-",
formId: "todo-form",
dataAttribute: "data",
deleteDiv: "trash-area",
addDiv: "add-trigger",
reloadDiv: "reload_trigger",
deleteButton: "glyphicon glyphicon-minus-sign",
itemForm: "interaction-panel",
itemFormFader: "interaction-fader"
},
codes = {
"1" : "#pending", // For pending tasks
"2" : "#inProgress",
"3" : "#completed"
};

//	init : options
var options = options || {};
options = $.extend({}, defaults, options);
//	---------------------------------------------------------------------------------------------------------------------------------------------
//	init
//	---------------------------------------------------------------------------------------------------------------------------------------------
var app_initApp = function()
{
//	init : options
//	var options = options || {};
//	options = $.extend({}, defaults, options);
//	data : populate the item lists
$.each(data, function (index, params)
{
app_createElement(params);
});
//	dragndrop : the (drop) actions for the 3 states of the item columns
$.each(codes, function(index, value)
{
$(value).droppable(
{
drop: function(event, ui)
{
//	data
var element = ui.helper,
css_id = element.attr("id"),
id = css_id.replace(options.taskId, ""),
object = data[id];
//	Removing old element
app_removeElement(object);
//	Changing object code
object.code = index;
//	Generating new element
app_createElement(object);
// 	Updating Local Storage
data[id] = object;
localStorage.setItem("taskDataSet", JSON.stringify(data));
// Hiding Delete Area
app_hideTrash();
//$("#" + defaults.deleteDiv).hide();
}
});
});
//	dragndrop : the (drop) action for the delete process
$("#" + options.deleteDiv).droppable(
{
drop: function(event, ui)
{
//	get the dragged element
var element = ui.helper,
css_id = element.attr("id"),
id = css_id.replace(options.taskId, ""),
object = data[id];
//	Removing old element
app_removeElement(object);
// Updating local storage
delete data[id];
localStorage.setItem("taskDataSet", JSON.stringify(data));
// Hiding Delete Area
app_hideTrash();
//$("#" + defaults.deleteDiv).hide();
}
});
//	init the datepicker
$( "#datepicker" ).datepicker();
$( "#datepicker" ).datepicker("option", "dateFormat", "dd/mm/yy");
//	the lists can be moved by dragging the title section
$(".task-list").draggable({ handle: "h4" });
//	init the wallpaper
	app_wallpaper_refresh(1);
};
//	---------------------------------------------------------------------------------------------------------------------------------------------
//	init : localstorage
//	---------------------------------------------------------------------------------------------------------------------------------------------
if (localStorage.getItem("taskDataSet") === null) {
var data = {};
}
else
{
var data = JSON.parse(localStorage.getItem("taskDataSet"));
}
//	---------------------------------------------------------------------------------------------------------------------------------------------
//	add a new todo item
//	---------------------------------------------------------------------------------------------------------------------------------------------
var app_addTodoItem = function()
{
//	form : read the input values
var inputs = $("#" + defaults.formId + " :input"),
errorMessage = "Title can not be empty",
id, title, description, date, tempData;
//	form : make sure that we got all values
if (inputs.length !== 5)
{
return;
}
//	form : assign aliases to the collected input values
title = inputs[0].value;
description = inputs[1].value;
date = inputs[2].value;
//	form : check if the title is set
if (!title) {
app_displayMessage(errorMessage);
return;
}
//	dataset : get the current time -> this will be used as the unique identifier for the item dataset
id = new Date().getTime();
//	dataset : create a new dataset
tempData = {
id : id,
code: "1",
title: title,
date: date,
description: description
};
//	Saving element in local storage
data[id] = tempData;
localStorage.setItem("taskDataSet", JSON.stringify(data));
//	add the new item to the list
app_createElement(data[id]);
//	reset Form input fields
inputs[0].value = "";
inputs[1].value = "";
inputs[2].value = "";
//	hide the form now
app_hideForm();
};
//	---------------------------------------------------------------------------------------------------------------------------------------------
//	display a message or notification
//	---------------------------------------------------------------------------------------------------------------------------------------------
var app_displayMessage = function(message)
{
alert(message);
};
//	---------------------------------------------------------------------------------------------------------------------------------------------
//	create a new item in the list
//	---------------------------------------------------------------------------------------------------------------------------------------------
//	add Task
var app_createElement = function(params)
{
//	init
var parent = $(codes[params.code]),wrapper;
if (!parent) { return; }
//	assign a class matching the current list the element is in
switch(params.code)
{
case '1' : var elementClass = "todo-task-queue"; break;
case '2' : var elementClass = "todo-task-inprogress"; break;
case '3' : var elementClass = "todo-task-done"; break;
}
//	create wrapper for the element
wrapper = $("<div />", {
"class" : elementClass,
"id" : defaults.taskId + params.id,
"data" : params.id
}).appendTo(parent);
//	item : delete button
$("<div />", {
"html" : "<span class='"+defaults.deleteButton+ " interaction-deleteItem' onclick='app_deleteItem("+params.id+")'></span>"
}).appendTo(wrapper);
//	item : header
$("<div />", {
"class" : defaults.todoHeader,
"text": params.title
}).appendTo(wrapper);

//	item : date
$("<div />", {
"class" : defaults.todoDate,
"text": params.date
}).appendTo(wrapper);

//	item : description
$("<div />", {
"class" : defaults.todoDescription,
"text": params.description
}).appendTo(wrapper);

//	item : drag interaction
wrapper.draggable({
start: function() {
//$("#" + defaults.deleteDiv).show();
app_showTrash();
$(this).addClass('todo-task-dragging');
},
stop: function() {
//$("#" + defaults.deleteDiv).hide();
app_hideTrash();
$(this).removeClass('todo-task-dragging');
},
revert: "invalid",
revertDuration : 200
});
};
//	---------------------------------------------------------------------------------------------------------------------------------------------
//	remove an old element from the list
//	---------------------------------------------------------------------------------------------------------------------------------------------
var app_removeElement = function(params) {
$("#" + defaults.taskId + params.id).remove();
};
//	---------------------------------------------------------------------------------------------------------------------------------------------
//	delete an item in local storage and add a fadeout effect before removing the element at all
//	---------------------------------------------------------------------------------------------------------------------------------------------
var app_deleteItem = function(elementID)
{
//	remove the element from the list now
var css_id = defaults.taskId + elementID;
$("#" + css_id).fadeOut( 'fast' , function() { app_removeElement({ id: css_id }) });
//	remove item , update local storage
var id = css_id.replace(options.taskId, "");
delete data[id];
localStorage.setItem("taskDataSet", JSON.stringify(data));
// Hiding Delete Area
app_hideTrash();
};
var app_showTrash = function()
{

$("#" + defaults.deleteDiv).fadeIn();

}
var app_hideTrash = function()
{

$("#" + defaults.deleteDiv).fadeOut();

}

var app_showForm = function()
{
//	center the interaction panel [ form ]
var panel = $("#interaction-panel");
panel.css("position","absolute");
panel.css("top", Math.max(0, (($(window).height() - panel.outerHeight()) / 2) + $(window).scrollTop()) + "px");
panel.css("left", Math.max(0, (($(window).width() - panel.outerWidth()) / 2) + $(window).scrollLeft()) + "px");
$("#" + defaults.itemForm).fadeIn();
$("#" + defaults.itemFormFader).fadeIn();
}
var app_hideForm = function()
{
$("#" + defaults.itemForm).fadeOut();
$("#" + defaults.itemFormFader).fadeOut();
}
var app_refresh = function()
{
location.reload();
}

var app_wallpaper_refresh = function(target)
{
	if ( target == null )
	{
		var rnd = Math.floor((Math.random() * 4) + 1);
		$('.wallpaperPlaceholder').fadeOut();
		$('#wall'+rnd).fadeIn();

	}
	else
	{
		$('.wallpaperPlaceholder').fadeOut();
		$('#wall'+target).fadeIn();
	}
}




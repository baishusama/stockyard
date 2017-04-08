// 解决 IE 和非 IE 浏览器在事件绑定方面的兼容性
function addEventHandler(elem, event, handler) {
    if (elem.addEventHandler) {
        elem.addEventHandler(event, handler, false);
    } else if (elem.attachEvent) {
        elem.attachEvent("on" + event, handler);
    } else {
        elem["on" + event] = handler;
    }
}

// Below dosen't work :(
// 用于添加 blur 事件的事件代理
function addBlurHandler(elem, blurHandler) {
    if (document.addEventHandler) {
        elem.addEventHandler("blur", blurHandler, true);
    } else if (document.attachEvent) {
        elem.onfocusout = blurHandler;
    }
}

// 用于偷懒的 $ 方法
function $(selector) {
    var elem = null;
    if (selector.indexOf('#') === 0) {
        elem = document.getElementById(selector.slice(1));
    } else if (selector.indexOf('.') === 0) {
        elem = document.getElementsByClassName(selector.slice(1));
    }
    return elem;
}

// 用于添加类名
function addClassName(elem, clsname) {
    var arr = elem.className.split(/\s/);
    var index = arr.indexOf(clsname);
    if (index === -1) {
        arr.push(clsname); // 【返回值】是变化后的数组长度
        elem.className = arr.join(' ');
        return true;
    }
    return false;
}
// 用于删除类名
function removeClassName(elem, clsname) {
    var arr = elem.className.split(/\s/);
    var index = arr.indexOf(clsname);
    if (index !== -1) {
        arr.splice(index, 1); //这里注意一下 splice 函数的【返回值】是被删除的节点，而原数组会受到影响（这是一个xxx的方法，即这不是一个纯函数）
        elem.className = arr.join(' ');
        return true;
    }
    return false;
}

// DOM
var checkAll = $("#checkAllTodo");
var todoInput = $("#todoInput");
var todoList = $("#todo-list");
var divInputs = $(".todo");
var info = $("#info");
var option = $("#option");
var clear = $("#clear");

/*--------------------
  封装 todo 对象
--------------------*/
// 后期需要添加缓存，现在先弄成在线的
var todo = (function() {
    var list = []; // ???
    var id = 3; // unique id

    var increaseID = function() {
        id++;
        console.log("id: " + id);
    };
    /*var decreaseID = function() {
      id--;
      console.log("id: " + id);
    };*/
    var getListLength = function() {
        return divInputs.length;
    };
    var getTodoLength = function() {
        return todoList.getElementsByClassName("todo-item").length;
    };
    var checkAllCheckbox = function(check) {
        console.log("In checkAllCheckbox, checkAll.checked is firstly: " + checkAll.checked.toString());
        var newClassName = check ? "completed-item" : "todo-item";

        // checkAll.checked = check; // 这句话不能省去，看来 click 和 checkbox 的值的变动的先后和原来的值有关 (???)
        for (var i = 0; i < getListLength(); i++) {
            divInputs[i].previousElementSibling.previousElementSibling.checked = check;
            divInputs[i].parentNode.className = newClassName;
        }
    };
    var updateInfo = function() {
        info.getElementsByClassName("num")[0].innerText = getTodoLength();
    };
    return {
        increase: function() {
            increaseID();
        },
        /*decrease: function() {
          decreaseID();
        },*/
        /*checkAll: function() {
          checkAllCheckbox(true);
        },
        uncheckAll: function() {
          checkAllCheckbox(false);
        },*/
        refreshInfo: function() {
            updateInfo();
        },
        toggleCheckAll: function() {
            // 回头再梳理一下 checkAll.checked 值的变化和 click 事件的先后顺序
            console.log("In toggleCheckAll, checkAll.checked: " + checkAll.checked.toString());

            checkAllCheckbox(checkAll.checked);
            updateInfo();
        },
        completeItem: function(index) {
            todoList.children[index].className = "completed-item";
            updateInfo();
        },
        undoCompleteItem: function(index) {
            todoList.children[index].className = "todo-item";
            updateInfo();
        },
        generate: function(string) {
            var newIdIndex = id + 1; // todoList.children.length + 1;
            // var newIndex = newIdIndex - 1;

            var todoItemHTML = '<input type="checkbox" id="checkTodo' + newIdIndex + '" />\
      <label for="checkTodo' + newIdIndex + '"></label>\
      <div class="todo" placeholder="something to do..." onblur="this.contentEditable=\'false\';"></div>\
      <span class="delete">x</span>';

            var todoItem = document.createElement("li");
            todoItem.className = "todo-item";
            todoItem.innerHTML = todoItemHTML;
            todoList.appendChild(todoItem);

            todoList.children[todoList.children.length - 1].getElementsByClassName("todo")[0].innerText = string;

            increaseID();

            updateInfo();

            return true;
        }
    };
})();

/*--------------------
  全选/全不选
--------------------*/
addEventHandler(checkAll, "click", function() {
    // 虽然这里的 checkAll 是一个隐藏的 input ，但是其对应的 label 的 click 事件可以触发该 input 的 click 事件 (???)
    todo.toggleCheckAll();
});


addEventHandler(todoList, "click", function(e) {
    var tar = e.target;

    if (tar.nodeName === "LABEL") {
        /*--------------------
          单个复选框
        --------------------*/
        var originVal = tar.previousElementSibling.checked; // It's original !!!
        var newVal = !originVal;
        var curItem = tar.parentNode;
        var index = [].indexOf.call(todoList.children, curItem); // parseInt(tar.previousElementSibling.id.split("checkTodo")[1]) - 1; // wrong way
        if (newVal) {
            todo.completeItem(index);
        } else {
            todo.undoCompleteItem(index);
        }
    } else if (tar.nodeName === "SPAN" /*&& tar.className === "delete"*/ ) {
        /*--------------------
          .delete
        --------------------*/
        // var curItem = tar.parentNode;
        // var index = [].indexOf.call(todoList.children, curItem);
        todoList.removeChild(tar.parentNode); //children[index]
        todo.refreshInfo();
    }
});

/*--------------------
  回车添加 todo 事项
--------------------*/
addEventHandler(todoInput, "keydown", function(e) {
    var todoVal = todoInput.value.trim();
    if (e.keyCode === 13 && todoVal) { // 禁止添加空 todo
        if (todo.generate(todoVal)) {
            todoInput.value = '';
        }
    }
});

/*--------------------
  div 模仿 textarea
--------------------*/
// 给 div 添加双击可编辑事件 - 事件委托给 ul
addEventHandler(todoList, "dblclick", function(e) {
    var divTar = e.target;
    if (divTar.nodeName === "DIV") {
        if (divTar.contentEditable === "true") {
            // Do nothing...
            // To keep double click in contentEditable div able to highlight text~
        } else {
            divTar.contentEditable = "true";

            /* Way 0. Failed :( */
            // var originValue = divTar.innerText;
            // divTar.innerText = '';
            divTar.focus();
            // divTar.innerText = originValue;
            var range = document.createRange();

            /* Way 1. Success :) */
            // var caret = 1;
            // range.setStart(divTar, caret);
            // range.setEnd(divTar, caret);

            /* Way 2. Success :) */
            range.selectNodeContents(divTar);
            range.collapse(false);

            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }
    // e.preventDefault();
});
// 给 div 添加失去焦点则不可编辑事件 - 事件怎么委托？？？
// 下下策：在最开始的 HTML 代码里写一个 blur 的行内函数：onblur="this.contentEditable=false;"
/*for (var i = 0; i < divInputs.length; i++) {
  var div = divInputs[i];
  addEventHandler(div, "blur", function(e) {
    this.contentEditable = false;
  });
}*/ // 这个存在 bug ，blur 最好还是能事件委托。。不然后来添加的所有 div 难道都要重新绑定 blur 事件么。。。？？？

// Below dosen't work :(
addBlurHandler(todoList, function(e) {
    console.log("blur happened!");
});

/*--------------------
  底部显示选项 - All/Active/Completed
--------------------*/
addEventHandler(option, "click", function(e) {
    // 本来一开始还在纠结怎么配合 li 的两种类（todo-item/completed-item）怎么写样式的。。
    // 后来想到“一键切换主题”的实现，就直接在 ul 上添加类名了 www 棒棒哒~
    var spanTar = e.target;
    var spans = null;
    var type = "";
    if (spanTar.nodeName === "SPAN") {
        type = spanTar.innerText.toLowerCase();
        todoList.className = type;

        spans = option.getElementsByTagName("span");
        for (var i = 0; i < spans.length; i++) {
            removeClassName(spans[i], "chosen");
        }
        /*option.getElementsByTagName("span").forEach(function() {
          removeClassName(this, "chosen");
        });*/
        addClassName(spanTar, "chosen");
    }
});

/*--------------------
  删除所有已完成项
--------------------*/
addEventHandler(clear, "click", function(e) {
    var completedItems = todoList.getElementsByClassName("completed-item");
    var len = completedItems.length;
    var trueIndex = null;
    for (var i = 0; i < len; i++) {
        // 删的过程中，completedItems.length 会变化；比起用 index 来确定其在 completedItems 类数组中的位置，不如直接删除第一个 [0]
        completedItems[0].remove(); // !!!
        // trueIndex = [].indexOf.call(todoList.children, completedItems[i]);
        // todoList.children[trueIndex].remove();
        /*console.log("removed completedItems' index: " + i)
        console.log("completedItems[i]: ")
        console.log(completedItems)
        console.log("------------------------------")*/
    }
});

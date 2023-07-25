const taskInput = document.querySelector(".task-input input"),
      filters = document.querySelectorAll(".filters span"),
      clearAll = document.querySelector(".clear-btn"),
      boxName = document.querySelector(".name");
      nameInp = document.querySelector(".name input");
const taskBox = document.querySelector(".task-box");

let inpVal = JSON.parse(localStorage.getItem("inpVal"))
nameInp.value = inpVal;
nameInp.addEventListener("input", () => {
    boxName.classList.toggle("change");
    localStorage.setItem("inpVal", JSON.stringify(nameInp.value));
    console.log(nameInp.value);
});
nameInp.addEventListener("focusout", () => {
    boxName.classList.remove("change")
})


let editId;
let isEditedTask = false;
// getting localStorage todos-list 
let todos = JSON.parse(localStorage.getItem("todo-list"));
let page = localStorage.getItem("page") ? localStorage.getItem("page") : "all";

document.querySelector(`#${page}`).classList.add("active");

filters.forEach(btn => {
    btn.addEventListener("click", () => {
        let activeSpan = document.querySelector("span.active")
        if(activeSpan)  {
            activeSpan.classList.remove("active");
            btn.classList.add("active");
            localStorage.setItem("page", btn.id)
            console.log(btn.id);
            showTodo(btn.id)
        }
    })
})

function showTodo(filter) {
    let li = "";
    if(todos) {
        todos.forEach((todo, id) => {
            // if todo status is completed, set the completed vaue to checked
            let isCompleted = todo.status == "completed" ? "checked" : "";
            if(filter == todo.status || filter == "all") {
                li += `<li class="task">
                        <label for="${id}">
                            <input onClick="updateStatus(this)" type="checkbox" id="${id}" ${isCompleted}>
                            <p class="${isCompleted}">${todo.name}</p>
                        </label>
                        <div class="settings">
                            <i onClick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                            <ul class="task-menu">
                                <li onClick="editTask(${id}, '${todo.name}')"><i class="uil uil-pen"></i>Edit</li>
                                <li onClick="deleteTask(${id})"><i class="uil uil-trash"></i>Delete</li>
                            </ul>
                        </div>
                    </li>`;
            }
        });
    }
    taskBox.innerHTML = li || `<span>You don't have any task here</span>`;
}
localStorage.getItem("page") ? localStorage.getItem("page") : "all"
showTodo(page);


function showMenu(selectedTask) {
    // getting task menu div
    let taskMenu = selectedTask.parentNode.lastElementChild;
    taskMenu.classList.add("show");
    // document.querySelector(".settings");
    // removing show class from the task menu of the document click
    document.addEventListener("click", e => {
         if(e.target.tagName != "I" || e.target != selectedTask) {
            taskMenu.classList.remove("show");
        }
    });
}

function editTask(taskId, taskName) {
    editId = taskId
    isEditedTask = true;
    taskInput.value = taskName;
}

function deleteTask(deleteId) {
    todos.splice(deleteId, 1);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    page = localStorage.getItem("page") ? localStorage.getItem("page") : "all"
    showTodo(page)
}

clearAll.addEventListener("click", () => {
    todos.splice(0, todos.length);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    // document.querySelector(".filters span.active").classList.remove("active")
    // document.querySelector(".filters #all").classList.add("active")
    // page = "all";
    // localStorage.setItem("page", page);
    page = localStorage.getItem("page") ? localStorage.getItem("page") : "all";
    showTodo(page)
});

function updateStatus(selectedTask) {
    // getting paragraph that contains task name
    let taskName = selectedTask.parentNode.lastElementChild;
    if(selectedTask.checked) {
        taskName.classList.add("checked");
        // update the status of selected task to completed
        todos[selectedTask.id].status = "completed"
    } else {
        taskName.classList.remove("checked");
        // update the status of selected task to pending
        todos[selectedTask.id].status = "pending"
    }
    localStorage.setItem("todo-list", JSON.stringify(todos));
    page = localStorage.getItem("page") ? localStorage.getItem("page") : "all";
    showTodo(page);
}

taskInput.addEventListener("keyup", e => {
    let userTask = taskInput.value.trim()
    if(e.key == "Enter" && userTask) {
        if(!isEditedTask) {
            if(!todos) {
                todos = [];
            }
            let taskInfo = { name: userTask, status: "pending" };
            todos.push(taskInfo); // adding new task to todos
        } else {
            isEditedTask = false;
            todos[editId].name = userTask;
        }
        taskInput.value = "";
        localStorage.setItem("todo-list", JSON.stringify(todos));
        page = localStorage.getItem("page") ? localStorage.getItem("page") : "all"
        showTodo(page);
    }
});

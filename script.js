const taskInput = document.querySelector(".task-input input"),
clearBtn = document.querySelector(".clear-btn"), 
taskBox = document.querySelector(".task-box");//getting localhost todo-list
filters = document.querySelectorAll(".filters span");//getting localhost todo-list

let editId;
let isEditedTask = false;

//getting localStorage todo-list
let todos = JSON.parse(localStorage.getItem("todo-list")); //Parse this localSotrage data to js object

filters.forEach(btn => {
    btn.addEventListener("click", () => {
        // console.log(btn);
       // remove active class from span
        document.querySelector("span.active").classList.remove("active");
        //add active class to the btn clicked;
        btn.classList.add("active");
        showTodo(btn.id);
    })
})


function showTodo(filter){//filter parameter is add to handle filter section
   let li = "";
  if(todos){
   todos.forEach((todo, id) => {
      let isCompleted = todo.status == "completed" ? "checked" : "";
     if(filter == todo.status || filter == "all"){
      li += `<li class="task">
                <label for="${id}">
                    <input onclick="updateStatus(this)" type="checkbox" name="" id="${id}" ${isCompleted}>
                    <p class="${isCompleted}" >${todo.name}</p>
                </label>
                <div class="settings">
                    <i onclick="showMenu(this)" class="ul uil-ellipsis-h"></i>
                    <ul class="task-menu">
                        <li onclick="editTask(${id},'${todo.name}')"><i class="ui uil-pen"></i>Edit</li>
                        <li onclick="deleteTask(${id})"><i class="ui uil-trash"></i>Delete</li>
                    </ul>
                </div>
            </li>` 
        }
    });
    //if li isn't empty, inser this value inside taskBox else insert span
    taskBox.innerHTML = li || `<span>You don't have any task here`;
    let checkTask = taskBox.querySelectorAll(".task");
   //
    !checkTask.length ? clearBtn.classList.remove("active") : clearBtn.classList.add("active");
    taskBox.offsetHeight >= 300 ? taskBox.classList.add("overflow") : taskBox.classList.remove("overflow");
}

}
showTodo("all");


// updating task status on checkbox click
function showMenu(selectedTask){
   // console.log(selectedTask) //Get the element and display it
    let taskMenu = selectedTask.parentElement.lastElementChild;
    taskMenu.classList.add("show");

    //Close showMenu if user click any part of the web page
    document.addEventListener("click", e => {
        if(e.target.tagName != "I" || e.target != selectedTask){
            taskMenu.classList.remove("show");
            taskInput.classList.remove("active"); 
            // console.log(e.target.tagName);  //return element that triggered the function
        }
    })
}

//edit task function
function editTask(taskId,taskName){
//    console.log(taskId,taskName);

    editId = taskId;
    isEditedTask = true;
    taskInput.value = taskName;
    taskInput.focus();
    taskInput.classList.add("active");

}


//delete task function
deleteTask = (deleteId) => {
    // console.log(deleteId);
    //removing selected task from array/todos
     todos.splice(deleteId, 1);
     localStorage.setItem("todo-list", JSON.stringify(todos));
     showTodo("all");
 }

 clearBtn.addEventListener("click", ()=>{
    todos.splice(0, todos.length);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo("all");
  });
  
function updateStatus(selectedTask){
   // console.log(selectedTask); //Get the element and display it
    //getting paragraph that contains task name
   let taskName = selectedTask.parentElement.lastElementChild;
   //console.log(taskName)
if(selectedTask.checked){
    taskName.classList.add("checked");
    //updating the status of selected task to completed
    todos[selectedTask.id].status = "completed";
    
}else{
    taskName.classList.remove("checked");
    //updating the status of selected task to pending

    todos[selectedTask.id].status = "pending";
}
localStorage.setItem("todo-list", JSON.stringify(todos));
}
taskInput.addEventListener("keyup", e => {
    let userTask = taskInput.value.trim();
    if(e.key == "Enter" && userTask){
       if(!isEditedTask){ //if isEditedTask isn't true
        if(!todos){ //If todos doesn't exit, pass an empty array to todos
            todos = [];
        }
        let taskInfo = {name:userTask, status: "pending"};
        todos.push(taskInfo); //adding new task to todos
       }else{
        isEditedTask = false;
        todos[editId].name = userTask;
       }
        
        taskInput.value = "";
        //Not we have to convert the data into string to it on localStorage
        localStorage.setItem("todo-list", JSON.stringify(todos));
        showTodo(document.querySelector("span.active").id);
    }
})


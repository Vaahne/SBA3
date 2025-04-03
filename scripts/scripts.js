// alert("Hello !!!");
alert("Welcome to your todo List API !!!");

const form = document.querySelector(".form");
const add = document.getElementById("add");
const todoContainerUl = document.querySelector("#todo");
const h1 = document.querySelector("h1");
const taskArea = document.querySelector(".taskArea");
const task = document.getElementById("task");
const dueDate = document.getElementById("dueDate");
dueDate.placeholder = "Enter due date";
const done = document.getElementById("done");

//  localStorage.removeItem("tasks");

// to get the existing tasks from localstorage if any.
let localStorageTasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Adding styles from css to the elements
h1.classList.add("centerText");
form.classList.add("formStyle");
taskArea.classList.add("taskSection");

//adding event listeners to the form
form.addEventListener('submit', addList);

fromLocalStorage();

// adding task to li for every new task added to the todo list using template
function addTemplate(todo,due,completed,...flag) {

    const template = document.querySelector("template");
    const newList = template.content.cloneNode(true);
    // Todo list parent node with all lis
    let todoList = newList.querySelector(".todoList");

    const spanDiv = document.createElement("div");
    spanDiv.classList.add("spanFlex");

    // span for task and spandue for dueDate
    const span = document.createElement("span");
    span.textContent = todo;
    span.setAttribute("title",todo);    
    const spanDue = document.createElement("span");
    spanDue.textContent = due;
    
    spanDiv.appendChild(span);
    spanDiv.appendChild(spanDue);

    const checkBox = document.createElement("input");
    checkBox.type = "checkbox"; 
    if((completed+"").includes("true")){   
        checkBox.checked = completed;   
        checked();  //task marked complete, if coming from local storage or adding new task
    }
    const editBtn = document.createElement("img");
    editBtn.setAttribute("src","../images/edit.png");
    editBtn.setAttribute("title","click to edit");
    const deleteBtn = document.createElement("img");
    deleteBtn.setAttribute("src","../images/delete.png");
    deleteBtn.setAttribute("title","click to delete");

    todoList.appendChild(checkBox);
    todoList.appendChild(spanDiv);
    todoList.appendChild(editBtn);
    todoList.appendChild(deleteBtn);
    
    todoContainerUl.appendChild(todoList);

    // checks if it is coming from localStorage
    if(flag.length == 0){ 
        localStorageTasks.push(`{task:${todo},dueDate:${due},completed:false,}`);
        localStorage.setItem("tasks",JSON.stringify(localStorageTasks));
    }

    //  performs the operations, when edit is clicked 
    editBtn.addEventListener('click', (e) => {
        e.preventDefault();
        let newContent = prompt("Enter the todo list to be updated",span.textContent);
        if(newContent != "" && newContent != null){
            let task = e.target.parentNode.children[0].nextElementSibling.children[0].textContent;            
            // Editing the corresponding value in local storage
            editOrDeleteLocalStorage(task,newContent,"edit");
            span.textContent = newContent;
        }else
            alert("New edited task cannot be empty");
    });

    // deletes the task from li and local storage after confirnation, when delete is clicked 
    deleteBtn.addEventListener('click', (e) => {
        e.preventDefault();
        let yesOrNo = confirm("Do you want to delete the task?");
        if (yesOrNo) {
            let task = span.textContent;
            // checking the value in local storage and deleting it
            editOrDeleteLocalStorage(task,"","delete");       
            e.target.parentNode.remove();    
            
            //checks id tasks completed div has matched tasks
            [...done.children].forEach((l)=>{
                if(l.textContent == task)
                    l.remove()
            });

            if(done.children.length == 1)
                done.style.display = "none";
        }
    });
    checkBox.addEventListener('change',()=>{
        if(checkBox.checked){
            checked();
        }else{
            unchecked();
        }
    });

    function checked(){
        spanDiv.style.textDecoration = "line-through";
        spanDiv.style.textDecorationThickness = ".2rem";

        let found = [...done.children].find((l)=>l.textContent == span.textContent);
        // let task = e.target.nextElementSibling.firstChild.textContent;
        let task = span.textContent;
        if(!found){
            const liDone = document.createElement("li");
            liDone.textContent = task;
            done.appendChild(liDone);
        }
        // updating the local storage when task marked complete
        updateLocalStorageStatus(task,true);
        done.style.display = "block";
    }
    function unchecked(){
        spanDiv.style.textDecoration = "none";
        let task = span.textContent;
             [...done.children].forEach((l)=>{
                if(l.textContent == task)
                    l.remove()
            });
            // updating local storage when task marked not complete
            updateLocalStorageStatus(task,false);   
            if(done.children.length == 1)
                done.style.display = "none";
    }
}

function addList(e) {
    e.preventDefault();
    const regex = /^\d+$/;
    
    task.classList.add("taskText");
    let taskVal = task.value;
    let due = dueDate.value;
    
    // checks if due date is past current date
    if(Date.parse(due) < Date.parse(new Date())){
        alert("Due date cannot be older than todays date");
        dueDate.focus();
        return;
    }
    // task cannot have just number check
    // validating the input 
    if(regex.test(taskVal)){
        alert("Task cannot be numbers only");
        return;
    }
    // checks if task already present in local storage
    let present = false;
    localStorageTasks.forEach(element => {   
        const localTask = element.split(",")[0].split(":")[1];
        if(localTask == taskVal){
            alert("Task already present");
            present = true;
            return;
        }  
    });
    if(!present)
        addTemplate(taskVal,due,false);
    form.reset();
}

function fromLocalStorage(){
    localStorageTasks.forEach(e => {     // loop through all the existing data in local Storage  
        [taskExisted,dueDateExisted,completedStatus] = [e.split(",")[0].split(":")[1],e.split(",")[1].split(":")[1],e.split(",")[2].split(":")[1]];
        addTemplate(taskExisted,dueDateExisted,completedStatus,true); 
    });
}
// edit or delete from local storage based on option passed
function editOrDeleteLocalStorage(task,newContent,option){
    for(let i = 0;i<localStorageTasks.length;i++){
        const e = localStorageTasks[i];
        const localTask = e.split(",")[0].split(":")[1];
        const localDueDate = e.split(",")[1].split(":")[1];
        const localStatus = e.split(",")[2].split(":")[1];
        
        if(localTask == task){
            if(option == "edit"){
                // localStorageTasks[i].task = newContent;
                localStorageTasks[i] = `{task:${newContent},dueDate:${localDueDate},complete:${localStatus},}`;
            }
            if(option == "delete"){
                localStorageTasks.splice(i,1);
            }
            localStorage.setItem("tasks",JSON.stringify(localStorageTasks));
            break;
        }
    }
}

// updates the local storage based on task completed or not
function updateLocalStorageStatus(task,completeOrNot){
    for(let i = 0;i<localStorageTasks.length;i++){
        const e = localStorageTasks[i];
        const localTask = e.split(",")[0].split(":")[1];
        const localDueDate = e.split(",")[1].split(":")[1];
        
        if(localTask == task){
            localStorageTasks[i] = `{task:${localTask},dueDate:${localDueDate},complete:${completeOrNot},}`;
            localStorage.setItem("tasks",JSON.stringify(localStorageTasks));
            break;
        }
    }    
}
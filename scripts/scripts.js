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

// adding task to li for every new task added to the todo list
function addTemplate(todo,due,...flag) {

    // let due = dueDate.value;
    const template = document.querySelector("template");
    const newList = template.content.cloneNode(true);

    let todoList = newList.querySelector(".todoList");

    const spanDiv = document.createElement("div");
    spanDiv.classList.add("spanFlex");

    const span = document.createElement("span");
    span.textContent = todo;
    span.setAttribute("title",todo);
    
    const spanDue = document.createElement("span");
    spanDue.textContent = due;
    
    spanDiv.appendChild(span);
    spanDiv.appendChild(spanDue);

    const checkBox = document.createElement("input");
    checkBox.type = "checkbox";    
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
        localStorageTasks.push(`${todo}:${due}`);
        localStorage.setItem("tasks",JSON.stringify(localStorageTasks));
    }

    //  performs the operations, when edit is clicked 
    editBtn.addEventListener('click', (e) => {
        e.preventDefault();
        let newContent = prompt("Enter the todo list to be updated");
        if(newContent != "" && newContent != null){
            let task = e.target.parentNode.children[0].nextElementSibling.children[0].textContent;            
            // Editing the corresponding value in local storage
            for(let i = 0;i<localStorageTasks.length;i++){
                if(localStorageTasks[i].split(":")[0] == task){
                    localStorageTasks[i] = newContent+":"+localStorageTasks[i].split(":")[1];
                    break;
                }
            }

            span.textContent = newContent;
            //localStorageTasks[index] = newContent;
            localStorage.setItem("tasks",JSON.stringify(localStorageTasks));
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
            for(let i = 0;i< localStorageTasks.length;i++){
                if(localStorageTasks[i].split(":")[0] == task){
                    localStorageTasks.splice(i,1);
                    localStorage.setItem("tasks",JSON.stringify(localStorageTasks));
                    break;
                }
            }            
            e.target.parentNode.remove();            
        }
    });
    checkBox.addEventListener('change',(e)=>{
        if(checkBox.checked){
            spanDiv.style.textDecoration = "line-through";
            spanDiv.style.textDecorationThickness = ".2rem";

            let found = [...done.children].find((l)=>l.textContent == span.textContent);
            
            if(!found){
                const liDone = document.createElement("li");
                // liDone.textContent = span.textContent;            
                liDone.textContent = e.target.nextElementSibling.firstChild.textContent;
                done.appendChild(liDone);
            }
            done.style.display = "block";
        }else{
            spanDiv.style.textDecoration = "none";
            
             [...done.children].forEach((l)=>{
                if(l.textContent == spanDiv.children[0].textContent)
                    l.remove()
            });

            if(done.children.length == 1)
                done.style.display = "none";
        }
    });
}


function addList(e) {
    e.preventDefault();
    const regex = /^\d+$/;
    
    task.classList.add("taskText");
    let taskVal = task.value;
    let due = dueDate.value;
    
    if(Date.parse(due) < Date.parse(new Date())){
        alert("Due date cannot be older than todays date");
        dueDate.focus();
        return;
    }

    if(regex.test(taskVal)){
        alert("Task cannot be numbers only");
        return;
    }
    
    let present = false;
    localStorageTasks.forEach(element => {     // loop through all the existing data in local Storage  
        let task = element.split(":");
        if(task[0] == taskVal){
            alert("Task already present");    
            present = true;
            return;
        }
    });
    if(!present)
        addTemplate(taskVal,due);
    form.reset();
}

function fromLocalStorage(){
    localStorageTasks.forEach(element => {     // loop through all the existing data in local Storage  
        let task = element.split(":");
        addTemplate(task[0],task[1],true); 
    });
}
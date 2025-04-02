// alert("Hello !!!");
// alert("Welcome to your todo List!!!");

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

h1.classList.add("centerText");
form.classList.add("formStyle");
taskArea.classList.add("taskSection");

form.addEventListener('submit', addList);

fromLocalStorage();

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
    // const editImg = document.createElement("img");
    editBtn.setAttribute("src","../images/edit.jpg");
    // editBtn.textContent = "Edit";    
    // editBtn.appendChild(editImg);
    const deleteBtn = document.createElement("img");
    deleteBtn.setAttribute("src","../images/delete.jpg");

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

    // when edit is clicked
    editBtn.addEventListener('click', (e) => {
        e.preventDefault();
        let newContent = prompt("Enter the todo list to be updated");
        if(newContent != "" && newContent != null){
            let task = span.textContent;            
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

            let found = [...done.children].find((l)=> l.textContent == span.textContent);
            
            if(!found){
                const liDone = document.createElement("li");
                liDone.textContent = span.textContent;            
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

    if(regex.test(taskVal))
        alert("Task cannot be numbers only");
    else if(localStorageTasks.includes(taskVal))
        alert("Task already present");
    else
        addTemplate(taskVal,due);
    form.reset();
}

function fromLocalStorage(){
    localStorageTasks.forEach(element => {     // loop through all the existing data in local Storage  
        let task = element.split(":");
        addTemplate(task[0],task[1],true); 
    });
}
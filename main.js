const manageTodoList = (() => {

    //DOM
    const $addToDoButton = document.querySelector("#add_todo_button")
    const $todoList = document.querySelector(".to_do_list")
    const $todoName = document.querySelector("#todo_name")
    //Bind events
    $addToDoButton.addEventListener("click", addTodo)
    $todoList.addEventListener("click", deleteTodo)

    function addTodo() {
        if($todoName.value) {
            const todoContent = document.createElement("div")
            todoContent.classList.add("to_do_content")
            $todoList.appendChild(todoContent)
            const todo = document.createElement("p")
            const todoButton = document.createElement("button")
            todoButton.textContent = "Delete"
            todo.textContent = $todoName.value
            $todoName.value = ""
            todoContent.appendChild(todo)
            todoContent.appendChild(todoButton)
        } 
    }

    function deleteTodo (e) {
        if(e.target.textContent === "Delete") {
            e.target.parentElement.remove()
        }
    }

})()


const manageSideBar = (() => {

    //DOM
    const $home = document.querySelector(".home")
    const $today = document.querySelector(".today")
    const $thisWeek = document.querySelector(".this_week")
    const $projects = document.querySelector(".projects")

    //Bind events


    function showHome() {

    }

    function showToday() {

    }

    function showThisWeek() {

    }

    function showProjects() {

    }
})



const events = {
    events: {},
    on: function (eventName, fn) {
        this.events[eventName] = this.events[eventName] || []
        this.events[eventName].push(fn)
    },
    off: function (eventName, fn) {
        if (this.events[eventName]) {
            for (let i = 0; i<this.events[eventName].lenght; i++) {
                if(this.events[eventName][i] === fn) {
                    this.events[eventName].splice(i, 1)
                    break
                }
            }
        }
    },
    emit: function(eventName, data) {
        if(this.events[eventName]) {
            this.events[eventName].forEach((fn) => fn(data))
        }
    }
}
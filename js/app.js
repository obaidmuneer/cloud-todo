let addBtn = document.querySelector('#addBtn')
let courseItem = document.querySelector('#courseItem')
let imagefile = document.querySelector('#uploadedFile');
let item = document.querySelector('#item')
let result = document.querySelector('#result')
let todo = document.querySelector('#todo')

let todos = {}
let todoId;
// let api = 'https://faithful-erin-wig.cyclic.app/'
let api = 'http://localhost:8080/'

function addCourse() {
    if (!courseItem.value) {
        return
    }
    localStorage.setItem('course', courseItem.value)
    renderItems()
    item.focus()


}
function renderItems(items) {
    axios.get(`${api}todos/${courseItem.value}`)
        .then((res) => {
            todos = res.data.data
            // todos = todos.filter((item, index) => {
            //     return item.course === courseItem.value
            // })
            // console.log(todos);
            showItems()
        })
        .catch((err) => {
            console.log(err);
        })

}
if (localStorage.getItem('course')) {
    // courseItem.focus()
    courseItem.value = localStorage.getItem('course')
    renderItems()
}

function addItem(index) {
    if (!item.value) {
        return
    }
    index > -1 ? updateItem(index) : postItem(courseItem.value, item.value)
    item.value = ''
}

function postItem(course, text) {
    axios.post(`${api}todo`, {
        course,
        text
    })
        .then((res) => {
            renderItems()
            // console.log(res.data);
            // todos = res.data
            // showItems()
        })
}


function showItems() {
    result.innerHTML = ''
    todos.reverse().map((item, index) => {
        let edit = item.text ? `<a href="#" onclick="editItem(${index})" class="text-info" data-mdb-toggle="tooltip" title="Edit todo"><i
        class="fas fa-pencil-alt me-3"></i></a>` : ''
        let dlt = `<a href="#" onclick="dltItem(${index})" class="text-danger" data-mdb-toggle="tooltip" title="Delete todo"><i
        class="fas fa-trash-alt"></i></a>`
        let itemdiv;
        if (item.text) {
            itemdiv = `<div class="d-flex align-items-center">
            ${item.text}
          </div>`
        } else {
            itemdiv = `<div class="card img-card">
            <div class="bg-image hover-overlay ripple" data-mdb-ripple-color="light">
              <img src="${api}${courseItem.value}/${item.filename}" class="img-fluid"/>
                <div class="mask" style="background-color: rgba(251, 251, 251, 0.15);"></div>
            </div>
          </div><br>`

        }
        result.innerHTML += `<li data-key="${item._id}"
                class="list-group-item d-flex justify-content-between align-items-center border-start-0 border-top-0 border-end-0 border-bottom rounded-0 mb-2">
                ${itemdiv}
                <div class="d-flex flex-row justify-content-end mb-1">
                      ${edit}
                      ${dlt}
                    </div>
              </li>`
    })
}

function formSetting(index) {
    if (index > -1) {
        addBtn.innerHTML = 'Update'
        addBtn.setAttribute('class', 'btn btn-success btn-rounded ms-2')
        todo.onsubmit = function () {
            addItem(index);
            return false
        }
    } else {
        addBtn.innerHTML = 'Add'
        addBtn.setAttribute('class', 'btn btn-primary btn-rounded ms-2')
        todo.onsubmit = function () {
            addItem();
            return false
        }
    }
}

function updateItem() {
    axios.put(`${api}todo/${todoId}`, {
        text: item.value
    })
        .then((res) => {
            // console.log(res.data);
            renderItems()
        })
        .catch((err) => {
            console.log(err.response.data.msg);
        })
    formSetting()
}

function editItem(index) {
    item.value = todos[index].text
    todoId = todos[index]._id
    item.focus()
    formSetting(index)
}

function dltItem(index) {
    todoId = todos[index]._id
    axios.delete(`${api}todo/${todoId}`)
        .then((res) => {
            console.log(res.data);
            renderItems()
        })
        .catch((err) => {
            console.log(err.message);
        })
}

function dltAll() {
    axios.delete(`${api}todos/${courseItem.value}`)
        .then((res) => {
            console.log(res.data);
            result.innerHTML = ''
        })
}
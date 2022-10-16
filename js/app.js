let courseItem = document.querySelector('#courseItem')
let todo = document.querySelector('#todo')
let item = document.querySelector('#item')
let imagefile = document.querySelector('#uploadedFile');
let addBtn = document.querySelector('#addBtn')
let cancleBtn = document.querySelector('#cancleBtn')
let uploadBtn = document.querySelector('#uploadBtn')
let result = document.querySelector('#result')

let todos = {}
let todoId;
let api;
if (window.location.protocol) {
    api = 'http://localhost:8080/'
} else {
    api = 'https://faithful-erin-wig.cyclic.app/'
}
// console.log(api);

let addCourse = () => {
    if (!courseItem.value) {
        return
    }
    localStorage.setItem('course', courseItem.value)
    renderItems()
    item.focus()
}

let renderItems = (items) => {
    axios.get(`${api}todos/${courseItem.value}`)
        .then((res) => {
            todos = res.data.data
            showItems()
        })
        .catch((err) => {
            console.log(err);
        })

}
if (localStorage.getItem('course')) {
    courseItem.value = localStorage.getItem('course')
    renderItems()
}

let addItem = (index) => {
    // console.log(todo['item'].value);
    if (!courseItem.value || !item.value) {
        return
    }
    index > -1 ? updateItem(index) : postItem(courseItem.value, item.value)
    item.value = ''
}

let postItem = (course, text) => {
    axios.post(`${api}todo`, {
        course,
        text
    })
        .then((res) => {
            renderItems()
        })
}

let cancle = () => {
    todo.reset()
    addBtn.style.display = 'inline'
    uploadBtn.style.display = 'none'
    cancleBtn.style.display = 'none'
}

let upload = () => {
    addBtn.style.display = 'none'
    uploadBtn.style.display = 'inline'
    cancleBtn.style.display = 'inline'
}

let fileUpload = () => {
    let formData = new FormData();
    formData.append("uploadedFile", imagefile.files[0]);
    axios.post(`${api}upload/${courseItem.value}`, formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then((res) => {
            // console.log(res.data.data);
            renderItems()
        })
        .catch((err) => {
            console.log(err);
        })
    addBtn.style.display = 'inline'
    uploadBtn.style.display = 'none'
    cancleBtn.style.display = 'none'

}

let showItems = () => {
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
              <img src="${item.file.link}" class="img-fluid"/>
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

let formSetting = (index) => {
    if (index > -1) {
        addBtn.innerHTML = 'Update'
        addBtn.setAttribute('class', 'btn btn-success btn-rounded ms-2')
        todo.onsubmit = function () {
            addItem(index);
            return false
        }
        cancleBtn.style.display = 'inline'
    } else {
        addBtn.innerHTML = 'Add'
        addBtn.setAttribute('class', 'btn btn-primary btn-rounded ms-2')
        todo.onsubmit = function () {
            addItem();
            return false
        }
        // cancleBtn.style.display = 'none'
        // item.value = ''
    }
}

let updateItem = () => {
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

let editItem = (index) => {
    item.value = todos[index].text
    todoId = todos[index]._id
    item.focus()
    formSetting(index)

}

let dltItem = (index) => {
    // console.log(todos[index]);
    if (todos[index].text) {
        todoId = todos[index]._id
    } else {
        todoId = `${todos[index]._id} ${todos[index].file.fileId}`
    }
    axios.delete(`${api}todo/${todoId}`)
        .then((res) => {
            console.log(res.data);
            renderItems()
        })
        .catch((err) => {
            console.log(err.message);
        })
}

let dltAll = () => {
    axios.delete(`${api}todos/${courseItem.value}`)
        .then((res) => {
            console.log(res.data);
            result.innerHTML = ''
        })
}

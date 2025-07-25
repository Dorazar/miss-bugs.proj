'use strict'


function onGetBug() {
    fetch('/api/bug/').then(res =>res.json()).
    then(bugs =>{
        const elBugList = document.querySelector('.bug-list')
        elBugList.innerText = JSON.stringify(bugs,null,4)
    })
}


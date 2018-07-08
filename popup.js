function modifyDOM() {
    function onClick(e) {
        document.body.onmouseover = document.body.onmouseout = undefined;
        document.removeEventListener('click', onClick, false);

        e = e || window.event;
        let target = e.target || e.srcElement;

        document.body.innerHTML = '';

        target.style.borderColor = 'black';
        target.style.backgroundColor = 'black';
        target.style.height = '75vh';
        target.style.width = '75%';
        target.style.marginLeft = 'auto';
        target.style.marginRight = 'auto';
        target.style.marginTop = '0';
        target.style.marginBottom = '0';

        let iframes = target.getElementsByTagName("iframe");
        for(let i = 0; i < iframes.length; i++) {

            iframes[i].style.height = '100%';
            iframes[i].style.width = '100%';

            let parent = iframes[i].parentElement;
            while (parent != null && parent !== target) {
                parent.style.height = '100%';
                parent.style.width = '100%';

                parent = parent.parentElement;
            }
        }


        let container = document.createElement('div');
        container.style.backgroundColor = 'black';
        container.style.borderColor = 'black';
        container.style.width = '100%';
        container.style.height = '100vh';

        container.appendChild(target);
        document.body.appendChild(container);
    }

    function onMouse(event) {

        if (event.type === 'mouseover') {

            event.target.style.backgroundColor = 'pink';
            event.target.style.borderColor = 'pink';
        }
        if (event.type === 'mouseout') {
            event.target.style.backgroundColor = '';
            event.target.style.borderColor = '';
        }
    }

    document.body.onmouseover = document.body.onmouseout = onMouse;
    document.addEventListener('click', onClick, false);

    return function () {
        document.body.onmouseover = document.body.onmouseout = undefined;
        document.removeEventListener('click', onClick, false);
    };
}

const fixButtom = document.getElementById("fixButton");
let unregister;

fixButtom.addEventListener('click', () => {
    if (fixButtom.innerHTML === "Отменить") {
        document.getElementById("selectText").remove();

        fixButtom.innerHTML = 'Выбрать окно';

        unregister(); // todo не работает unregister
    } else {
        const selectText = document.createElement("p");
        selectText.id = "selectText";
        selectText.innerHTML = "Выберите элемент на странице";
        selectText.style.color = 'blue';
        fixButtom.parentElement.appendChild(selectText);

        fixButtom.innerHTML = "Отменить";

        //We have permission to access the activeTab, so we can call chrome.tabs.executeScript:
        chrome.tabs.executeScript({
            code: '(' + modifyDOM + ')();' //argument here is a string but function.toString() returns function's code
        }, (results) => {
            unregister = results;
        });
    }
});
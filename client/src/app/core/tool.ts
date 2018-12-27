function showloading(showclose, request, text = '') {
    if (document.getElementById('WK_loading')) {
        return;
    }
    const ul = document.createElement('ul');
    ul.classList.add('WK_loading');
    const panel = document.createElement('div');
    panel.setAttribute('id', 'WK_loading');
    panel.appendChild(ul);
    for (let i = 0; i < 8; i++) {
        const li = document.createElement('li');
        ul.appendChild(li);
    }
    document.body.appendChild(panel);
    if (showclose) {
        const closebtn = document.createElement('span');
        panel.appendChild(closebtn);
        closebtn.onclick = () => {
            hideloading();
            request.unsubscribe();
            closebtn.onclick = null;
        };
    }
    if (text) {
        const p = document.createElement('p');
        p.innerText = text;
        panel.appendChild(p);
    }
    return panel;
}

function hideloading() {
    const panel = document.getElementById('WK_loading');
    if (panel) {
        document.body.removeChild(panel);
    }
}

const Tool = {
    showloading,
    hideloading
}
export default {
    showloading,
    hideloading
};
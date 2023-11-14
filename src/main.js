const root = document.querySelector('#app');
const node = document.createTextNode('Hello World');
const element = document.createElement('h1');
element.appendChild(node);
root.appendChild(element);

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


var node_el = [];
var edge_el = [];

class Nodes extends React.Component {
    render() {
        var node_elements = [];
        for(let i = 0; i < node_el.length; ++i)
            node_elements.push(<canvas width={node_el[i].size * 2} height={node_el[i].size * 2} className="node" id={node_el[i].id} key={node_el[i].id} style={{left: node_el[i].posX + 'px', top: node_el[i].posY + 'px'}}></canvas>);
        return (
            <div>
                {node_elements}
            </div>
            );
        }
}

// class Edges extends React.Component {
//     render() {
//         var edge_elements = [];
//         for(let i = 0; i < edge_el.length; ++i)
//             edge_elements.push(<canvas ></canvas>);
//         return (
//             <div>
//                 {edge_elements}
//             </div>
//             );
//         }
// }

function Draw_graph() {
    ReactDOM.render(
    <div>
        <canvas height="50000" width="50000"></canvas>
        <Nodes/>
        
    </div>,
    document.getElementById("root"));
}

function Dragger(GLOBAL) {
    var DOC = GLOBAL.document;
    function stopDrag() {
        DOC.onmousemove = null;
        DOC.onselectstart = null;
    }
    function pageOffset() {
        return {
             x : GLOBAL.pageXOffset || DOC.documentElement.scrollLeft || DOC.body.scrollLeft,
             y : GLOBAL.pageYOffset || DOC.documentElement.scrollTop  || DOC.body.scrollTop
        };
    }
    function process(element, dx, dy) {
        DOC.onselectstart = function () {
            return false;
        };
        DOC.onmousemove = function (event) {
            var e = GLOBAL.event || event;
            if (GLOBAL.getSelection) {
                GLOBAL.getSelection().removeAllRanges();
            } else if (DOC.selection && DOC.selection.clear) {
                DOC.selection.clear();
            }
            element.style.left = e.clientX + pageOffset().x - dx + "px";
            element.style.top  = e.clientY + pageOffset().y - dy + "px";
        };
    }
    function dragDrop(elements) {
        var length, deltaX, deltaY, i;
        length = elements.length;
        function startDrag(event) {
            var e = GLOBAL.event || event,
                target = e.srcElement || e.target;
            deltaX = e.clientX + pageOffset().x - target.offsetLeft;
            deltaY = e.clientY + pageOffset().y - target.offsetTop;
            process(target, deltaX, deltaY);
        }
        for (i = 0; i < length; i += 1) {
            elements[i].style.position = "absolute";
            elements[i].onmousedown = startDrag;
        }
    }
    DOC.onmouseup = stopDrag;
    return {
        makeDragDrop : dragDrop
    };
}

window.onload = function() {
  var dragDrop = Dragger(this);
  var divs = document.getElementsByClassName("node");
  dragDrop.makeDragDrop(divs);
}

function node_add(element) {
    var elem = {
        id: "1",
        posY: "50",
        posX: "50",
        value: "value",
        radius: 25,
        size: 52,
        color: "red"
    }
    if (element.id !== undefined)
        elem.id = String(element.id);
    if (element.posX !== undefined)
        elem.posX = String(element.posX);
    if (element.posY !== undefined)
        elem.posY = String(element.posY);
    if (element.value !== undefined)
        elem.value = String(element.value);
    if (element.radius !== undefined)
        elem.radius = String(element.radius);
    if (element.color !== undefined)
        elem.color = String(element.color);
    if (element.size !== undefined) {
        elem.size = String(element.size);
    } else {
        elem.size = elem.radius * 2 + 2;
    }
    node_el.push(elem);
    Draw_graph();

    var canvas = document.getElementById(elem.id);
    var obCanvas = canvas.getContext('2d');
    
    obCanvas.beginPath();
    obCanvas.font = "italic 15pt Arial";
    let text_size = obCanvas.measureText(elem.value);
    if (text_size.width > elem.size) {
        elem.size = text_size.width;
        Draw_graph();
    }
    obCanvas.draggable = true;
    obCanvas.arc(elem.size / 2, elem.size / 2, elem.radius, 0, 2*Math.PI, false);
    obCanvas.fillStyle = elem.color;
    obCanvas.fill();
    obCanvas.lineWidth = 1;
    obCanvas.strokeStyle = elem.color;
    obCanvas.stroke();
    obCanvas.font = "italic 15pt Arial";
    obCanvas.fillStyle = 'black';
    obCanvas.textAlign = "center";
    obCanvas.fillText(elem.value, elem.size / 2, elem.size / 2 + 7);
    return;
}

function node_remove(id) {
    for (let i = 0; i < node_el.length; ++i) {
        if (node_el[i].id === String(id)) {
            node_el.splice(i, 1);
            break;
        }
    }
    Draw_graph();
    return;
}

node_add({
        id: "1",
        posY: "150",
        posX: "150",
        value: "1",
    });

node_add({
        id: "2",
        posY: "250",
        posX: "250",
        value: "2",
        color: "blue"
    });

node_add({
        id: "3",
        posY: "350",
        posX: "350",
        value: "3",
        radius: 50,
    });

node_add({
        id: "4",
        posY: "450",
        posX: "450",
        value: "4",
    });

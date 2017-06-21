import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


var node_el = [];
var edge_el = [];

class Nodes extends React.Component {
    render() {
        var node_elements = [];
        for(let i = 0; i < node_el.length; ++i)
            node_elements.push(<canvas width={node_el[i].size} height={node_el[i].size} className="node" id={node_el[i].id} key={node_el[i].id} style={{left: node_el[i].posX + 'px', top: node_el[i].posY + 'px'}}></canvas>);
        return (
            <div>
                {node_elements}
            </div>
            );
        }
}

class Edges extends React.Component {
    render() {
        var edge_elements = [];
        for(let i = 0; i < edge_el.length; ++i)
            edge_elements.push(<canvas id={edge_el[i].id} key={edge_el[i].id} width="5000" height="2000" style={{position: "absolute", left: "0px", top: "0px"}}></canvas>);
        return (
            <div>
                {edge_elements}
            </div>
            );
        }
}

function Draw_graph() {
    ReactDOM.render(
    <div>
        <Edges/>
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


            let node_id = element.id;
            let lastX = 0;
            let lastY = 0;
            for (let i = 0; i < node_el.length; ++i) {
                if (node_el[i].id === String(node_id)) {
                    lastX = node_el[i].posX;
                    lastY = node_el[i].posY;
                    node_el[i].posX = e.clientX + pageOffset().x - dx;
                    node_el[i].posY = e.clientY + pageOffset().y - dy;
                    
                    for (let j = 0; j < node_el[i].edges.length; ++j) {
                        var example = document.getElementById(node_el[i].edges[j].id);
                        var coordX_1 = 0;
                        var coordX_2 = 0;
                        var coordY_1 = 0;
                        var coordY_2 = 0;
                        var rad1 = 0;
                        var rad2 = 0;
                        if (node_el[i].edges[j].from === String(node_id)) {
                            coordX_1 = node_el[i].posX;
                            coordY_1 = node_el[i].posY;
                            rad1 = node_el[i].radius;
                            for (let k = 0; k < node_el.length; ++k) {
                                if (node_el[i].edges[j].to === node_el[k].id) {
                                    coordX_2 = node_el[k].posX;
                                    coordY_2 = node_el[k].posY;
                                    rad2 = node_el[k].radius;
                                }
                            }
                        } else {
                            coordX_2 = node_el[i].posX;
                            coordY_2 = node_el[i].posY;
                            rad2 = node_el[i].radius;
                            for (let k = 0; k < node_el.length; ++k) {
                                if (node_el[i].edges[j].from === node_el[k].id) {
                                    coordX_1 = node_el[k].posX;
                                    coordY_1 = node_el[k].posY;
                                    rad1 = node_el[k].radius;
                                }
                            }
                        }
                        var ctx = example.getContext('2d');
                        ctx.beginPath();
                        ctx.clearRect(Math.min(parseInt(coordX_1, 10), parseInt(coordX_2, 10), lastX), Math.min(parseInt(coordY_1, 10), parseInt(coordY_2, 10), lastY), Math.max(parseInt(coordX_1, 10), parseInt(coordX_2, 10), lastX) + parseInt(coordY_1, 10) + parseInt(rad1, 10) + parseInt(rad2, 10) + parseInt(rad2, 10), Math.max(parseInt(coordY_1, 10), parseInt(coordY_2, 10), lastY) + parseInt(coordY_1, 10) + parseInt(rad1, 10) + parseInt(rad2, 10) + parseInt(rad2, 10));
                        
                        coordX_1 = parseInt(coordX_1, 10) + parseInt(rad1, 10);
                        coordX_2 = parseInt(coordX_2, 10) + parseInt(rad2, 10);
                        coordY_1 = parseInt(coordY_1, 10) + parseInt(rad1, 10);
                        coordY_2 = parseInt(coordY_2, 10) + parseInt(rad2, 10);

                        ctx.moveTo(coordX_1 , coordY_1);
                        ctx.lineTo(coordX_2, coordY_2);
                        ctx.lineWidth = node_el[i].edges[j].width;
                        ctx.strokeStyle = node_el[i].edges[j].color;
                        ctx.stroke();
                    }
                    break;
                }
            }
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
        color: "red",
        edges: []
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

function edge_add(element) {
    var elem = {
        id: " ",
        from: " ",
        to: " ",
        width: "3",
        color: "black"
    }

    if (element.id !== undefined) {
        elem.id = String(element.id);
    } else {
        return;
    }
    if (element.from !== undefined) {
        elem.from = String(element.from);
    } else {
        return;
    }
    if (element.to !== undefined) {
        elem.to = String(element.to);
    } else {
        return;
    }
    if (element.width !== undefined)
        elem.width = String(element.width);
    if (element.color !== undefined)
        elem.color = String(element.color);

    let posX_1 = 0;
    let posX_2 = 0;
    let posY_1 = 0;
    let posY_2 = 0;
    let rad_1 = 0;
    let rad_2 = 0;
    edge_el.push(elem);
    for (let i = 0, j = 0; i < node_el.length && j < 2; ++i) {
        if (node_el[i].id === String(elem.from)) {
            node_el[i].edges.push(elem);
            posX_1 = node_el[i].posX;
            posY_1 = node_el[i].posY;
            rad_1 = node_el[i].radius;
            j++;
        } else if (node_el[i].id === String(elem.to)) {
            node_el[i].edges.push(elem);
            posX_2 = node_el[i].posX;
            posY_2 = node_el[i].posY;
            rad_2 = node_el[i].radius;
            j++;
        }

    }
    Draw_graph();
    var example = document.getElementById(elem.id),
    ctx     = example.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(parseInt(posX_1, 10) + parseInt(rad_1, 10), parseInt(posY_1, 10) + parseInt(rad_1, 10));
    ctx.lineTo(parseInt(posX_2, 10) + parseInt(rad_2, 10), parseInt(posY_2, 10) + parseInt(rad_2, 10));
    ctx.lineWidth = elem.width;
    ctx.strokeStyle = elem.color;
    ctx.stroke();
}

function node_remove(id) {
    for (let i = 0; i < node_el.length; ++i) {
        if (node_el[i].id === String(id)) {
            for (let j = 0; j < node_el[i].edges.length; ++j) {
                for (let k = 0; k < edge_el.length; ++k) {
                    let el_id = String(edge_el[k].id);
                    if (node_el[i].edges[j].id === el_id) {
                        for (let l = 0; l < node_el.length; ++l) {
                            for (let n = 0; n < node_el[l].edges.length; ++n) {
                                if (node_el[l].edges[n].id === el_id) {
                                    node_el[l].edges.splice(n, 1);
                                    n--;
                                }
                            }
                        }
                        edge_el.splice(k, 1);
                        k--;
                    }
                }
            }
            node_el.splice(i, 1);
            break;
        }
    }
    Draw_graph();
    return;
}

function edge_remove(id) {
    for (let i = 0; i < node_el.length; ++i) {
        for (let j = 0; j < node_el[i].edges.length; ++j) {
            if (node_el[i].edges[j].id === String(id)) {
                node_el[i].edges.splice(j, 1);
                j--;
            }
        }
    }
    for (let i = 0; i < edge_el.length; ++i) {
        if (edge_el[i].id === String(id)) {
            edge_el.splice(i, 1);
            break;
        }
    }
    Draw_graph();
    return;
}

function graph_destroy() {
    node_el = [];
    edge_el = [];
    Draw_graph();
}

function get_graph() {
    return [node_el, edge_el];
}

function get_nodes() {
    return node_el;
}

function get_edges() {
    return edge_el;
}
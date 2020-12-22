export default class Workflow {
    constructor(container, workflowId, render = null) {
        this.events = {};
        this.container = container;
        this.workflowId = workflowId;
        this.precanvas = null;
        this.nodeId = 1;
        this.ele_selected = null;
        this.node_selected = null;
        this.drag = false;
        this.reroute = false;
        this.reroute_fix_curvature = false;
        this.curvature = 0.5;
        this.reroute_curvature_start_end = 0.5;
        this.reroute_curvature = 0.5;
        this.reroute_width = 6;
        this.drag_point = false;
        this.editor_selected = false;
        this.connection = false;
        this.connection_ele = null;
        this.connection_selected = null;

        // Position
        this.canvas_x = 0;
        this.canvas_y = 0;
        this.pos_x = 0;
        this.pos_x_start = 0;
        this.pos_y = 0;
        this.pos_y_start = 0;
        this.mouse_x = 0;
        this.mouse_y = 0;
        this.line_path = 5;
        this.first_click = null;
        this.force_first_input = false;
        this.draggable_inputs = true;


        this.select_elements = null;
        this.noderegister = {};
        this.render = render;

        // Configurable options
        this.workflow = {
            steps: []
        };


        //config mode
        this.editor_mode = 'edit';
        this.zoom = 1;
        this.zoom_max = 1.6;
        this.zoom_min = 0.5;
        this.zoom_value = 0.1;
        this.zoom_last_value = 1;

        // Mobile
        this.evCache = [];
        this.prevDiff = -1;
    }

    start() {
        console.info("Start workflow!!");
        this.container.classList.add("parent-workflow");
        this.container.tabIndex = 0;
        this.precanvas = document.createElement('div');
        this.precanvas.classList.add("workflow");
        this.container.appendChild(this.precanvas);


        /* Mouse and Touch Actions */

        this.container.addEventListener('mouseup', this.dragEnd.bind(this));
        this.container.addEventListener('mousemove', this.position.bind(this));
        this.container.addEventListener('mousedown', this.click.bind(this));

        this.container.addEventListener('touchend', this.dragEnd.bind(this));
        this.container.addEventListener('touchmove', this.position.bind(this));
        this.container.addEventListener('touchstart', this.click.bind(this));

        /* Context Menu */
        this.container.addEventListener('contextmenu', this.contextmenu.bind(this));
        /* Delete */
        this.container.addEventListener('keydown', this.key.bind(this));

        /* Zoom Mouse */
        this.container.addEventListener('wheel', this.zoom_enter.bind(this));
        /* Update data Nodes */
        this.container.addEventListener('input', this.updateNodeValue.bind(this));

        this.container.addEventListener('dblclick', this.dblclick.bind(this));
        /* Mobile zoom */
        this.container.onpointerdown = this.pointerdown_handler.bind(this);
        this.container.onpointermove = this.pointermove_handler.bind(this);
        this.container.onpointerup = this.pointerup_handler.bind(this);
        this.container.onpointercancel = this.pointerup_handler.bind(this);
        this.container.onpointerout = this.pointerup_handler.bind(this);
        this.container.onpointerleave = this.pointerup_handler.bind(this);

        this.load();
    }

    /* Mobile zoom */
    pointerdown_handler(ev) {
        this.evCache.push(ev);
    }

    pointermove_handler(ev) {
        for (let i = 0; i < this.evCache.length; i++) {
            if (ev.pointerId === this.evCache[i].pointerId) {
                this.evCache[i] = ev;
                break;
            }
        }

        if (this.evCache.length === 2) {
            // Calculate the distance between the two pointers
            let curDiff = Math.abs(this.evCache[0].clientX - this.evCache[1].clientX);

            if (this.prevDiff > 100) {
                if (curDiff > this.prevDiff) {
                    // The distance between the two pointers has increased

                    this.zoom_in();
                }
                if (curDiff < this.prevDiff) {
                    // The distance between the two pointers has decreased
                    this.zoom_out();
                }
            }
            this.prevDiff = curDiff;
        }
    }

    pointerup_handler(ev) {
        this.remove_event(ev);
        if (this.evCache.length < 2) {
            this.prevDiff = -1;
        }
    }

    remove_event(ev) {
        // Remove this event from the target's cache
        for (let i = 0; i < this.evCache.length; i++) {
            if (this.evCache[i].pointerId === ev.pointerId) {
                this.evCache.splice(i, 1);
                break;
            }
        }
    }

    /* End Mobile Zoom */

    load() {
        this.workflow.steps.forEach((item, index, array) => {
            this.addNodeImport(item, this.precanvas);
            this.nodeId+=1;
        });

        this.workflow.steps.forEach((item, index, array) => {
            this.updateConnectionNodes('node-' + item.step_id);
        });
    }


    removeReouteConnectionSelected() {
        if (this.reroute_fix_curvature) {
            this.connection_selected.parentElement.querySelectorAll(".main-path").forEach((item, i) => {
                item.classList.remove("selected");
            });
        }
    }

    click(e) {
        this.dispatch('click', e);
        if (this.editor_mode === 'fixed') {
            //return false;
            if (e.target.classList[0] === 'parent-workflow' || e.target.classList[0] === 'workflow') {
                this.ele_selected = e.target.closest(".parent-workflow");
            } else {
                return false;
            }

        } else {
            this.first_click = e.target;
            this.ele_selected = e.target;
            if (e.button === 0) {
                this.contextmenuDel();
            }

            if (e.target.closest(".workflow_content_node") != null) {
                this.ele_selected = e.target.closest(".workflow_content_node").parentElement;
            }
        }
        switch (this.ele_selected.classList[0]) {
            case 'workflow-node':
                if (this.node_selected != null) {
                    this.node_selected.classList.remove("selected");
                    if (this.node_selected !== this.ele_selected) {
                        this.dispatch('nodeUnselected', true);
                    }
                }
                if (this.connection_selected != null) {
                    this.connection_selected.classList.remove("selected");
                    this.removeReouteConnectionSelected();
                    this.connection_selected = null;
                }
                if (this.node_selected !== this.ele_selected) {
                    this.dispatch('nodeSelected', this.ele_selected.id.slice(5));
                }
                this.node_selected = this.ele_selected;
                this.node_selected.classList.add("selected");
                if (!this.draggable_inputs) {
                    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA' && e.target.hasAttribute('contenteditable') !== true) {
                        this.drag = true;
                    }
                } else {
                    this.drag = true;
                }
                break;
            case 'output':
                this.connection = true;
                if (this.node_selected != null) {
                    this.node_selected.classList.remove("selected");
                    this.node_selected = null;
                    this.dispatch('nodeUnselected', true);
                }
                if (this.connection_selected != null) {
                    this.connection_selected.classList.remove("selected");
                    this.removeReouteConnectionSelected();
                    this.connection_selected = null;
                }
                this.drawConnection(e.target);
                break;
            case 'parent-workflow':
                if (this.node_selected != null) {
                    this.node_selected.classList.remove("selected");
                    this.node_selected = null;
                    this.dispatch('nodeUnselected', true);
                }
                if (this.connection_selected != null) {
                    this.connection_selected.classList.remove("selected");
                    this.removeReouteConnectionSelected();
                    this.connection_selected = null;
                }
                this.editor_selected = true;
                break;
            case 'workflow':
                if (this.node_selected != null) {
                    this.node_selected.classList.remove("selected");
                    this.node_selected = null;
                    this.dispatch('nodeUnselected', true);
                }
                if (this.connection_selected != null) {
                    this.connection_selected.classList.remove("selected");
                    this.removeReouteConnectionSelected();
                    this.connection_selected = null;
                }
                this.editor_selected = true;
                break;
            case 'main-path':
                if (this.node_selected != null) {
                    this.node_selected.classList.remove("selected");
                    this.node_selected = null;
                    this.dispatch('nodeUnselected', true);
                }
                if (this.connection_selected != null) {
                    this.connection_selected.classList.remove("selected");
                    this.removeReouteConnectionSelected();
                    this.connection_selected = null;
                }
                this.connection_selected = this.ele_selected;
                this.connection_selected.classList.add("selected");
                if (this.reroute_fix_curvature) {
                    this.connection_selected.parentElement.querySelectorAll(".main-path").forEach((item, i) => {
                        item.classList.add("selected");
                    });
                }
                break;
            case 'point':
                this.drag_point = true;
                this.ele_selected.classList.add("selected");
                break;
            case 'workflow-delete':
                if (this.node_selected) {
                    this.removeNodeId(this.node_selected.id);
                }

                if (this.connection_selected) {
                    this.removeConnection()
                }

                if (this.node_selected != null) {
                    this.node_selected.classList.remove("selected");
                    this.node_selected = null;
                    this.dispatch('nodeUnselected', true);
                }
                if (this.connection_selected != null) {
                    this.connection_selected.classList.remove("selected");
                    this.removeReouteConnectionSelected();
                    this.connection_selected = null;
                }

                break;
            default:
        }
        if (e.type === "touchstart") {
            this.pos_x = e.touches[0].clientX;
            this.pos_x_start = e.touches[0].clientX;
            this.pos_y = e.touches[0].clientY;
            this.pos_y_start = e.touches[0].clientY;
        } else {
            this.pos_x = e.clientX;
            this.pos_x_start = e.clientX;
            this.pos_y = e.clientY;
            this.pos_y_start = e.clientY;
        }
        this.dispatch('clickEnd', e);
    }

    position(e) {
        let e_pos_x, e_pos_y;
        if (e.type === "touchmove") {
            e_pos_x = e.touches[0].clientX;
            e_pos_y = e.touches[0].clientY;
        } else {
            e_pos_x = e.clientX;
            e_pos_y = e.clientY;
        }


        if (this.connection) {
            this.updateConnection(e_pos_x, e_pos_y);
        }
        if (this.editor_selected) {
            /*if (e.ctrlKey) {
              this.selectElements(e_pos_x, e_pos_y);
            } else { */
            x = this.canvas_x + (-(this.pos_x - e_pos_x))
            y = this.canvas_y + (-(this.pos_y - e_pos_y))
            // console.log(canvas_x +' - ' +pos_x + ' - '+ e_pos_x + ' - ' + x);
            this.dispatch('translate', {x: x, y: y});
            this.precanvas.style.transform = "translate(" + x + "px, " + y + "px) scale(" + this.zoom + ")";
            //}
        }
        if (this.drag) {

            let x = (this.pos_x - e_pos_x) * this.precanvas.clientWidth / (this.precanvas.clientWidth * this.zoom);
            let y = (this.pos_y - e_pos_y) * this.precanvas.clientHeight / (this.precanvas.clientHeight * this.zoom);
            this.pos_x = e_pos_x;
            this.pos_y = e_pos_y;

            this.ele_selected.style.top = (this.ele_selected.offsetTop - y) + "px";
            this.ele_selected.style.left = (this.ele_selected.offsetLeft - x) + "px";
            let nodeIndex = this.workflow.steps.findIndex(step => step.step_id === parseInt(this.ele_selected.id.slice(5)));
            if (nodeIndex !== -1) {
                this.workflow.steps[nodeIndex].pos_x = (this.ele_selected.offsetLeft - x);
                this.workflow.steps[nodeIndex].pos_y = (this.ele_selected.offsetTop - y);
            }

            this.updateConnectionNodes(this.ele_selected.id)
        }

        if (this.drag_point) {

            var x = (this.pos_x - e_pos_x) * this.precanvas.clientWidth / (this.precanvas.clientWidth * this.zoom);
            var y = (this.pos_y - e_pos_y) * this.precanvas.clientHeight / (this.precanvas.clientHeight * this.zoom);
            this.pos_x = e_pos_x;
            this.pos_y = e_pos_y;

            var pos_x = this.pos_x * (this.precanvas.clientWidth / (this.precanvas.clientWidth * this.zoom)) - (this.precanvas.getBoundingClientRect().x * (this.precanvas.clientWidth / (this.precanvas.clientWidth * this.zoom)));
            var pos_y = this.pos_y * (this.precanvas.clientHeight / (this.precanvas.clientHeight * this.zoom)) - (this.precanvas.getBoundingClientRect().y * (this.precanvas.clientHeight / (this.precanvas.clientHeight * this.zoom)));


            this.ele_selected.setAttributeNS(null, 'cx', pos_x);
            this.ele_selected.setAttributeNS(null, 'cy', pos_y);

            const nodeUpdate = this.ele_selected.parentElement.classList[2].slice(9)
            const nodeUpdateIn = this.ele_selected.parentElement.classList[1].slice(13);
            const output_class = this.ele_selected.parentElement.classList[3];
            const input_class = this.ele_selected.parentElement.classList[4];

            let numberPointPosition = Array.from(this.ele_selected.parentElement.children).indexOf(this.ele_selected) - 1;

            if (this.reroute_fix_curvature) {
                const numberMainPath = this.ele_selected.parentElement.querySelectorAll(".main-path").length - 1

                numberPointPosition -= numberMainPath;
                if (numberPointPosition < 0) {
                    numberPointPosition = 0;
                }
            }

            const nodeId = nodeUpdate.slice(5);
            const searchConnection = this.workflow.workflow[this.module].steps[nodeId].outputs[output_class].connections.findIndex(function (item, i) {
                return item.node === nodeUpdateIn && item.output === input_class;
            });

            this.workflow.workflow[this.module].steps[nodeId].outputs[output_class].connections[searchConnection].points[numberPointPosition] = {
                pos_x: pos_x,
                pos_y: pos_y
            };

            const parentSelected = this.ele_selected.parentElement.classList[2].slice(9);

            /*this.workflow.workflow[this.module].data[this.ele_selected.id.slice(5)].pos_x = (this.ele_selected.offsetLeft - x);
            this.workflow.workflow[this.module].data[this.ele_selected.id.slice(5)].pos_y = (this.ele_selected.offsetTop - y);
            */
            this.updateConnectionNodes(parentSelected);
        }

        if (e.type === "touchmove") {
            this.mouse_x = e_pos_x;
            this.mouse_y = e_pos_y;
        }
        this.dispatch('mouseMove', {x: e_pos_x, y: e_pos_y});
    }

    dragEnd(e) {
        let e_pos_x, e_pos_y, ele_last, input_id, input_class;

        if (this.select_elements != null) {
            this.select_elements.remove();
            this.select_elements = null;
        }

        if (e.type === "touchend") {
            e_pos_x = this.mouse_x;
            e_pos_y = this.mouse_y;
            ele_last = document.elementFromPoint(e_pos_x, e_pos_y);
        } else {
            e_pos_x = e.clientX;
            e_pos_y = e.clientY;
            ele_last = e.target;
        }

        if (this.drag) {
            if (this.pos_x_start !== e_pos_x || this.pos_y_start !== e_pos_y) {
                this.dispatch('nodeMoved', this.ele_selected.id.slice(5));
            }
        }

        if (this.drag_point) {
            this.ele_selected.classList.remove("selected");
        }

        if (this.editor_selected) {
            this.canvas_x = this.canvas_x + (-(this.pos_x - e_pos_x));
            this.canvas_y = this.canvas_y + (-(this.pos_y - e_pos_y));
            this.editor_selected = false;
        }
        if (this.connection === true) {
            //console.log(ele_last)
            if (ele_last.classList[0] === 'input' || (this.force_first_input && (ele_last.closest(".workflow_content_node") !== null || ele_last.classList[0] === 'workflow-node'))) {

                if (this.force_first_input && (ele_last.closest(".workflow_content_node") !== null || ele_last.classList[0] === 'workflow-node')) {
                    if (ele_last.closest(".workflow_content_node") != null) {
                        input_id = ele_last.closest(".workflow_content_node").parentElement.id;
                    } else {
                        input_id = ele_last.id;
                    }
                    if (Object.keys(this.getNodeFromId(input_id.slice(5)).inputs).length === 0) {
                        input_class = false;
                    } else {
                        input_class = "input_1";
                    }


                } else {
                    // Fix connection;
                    input_id = ele_last.parentElement.parentElement.id;
                    input_class = ele_last.classList[1];
                }
                let output_id = this.ele_selected.parentElement.parentElement.id;
                let output_class = this.ele_selected.classList[1];

                if (output_id !== input_id && input_class !== false) {

                    if (this.container.querySelectorAll('.connection.node_in_' + input_id + '.node_out_' + output_id + '.' + output_class + '.' + input_class).length === 0) {
                        // Connection no exist save connection

                        this.connection_ele.classList.add("node_in_" + input_id);
                        this.connection_ele.classList.add("node_out_" + output_id);
                        this.connection_ele.classList.add(output_class);
                        this.connection_ele.classList.add(input_class);

                        let [action,,status] = output_class.split("_");

                        let id_input = input_id.slice(5);
                        let id_output = output_id.slice(5);

                        let stepIn = this.workflow.steps.findIndex(step => step.step_id === parseInt(id_input));
                        let stepOut = this.workflow.steps.findIndex(step => step.step_id === parseInt(id_output));
                        let portIn = this.workflow.steps[stepIn].inputs.findIndex(step => step.name === input_class);
                        let portOut = this.workflow.steps[stepOut].actions.findIndex(step => step.name === action);

                        this.workflow.steps[stepIn].inputs[portIn]['steps'].push({
                            "step_id": id_output,
                            "output": output_class
                        });
                        this.workflow.steps[stepOut].actions[portOut][status] = id_input;

                        this.updateConnectionNodes('node-' + id_output);
                        this.updateConnectionNodes('node-' + id_input);
                        this.dispatch('connectionCreated', {
                            output_id: id_output,
                            input_id: id_input,
                            output_class: output_class,
                            input_class: input_class
                        });

                    } else {
                        this.connection_ele.remove();
                    }

                    this.connection_ele = null;
                } else {
                    // Connection exists Remove Connection;
                    this.connection_ele.remove();
                    this.connection_ele = null;
                }

            } else {
                // Remove Connection;
                this.connection_ele.remove();
                this.connection_ele = null;
            }
        }

        this.drag = false;
        this.drag_point = false;
        this.connection = false;
        this.ele_selected = null;
        this.editor_selected = false;

    }

    contextmenu(e) {
        this.dispatch('contextmenu', e);
        e.preventDefault();
        if (this.editor_mode === 'fixed') {
            return false;
        }
        if (this.precanvas.getElementsByClassName("workflow-delete").length) {
            this.precanvas.getElementsByClassName("workflow-delete")[0].remove()
        }
        if (this.node_selected || this.connection_selected) {
            let deleteBox = document.createElement('div');
            deleteBox.classList.add("workflow-delete");
            deleteBox.innerHTML = "x";
            if (this.node_selected) {
                this.node_selected.appendChild(deleteBox);

            }
            if (this.connection_selected) {
                deleteBox.style.top = e.clientY * (this.precanvas.clientHeight / (this.precanvas.clientHeight * this.zoom)) - (this.precanvas.getBoundingClientRect().y * (this.precanvas.clientHeight / (this.precanvas.clientHeight * this.zoom))) + "px";
                deleteBox.style.left = e.clientX * (this.precanvas.clientWidth / (this.precanvas.clientWidth * this.zoom)) - (this.precanvas.getBoundingClientRect().x * (this.precanvas.clientWidth / (this.precanvas.clientWidth * this.zoom))) + "px";

                this.precanvas.appendChild(deleteBox);

            }

        }

    }

    contextmenuDel() {
        if (this.precanvas.getElementsByClassName("workflow-delete").length) {
            this.precanvas.getElementsByClassName("workflow-delete")[0].remove()
        }
    }

    key(e) {
        this.dispatch('keydown', e);
        if (this.editor_mode === 'fixed') {
            return false;
        }
        if (e.key === 'Delete' || (e.key === 'Backspace' && e.metaKey)) {
            if (this.node_selected != null) {
                if (this.first_click.tagName !== 'INPUT' && this.first_click.tagName !== 'TEXTAREA' && this.first_click.hasAttribute('contenteditable') !== true) {
                    this.removeNodeId(this.node_selected.id);
                }
            }
            if (this.connection_selected != null) {
                this.removeConnection();
            }
        }
    }

    zoom_enter(event, delta) {
        if (event.ctrlKey) {
            event.preventDefault()
            if (event.deltaY > 0) {
                // Zoom Out
                this.zoom_out();
            } else {
                // Zoom In
                this.zoom_in();
            }
        }
    }

    zoom_refresh() {
        this.dispatch('zoom', this.zoom);
        this.canvas_x = (this.canvas_x / this.zoom_last_value) * this.zoom;
        this.canvas_y = (this.canvas_y / this.zoom_last_value) * this.zoom;
        this.zoom_last_value = this.zoom;
        this.precanvas.style.transform = "translate(" + this.canvas_x + "px, " + this.canvas_y + "px) scale(" + this.zoom + ")";
    }

    zoom_in() {
        if (this.zoom < this.zoom_max) {
            this.zoom += this.zoom_value;
            this.zoom_refresh();
        }
    }

    zoom_out() {
        if (this.zoom > this.zoom_min) {
            this.zoom -= this.zoom_value;
            this.zoom_refresh();
        }
    }

    zoom_reset() {
        if (this.zoom !== 1) {
            this.zoom = 1;
            this.zoom_refresh();
        }
    }

    lock() {
        this.editor_mode = 'fixed';
    }

    unlock() {
        this.editor_mode = 'edit';
    }

    createCurvature(start_pos_x, start_pos_y, end_pos_x, end_pos_y, curvature_value, type) {
        let line_x = start_pos_x;
        let line_y = start_pos_y;
        let x = end_pos_x;
        let y = end_pos_y;
        let curvature = curvature_value;

        // let hx1 = line_x + Math.abs(x - line_x) * curvature;
        // let hx2 = x - Math.abs(x - line_x) * curvature;

        let hx1 = Math.max(line_x + 70,line_x + Math.abs(x - line_x)/2);
        let hx2 = Math.min(x-70,x - Math.abs(x - line_x)/2);
        let mid =line_y - (line_y - y)/2;

        if (line_x > (x+70))
            mid = line_y - Math.abs(line_y - y)/2;

        // return ' M ' + line_x + ' ' + line_y + ' L ' + hx1 + ' ' + line_y + ' ' + hx2 + ' ' + y + ' ' + x + '  ' + y + ' M ' + (x - 11) + ' ' + y + ' L' + (x - 20) + ' ' + (y - 5) + '  L' + (x - 20) + ' ' + (y + 5) + ' Z' + ' M ' + (x - 11) + ' ' + y + ' L' + (x - 20) + ' ' + (y - 3) + '  L' + (x - 20) + ' ' + (y + 3) + ' Z' + ' M ' + (x - 11) + ' ' + y + ' L' + (x - 20) + ' ' + (y - 1) + '  L' + (x - 20) + ' ' + (y + 1) + ' Z';
        // if (!mid)
        //  return ' M '+ line_x +' '+ line_y +' L '+ hx1 +' '+ line_y +' '+ hx2 +' ' + y +' ' + x +'  ' + y;
        // else
         return ' M '+ line_x +' '+ line_y +' L '+ hx1 +' '+ line_y +' '+ hx1 +' ' + mid +' '+ hx2 +' ' + mid +' '+ hx2 +' ' + y +' ' + x +'  ' + y
        +'M '+ (x-11)  + ' ' + y + ' L'+(x-20)+' '+ (y-5)+'  L'+(x-20)+' '+ (y+5)+' Z' +' M '+ (x-11)  + ' ' + y + ' L'+(x-20)+' '+ (y-3)+'  L'+(x-20)+' '+ (y+3)+' Z' +' M '+ (x-11)  + ' ' + y + ' L'+(x-20)+' '+ (y-1)+'  L'+(x-20)+' '+ (y+1)+' Z';
    }

    drawConnection(ele) {
        let connection = document.createElementNS('http://www.w3.org/2000/svg', "svg");
        this.connection_ele = connection;
        let path = document.createElementNS('http://www.w3.org/2000/svg', "path");
        path.classList.add("main-path");
        path.setAttributeNS(null, 'd', '');
        let [_,outputClass] = ele.classList;
        let [,,status] = outputClass.split("_");
        connection.classList.add("connection");
        if (status)
            connection.setAttribute('status',status);
        connection.appendChild(path);
        this.precanvas.appendChild(connection);

    };

    updateConnection(eX, eY) {
        const precanvas = this.precanvas;
        const zoom = this.zoom;
        let precanvasWitdhZoom = precanvas.clientWidth / (precanvas.clientWidth * zoom);
        precanvasWitdhZoom = precanvasWitdhZoom || 0;
        let precanvasHeightZoom = precanvas.clientHeight / (precanvas.clientHeight * zoom);
        precanvasHeightZoom = precanvasHeightZoom || 0;
        var path = this.connection_ele.children[0];

        /*var line_x = this.ele_selected.offsetWidth/2 + this.line_path/2 + this.ele_selected.parentElement.parentElement.offsetLeft + this.ele_selected.offsetLeft;
        var line_y = this.ele_selected.offsetHeight/2 + this.line_path/2 + this.ele_selected.parentElement.parentElement.offsetTop + this.ele_selected.offsetTop;*/

        var line_x = this.ele_selected.offsetWidth / 2 + (this.ele_selected.getBoundingClientRect().x - precanvas.getBoundingClientRect().x) * precanvasWitdhZoom;
        var line_y = this.ele_selected.offsetHeight / 2 + (this.ele_selected.getBoundingClientRect().y - precanvas.getBoundingClientRect().y) * precanvasHeightZoom;

        var x = eX * (this.precanvas.clientWidth / (this.precanvas.clientWidth * this.zoom)) - (this.precanvas.getBoundingClientRect().x * (this.precanvas.clientWidth / (this.precanvas.clientWidth * this.zoom)));
        var y = eY * (this.precanvas.clientHeight / (this.precanvas.clientHeight * this.zoom)) - (this.precanvas.getBoundingClientRect().y * (this.precanvas.clientHeight / (this.precanvas.clientHeight * this.zoom)));

        /*
        var curvature = 0.5;
        var hx1 = line_x + Math.abs(x - line_x) * curvature;
        var hx2 = x - Math.abs(x - line_x) * curvature;
        */

        //path.setAttributeNS(null, 'd', 'M '+ line_x +' '+ line_y +' C '+ hx1 +' '+ line_y +' '+ hx2 +' ' + y +' ' + x +'  ' + y);
        var curvature = this.curvature;
        var lineCurve = this.createCurvature(line_x, line_y, x, y, curvature, 'openclose');
        path.setAttributeNS(null, 'd', lineCurve);

    }

    addConnection(id_output, id_input, output_class, input_class) {
        var nodeOneModule = this.getModuleFromNodeId(id_output);
        var nodeTwoModule = this.getModuleFromNodeId(id_input);
        if (nodeOneModule === nodeTwoModule) {

            var dataNode = this.getNodeFromId(id_output);
            var exist = false;
            for (var checkOutput in dataNode.outputs[output_class].connections) {
                var connectionSearch = dataNode.outputs[output_class].connections[checkOutput]
                if (connectionSearch.node == id_input && connectionSearch.output == input_class) {
                    exist = true;
                }
            }
            // Check connection exist
            if (exist === false) {
                //Create Connection
                this.workflow.workflow[nodeOneModule].steps[id_output].outputs[output_class].connections.push({
                    "node": id_input.toString(),
                    "output": input_class
                });
                this.workflow.workflow[nodeOneModule].steps[id_input].inputs[input_class].connections.push({
                    "node": id_output.toString(),
                    "input": output_class
                });

                if (this.module === nodeOneModule) {
                    //Draw connection
                    var connection = document.createElementNS('http://www.w3.org/2000/svg', "svg");
                    var path = document.createElementNS('http://www.w3.org/2000/svg', "path");
                    path.classList.add("main-path");
                    path.setAttributeNS(null, 'd', '');
                    // path.innerHTML = 'a';
                    connection.classList.add("connection");
                    connection.classList.add("node_in_node-" + id_input);
                    connection.classList.add("node_out_node-" + id_output);
                    connection.classList.add(output_class);
                    connection.classList.add(input_class);
                    connection.appendChild(path);
                    this.precanvas.appendChild(connection);
                    this.updateConnectionNodes('node-' + id_output);
                    this.updateConnectionNodes('node-' + id_input);
                }

                this.dispatch('connectionCreated', {
                    output_id: id_output,
                    input_id: id_input,
                    output_class: output_class,
                    input_class: input_class
                });
            }
        }
    }

    updateConnectionNodes(id) {
        const idSearch = 'node_in_' + id;
        const idSearchOut = 'node_out_' + id;
        var line_path = this.line_path / 2;
        const precanvas = this.precanvas;
        const curvature = this.curvature;
        const createCurvature = this.createCurvature;
        const reroute_curvature = this.reroute_curvature;
        const reroute_curvature_start_end = this.reroute_curvature_start_end;
        const reroute_fix_curvature = this.reroute_fix_curvature;
        const rerouteWidth = this.reroute_width;
        const zoom = this.zoom;
        let precanvasWitdhZoom = precanvas.clientWidth / (precanvas.clientWidth * zoom);
        precanvasWitdhZoom = precanvasWitdhZoom || 0;
        let precanvasHeightZoom = precanvas.clientHeight / (precanvas.clientHeight * zoom);
        precanvasHeightZoom = precanvasHeightZoom || 0;


        const elemsOut = document.getElementsByClassName(idSearchOut);
        Object.keys(elemsOut).forEach((item, index)=>  {
            if (elemsOut[item].querySelector('.point') === null) {

                var elemtsearchId_out = document.getElementById(id);

                var id_search = elemsOut[item].classList[1].replace('node_in_', '');
                var elemtsearchId = document.getElementById(id_search);

                var elemtsearch = elemtsearchId.querySelectorAll('.' + elemsOut[item].classList[4])[0]

                /*var eX = elemtsearch.offsetWidth/2 + line_path + elemtsearch.parentElement.parentElement.offsetLeft + elemtsearch.offsetLeft;
                var eY = elemtsearch.offsetHeight/2 + line_path + elemtsearch.parentElement.parentElement.offsetTop + elemtsearch.offsetTop;*/
                var eX = elemtsearch.offsetWidth / 2 + (elemtsearch.getBoundingClientRect().x - precanvas.getBoundingClientRect().x) * precanvasWitdhZoom;
                var eY = elemtsearch.offsetHeight / 2 + (elemtsearch.getBoundingClientRect().y - precanvas.getBoundingClientRect().y) * precanvasHeightZoom;


                var elemtsearchOut = elemtsearchId_out.querySelectorAll('.' + elemsOut[item].classList[3])[0]
                /*var line_x = elemtsearchId_out.offsetLeft + elemtsearchId_out.querySelectorAll('.'+elemsOut[item].classList[3])[0].offsetLeft + elemtsearchId_out.querySelectorAll('.'+elemsOut[item].classList[3])[0].offsetWidth/2 + line_path;
                var line_y = elemtsearchId_out.offsetTop + elemtsearchId_out.querySelectorAll('.'+elemsOut[item].classList[3])[0].offsetTop + elemtsearchId_out.querySelectorAll('.'+elemsOut[item].classList[3])[0].offsetHeight/2 + line_path;*/
                var line_x = elemtsearchOut.offsetWidth / 2 + (elemtsearchOut.getBoundingClientRect().x - precanvas.getBoundingClientRect().x) * precanvasWitdhZoom;
                var line_y = elemtsearchOut.offsetHeight / 2 + (elemtsearchOut.getBoundingClientRect().y - precanvas.getBoundingClientRect().y) * precanvasHeightZoom;

                var x = eX;
                var y = eY;
                /*
                var curvature = 0.5;
                var hx1 = line_x + Math.abs(x - line_x) * curvature;
                var hx2 = x - Math.abs(x - line_x) * curvature;
                // console.log('M '+ line_x +' '+ line_y +' C '+ hx1 +' '+ line_y +' '+ hx2 +' ' + y +' ' + x +'  ' + y );
                elemsOut[item].children[0].setAttributeNS(null, 'd', 'M '+ line_x +' '+ line_y +' C '+ hx1 +' '+ line_y +' '+ hx2 +' ' + y +' ' + x +'  ' + y );
                */

                const lineCurve = createCurvature(line_x, line_y, x, y, curvature, 'openclose');
                elemsOut[item].children[0].setAttributeNS(null, 'd', lineCurve);
            } else {
                const points = elemsOut[item].querySelectorAll('.point');
                let linecurve = '';
                const reoute_fix = [];
                points.forEach((item, i) => {
                    if (i === 0 && ((points.length - 1) === 0)) {
                        // M line_x line_y C hx1 line_y hx2 y x y
                        var elemtsearchId_out = document.getElementById(id);
                        var elemtsearch = item;

                        var eX = (elemtsearch.getBoundingClientRect().x - precanvas.getBoundingClientRect().x) * precanvasWitdhZoom + rerouteWidth;
                        var eY = (elemtsearch.getBoundingClientRect().y - precanvas.getBoundingClientRect().y) * precanvasHeightZoom + rerouteWidth;

                        /*var line_x = elemtsearchId_out.offsetLeft + elemtsearchId_out.querySelectorAll('.'+item.parentElement.classList[3])[0].offsetLeft + elemtsearchId_out.querySelectorAll('.'+item.parentElement.classList[3])[0].offsetWidth/2 + line_path;
                        var line_y = elemtsearchId_out.offsetTop + elemtsearchId_out.querySelectorAll('.'+item.parentElement.classList[3])[0].offsetTop + elemtsearchId_out.querySelectorAll('.'+item.parentElement.classList[3])[0].offsetHeight/2 + line_path;*/
                        var elemtsearchOut = elemtsearchId_out.querySelectorAll('.' + item.parentElement.classList[3])[0]
                        var line_x = elemtsearchOut.offsetWidth / 2 + (elemtsearchOut.getBoundingClientRect().x - precanvas.getBoundingClientRect().x) * precanvasWitdhZoom;
                        var line_y = elemtsearchOut.offsetHeight / 2 + (elemtsearchOut.getBoundingClientRect().y - precanvas.getBoundingClientRect().y) * precanvasHeightZoom;
                        var x = eX;
                        var y = eY;

                        /*var curvature = 0.5;
                        var hx1 = line_x + Math.abs(x - line_x) * curvature;
                        var hx2 = x - Math.abs(x - line_x) * curvature;
                        linecurve += ' M '+ line_x +' '+ line_y +' C '+ hx1 +' '+ line_y +' '+ hx2 +' ' + y +' ' + x +'  ' + y;*/
                        var lineCurveSearch = createCurvature(line_x, line_y, x, y, reroute_curvature_start_end, 'open');
                        linecurve += lineCurveSearch;
                        reoute_fix.push(lineCurveSearch);

                        //var elemtsearchId_out = document.getElementById(id);
                        var elemtsearchId_out = item;
                        var id_search = item.parentElement.classList[1].replace('node_in_', '');
                        var elemtsearchId = document.getElementById(id_search);
                        var elemtsearch = elemtsearchId.querySelectorAll('.' + item.parentElement.classList[4])[0]


                        /*var eX = elemtsearch.offsetWidth/2 + line_path + elemtsearch.parentElement.parentElement.offsetLeft + elemtsearch.offsetLeft;
                        var eY = elemtsearch.offsetHeight/2 + line_path + elemtsearch.parentElement.parentElement.offsetTop + elemtsearch.offsetTop;*/
                        var elemtsearchIn = elemtsearchId.querySelectorAll('.' + item.parentElement.classList[4])[0]
                        var eX = elemtsearchIn.offsetWidth / 2 + (elemtsearchIn.getBoundingClientRect().x - precanvas.getBoundingClientRect().x) * precanvasWitdhZoom;
                        var eY = elemtsearchIn.offsetHeight / 2 + (elemtsearchIn.getBoundingClientRect().y - precanvas.getBoundingClientRect().y) * precanvasHeightZoom;


                        var line_x = (elemtsearchId_out.getBoundingClientRect().x - precanvas.getBoundingClientRect().x) * precanvasWitdhZoom + rerouteWidth;
                        var line_y = (elemtsearchId_out.getBoundingClientRect().y - precanvas.getBoundingClientRect().y) * precanvasHeightZoom + rerouteWidth;
                        var x = eX;
                        var y = eY;
                        /*
                        var curvature = 0.5;
                        var hx1 = line_x + Math.abs(x - line_x) * curvature;
                        var hx2 = x - Math.abs(x - line_x) * curvature;
                        linecurve += ' M '+ line_x +' '+ line_y +' C '+ hx1 +' '+ line_y +' '+ hx2 +' ' + y +' ' + x +'  ' + y;
                        */
                        var lineCurveSearch = createCurvature(line_x, line_y, x, y, reroute_curvature_start_end, 'close');
                        linecurve += lineCurveSearch;
                        reoute_fix.push(lineCurveSearch);

                    } else if (i === 0) {
                        //console.log("Primero");
                        // M line_x line_y C hx1 line_y hx2 y x y
                        // FIRST
                        var elemtsearchId_out = document.getElementById(id);
                        var elemtsearch = item;

                        var eX = (elemtsearch.getBoundingClientRect().x - precanvas.getBoundingClientRect().x) * precanvasWitdhZoom + rerouteWidth;
                        var eY = (elemtsearch.getBoundingClientRect().y - precanvas.getBoundingClientRect().y) * precanvasHeightZoom + rerouteWidth;

                        /*var line_x = elemtsearchId_out.offsetLeft + elemtsearchId_out.querySelectorAll('.'+item.parentElement.classList[3])[0].offsetLeft + elemtsearchId_out.querySelectorAll('.'+item.parentElement.classList[3])[0].offsetWidth/2 + line_path;
                        var line_y = elemtsearchId_out.offsetTop + elemtsearchId_out.querySelectorAll('.'+item.parentElement.classList[3])[0].offsetTop + elemtsearchId_out.querySelectorAll('.'+item.parentElement.classList[3])[0].offsetHeight/2 + line_path;*/
                        var elemtsearchOut = elemtsearchId_out.querySelectorAll('.' + item.parentElement.classList[3])[0]
                        var line_x = elemtsearchOut.offsetWidth / 2 + (elemtsearchOut.getBoundingClientRect().x - precanvas.getBoundingClientRect().x) * precanvasWitdhZoom;
                        var line_y = elemtsearchOut.offsetHeight / 2 + (elemtsearchOut.getBoundingClientRect().y - precanvas.getBoundingClientRect().y) * precanvasHeightZoom;

                        var x = eX;
                        var y = eY;
                        /*
                        var curvature = 0.5;
                        var hx1 = line_x + Math.abs(x - line_x) * curvature;
                        var hx2 = x - Math.abs(x - line_x) * curvature;
                        linecurve += ' M '+ line_x +' '+ line_y +' C '+ hx1 +' '+ line_y +' '+ hx2 +' ' + y +' ' + x +'  ' + y;*/
                        var lineCurveSearch = createCurvature(line_x, line_y, x, y, reroute_curvature_start_end, 'open');
                        linecurve += lineCurveSearch;
                        reoute_fix.push(lineCurveSearch);

                        // SECOND
                        var elemtsearchId_out = item;
                        var elemtsearch = points[i + 1];

                        var eX = (elemtsearch.getBoundingClientRect().x - precanvas.getBoundingClientRect().x) * precanvasWitdhZoom + rerouteWidth;
                        var eY = (elemtsearch.getBoundingClientRect().y - precanvas.getBoundingClientRect().y) * precanvasHeightZoom + rerouteWidth;
                        var line_x = (elemtsearchId_out.getBoundingClientRect().x - precanvas.getBoundingClientRect().x) * precanvasWitdhZoom + rerouteWidth;
                        var line_y = (elemtsearchId_out.getBoundingClientRect().y - precanvas.getBoundingClientRect().y) * precanvasHeightZoom + rerouteWidth;
                        var x = eX;
                        var y = eY;
                        /*
                        var curvature = reroute_curvature;
                        var hx1 = line_x + Math.abs(x - line_x) * curvature;
                        var hx2 = x - Math.abs(x - line_x) * curvature;
                        linecurve += ' M '+ line_x +' '+ line_y +' C '+ hx1 +' '+ line_y +' '+ hx2 +' ' + y +' ' + x +'  ' + y;*/
                        var lineCurveSearch = createCurvature(line_x, line_y, x, y, reroute_curvature, 'other');
                        linecurve += lineCurveSearch;
                        reoute_fix.push(lineCurveSearch);


                    } else if (i === (points.length - 1)) {
                        //console.log("Final");
                        var elemtsearchId_out = item;

                        var id_search = item.parentElement.classList[1].replace('node_in_', '');
                        var elemtsearchId = document.getElementById(id_search);
                        var elemtsearch = elemtsearchId.querySelectorAll('.' + item.parentElement.classList[4])[0]

                        /*var eX = elemtsearch.offsetWidth/2 + line_path + elemtsearch.parentElement.parentElement.offsetLeft + elemtsearch.offsetLeft;
                        var eY = elemtsearch.offsetHeight/2 + line_path + elemtsearch.parentElement.parentElement.offsetTop + elemtsearch.offsetTop;*/
                        var elemtsearchIn = elemtsearchId.querySelectorAll('.' + item.parentElement.classList[4])[0]
                        var eX = elemtsearchIn.offsetWidth / 2 + (elemtsearchIn.getBoundingClientRect().x - precanvas.getBoundingClientRect().x) * precanvasWitdhZoom;
                        var eY = elemtsearchIn.offsetHeight / 2 + (elemtsearchIn.getBoundingClientRect().y - precanvas.getBoundingClientRect().y) * precanvasHeightZoom;
                        var line_x = (elemtsearchId_out.getBoundingClientRect().x - precanvas.getBoundingClientRect().x) * (precanvas.clientWidth / (precanvas.clientWidth * zoom)) + rerouteWidth;
                        var line_y = (elemtsearchId_out.getBoundingClientRect().y - precanvas.getBoundingClientRect().y) * (precanvas.clientHeight / (precanvas.clientHeight * zoom)) + rerouteWidth;
                        var x = eX;
                        var y = eY;

                        /*
                        var curvature = 0.5;
                        var hx1 = line_x + Math.abs(x - line_x) * curvature;
                        var hx2 = x - Math.abs(x - line_x) * curvature;
                        linecurve += ' M '+ line_x +' '+ line_y +' C '+ hx1 +' '+ line_y +' '+ hx2 +' ' + y +' ' + x +'  ' + y;*/
                        var lineCurveSearch = createCurvature(line_x, line_y, x, y, reroute_curvature_start_end, 'close');
                        linecurve += lineCurveSearch;
                        reoute_fix.push(lineCurveSearch);

                    } else {
                        var elemtsearchId_out = item;
                        var elemtsearch = points[i + 1];

                        var eX = (elemtsearch.getBoundingClientRect().x - precanvas.getBoundingClientRect().x) * (precanvas.clientWidth / (precanvas.clientWidth * zoom)) + rerouteWidth;
                        var eY = (elemtsearch.getBoundingClientRect().y - precanvas.getBoundingClientRect().y) * (precanvas.clientHeight / (precanvas.clientHeight * zoom)) + rerouteWidth;
                        var line_x = (elemtsearchId_out.getBoundingClientRect().x - precanvas.getBoundingClientRect().x) * (precanvas.clientWidth / (precanvas.clientWidth * zoom)) + rerouteWidth;
                        var line_y = (elemtsearchId_out.getBoundingClientRect().y - precanvas.getBoundingClientRect().y) * (precanvas.clientHeight / (precanvas.clientHeight * zoom)) + rerouteWidth;
                        var x = eX;
                        var y = eY;
                        /*
                        var curvature = reroute_curvature;
                        var hx1 = line_x + Math.abs(x - line_x) * curvature;
                        var hx2 = x - Math.abs(x - line_x) * curvature;
                        linecurve += ' M '+ line_x +' '+ line_y +' C '+ hx1 +' '+ line_y +' '+ hx2 +' ' + y +' ' + x +'  ' + y;*/
                        var lineCurveSearch = createCurvature(line_x, line_y, x, y, reroute_curvature, 'other');
                        linecurve += lineCurveSearch;
                        reoute_fix.push(lineCurveSearch);
                    }

                });
                if (reroute_fix_curvature) {
                    reoute_fix.forEach((itempath, i) => {
                        elemsOut[item].children[i].setAttributeNS(null, 'd', itempath);
                    });

                } else {
                    elemsOut[item].children[0].setAttributeNS(null, 'd', linecurve);
                }

            }
        })

        const elems = document.getElementsByClassName(idSearch);
        Object.keys(elems).forEach( (item, index) => {
            // console.log("In")
            if (elems[item].querySelector('.point') === null) {
                var elemtsearchId_in = document.getElementById(id);

                var id_search = elems[item].classList[2].replace('node_out_', '');
                var elemtsearchId = document.getElementById(id_search);
                var elemtsearch = elemtsearchId.querySelectorAll('.' + elems[item].classList[3])[0]

                /*var line_x = elemtsearch.offsetWidth/2 + line_path + elemtsearch.parentElement.parentElement.offsetLeft + elemtsearch.offsetLeft;
                var line_y = elemtsearch.offsetHeight/2 + line_path + elemtsearch.parentElement.parentElement.offsetTop + elemtsearch.offsetTop;*/

                var line_x = elemtsearch.offsetWidth / 2 + (elemtsearch.getBoundingClientRect().x - precanvas.getBoundingClientRect().x) * precanvasWitdhZoom;
                var line_y = elemtsearch.offsetHeight / 2 + (elemtsearch.getBoundingClientRect().y - precanvas.getBoundingClientRect().y) * precanvasHeightZoom;


                /*var x = elemtsearchId_in.offsetLeft + elemtsearchId_in.querySelectorAll('.'+elems[item].classList[4])[0].offsetLeft + elemtsearchId_in.querySelectorAll('.'+elems[item].classList[4])[0].offsetWidth/2 + line_path;
                var y = elemtsearchId_in.offsetTop + elemtsearchId_in.querySelectorAll('.'+elems[item].classList[4])[0].offsetTop + elemtsearchId_in.querySelectorAll('.'+elems[item].classList[4])[0].offsetHeight/2 + line_path;*/
                var elemtsearchId_in = elemtsearchId_in.querySelectorAll('.' + elems[item].classList[4])[0]
                var x = elemtsearchId_in.offsetWidth / 2 + (elemtsearchId_in.getBoundingClientRect().x - precanvas.getBoundingClientRect().x) * precanvasWitdhZoom;
                var y = elemtsearchId_in.offsetHeight / 2 + (elemtsearchId_in.getBoundingClientRect().y - precanvas.getBoundingClientRect().y) * precanvasHeightZoom;

                /*
                var curvature = 0.5;
                var hx1 = line_x + Math.abs(x - line_x) * curvature;
                var hx2 = x - Math.abs(x - line_x) * curvature;
                // console.log('M '+ line_x +' '+ line_y +' C '+ hx1 +' '+ line_y +' '+ hx2 +' ' + y +' ' + x +'  ' + y );
                elems[item].children[0].setAttributeNS(null, 'd', 'M '+ line_x +' '+ line_y +' C '+ hx1 +' '+ line_y +' '+ hx2 +' ' + y +' ' + x +'  ' + y );*/
                const lineCurve = createCurvature(line_x, line_y, x, y, curvature, 'openclose');
                elems[item].children[0].setAttributeNS(null, 'd', lineCurve);

            } else {
                const points = elems[item].querySelectorAll('.point');
                let linecurve = '';
                const reoute_fix = [];
                points.forEach((item, i) => {
                    if (i === 0 && ((points.length - 1) === 0)) {
                        // M line_x line_y C hx1 line_y hx2 y x y
                        var elemtsearchId_out = document.getElementById(id);
                        var elemtsearch = item;

                        var line_x = (elemtsearch.getBoundingClientRect().x - precanvas.getBoundingClientRect().x) * precanvasWitdhZoom + rerouteWidth;
                        var line_y = (elemtsearch.getBoundingClientRect().y - precanvas.getBoundingClientRect().y) * precanvasHeightZoom + rerouteWidth;


                        var elemtsearchIn = elemtsearchId_out.querySelectorAll('.' + item.parentElement.classList[4])[0]
                        var eX = elemtsearchIn.offsetWidth / 2 + (elemtsearchIn.getBoundingClientRect().x - precanvas.getBoundingClientRect().x) * precanvasWitdhZoom;
                        var eY = elemtsearchIn.offsetHeight / 2 + (elemtsearchIn.getBoundingClientRect().y - precanvas.getBoundingClientRect().y) * precanvasHeightZoom;

                        /*var eX = elemtsearchId_out.offsetLeft + elemtsearchId_out.querySelectorAll('.'+item.parentElement.classList[4])[0].offsetLeft + elemtsearchId_out.querySelectorAll('.'+item.parentElement.classList[4])[0].offsetWidth/2 + line_path;
                        var eY = elemtsearchId_out.offsetTop + elemtsearchId_out.querySelectorAll('.'+item.parentElement.classList[4])[0].offsetTop + elemtsearchId_out.querySelectorAll('.'+item.parentElement.classList[4])[0].offsetHeight/2 + line_path;*/

                        var x = eX;
                        var y = eY;
                        /*
                        var curvature = 0.5;
                        var hx1 = line_x + Math.abs(x - line_x) * curvature;
                        var hx2 = x - Math.abs(x - line_x) * curvature;
                        linecurve += ' M '+ line_x +' '+ line_y +' C '+ hx1 +' '+ line_y +' '+ hx2 +' ' + y +' ' + x +'  ' + y;*/
                        var lineCurveSearch = createCurvature(line_x, line_y, x, y, reroute_curvature_start_end, 'close');
                        linecurve += lineCurveSearch;
                        reoute_fix.push(lineCurveSearch);

                        //var elemtsearchId_out = document.getElementById(id);
                        var elemtsearchId_out = item;

                        var id_search = item.parentElement.classList[2].replace('node_out_', '');
                        var elemtsearchId = document.getElementById(id_search);
                        var elemtsearch = elemtsearchId.querySelectorAll('.' + item.parentElement.classList[3])[0]

                        /*var line_x = elemtsearch.offsetWidth/2 + line_path + elemtsearch.parentElement.parentElement.offsetLeft + elemtsearch.offsetLeft;
                        var line_y = elemtsearch.offsetHeight/2 + line_path + elemtsearch.parentElement.parentElement.offsetTop + elemtsearch.offsetTop;*/
                        var elemtsearchOut = elemtsearchId.querySelectorAll('.' + item.parentElement.classList[3])[0]
                        var line_x = elemtsearchOut.offsetWidth / 2 + (elemtsearchOut.getBoundingClientRect().x - precanvas.getBoundingClientRect().x) * precanvasWitdhZoom;
                        var line_y = elemtsearchOut.offsetHeight / 2 + (elemtsearchOut.getBoundingClientRect().y - precanvas.getBoundingClientRect().y) * precanvasHeightZoom;

                        var eX = (elemtsearchId_out.getBoundingClientRect().x - precanvas.getBoundingClientRect().x) * precanvasWitdhZoom + rerouteWidth;
                        var eY = (elemtsearchId_out.getBoundingClientRect().y - precanvas.getBoundingClientRect().y) * precanvasHeightZoom + rerouteWidth;
                        var x = eX;
                        var y = eY;
                        /*
                        var curvature = 0.5;
                        var hx1 = line_x + Math.abs(x - line_x) * curvature;
                        var hx2 = x - Math.abs(x - line_x) * curvature;
                        linecurve += ' M '+ line_x +' '+ line_y +' C '+ hx1 +' '+ line_y +' '+ hx2 +' ' + y +' ' + x +'  ' + y;*/
                        var lineCurveSearch = createCurvature(line_x, line_y, x, y, reroute_curvature_start_end, 'open');
                        linecurve += lineCurveSearch;
                        reoute_fix.push(lineCurveSearch);


                    } else if (i === 0) {
                        // M line_x line_y C hx1 line_y hx2 y x y
                        // FIRST
                        var elemtsearchId_out = item;
                        var id_search = item.parentElement.classList[2].replace('node_out_', '');
                        var elemtsearchId = document.getElementById(id_search);
                        var elemtsearch = elemtsearchId.querySelectorAll('.' + item.parentElement.classList[3])[0]

                        /*var line_x = elemtsearch.offsetWidth/2 + line_path + elemtsearch.parentElement.parentElement.offsetLeft + elemtsearch.offsetLeft;
                        var line_y = elemtsearch.offsetHeight/2 + line_path + elemtsearch.parentElement.parentElement.offsetTop + elemtsearch.offsetTop;*/
                        var elemtsearchOut = elemtsearchId.querySelectorAll('.' + item.parentElement.classList[3])[0]
                        var line_x = elemtsearchOut.offsetWidth / 2 + (elemtsearchOut.getBoundingClientRect().x - precanvas.getBoundingClientRect().x) * precanvasWitdhZoom;
                        var line_y = elemtsearchOut.offsetHeight / 2 + (elemtsearchOut.getBoundingClientRect().y - precanvas.getBoundingClientRect().y) * precanvasHeightZoom;

                        var eX = (elemtsearchId_out.getBoundingClientRect().x - precanvas.getBoundingClientRect().x) * precanvasWitdhZoom + rerouteWidth;
                        var eY = (elemtsearchId_out.getBoundingClientRect().y - precanvas.getBoundingClientRect().y) * precanvasHeightZoom + rerouteWidth;
                        var x = eX;
                        var y = eY;
                        /*
                        var curvature = 0.5;
                        var hx1 = line_x + Math.abs(x - line_x) * curvature;
                        var hx2 = x - Math.abs(x - line_x) * curvature;
                        linecurve += ' M '+ line_x +' '+ line_y +' C '+ hx1 +' '+ line_y +' '+ hx2 +' ' + y +' ' + x +'  ' + y;*/
                        var lineCurveSearch = createCurvature(line_x, line_y, x, y, reroute_curvature_start_end, 'open');
                        linecurve += lineCurveSearch;
                        reoute_fix.push(lineCurveSearch);

                        // SECOND
                        var elemtsearchId_out = item;
                        var elemtsearch = points[i + 1];

                        var eX = (elemtsearch.getBoundingClientRect().x - precanvas.getBoundingClientRect().x) * precanvasWitdhZoom + rerouteWidth;
                        var eY = (elemtsearch.getBoundingClientRect().y - precanvas.getBoundingClientRect().y) * precanvasHeightZoom + rerouteWidth;
                        var line_x = (elemtsearchId_out.getBoundingClientRect().x - precanvas.getBoundingClientRect().x) * precanvasWitdhZoom + rerouteWidth;
                        var line_y = (elemtsearchId_out.getBoundingClientRect().y - precanvas.getBoundingClientRect().y) * precanvasHeightZoom + rerouteWidth;
                        var x = eX;
                        var y = eY;

                        /*
                        var curvature = reroute_curvature;
                        var hx1 = line_x + Math.abs(x - line_x) * curvature;
                        var hx2 = x - Math.abs(x - line_x) * curvature;
                        linecurve += ' M '+ line_x +' '+ line_y +' C '+ hx1 +' '+ line_y +' '+ hx2 +' ' + y +' ' + x +'  ' + y;*/
                        var lineCurveSearch = createCurvature(line_x, line_y, x, y, reroute_curvature, 'other');
                        linecurve += lineCurveSearch;
                        reoute_fix.push(lineCurveSearch);

                    } else if (i === (points.length - 1)) {

                        var elemtsearchId_out = item;

                        var id_search = item.parentElement.classList[1].replace('node_in_', '');
                        var elemtsearchId = document.getElementById(id_search);
                        var elemtsearch = elemtsearchId.querySelectorAll('.' + item.parentElement.classList[4])[0]

                        /*var eX = elemtsearch.offsetWidth/2 + line_path + elemtsearch.parentElement.parentElement.offsetLeft + elemtsearch.offsetLeft;
                        var eY = elemtsearch.offsetHeight/2 + line_path + elemtsearch.parentElement.parentElement.offsetTop + elemtsearch.offsetTop;*/
                        var elemtsearchIn = elemtsearchId.querySelectorAll('.' + item.parentElement.classList[4])[0]
                        var eX = elemtsearchIn.offsetWidth / 2 + (elemtsearchIn.getBoundingClientRect().x - precanvas.getBoundingClientRect().x) * precanvasWitdhZoom;
                        var eY = elemtsearchIn.offsetHeight / 2 + (elemtsearchIn.getBoundingClientRect().y - precanvas.getBoundingClientRect().y) * precanvasHeightZoom;

                        var line_x = (elemtsearchId_out.getBoundingClientRect().x - precanvas.getBoundingClientRect().x) * precanvasWitdhZoom + rerouteWidth;
                        var line_y = (elemtsearchId_out.getBoundingClientRect().y - precanvas.getBoundingClientRect().y) * precanvasHeightZoom + rerouteWidth;
                        var x = eX;
                        var y = eY;
                        /*
                        var curvature = 0.5;
                        var hx1 = line_x + Math.abs(x - line_x) * curvature;
                        var hx2 = x - Math.abs(x - line_x) * curvature;
                        linecurve += ' M '+ line_x +' '+ line_y +' C '+ hx1 +' '+ line_y +' '+ hx2 +' ' + y +' ' + x +'  ' + y;*/
                        var lineCurveSearch = createCurvature(line_x, line_y, x, y, reroute_curvature_start_end, 'close');
                        linecurve += lineCurveSearch;
                        reoute_fix.push(lineCurveSearch);

                    } else {

                        var elemtsearchId_out = item;
                        var elemtsearch = points[i + 1];

                        var eX = (elemtsearch.getBoundingClientRect().x - precanvas.getBoundingClientRect().x) * precanvasWitdhZoom + rerouteWidth;
                        var eY = (elemtsearch.getBoundingClientRect().y - precanvas.getBoundingClientRect().y) * precanvasHeightZoom + rerouteWidth;
                        var line_x = (elemtsearchId_out.getBoundingClientRect().x - precanvas.getBoundingClientRect().x) * precanvasWitdhZoom + rerouteWidth;
                        var line_y = (elemtsearchId_out.getBoundingClientRect().y - precanvas.getBoundingClientRect().y) * precanvasHeightZoom + rerouteWidth;
                        var x = eX;
                        var y = eY;
                        /*
                        var curvature = reroute_curvature;
                        var hx1 = line_x + Math.abs(x - line_x) * curvature;
                        var hx2 = x - Math.abs(x - line_x) * curvature;
                        linecurve += ' M '+ line_x +' '+ line_y +' C '+ hx1 +' '+ line_y +' '+ hx2 +' ' + y +' ' + x +'  ' + y;
                        */
                        var lineCurveSearch = createCurvature(line_x, line_y, x, y, reroute_curvature, 'other');
                        linecurve += lineCurveSearch;
                        reoute_fix.push(lineCurveSearch);
                    }

                });
                if (reroute_fix_curvature) {
                    reoute_fix.forEach((itempath, i) => {
                        elems[item].children[i].setAttributeNS(null, 'd', itempath);
                    });

                } else {
                    elems[item].children[0].setAttributeNS(null, 'd', linecurve);
                }

            }
        })
    }


    dblclick(e) {
        if (this.connection_selected != null && this.reroute) {
            this.createReroutePoint(this.connection_selected);
        }

        if (e.target.classList[0] === 'point') {
            this.removeReroutePoint(e.target);
        }
    }

    createReroutePoint(ele) {
        this.connection_selected.classList.remove("selected");
        const nodeUpdate = this.connection_selected.parentElement.classList[2].slice(9);
        const nodeUpdateIn = this.connection_selected.parentElement.classList[1].slice(13);
        const output_class = this.connection_selected.parentElement.classList[3];
        const input_class = this.connection_selected.parentElement.classList[4];
        this.connection_selected = null;
        const point = document.createElementNS('http://www.w3.org/2000/svg', "circle");
        point.classList.add("point");
        var pos_x = this.pos_x * (this.precanvas.clientWidth / (this.precanvas.clientWidth * this.zoom)) - (this.precanvas.getBoundingClientRect().x * (this.precanvas.clientWidth / (this.precanvas.clientWidth * this.zoom)));
        var pos_y = this.pos_y * (this.precanvas.clientHeight / (this.precanvas.clientHeight * this.zoom)) - (this.precanvas.getBoundingClientRect().y * (this.precanvas.clientHeight / (this.precanvas.clientHeight * this.zoom)));

        point.setAttributeNS(null, 'cx', pos_x);
        point.setAttributeNS(null, 'cy', pos_y);
        point.setAttributeNS(null, 'r', this.reroute_width);

        let position_add_array_point = 0;
        if (this.reroute_fix_curvature) {

            const numberPoints = ele.parentElement.querySelectorAll(".main-path").length;
            var path = document.createElementNS('http://www.w3.org/2000/svg', "path");
            path.classList.add("main-path");
            path.setAttributeNS(null, 'd', '');

            ele.parentElement.insertBefore(path, ele.parentElement.children[numberPoints]);
            if (numberPoints === 1) {
                ele.parentElement.appendChild(point);
            } else {
                const search_point = Array.from(ele.parentElement.children).indexOf(ele)
                position_add_array_point = search_point;
                ele.parentElement.insertBefore(point, ele.parentElement.children[search_point + numberPoints + 1]);
            }


        } else {
            ele.parentElement.appendChild(point);
        }


        const nodeId = nodeUpdate.slice(5);
        const searchConnection = this.workflow.workflow[this.module].steps[nodeId].outputs[output_class].connections.findIndex(function (item, i) {
            return item.node === nodeUpdateIn && item.output === input_class;
        });

        if (this.workflow.workflow[this.module].steps[nodeId].outputs[output_class].connections[searchConnection].points === undefined) {
            this.workflow.workflow[this.module].steps[nodeId].outputs[output_class].connections[searchConnection].points = [];
        }
        //this.workflow.workflow[this.module].steps[nodeId].outputs[output_class].connections[searchConnection].points.push({ pos_x: pos_x, pos_y: pos_y });


        if (this.reroute_fix_curvature) {
            //console.log(position_add_array_point)
            if (position_add_array_point > 0) {
                this.workflow.workflow[this.module].steps[nodeId].outputs[output_class].connections[searchConnection].points.splice(position_add_array_point, 0, {
                    pos_x: pos_x,
                    pos_y: pos_y
                });
            } else {
                this.workflow.workflow[this.module].steps[nodeId].outputs[output_class].connections[searchConnection].points.push({
                    pos_x: pos_x,
                    pos_y: pos_y
                });
            }

            ele.parentElement.querySelectorAll(".main-path").forEach((item, i) => {
                item.classList.remove("selected");
            });

        } else {
            this.workflow.workflow[this.module].steps[nodeId].outputs[output_class].connections[searchConnection].points.push({
                pos_x: pos_x,
                pos_y: pos_y
            });
        }


        /*
        this.workflow.workflow[this.module].steps[nodeId].outputs[output_class].connections[searchConnection].points.sort((a,b) => (a.pos_x > b.pos_x) ? 1 : (b.pos_x > a.pos_x ) ? -1 : 0 );
        this.workflow.workflow[this.module].steps[nodeId].outputs[output_class].connections[searchConnection].points.forEach((item, i) => {
            ele.parentElement.children[i+1].setAttributeNS(null, 'cx', item.pos_x);
            ele.parentElement.children[i+1].setAttributeNS(null, 'cy', item.pos_y);
        });*/

        this.dispatch('addReroute', nodeId);
        this.updateConnectionNodes(nodeUpdate);
    }

    removeReroutePoint(ele) {
        const nodeUpdate = ele.parentElement.classList[2].slice(9)
        const nodeUpdateIn = ele.parentElement.classList[1].slice(13);
        const output_class = ele.parentElement.classList[3];
        const input_class = ele.parentElement.classList[4];


        let numberPointPosition = Array.from(ele.parentElement.children).indexOf(ele) - 1;

        const nodeId = nodeUpdate.slice(5);
        const searchConnection = this.workflow.workflow[this.module].steps[nodeId].outputs[output_class].connections.findIndex(function (item, i) {
            return item.node === nodeUpdateIn && item.output === input_class;
        });

        if (this.reroute_fix_curvature) {

            const numberMainPath = ele.parentElement.querySelectorAll(".main-path").length
            ele.parentElement.children[numberMainPath - 1].remove();
            numberPointPosition -= numberMainPath;
            if (numberPointPosition < 0) {
                numberPointPosition = 0;
            }
        }
        //console.log(numberPointPosition);
        this.workflow.workflow[this.module].steps[nodeId].outputs[output_class].connections[searchConnection].points.splice(numberPointPosition, 1);

        ele.remove();
        this.dispatch('removeReroute', nodeId);
        this.updateConnectionNodes(nodeUpdate);

    }

    registerNode(name, html, props = null, options = null) {
        this.noderegister[name] = {html: html, props: props, options: options};
    }

    getNodeFromId(id) {
        let moduleName = this.getModuleFromNodeId(id)
        return JSON.parse(JSON.stringify(this.workflow.workflow[moduleName].steps[id]));
    }

    getNodesFromName(name) {
        let nodes = [];
        const editor = this.workflow.workflow
        Object.keys(editor).map(function (moduleName, index) {
            for (let node in editor[moduleName].steps) {
                if (editor[moduleName].steps[node].name == name) {
                    nodes.push(editor[moduleName].steps[node].id);
                }
            }
        });
        return nodes;
    }

    addNode(data, ele_pos_x, ele_pos_y, html) {
        let {name = "", description = "", action, target,is_first} = data;

        const parent = document.createElement('div');
        parent.classList.add("parent-node");

        const node = document.createElement('div');
        node.innerHTML = "";
        node.setAttribute("id", "node-" + this.nodeId);
        node.classList.add("workflow-node");

        const inputs = document.createElement('div');
        inputs.classList.add("inputs");
        const outputs = document.createElement('div');
        outputs.classList.add("outputs");

        let jsonInput = [];
        let jsonOutput = [];

        if (action && target) {

            if (!is_first){
                let inputItem = {
                    name:"",
                    steps:[]
                };

                ['default'].forEach(value => {
                    let input = document.createElement('div');
                    input.classList.add("input");
                    input.classList.add(`input_${value}`);
                    inputItem.name = `input_${value}`;
                    inputs.appendChild(input);
                });

                jsonInput.push(inputItem);
            }

            let outputItem = {
                name:action,
                target_type: target
            };

            ['pass', 'reject'].forEach(value => {
                let output = document.createElement('div');
                output.classList.add("output");
                output.classList.add(`${action}_output_${value}`);
                outputItem[value] = null;
                outputs.appendChild(output)
            })

            jsonOutput.push(outputItem)
        }


        const content = document.createElement('div');
        content.classList.add("workflow_content_node");

        content.innerHTML = html;

        node.appendChild(inputs);
        node.appendChild(content);
        node.appendChild(outputs);
        node.style.top = ele_pos_y + "px";
        node.style.left = ele_pos_x + "px";
        parent.appendChild(node);
        this.precanvas.appendChild(parent);

        this.workflow.steps.push({
            step_id: this.nodeId,
            workflow_id: this.workflowId,
            description: description,
            name: name,
            html:html,
            is_first: is_first,
            inputs: jsonInput,
            actions: jsonOutput,
            targets: [
                {
                    id: '',
                    name: '',
                    type: target,
                    action: action
                },
            ],
            pos_x: ele_pos_x,
            pos_y: ele_pos_y,
        });

        this.dispatch('nodeCreated', this.nodeId);

        return ++this.nodeId;
    }

    addNodeImport(dataNode, preCanvas) {
        const parent = document.createElement('div');
        parent.classList.add("parent-node");

        const node = document.createElement('div');
        node.innerHTML = "";
        node.setAttribute("id", "node-" + dataNode.step_id);
        node.classList.add("workflow-node");
        if (dataNode.class !== '') {
            node.classList.add(dataNode.class);
        }

        //input
        const inputs = document.createElement('div');
        inputs.classList.add("inputs");

        if (!dataNode.is_first)
            dataNode.inputs.forEach((input_item, index)=>{
            const input = document.createElement('div');
            input.classList.add("input");
            input.classList.add(input_item.name);
            inputs.appendChild(input);

            input_item['steps'].forEach((output_item, index) => {

                let connection = document.createElementNS('http://www.w3.org/2000/svg', "svg");
                let path = document.createElementNS('http://www.w3.org/2000/svg', "path");
                path.classList.add("main-path");
                path.setAttributeNS(null, 'd', '');
                // path.innerHTML = 'a';
                connection.classList.add("connection");
                connection.classList.add("node_in_node-" + dataNode.step_id);
                connection.classList.add("node_out_node-" + output_item.step_id);
                let [,,status] = output_item.output.split("_");

                connection.classList.add("connection");
                if (status)
                    connection.setAttribute('status',status);

                connection.classList.add(output_item.output);
                connection.classList.add(input_item.name);

                connection.appendChild(path);
                preCanvas.appendChild(connection);

            });
        });

        //output
        const outputs = document.createElement('div');
        outputs.classList.add("outputs");
        dataNode.actions.forEach(action =>{
            ['pass', 'reject'].forEach(value => {
                let output = document.createElement('div');
                output.classList.add("output");
                output.classList.add(`${action.name}_output_${value}`);
                outputs.appendChild(output)
            })
        })

        const content = document.createElement('div');
        content.classList.add("workflow_content_node");
        //content.innerHTML = dataNode.html;

        content.innerHTML = dataNode.html;

        node.appendChild(inputs);
        node.appendChild(content);
        node.appendChild(outputs);
        node.style.top = dataNode.pos_y + "px";
        node.style.left = dataNode.pos_x + "px";
        parent.appendChild(node);
        this.precanvas.appendChild(parent);
    }

    updateNodeValue(event) {
        let attr = event.target.attributes
        for (let i = 0; i < attr.length; i++) {
            if (attr[i].nodeName.startsWith('df-')) {
                this.workflow.steps[event.target.closest(".workflow_content_node").parentElement.id.slice(5)].data[attr[i].nodeName.slice(3)] = event.target.value;
            }

        }
    }


    removeNodeId(id) {
        this.removeConnectionNodeId(id);

        document.getElementById(id).remove();

        this.workflow.steps = this.workflow.steps.filter(step => step.step_id !== parseInt(id.slice(5)));

        this.dispatch('nodeRemoved', id.slice(5));
    }

    removeConnection() {
        if (this.connection_selected != null) {
            let listClass = this.connection_selected.parentElement.classList;
            this.connection_selected.parentElement.remove();
            const [,nodeIn,nodeOut,output_class,input_class] = listClass;

            let [action,,status] = output_class.split("_");

            let id_input = nodeIn.slice(13);
            let id_output = nodeOut.slice(14);

            let stepIn = this.workflow.steps.findIndex(step => step.step_id === parseInt(id_input));
            let stepOut = this.workflow.steps.findIndex(step => step.step_id === parseInt(id_output));
            let portIn = this.workflow.steps[stepIn].inputs.findIndex(step => step.name === input_class);
            let portOut = this.workflow.steps[stepOut].actions.findIndex(step => step.name === action);


            let inputItemIndex = this.workflow.steps[stepIn].inputs[portIn]['steps'].findIndex(item=>{
                return item["step_id"] === id_output && item["output"] === output_class
            });

            this.workflow.steps[stepIn].inputs[portIn]['steps'].splice(inputItemIndex,1);

            this.workflow.steps[stepOut].actions[portOut][status] = null;

            this.dispatch('connectionRemoved', {
                output_id: id_output,
                input_id: id_input,
                output_class: output_class,
                input_class: input_class
            });

            this.connection_selected = null;
        }
    }

    // removeSingleConnection(id_output, id_input, output_class, input_class) {
    //     let nodeOneModule = this.getModuleFromNodeId(id_output);
    //     let nodeTwoModule = this.getModuleFromNodeId(id_input);
    //     if (nodeOneModule === nodeTwoModule) {
    //         // Check nodes in same module.
    //
    //         // Check connection exist
    //         var exists = this.workflow.workflow[nodeOneModule].steps[id_output].outputs[output_class].connections.findIndex(function (item, i) {
    //             return item.node == id_input && item.output === input_class
    //         });
    //         if (exists > -1) {
    //
    //             if (this.module === nodeOneModule) {
    //                 // In same module with view.
    //                 document.querySelector('.connection.node_in_node-' + id_input + '.node_out_node-' + id_output + '.' + output_class + '.' + input_class).remove();
    //             }
    //
    //             var index_out = this.workflow.workflow[nodeOneModule].steps[id_output].outputs[output_class].connections.findIndex(function (item, i) {
    //                 return item.node == id_input && item.output === input_class
    //             });
    //             this.workflow.workflow[nodeOneModule].steps[id_output].outputs[output_class].connections.splice(index_out, 1);
    //
    //             var index_in = this.workflow.workflow[nodeOneModule].steps[id_input].inputs[input_class].connections.findIndex(function (item, i) {
    //                 return item.node == id_output && item.input === output_class
    //             });
    //             this.workflow.workflow[nodeOneModule].steps[id_input].inputs[input_class].connections.splice(index_in, 1);
    //
    //             this.dispatch('connectionRemoved', {
    //                 output_id: id_output,
    //                 input_id: id_input,
    //                 output_class: output_class,
    //                 input_class: input_class
    //             });
    //             return true;
    //
    //         } else {
    //             return false;
    //         }
    //     } else {
    //         return false;
    //     }
    // }

    removeConnectionNodeId(id) {
        const idSearchIn = 'node_in_' + id;
        const idSearchOut = 'node_out_' + id;

        const elemsOut = document.getElementsByClassName(idSearchOut);
        for (let i = elemsOut.length - 1; i >= 0; i--) {
            let listClass = elemsOut[i].classList;

            const [,nodeIn,nodeOut,output_class,input_class] = listClass;

            let [action,,status] = output_class.split("_");

            let id_input = nodeIn.slice(13);
            let id_output = nodeOut.slice(14);

            let stepIn = this.workflow.steps.findIndex(step => step.step_id === parseInt(id_input));
            let stepOut = this.workflow.steps.findIndex(step => step.step_id === parseInt(id_output));
            let portIn = this.workflow.steps[stepIn].inputs.findIndex(step => step.name === input_class);
            let portOut = this.workflow.steps[stepOut].actions.findIndex(step => step.name === action);


            let inputItemIndex = this.workflow.steps[stepIn].inputs[portIn]['steps'].findIndex(item=>{
                return item["step_id"] === id_output && item["output"] === output_class
            });

            this.workflow.steps[stepIn].inputs[portIn]['steps'].splice(inputItemIndex,1);

            this.workflow.steps[stepOut].actions[portOut][status] = null;

            elemsOut[i].remove();

            this.dispatch('connectionRemoved', {
                output_id: nodeOut,
                input_id: nodeIn,
                output_class: output_class,
                input_class: input_class
            });
        }

        const elemsIn = document.getElementsByClassName(idSearchIn);

        for (let i = elemsIn.length - 1; i >= 0; i--) {

            let listClass = elemsIn[i].classList;

            const [,nodeIn,nodeOut,output_class,input_class] = listClass;

            let [action,,status] = output_class.split("_");

            let id_input = nodeIn.slice(13);
            let id_output = nodeOut.slice(14);

            let stepIn = this.workflow.steps.findIndex(step => step.step_id === parseInt(id_input));
            let stepOut = this.workflow.steps.findIndex(step => step.step_id === parseInt(id_output));
            let portIn = this.workflow.steps[stepIn].inputs.findIndex(step => step.name === input_class);
            let portOut = this.workflow.steps[stepOut].actions.findIndex(step => step.name === action);


            let inputItemIndex = this.workflow.steps[stepIn].inputs[portIn]['steps'].findIndex(item=>{
                return item["step_id"] === id_output && item["output"] === output_class
            });

            this.workflow.steps[stepIn].inputs[portIn]['steps'].splice(inputItemIndex,1);

            this.workflow.steps[stepOut].actions[portOut][status] = null;

            elemsIn[i].remove();

            this.dispatch('connectionRemoved', {
                output_id: nodeOut,
                input_id: nodeIn,
                output_class: output_class,
                input_class: input_class
            });
        }
    }

    // getModuleFromNodeId(id) {
    //     var nameModule;
    //     const editor = this.drawflow.drawflow
    //     Object.keys(editor).map(function (moduleName, index) {
    //         Object.keys(editor[moduleName].data).map(function (node, index2) {
    //             if (node == id) {
    //                 nameModule = moduleName;
    //             }
    //         })
    //     });
    //     return nameModule;
    // }


    clear() {
        if (this.precanvas)
            this.precanvas.innerHTML = "";
        this.workflow = {steps: []};
    }

    export() {
        const dataExport = JSON.parse(JSON.stringify(this.workflow));
        this.dispatch('export', dataExport);
        return dataExport;
    }

    import(data) {
        this.clear();
        this.workflow = JSON.parse(JSON.stringify(data));
        this.start();
        this.dispatch('import', 'import');
    }

    /* Events */
    on(event, callback) {
        // Check if the callback is not a function
        if (typeof callback !== 'function') {
            console.error(`The listener callback must be a function, the given type is ${typeof callback}`);
            return false;
        }


        // Check if the event is not a string
        if (typeof event !== 'string') {
            console.error(`The event name must be a string, the given type is ${typeof event}`);
            return false;
        }

        // Check if this event not exists
        if (this.events[event] === undefined) {
            this.events[event] = {
                listeners: []
            }
        }

        this.events[event].listeners.push(callback);
    }

    removeListener(event, callback) {
        // Check if this event not exists
        if (this.events[event] === undefined) {
            //console.error(`This event: ${event} does not exist`);
            return false;
        }

        this.events[event].listeners = this.events[event].listeners.filter(listener => {
            return listener.toString() !== callback.toString();
        });
    }

    dispatch(event, details) {
        // Check if this event not exists
        if (this.events[event] === undefined) {
            // console.error(`This event: ${event} does not exist`);
            return false;
        }

        this.events[event].listeners.forEach((listener) => {
            listener(details);
        });
    }


}
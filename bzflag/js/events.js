// Copyright 2012 United States Government, as represented by the Secretary of Defense, Under
// Secretary of Defense (Personnel & Readiness).
// 
// Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
// in compliance with the License. You may obtain a copy of the License at
// 
//   http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License
// is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
// or implied. See the License for the specific language governing permissions and limitations under
// the License.
var playerNode = undefined;
var playerName = undefined;
var sceneNode = 'index-vwf';

var canvas = $('#' + sceneNode).get(0);
var keyStates = { keysDown: {}, mods: {}, keysUp: {} };
var buttonStates = {left: false, middle: false, right: false};

vwf_view.createdNode = function(nodeID, childID, childExtendsID, childImplementsIDs,
	childSource, childType, childURI, childName, callback /* ( ready ) */ ) {
	if(vwf.client() == vwf.moniker() && nodeID == sceneNode) {
		playerNode = childID;
		playerName = childName;
	}
	else if(vwf.client() == vwf.moniker() && childExtendsID == "http-vwf-example-com-camera-vwf") {
		var glgeCamera = vwf.views[0].state.nodes[ childID ].glgeObject;
		glgeCamera.setAspect(canvas.width / canvas.height);
		vwf.views[0].state.cameraInUse = glgeCamera;
		vwf.views[0].state.cameraInUseID = childID;
		vwf.views[0].state.scenes[sceneNode].glgeScene.setCamera(glgeCamera);
		vwf.views[0].state.scenes[sceneNode].camera.ID = childID;
	}
}

canvas.onmousedown = function(e) {
    if(playerNode) {
        switch( e.button ) {
            case 2: 
                buttonStates.right = true;
                break;
            case 1: 
                buttonStates.middle = true;
                break;
            case 0:
                buttonStates.left = true;
                break;
        };
        var eData = getMouseEventData( e );
        if ( eData ) {
            vwf_view.kernel.dispatchEvent( sceneNode, "pointerDown", [playerName, eData] );
        }
    }
}

canvas.onmouseup = function(e) {
    if(playerNode) {
        switch( e.button ) {
            case 2: 
                buttonStates.right = false;
                break;
            case 1: 
                buttonStates.middle = false;
                break;
            case 0:
                buttonStates.left = false;
                break;
        };

        var eData = getMouseEventData( e );
        if ( eData ) {
            vwf_view.kernel.dispatchEvent( sceneNode, "pointerUp", [playerName, eData] );
        }
    }
}

canvas.onmouseover = undefined;

canvas.onmouseout = undefined;

canvas.onmousemove = function(e) {
    if(playerNode) {
        var eData = getMouseEventData( e, false );
        if ( eData ) {
            vwf_view.kernel.dispatchEvent( sceneNode, "pointerMove", [playerName, eData] );
        }
    }
}

canvas.onmousewheel = undefined;

window.onkeydown = function(e) {
	if(playerNode) {
        var validKey = false;
        var keyAlreadyDown = false;
        switch (e.keyCode) {
            case 17:
            case 16:
            case 18:
            case 19:
            case 20:
                break;
            default:
                keyAlreadyDown = !!keyStates.keysDown[e.keyCode];
                keyStates.keysDown[e.keyCode] = true;
                validKey = true;
                break;
        }

        if (!keyStates.mods) keyStates.mods = {};
        keyStates.mods.alt = e.altKey;
        keyStates.mods.shift = e.shiftKey;
        keyStates.mods.ctrl = e.ctrlKey;
        keyStates.mods.meta = e.metaKey;
        if(!keyAlreadyDown) {
            vwf_view.kernel.dispatchEvent(sceneNode, "keyDown", [playerName, keyStates]);
		}
	}
}

window.onkeyup = function(e) {
	if(playerNode) {
        var validKey = false;
        switch (e.keyCode) {
            case 16:
            case 17:
            case 18:
            case 19:
            case 20:
                break;
            default:
                delete keyStates.keysDown[e.keyCode];
                keyStates.keysUp[e.keyCode] = true;
                validKey = true;
                break;
        }

        keyStates.mods.alt = e.altKey;
        keyStates.mods.shift = e.shiftKey;
        keyStates.mods.ctrl = e.ctrlKey;
        keyStates.mods.meta = e.metaKey;
        vwf_view.kernel.dispatchEvent(sceneNode, "keyUp", [playerName, keyStates]);
        delete keyStates.keysUp[e.keyCode];
	}
}

function getMouseEventData(e) {
    var mouseButton = "left";
    switch( e.button ) {
        case 2: 
            mouseButton = "right";
            break;
        case 1: 
            mouseButton = "middle";
            break;
        default:
            mouseButton = "left";
            break;
    };

    var eventData = {
        button: mouseButton,
        clicks: 1,
        buttons: buttonStates,
        modifiers: {
                alt: e.altKey,
                ctrl: e.ctrlKey,
                shift: e.shiftKey,
                meta: e.metaKey,
            },
        position: [ mouseXPos.call( this,e)/(window.innerWidth - 20), mouseYPos.call( this,e)/(window.innerHeight - 20) ],
        screenPosition: [mouseXPos.call(this,e), mouseYPos.call(this,e)]
    };
    return eventData;
}

function mouseXPos(e) {
    return e.clientX - e.currentTarget.offsetLeft + window.scrollX + window.slideOffset;
}

function mouseYPos(e) {
    return e.clientY - e.currentTarget.offsetTop + window.scrollY;
}

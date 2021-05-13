var transformOnMouseMovePlugin = document.getElementById("ceros-transform-on-mouse-move-plugin");
(function(){
    'use strict';
    require.config({
        paths: {
            CerosSDK: '//sdk.ceros.com/standalone-player-sdk-v5.min'
        }
    });
    require(['CerosSDK'], function (CerosSDK) {
        CerosSDK.findExperience()
            .fail(function (error) {
                console.error(error);
            })
            .done(function (experience) {
                window.myExperience = experience;
                var mouseMoveObjects = experience.findLayersByTag("mouse-move").layers;

                experience.on(CerosSDK.EVENTS.PAGE_CHANGED, pageChangedCallback);
                function pageChangedCallback(){
                    let pageViewportTop = document.querySelector(".page-viewport.top");
                    //making new array of mouseMoveObjects that are on current page 
                    let currentPageMouseMoveObjects = mouseMoveObjects.filter(($object) =>{
                        let $obj = document.getElementById($object.id);
                        if(pageViewportTop.contains($obj)){
                            return $object;
                        }
                    });
                    let mainBody = document.querySelector('body');
                    mainBody.addEventListener('mousemove',function(event){mouseMoveFunction(event, currentPageMouseMoveObjects)});  
                }
            })
    });
})();

var mouseMoveFunction = (e, mouseMoveObj) => {
    for(let i = 0; i<mouseMoveObj.length; i++){
        var mouseMove = document.getElementById(mouseMoveObj[i].id);
        mouseMove.style.setProperty("-webkit-transform-style", "preserve-3d");

        var tags = mouseMoveObj[i].getTags();
        var translateNumbers = [0,0];
        var rotateNumbers = [0,0];
        var translateLetters = [];
        var rotationLetters = [];
        var translateBool = false;
        var rotateBool = false;
        var multiplier = 1;
        var duration = 0;
        var mainFloatNumber = -0.1;

        _.forEach(tags, function(value, key){
            if(value.indexOf("translate:") > -1){
                let trans = value.slice(10,value.length);
                translateLetters = trans.split("&");
                translateBool = true;
            }
            if(value.indexOf("rotate:") > -1){
                let rot = value.slice(7,value.length);
                rotationLetters= rot.split("&");
                rotateBool = true;
            }
            if(value.indexOf("multiplier:") > -1){
                let multi = value.slice(11,value.length);
                multiplier = parseFloat(multi);
            }
            if(value.indexOf("mouse-duration:") > -1){
                let dur = value.slice(9,value.length);
                duration = parseFloat(dur);
            }
        });

        var setProperties = (letters, numbers) => {
            for(let j=0; j<letters.length;j++){
                switch(letters[j]){
                    case "x":
                        numbers[0] = mainFloatNumber;
                        break;
                    case "y":
                        numbers[1] = mainFloatNumber;
                        break;
                }
            }
        }
        setProperties(translateLetters, translateNumbers);
        setProperties(rotationLetters, rotateNumbers);
        
        let moveX=0, moveY=0, moveZ=0;
        let rotateX=0, rotateY=0, rotateZ=0;
        let moves = [moveX, moveY, moveZ];
        let rotates = [rotateX, rotateY, rotateZ];
        if(translateBool == true){
            for(let q=0;q<moves.length;q++){
                if(q==0){
                    moves[q] = (($(window).width()/2-e.clientX)*translateNumbers[q]*multiplier);
                }
                if(q==1){
                    moves[q] = (($(window).height()/2-e.clientY)*translateNumbers[q]*multiplier);
                }
            }
        }
        if(rotateBool == true){
            for(let q=0;q<rotates.length;q++){
                if(q==0){
                    rotates[q] = (($(window).height()/2-e.clientY)*rotateNumbers[q]*multiplier);
                }
                if(q==1){
                    rotates[q] = (($(window).width()/2-e.clientX)*rotateNumbers[q]*multiplier);
                }
            }
        }
        mouseMove.style.transitionDuration = duration +'ms';
        mouseMove.style.transform = 'translate3d(' + moves[0] + 'px,' + moves[1] + 'px, 0px) rotateX(' + rotates[0] + 'deg) rotateY(' + rotates[1] + 'deg) rotateZ(' + rotates[2] + 'deg)';
    }
}

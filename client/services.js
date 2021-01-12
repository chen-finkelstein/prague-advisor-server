angular.module('pragueApp')
    .factory('poiFactory', function() { 

            return function (divID, point) {
                var div = document.createElement("div");
                div.style.position = "relative";
                div.style.float = "left";
                div.style.width = "200px";
                div.style.height = "100%";
                div.style.marginRight = "10px";
                div.style.backgroundColor = "purple";

                var img = document.createElement("IMG");
                div.appendChild(img);
                img.setAttribute("src", point.imagePath);
                img.style.width = "100%";
                img.style.height = "100%";
                img.style.position = "absolute";
                img.style.bottom = "0";
                img.style.borderRadius = "1.5em";


                var div2 = document.createElement("div");
                var title = document.createTextNode(point.name);
                var like = document.createElement("button");
                angular.element(like).addClass('like-button');
                div2.appendChild(title);

                
                div.appendChild(div2);
                div2.style.position = "absolute";
                div2.style.bottom = "0";
                div2.style.padding = "5px";
                div2.style.zIndex = "999";
                div2.style.color = "white";
                div2.style.fontSize = "15px";
                div2.style.fontWeight = "700";
                //div2.style.margin = "3px";
                div2.style.backgroundColor = "black";
                div2.style.opacity = "80%";
                div2.style.width = "calc(100% - 10px)";
                div2.style.borderBottomRightRadius = "1.5em";
                div2.style.borderBottomLeftRadius = "1.5em";
                document.getElementById(divID).appendChild(div);

            };
 
    }); 
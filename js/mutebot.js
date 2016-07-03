var mutebot = (function() {       

    "use strict";

    var mutebot = {};

    mutebot.filters = function() {

        var searchbox = document.getElementsByClassName('s');

        searchbox[0].addEventListener('keyup', function(e) {

            var tableBody = document.getElementsByClassName('tablebody');
            var tableRowsClass = document.getElementsByClassName('tablerow');
            var elements = document.getElementsByClassName('tablerow');

            Array.prototype.forEach.call(elements, function(el, i) {

                var rowText = el.innerHTML.toLowerCase().replace(/<[^>]*>/g, "");
                var inputText = searchbox[0].value.toLowerCase();

                if( rowText.indexOf( inputText ) == -1 ) {                        
                    tableRowsClass[i].style.display = 'none';                        
                } else {
                    tableRowsClass[i].style.display = '';  
                }

            });

        });

    }

    mutebot.getData = function() {

        var request = new XMLHttpRequest();
        request.open('GET', 'data/data.json', true);

        request.onload = function() {
          if (request.status >= 200 && request.status < 400) {
            
            var data = JSON.parse(request.responseText);
            var searchbox = document.getElementsByClassName('s');
            searchbox[0].setAttribute('placeholder', 'Search '+data.mutebots.length+' filters...');

            mutebot.drawTable(data);

          }
        };

        request.send();
    
    }

    mutebot.drawTable = function(data) {

        for (var i = 0; i < data.mutebots.length; i++) {
            
            var tableBody = document.getElementsByClassName('tablebody');
            var row = document.createElement("tr"); 
            row.classList.add("tablerow");
            
            row.appendChild(mutebot.addCell(data.mutebots[i].title, 'string'));
            row.appendChild(mutebot.addCell(data.mutebots[i].description, 'string'));
            row.appendChild(mutebot.addCell(data.mutebots[i].regex, 'code'));
            row.appendChild(mutebot.addCell(data.mutebots[i].url, 'url'));
            row.appendChild(mutebot.addCell(data.mutebots[i].authorurl, 'authorurl'));

            tableBody[0].appendChild(row);

        }
    }

    mutebot.addCell = function(text, format) {
        var column = document.createElement("td");
            
        if(format === 'url') {
            var a = document.createElement('a');
            var linkText = document.createTextNode('Link');
            a.href = text;
            a.setAttribute("target", "_blank");
            if(text !== '') {
                a.appendChild(linkText);
                column.appendChild(a);
            }
        } else if(format === 'authorurl') {
            var nick = text.substr(text.lastIndexOf('/') + 1);
            var a = document.createElement('a');
            var linkText = document.createTextNode(nick);
            a.href = text;
            a.setAttribute("target", "_blank");
            a.appendChild(linkText);
            column.appendChild(a);
        } else if(format === 'code') {
            var pre = document.createElement('pre');
            var codeText = document.createTextNode(text);
            pre.appendChild(codeText);
            column.appendChild(pre);
        } else {
            var text = document.createTextNode(text);
            column.appendChild(text);
        }
        return column;
    }

    document.addEventListener("DOMContentLoaded", function(event) { 
        
        // Filtering
        mutebot.filters();
        
        // Fetch data
        mutebot.getData();

    });

    return mutebot;

})();
/**
 * Created by Chris on 7/8/2015.
 */

document.addEventListener('DOMContentLoaded', function(){
    var dropEle = document.querySelector('div#drop');
    dropEle.addEventListener('dragover', dragOverHandler, false);
    dropEle.addEventListener('drop', fileSelectHandler, false);

    function fileSelectHandler(event){
        event.stopPropagation();
        event.preventDefault();
        var files = event.dataTransfer.files;
        console.log('bug in console?', files);

        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/upload');
        var formData = new FormData();
        for(var i = 0; i< files.length; i++){
            console.log(files[i]);
            if(files[i].type.match(/pdf$/))
                formData.append(files[i].name, files[i]);
        }
        xhr.addEventListener('readystatechange',function(){
            if(xhr.readyState === 4){
                console.log('response: ', xhr.responseText);
                alert(xhr.responseText);
            }
        });

        xhr.send(formData);
    }

    function dragOverHandler(event){
        event.stopPropagation();
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
    }
});
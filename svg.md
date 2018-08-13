## svg的简单使用
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <!-- <img src="./1.svg" alt="hehe" title="hehe">
    <embed src="./1.svg" type=""> -->
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width='100%' height='500px' background-color='#ccc'>
        <circle cx="300" cy="60" r="50" stroke="#ff0" stroke-width="3" fill="red">
            <set attributeName='fill' to="blue" begin="click"></set>
        </circle>
        
        <rect width="100px" height="30px" style="fill:#ccc;stroke-width: 1;stroke: black;opacity: .5;" x="20" y="20" rx="20" ry="20" onclick="changeCol(evt)"></rect>
        <ellipse cx="200" cy="100" rx="40" ry="100" style="fill: bisque;"></ellipse>
        <line x1=0 y1=0 x2="100" y2 = "100" style="stroke: red;stroke-width: 2px"></line>
        <polyline points="0,0 0,20 20,20 20,40 40,40 40,60" style="fill:white;stroke:red;stroke-width:2"/>
        <path d="M250 150 L150 350 L350 350 Z" />
        <image overflow="visible" width="39" height="40" xlink:href="./1.svg"></image>
    </svg>
</body>
</html>
<script>
    // svg可缩放矢量图形
    var SVGNS = "http://www.w3.org/2000/svg";
    
    function changeCol(evt){
        var target = evt.target;
        target.setAttributeNS(null,"fill","blue");
    }
    
    var rect = document.createElementNS(SVGNS, "rect");
    rect.setAttributeNS(null,'fill','blue')
    console.log(rect);
</script>
```
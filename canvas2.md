
## save restore
save 保存当前的路径状态
restore 恢复上一次保存的路径状态

## 矩形
rect(x, y, w, h)
x, x坐标
y, y坐标
w, 矩形宽
h, 矩形高
功能：绘制一个矩形路径，不描边

strokeRect(x, y, w, h)
x, x坐标
y, y坐标
w, 矩形宽
h, 矩形高
功能：绘制一个矩形路径，并描边

fillRect(x, y, w, h)
x, x坐标
y, y坐标
w, 矩形宽
h, 矩形高
功能：绘制一个矩形路径，并填充

clearRect(x, y, w, h)
x, x坐标
y, y坐标
w, 矩形宽
h, 矩形高
功能：清除指定的矩形区域

## 弧
arc(x, y, r, startAngle, endAngle, anticlockwise)
x,y 圆心坐标
r   圆的半径
startAngle 起始角度（弧度表示）
endAngle 结束角度（弧度表示）
anticlockwise 是否逆时针绘制，注意 找角的时候还是顺时针找

注意事项，每次画完弧之后，都会保存点，下次绘图会从该点开始


## 扇形 如何绘制
先moveTo圆心，然后画弧 ，然后closePath 弧就有了


setInterval  事件间隔用17 做动画
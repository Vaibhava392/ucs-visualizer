let cities=[]
let cost=[]
let visited=[]
let distance=[]
let parent=[]

let nodes=[]
let edges=[]
let network

function createInputs(){

let n=document.getElementById("numNodes").value

let html="<h3>City Names</h3>"

for(let i=0;i<n;i++){
html+=`<input id="city${i}" placeholder="City ${i}"><br>`
}

html+="<h3>Cost Matrix</h3><table>"

for(let i=0;i<n;i++){
html+="<tr>"
for(let j=0;j<n;j++){
html+=`<td><input type="number" id="cost${i}${j}" value="0" style="width:55px"></td>`
}
html+="</tr>"
}

html+="</table>"

html+=`<h3>Start Node Index</h3>
<input type="number" id="startNode">`

document.getElementById("inputs").innerHTML=html

}

function minDistance(n){

let min=Infinity
let index=-1

for(let i=0;i<n;i++){

if(!visited[i] && distance[i]<min){

min=distance[i]
index=i

}

}

return index
}

function buildGraph(n){

nodes=[]
edges=[]

for(let i=0;i<n;i++){

nodes.push({
id:i,
label:cities[i],
shape:"dot",
size:20
})

}

for(let i=0;i<n;i++){

for(let j=0;j<n;j++){

if(cost[i][j]>0){

edges.push({
from:i,
to:j,
label:String(cost[i][j])
})

}

}

}

let container=document.getElementById("network")

let data={
nodes:new vis.DataSet(nodes),
edges:new vis.DataSet(edges)
}

let options={
edges:{arrows:"to"},
physics:{enabled:true}
}

network=new vis.Network(container,data,options)

}

function getPath(j){

let path=[]

while(j!=-1){

path.unshift(j)
j=parent[j]

}

return path

}

function highlightPath(path){

let newEdges=[]

edges.forEach(e=>{

for(let i=0;i<path.length-1;i++){

if(e.from==path[i] && e.to==path[i+1]){

e.color={color:"red"}
e.width=4

}

}

newEdges.push(e)

})

network.setData({
nodes:new vis.DataSet(nodes),
edges:new vis.DataSet(newEdges)
})

}

function runUCS(){

let n=parseInt(document.getElementById("numNodes").value)

cities=[]
cost=[]

for(let i=0;i<n;i++){
cities[i]=document.getElementById("city"+i).value
}

for(let i=0;i<n;i++){

cost[i]=[]

for(let j=0;j<n;j++){

cost[i][j]=parseInt(document.getElementById("cost"+i+j).value)

}

}

let start=parseInt(document.getElementById("startNode").value)

visited=new Array(n).fill(false)
distance=new Array(n).fill(Infinity)
parent=new Array(n).fill(-1)

distance[start]=0

for(let count=0;count<n-1;count++){

let u=minDistance(n)

if(u==-1) break

visited[u]=true

for(let v=0;v<n;v++){

if(!visited[v] && cost[u][v]>0 &&
distance[u]+cost[u][v]<distance[v]){

distance[v]=distance[u]+cost[u][v]
parent[v]=u

}

}

}

buildGraph(n)

let output=`<h3>Shortest Paths from ${cities[start]}</h3>`

for(let i=0;i<n;i++){

if(i!=start){

let path=getPath(i)

highlightPath(path)

let names=path.map(x=>cities[x]).join(" → ")

output+=`
<p>
<b>To ${cities[i]}</b><br>
Cost: ${distance[i]}<br>
Path: ${names}
</p>
`

}

}

document.getElementById("output").innerHTML=output

}

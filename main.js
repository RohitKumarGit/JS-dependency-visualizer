#!usr/bin/end node
const express = require("express");
const fs = require("fs");
console.log("building the graph!");
const app = express();
const graph = { nodes: [], edges: [] };
const readFile = (url) => {
  try {
    let rawData = fs.readFileSync(__dirname + url);
    const base = JSON.parse(String(rawData));

    if (!base.dependencies) {
      throw new Error();
    }
    return base;
  } catch (error) {
    return { dependencies: [] };
  }
};
const visited = {};
const dfs = (package) => {
  if (!visited[package]) {
    visited[package] = true;

    graph.nodes.push({ id: package });
    const url = `/node_modules/${package}/package.json`;

    const t = readFile(url);

    const m = Object.keys(t.dependencies);
    m.forEach((dep) => {
      dfs(dep);
      graph.edges.push({
        from: package,
        to: dep,
      });
      graph.edges.push({
        to: package,
        from: dep,
      });
    });
  }
};

const init = () => {
  const start = Object.keys(readFile("/package.json").dependencies);
  const name = readFile("/package.json").name;
  console.log(name);
  graph.nodes.push({ id: name });
  start.forEach((dep) => {
    dfs(dep);
    graph.edges.push({
      from: start,
      to: dep,
    });
    graph.edges.push({
      to: start,
      from: dep,
    });
  });
  dfs(start);
  fs.writeFile("graph.json", JSON.stringify(graph), function (err) {
    if (err) {
    }
  });
};
init();
console.log("DONE!");

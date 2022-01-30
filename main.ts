import fs from "fs";
import path from "path";
class Base {
  dependencies: any;
}
class Graph {
  nodes: any;
  edges: any;
}
const graph: Graph = { nodes: [], edges: [] };
const readFile = (url: string) => {
  try {
    let rawData = fs.readFileSync(__dirname + url);
    const base = JSON.parse(String(rawData));
    console.log(base);
    if (!base.dependencies) {
      throw new Error();
    }
    return base as Base;
  } catch (error) {
    console.log(__dirname + url);
    return { dependencies: [] };
  }
};
const visited: any = {};
const dfs = (packages: string[]) => {
  for (let i = 0; i < packages.length; i++) {
    if (!visited[packages[i]]) {
      visited[packages[i]] = true;
      console.log(packages[i]);
      console.log(graph.nodes);
      graph.nodes.push({ id: packages[i] });
      const url = `/node_modules/${packages[i]}/package.json`;
      console.log(url);
      const t = readFile(url);
      console.log(t.dependencies);
      const m = Object.keys(t.dependencies);
      m.forEach((dep) => {
        dfs(m);
        graph.edges.push({
          from: packages[i],
          to: dep,
        });
        graph.edges.push({
          to: packages[i],
          from: dep,
        });
      });
    }
  }
};
export const init = () => {
  const start = Object.keys(readFile("/package.json").dependencies);
  dfs(start);
  fs.writeFile("graph.json", JSON.stringify(graph), function (err) {
    if (err) {
      console.log(err);
    }
  });
};
init();

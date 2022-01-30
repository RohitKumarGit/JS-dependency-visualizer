const fs = require("fs");
const path = require("path");
const graph = { nodes: [], edges: [] };
const readFile = (url) => {
  try {
    let rawData = fs.readFileSync(__dirname + url);
    const base = JSON.parse(String(rawData));
    console.log(base);
    if (!base.dependencies) {
      throw new Error();
    }
    return base;
  } catch (error) {
    console.log(__dirname + url);
    return { dependencies: [] };
  }
};
const visited = {};
const dfs = (packages) => {
  for (let i = 0; i < packages.length; i++) {
    if (!visited[packages[i]]) {
      visited[packages[i]] = true;

      graph.nodes.push({ id: packages[i] });
      const url = `/node_modules/${packages[i]}/package.json`;

      const t = readFile(url);

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

const init = () => {
  const start = Object.keys(readFile("/package.json").dependencies);
  dfs(start);
  fs.writeFile("graph.json", JSON.stringify(graph), function (err) {
    if (err) {
    }
  });
};
init();

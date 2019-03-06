const axios = require('axios');
const http = require('http');
const path = require('path');

let commits = [];
let trees = {};

axios.get('https://api.github.com/repos/ath92/tunnel/commits')
	.then(({ data }) => {
		commits = data;

		commits.forEach(commit => {
			axios.get(`${commit.commit.tree.url}?recursive=1`).then(({ data }) => {
				trees[commit.sha] = data.tree;
			}).catch(console.log);
		})
	})
	.catch(console.log);

http.createServer(function (req, res) {
	if (!commits.length) return res.end();

	console.log(req.url);

	const url = req.url === '/' ? '/index.html' : req.url;
	const commitSha = commits[0].sha;
	const tree = trees[commitSha];
	console.log('url', url);
	console.log(tree);
	console.log(tree.find(({ path }) => path === url));


	axios.get('https://api.github.com/repos/ath92/tunnel/commits')
	.then(({ data }) => {
		res.setHeader('Content-type', 'application/json');
        res.end(JSON.stringify(data));
	})
	.catch(console.log);

	// get all commits for repo
	// 
	// for each, get the tree
	// 
}).listen(8099);

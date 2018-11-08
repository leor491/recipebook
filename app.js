var express = require('express');
var path = require('path');
var cons = require('consolidate');
var dust = require('dustjs-helpers');
//var pg = require('pg');

var port = process.env.PORT || 3000;
var app = express();

const { Pool } = require('pg');

const pool = new Pool({
	user: 'postgres',
	host: 'localhost',
	database: 'recipebook',
	password: 'password',
	port: 5432
});

//View Engine
app.engine('dust', cons.dust);
app.set('view engine', 'dust');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

//Body Parsing
app.use(express.json());
app.use(express.urlencoded({ extended:false }));

app.listen(port, () => {
	console.info(`Server started on port: ${port}`);
});

app.get('/', (req, res, next) => {
	pool.query('SELECT * FROM recipebook.recipes', (err, results) => {
		if(err) {
			console.error(err);
			res.end();
		}
		else {
			res.render('index', {recipes: results.rows});
		}

		// done();

		// pool.end((err) => {
		// 	if(err)
		// 		console.error(err);
		// 	else
		// 		console.log('Closing connection pool.')
		// });
	});
});

app.post('/add', (req, res, next) => {
	var {name, ingredients, directions} = req.body;

	pool.query('INSERT INTO recipebook.recipes(name, ingredients, directions) values ($1, $2, $3)', 
		[name, ingredients, directions], 
		(err, results) => {
			if(err) {
				console.error(err);
				res.end();
			}
			else {
				//res.render('index', {recipes: results.rows});
				//req.flash('success', `Added recipe for ${results.rows[0].name}.`);
				//res.location('/');
				res.redirect('/');
				//status 200?
			}
		}
	);
});

app.delete('/remove/:id', (req, res, next) => {
	var {id} = req.params;

	pool.query('DELETE FROM recipebook.recipes where id=$1', 
		[id], 
		(err, results) => {
			if(err) {
				console.error(err);
				res.end();
			}
			else {
				res.sendStatus(200);
			}
		}
	);
});

app.post('/edit', (req, res, next) => {
	var {name, ingredients, directions, id} = req.body;

	pool.query('UPDATE recipebook.recipes SET name=$1, ingredients=$2, directions=$3 where id=$4', 
		[name, ingredients, directions, id], 
		(err, results) => {
			if(err) {
				console.error(err);
				res.end();
			}
			else {
				res.redirect('/');
			}
		}
	);
});
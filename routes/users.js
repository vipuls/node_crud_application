var express = require('express')
var app = express()
var ObjectId = require('mongodb').ObjectId
var formidable = require('formidable');
var fs = require('fs');
// SHOW LIST OF USERS
app.get('/', function(req, res, next) {	
	// fetch and sort users collection by id in descending order
	req.db.collection('users').find().sort({"_id": -1}).toArray(function(err, result) {
		//if (err) return console.log(err)
		if (err) {
			req.flash('error', err)
			res.render('user/list', {
				title: 'User List', 
				data: ''
			})
		} else {
			// render to views/user/list.ejs template file
			res.render('user/list', {
				title: 'User List', 
				data: result
			})
		}
	})
})

// SHOW ADD USER FORM
app.get('/add', function(req, res, next){	
	// render to views/user/add.ejs
	res.render('user/add', {
		password: '',
		email: ''		
	})
})

// ADD NEW USER POST ACTION
app.post('/add', function(req, res, next){	
	//console.log(req);


	req.assert('password', 'Password is required').notEmpty()           //Validate password
    req.assert('email', 'A valid email is required').isEmail()  //Validate email

    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!
		
		/********************************************
		 * Express-validator module
		 
		req.body.comment = 'a <span>comment</span>';
		req.body.username = '   a user    ';

		req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
		req.sanitize('username').trim(); // returns 'a user'
		********************************************/
		var photoname = '';
		

				
  var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var oldpath = files.photo.path;
      var path = __dirname;
      var photoname = files.photo.name;
      var newpath = path+'/../photo/' + photoname;
     // console.log('new path : '+newpath);
    //  console.log(" old path : "+oldpath);
     // res.end();
    // user.photo = photoname;

    
		if(photoname)
		{
			fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
         //console.log('new path : '+newpath);
      //console.log(" old path : "+oldpath);
      //  res.write('File uploaded and moved!');
      //  res.end();
      });
		}

      
 });
  
 var user = {
			password: req.sanitize('password').escape().trim(),
			email: req.sanitize('email').escape().trim(),
			photo : photoname
		}

		
		req.db.collection('users').insert(user, function(err, result) {
			if (err) {
				req.flash('error', err)
				
				// render to views/user/add.ejs
				res.render('user/add', {
					
					
					
					email: user.email					
				})
			} else {				
				req.flash('success', 'User added successfully!')
				
				// redirect to user list page				
				res.redirect('/users')
				
				// render to views/user/add.ejs
				/*res.render('user/add', {
					title: 'Add New User',
					name: '',
					age: '',
					email: ''					
				})*/
			}
		})		
	}
	else {   //Display errors to user
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})				
		req.flash('error', error_msg)		
		
	//	/
		//  Using req.body.name 
		//  because req.param('name') is deprecated
		//  
        res.render('user/add', { 
            title: 'Add New User',
            password: req.body.password,
            email: req.body.email
        })
    }
    
})

// check login

app.post('/checklogin', function(req, res, next){	
	//console.log(req);


	req.assert('password', 'Password is required').notEmpty()           //Validate password
    req.assert('email', 'A valid email is required').isEmail()  //Validate email

    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!
		
		/********************************************
		 * Express-validator module
		 
		req.body.comment = 'a <span>comment</span>';
		req.body.username = '   a user    ';

		req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
		req.sanitize('username').trim(); // returns 'a user'
		********************************************/
		var photoname = '';
		
  
 var user = {
			password: req.sanitize('password').escape().trim(),
			email: req.sanitize('email').escape().trim()
		}

		
		req.db.collection('users').findOne(user, function(err, result) {
			//console.log(result);
			//res.end()
			if (err) {
				req.flash('error', err)
				
				// render to views/user/add.ejs
				res.render('/', {
					
					
					
					email: user.email					
				})
			} else {

				if(result)
				{
					//req.flash('success', 'Data added successfully!')
				
				// redirect to user list page				
				res.redirect('/users')
				}	
				else{
req.flash('error', 'Login details does not match!')
				
				// redirect to user list page				
				res.redirect('/')
				}			
				
				
				// render to views/user/add.ejs
				/*res.render('user/add', {
					title: 'Add New User',
					name: '',
					age: '',
					email: ''					
				})*/
			}
		})		
	}
	else {   //Display errors to user
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})				
		req.flash('error', error_msg)		
		
	//	/
		//  Using req.body.name 
		//  because req.param('name') is deprecated
		//  
        res.render('user/add', { 
            title: 'Add New User',
            password: req.body.password,
            email: req.body.email
        })
    }
    
})
// SHOW EDIT USER FORM
app.get('/edit/(:id)', function(req, res, next){
	var o_id = new ObjectId(req.params.id)
	req.db.collection('users').find({"_id": o_id}).toArray(function(err, result) {
		if(err) return console.log(err)
		
		// if user not found
		if (!result) {
			req.flash('error', 'User not found with id = ' + req.params.id)
			res.redirect('/users')
		}
		else { // if user found
			// render to views/user/edit.ejs template file
			res.render('user/edit', {
				title: 'Edit User', 
				//data: rows[0],
				id: result[0]._id,
				password: result[0].name,
				email: result[0].email,
				photo : result[0].photo				
			})
		}
	})	
})

// EDIT USER POST ACTION
app.put('/edit/(:id)', function(req, res, next) {
	req.assert('password', 'Password is required').notEmpty()           //Validate name
    req.assert('email', 'A valid email is required').isEmail()  //Validate email

    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!
		
		/********************************************
		 * Express-validator module
		 
		req.body.comment = 'a <span>comment</span>';
		req.body.username = '   a user    ';

		req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
		req.sanitize('username').trim(); // returns 'a user'
		********************************************/



			var photoname = '';
		

				
  var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var oldpath = files.photo.path;
      var path = __dirname;
      var photoname = files.photo.name;
      var newpath = path+'/../photo/' + photoname;
     // console.log('new path : '+newpath);
    //  console.log(" old path : "+oldpath);
     // res.end();
    // user.photo = photoname;

    
		if(photoname)
		{
			fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
         //console.log('new path : '+newpath);
      //console.log(" old path : "+oldpath);
      //  res.write('File uploaded and moved!');
      //  res.end();
      });
		}

      
 });
  
 var user = {
			password: req.sanitize('password').escape().trim(),
			email: req.sanitize('email').escape().trim(),
			photo : photoname
		}


		//console.log(user); res.end();
		var o_id = new ObjectId(req.params.id)
		req.db.collection('users').update({"_id": o_id}, user, function(err, result) {
			if (err) {
				req.flash('error', err)
				
				// render to views/user/edit.ejs
				res.render('user/edit', {
					title: 'Edit User',
					id: req.params.id,
					password: req.body.password,
					email: req.body.email
				})
			} else {
				req.flash('success', 'User updated successfully!')
				
				res.redirect('/users')
				
				// render to views/user/edit.ejs
				/*res.render('user/edit', {
					title: 'Edit User',
					id: req.params.id,
					name: req.body.name,
					age: req.body.age,
					email: req.body.email
				})*/
			}
		})		
	}
	else {   //Display errors to user
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})
		req.flash('error', error_msg)
		
		/**
		 * Using req.body.name 
		 * because req.param('name') is deprecated
		 */ 
        res.render('user/edit', { 
            title: 'Edit User',            
			id: req.params.id, 
			name: req.body.name,
			age: req.body.age,
			email: req.body.email
        })
    }
})

// DELETE USER
app.delete('/delete/(:id)', function(req, res, next) {	
	var o_id = new ObjectId(req.params.id)
	req.db.collection('users').remove({"_id": o_id}, function(err, result) {
		if (err) {
			req.flash('error', err)
			// redirect to users list page
			res.redirect('/users')
		} else {
			req.flash('success', 'User deleted successfully! id = ' + req.params.id)
			// redirect to users list page
			res.redirect('/users')
		}
	})	
})

module.exports = app

const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {mongoose} = require('./db/mongoose');
// const User = require('./db/models/user.model.js');


//Load in the mongoose models 
const {List, Task, User } = require('./db/models');

//middleware
const bodyParser = require('body-parser');
app.use(bodyParser.json());

// CORS HEADERS MIDDLEWARE
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Methods","GET,POST,PUT,DELETE,OPTIONS,Head,PATCH");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,Accept,x-access-token,x-refresh-token");
    res.header(
        'Access-Control-Expose-Headers',
        'x-access-token,x-refresh-token');

    next();
  });
 // Check whether the request has a valid JWT access token
  let authenticate = (req, res, next) => {
    let token = req.header('x-access-token');
    //Verify the JWT
    jwt.verify(token, User.getJWTSecret(), (err, decoded) => {
        if (err) {
            // there was an error
            // jwt is invalid - * DO NOT AUTHENTICATE *
            res.status(401).send(err);
        } else {
            // jwt is valid
            req.user_id = decoded._id;
            next();
        }
    }); 
    }

  //verify refresh token Middleware (which will be verifying the session)
  let verifySession = (req, res, next) => {
    // grab the refresh token from the request header
    let refreshToken = req.header('x-refresh-token');

    // grab the _id from the request header
    let _id = req.header('_id');

    User.findByIdAndToken(_id, refreshToken).then((user) => {
        if (!user) {
            // user couldn't be found
            return Promise.reject({
                'error': 'User not found. Make sure that the refresh token and user id are correct'
            });
        }


        // if the code reaches here - the user was found
        // therefore the refresh token exists in the database - but we still have to check if it has expired or not

        req.user_id = user._id;
        req.userObject = user;
        req.refreshToken = refreshToken;

        let isSessionValid = false;

        user.sessions.forEach((session) => {
            if (session.token === refreshToken) {
                // check if the session has expired
                if (User.hasRefreshTokenExpired(session.expiresAt) === false) {
                    // refresh token has not expired
                    isSessionValid = true;
                }
            }
        });

        if (isSessionValid) {
            // the session is VALID - call next() to continue with processing this web request
            next();
        } else {
            // the session is not valid
            return Promise.reject({
                'error': 'Refresh token has expired or the session is invalid'
            })
        }

    }).catch((e) => {
        res.status(401).send(e);
    })
}



  // End of middleware
// Route handlers 
//LIST ROUTES 

// Get /Lists
// purpose : get all lists 
app.get('/lists',authenticate ,  (req, res)=>{
   //We want to return an array of all the lists in the database that belong to the authenticated user
   List.find({
     _userId: req.user_id
   }).then((lists)=>{
    res.send(lists);
});
});

app.get('/lists/:id',authenticate,(req,res)=>{
    List.find({_id: req.params.id}).then((ListResult)=>{
        res.send(ListResult);
    })
})
// Post/Lists
// purpose : create a list 
app.post('/lists',authenticate, (req,res)=>{
// We want to create a new list and return the new list document back to the user (which include the id) that belongs to the authenticated user that created the list
// The list information (fields) will be passed in via a json request body 
let title = req.body.title; 
let newList = new List({
    title,
    _userId: req.user_id
});
newList.save().then((listDoc)=>{
//The full list document is returned
res.send(listDoc);
})

});
// PATH /lists/:id
// Purpose : Update a specified list 
app.patch('/lists/:id',authenticate,(req,res)=>{
    // We want to udpdate the specified list with the new values of the request 
    List.findOneAndUpdate({_id: req.params.id, _userId: req.user_id }, {
        //mongodb instruction
        $set: req.body
    }).then(()=>{
        res.send({'message':'updated successfully'});
    })
});
app.delete('/lists/:id',authenticate,(req,res)=>{
// We want to delete the specified list 
List.findOneAndRemove({
    _id:req.params.id,
    _userId: req.user_id
}).then((ListDeleted)=>{
    res.send(ListDeleted);
    // Delete all the tasks that are in the deleted list
    deleteTaksFromList(ListDeleted._id);
    
})
});
/**
 * GET /lists/:listId/tasks
 * Purpose : Get all tasks in a specific list
 */
app.get("/lists/:listId/tasks",(req,res)=>{
    // we want to return all tasks that belong to a specific list
    Task.find({_listId:req.params.listId}).then((tasks)=>{
        res.send(tasks);
    })
});

// app.get('/lists/:listId/tasks/:taskId',(req,res)=>{
//     Task.findOne({
//         _id: req.params.taskId,
//         _ListId:req.params.listId
//     }).then((task)=>{
//         res.send(task);
//     })
// })
/**
 * POST /lists/:listId/tasks
 * purpose : create a new task in the specified list
 */ 
app.post("/lists/:listId/tasks",authenticate,(req,res)=>{
    // We want to create a new task in the list specified by list id

    List.findOne({
        _id:req.params.listId,
        _userId:req.user_id
    }).then((user)=>{
        if(!user){
            //user object is valid 
            //therefore the list id is valid
            return false;
            }
        return true;
            }).then((canCreateTask)=>{
                if(canCreateTask){
                    let newTask = new Task({
                        title:req.body.title,
                        _listId:req.params.listId
                    });
                    newTask.save().then((newTask)=>{
                        res.send(newTask);
                    })

                }else {
                    res.sendStatus(404);
                }
            })

   

});
/**
 * PATCH /lists/:listId/Tasks/:taskId
 * Purpose : Update an existind task
 */
app.patch('/lists/:listId/tasks/:taskId', authenticate, (req, res) => {
    // We want to update an existing task (specified by taskId)

    List.findOne({
        _id: req.params.listId,
        _userId: req.user_id
    }).then((list) => {
        if (list) {
            // list object with the specified conditions was found
            // therefore the currently authenticated user can make updates to tasks within this list
            return true;
        }

        // else - the list object is undefined
        return false;
    }).then((canUpdateTasks) => {
        if (canUpdateTasks) {
            // the currently authenticated user can update tasks
            Task.findOneAndUpdate({
                _id: req.params.taskId,
                _listId: req.params.listId
            }, {
                    $set: req.body
                }
            ).then(() => {
                res.send({ message: 'Updated successfully.' })
            })
        } else {
            res.sendStatus(404);
        }
    })
});
        



    


/**
 * DELETE  /lists/:listId/Tasks/:taskId
 * Purpose : Delete a task
 */
app.delete("/lists/:listId/tasks/:taskId",authenticate,(req,res)=>{
    // Verify that the current authenticated user have access  to the list 
    List.findOne({
        _id:req.params.listId,
        _userId:req.user_id
    }).then((list)=>{
        if(!list){
            //user object is valid
            //therefore the list id is valid
            return false;
        }
        return true;
   
    
    }).then((canDeleteTasks)=>{
        if(canDeleteTasks){
            Task.findOneAndRemove({
                _id: req.params.taskId,
                _listId: req.params.listId
            }).then((ListRemoved)=>{
                res.send(ListRemoved);
            })

        }else{
            res.sendStatus(404);
        }
    })
        
    }); 

    
//////////////////SignUp///////////////////////////////////////
// app.post('/Signup',(req,res)=>{
//     if(!req.body.name) {
//         return res.status(400).send({
//             message: "user content can not be empty"
//         });
//     }
//     const salt =  bcrypt.genSaltSync(8);
//     bcrypt.hash(req.body.password, salt)
//     .then(hash =>{
//          const user = new User({
//         name: req.body.name || "Untitled User", 
//         Lastname : req.body. Lastname,
//         email : req.body.email,
//         PhoneNumber : req.body.PhoneNumber,
//         Gender : req.body.Gender,
//         DateOfBirth : req.body.DateOfBirth,
//         password: hash
//          });
//            // Save user in the database
// user.save()
// .then(data => {
//     res.send(data);
// }).catch(err => {
//     res.status(500).send({
//         message: err.message || "Some error occurred while creating the user."
//     });
// });
//         })


// })


/////////////////////////User Roots///////////////////////////////////////
// Signup root 
// POST /users
// Purpose : Sign Up 
app.post('/users', (req, res) => {
    // User sign up
    let body = req.body;
    let newUser = new User(body);
    newUser.save().then(() => {
        return newUser.createSession();
    }).then((refreshToken) => {
        // Session created successfully - refreshToken returned
        // now we geneate an access auth token for the user
        return newUser.generateAccessAuthToken().then((accessToken) => {
            // access auth token generated successfully, now we return an object containing the auth tokens
            return {accessToken, refreshToken}
        });
    }).then((authTokens) => {
        // Now we construct and send the response to the user with their auth tokens in the header and the user object in the body
        res
        .header('x-refresh-token', authTokens.refreshToken)
        .header('x-access-token', authTokens.accessToken)
        .send(newUser);
    }).catch((e) => {
        res.status(400).send(e);
    });
});
/////////////////////////Login///////////////////////////////////////
// POST /users/login
// Purpose : Login 
app.post('/users/login', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    User.findByCredentials(email, password).then((user) => {
        return user.createSession().then((refreshToken) => {
            // Session created successfully - refreshToken returned
            // now we geneate an access auth token for the user
            return user.generateAccessAuthToken().then((accessToken) => {
                // access auth token generated successfully, now we return an object containing the auth tokens
                    return {accessToken, refreshToken}
                });
        }).then((authTokens) => {
            // Now we construct and send the response to the user with their auth tokens in the header and the user object in the body
            res.header('x-refresh-token', authTokens.refreshToken)
            .header('x-access-token', authTokens.accessToken)
            .send(user);
    });
    }).catch((e) => {
        res.sendStatus(400).send(e);
    });
});

///////////////////  GET /users/me/access-token ///////////////////////////
//Purpose : Generate and returns an access token 
// Check the header of request and make sure that the refresh token is valid
app.get('/users/me/access-token', verifySession, (req, res) => {
    // we know that the user/caller is authenticated and we have the user_id and user object available to us
    req.userObject.generateAccessAuthToken().then((accessToken) => {
        res.header('x-access-token', accessToken).send({ accessToken });
    }).catch((e) => {
        res.status(400).send(e);
    });
})

///Helper Methods
let deleteTaksFromList = (_listId) => {
Task.deleteMany({
    _listId 
}).then(()=>
{
    console.log("Tasks from " + _listId + " were deleted!");

})
}  
        



/////////////////////////////////////////////////////////////////////////////
app.listen(3000, () =>{
    console.log('Server is listening on port 3000');
});


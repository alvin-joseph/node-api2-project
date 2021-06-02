// implement your posts router here
const express = require('express');
const Post = require('./posts-model');

const router = express.Router();

router.get('/', (req, res) => {
    Post.find()
      .then(posts => {
        res.status(200).json(posts);
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({
          message: 'Error retrieving the posts',
          error: error.message,
          stack: error.stack,
        });
      });
  });

router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
      .then(posts => {
        if (posts) {
          res.status(200).json(posts);
        } else {
          res.status(404).json({ 
              message: "The post with the specified ID does not exist"
            });
        }
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({
            message: "The post information could not be retrieved",
            error: error.message,
            stack: error.stack,
        });
      });
  });

router.post('/', (req, res) => {
    const { title, contents } = req.body;
    if(!title || !contents) {
        res.status(400).json({
            message: "Please provide title and contents for the post"
        })
    } else {
        Post.insert({ title, contents })
            .then(({ id }) => {
                return Post.findById(id)
            })
            .then(post => {
                res.status(201).json(post)
            })
            .catch(error => {
                res.status(500).json({
                    message: "There was an error while saving the post to the database",
                    error: error.message,
                    stack: error.stack,
                  });
            })
    }
  });

router.delete('/:id', (req, res) => {
      Post.findById(req.params.id)
        .then(post => {
          if (!post) {
              res.status(404).json({ 
                  message: "The post with the specified ID does not exist" 
              });
          } else {
              Post.remove(req.params.id)
                .then(() => {
                    res.status(200).json(post)
                });
          }
        })
        .catch(error => {
          console.log(error);
          res.status(500).json({
              message: "The post could not be removed",
              error: error.message,
          });
        });
    });
//another way
router.delete('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            res.status(404).json({
                message: "The post with the specified ID does not exist"
            })
        } else {
            await Post.remove(req.params.id)
            res.json(post)
        }
    } catch (err) {
        res.status(500).json({
            message: "The post could not be removed",
            error: err.message,
            stack: err.stack,
        })
    }
})

router.put('/:id', (req, res) => {
    const changes = req.body;
    const { id } = req.params;
    
    if (!changes.title || !changes.contents) {
        res.status(400).json({
            message: "Please provide title and contents for the post"
            })
    } else {
        Post.findById(id)
            .then(post => {
                if(!post) {
                    res.status(404).json({ 
                        message: "The post with the specified ID does not exist" 
                    });
                } else {
                    return Post.update(id, changes)
                }
            })
            .then(data => {
                if(data) {
                    return Post.findById(id)
                }
            })
            .then(post => {
                if (post) {
                    res.json(post)
                }
            })
            .catch(err => {
                res.status(500).json({
                    message: "The post information could not be modified",
                    err: err.message,
                    stack: err.stack,
                });
            })
    }})


router.get('/:id/comments', (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            if(!post) {
                res.status(404).json({
                    message: "The post with the specified ID does not exist"
                })
            } else {
                return Post.findPostComments(req.params.id)
            }
        })
        .then(data => {
            res.json(data)
        })
        .catch(err => {
            res.status(500).json({
                message: "The comments information could not be retrieved",
                err: err.message,
                stack: err.stack,
            })
        })
});


module.exports = router



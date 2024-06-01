const Post = require('../models/Post');

// Get all posts
const getPosts = async (req, res) => {
    console.log('getPosts called');
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get post by ID
const getPostById = async (req, res) => {
    console.log('getPostById called');
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Create a new post
const createPost = async (req, res) => {
    console.log('createPost called');
    const { title, photos, description, type } = req.body;
    try {
        const newPost = new Post({ title, photos, description, type });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update a post
const updatePost = async (req, res) => {
    console.log('updatePost called');
    const { title, photos, description, type } = req.body;
    try {
        const updatedPost = await Post.findByIdAndUpdate(req.params.id, { title, photos, description, type }, { new: true });
        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Delete a post
const deletePost = async (req, res) => {
    console.log('deletePost called');
    try {
        const deletedPost = await Post.findByIdAndDelete(req.params.id);
        if (!deletedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = { getPosts, getPostById, createPost, updatePost, deletePost };

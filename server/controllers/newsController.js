const { NewsPost } = require('../models');

// Get all posts (Public)
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await NewsPost.findAll({
            order: [['publishDate', 'DESC']]
        });
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Create a post (Admin)
exports.createPost = async (req, res) => {
    const { title, content, summary, image, isPublished } = req.body;

    try {
        const newPost = await NewsPost.create({
            title,
            content,
            summary,
            image,
            isPublished: isPublished !== undefined ? isPublished : true,
            author: req.user.name // Using logged in admin name
        });

        res.json(newPost);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Update a post (Admin)
exports.updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, content, summary, image, isPublished } = req.body;

    try {
        let post = await NewsPost.findByPk(id);

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        post.title = title || post.title;
        post.content = content || post.content;
        post.summary = summary || post.summary;
        post.image = image || post.image;
        if (isPublished !== undefined) post.isPublished = isPublished;

        await post.save();
        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Delete a post (Admin)
exports.deletePost = async (req, res) => {
    const { id } = req.params;

    try {
        const post = await NewsPost.findByPk(id);

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        await post.destroy();
        res.json({ msg: 'Post removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

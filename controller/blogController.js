const Blog = require("../model/blog");

const blogController = {};

// Create a new blog
blogController.createBlog = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { images, title, content } = req.body;

    const blog = new Blog({
      images: images,
      title: title,
      content: content,
      author: userId,
    });
    await blog.save();

    res.status(200).json({
      success: true,
      data: blog,
      message: "Create new blog successful",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Get a single blog
blogController.getSingleBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      "author",
      "-_id -__v"
    );
    res.status(200).json({
      success: true,
      data: blog,
      message: "Get single blog successful",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Get list of blogs
blogController.getListOfBlogs = async (req, res, next) => {
  try {
    // 1. Read the query information
    let { page, limit, sortBy, ...filter } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    // 2. Get total blog number
    const totalBlog = await Blog.countDocuments({ ...filter });

    // 3. Calculate total page number
    const totalPages = Math.ceil(totalBlog / limit);

    // 4. Calculate how many data you will skip (offset)
    const offset = (page - 1) * limit;

    // 5. Get blog based on query info
    const blogs = await Blog.find(filter)
      .sort({ ...sortBy, createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .populate("author");

    // 6. Send blogs + totalPages info
    res.status(200).json({
      success: true,
      data: { blogs: blogs, totalPages },
      message: "Get list of blogs successful",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Update a single blog
blogController.updateSingleBlog = async (req, res, next) => {
  try {
    const userId = req.userId;
    const blogAuthor = await Blog.findById(req.params.id);
    const { images, title, content } = req.body;
    if (blogAuthor.author != userId) {
      throw new Error("You cannot edit the other user's blog");
    }

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        images: images || [],
        title: title,
        content: content,
        author: userId,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: blog,
      message: "Update blog successful",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Delete a single blog
blogController.deleteSingleBlog = async (req, res, next) => {
  try {
    const userId = req.userId;
    const blogAuthor = await Blog.findById(req.params.id);
    if (blogAuthor.author != userId) {
      throw new Error("You cannot delete the other user's blog");
    }

    const blog = await Blog.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: blog,
      message: "Delete blog successful",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = blogController;

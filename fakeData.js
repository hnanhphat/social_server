const faker = require("faker");
const User = require("./model/user");
const bcrypt = require("bcrypt");
const Blog = require("./model/blog");

const fake = {};

fake.generateUsers = () => {
  let userNumber = 10;
  const users = [];
  while (userNumber) {
    users.push({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    });
    userNumber--;
  }
  return users;
};

fake.createUserDatabase = async () => {
  const users = fake.generateUsers();
  users.map(async (el) => {
    let user = await User.findOne({ email: el.email });
    if (user) {
      console.log("email already exist");
    }

    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(el.password, salt);

    user = await User.create(el);
    // console.log("this is one user", user);
    const userId = user._id;

    const blog = new Blog({
      images: `${faker.image.animals()}?random=${Date.now()}`,
      title: faker.name.jobTitle(),
      content: faker.lorem.paragraph(),
      author: userId,
    });
    await blog.save();
  });
  const res = await User.find();
  // console.log(res);
};

//create a blog for every user? , right after we create 1 Single user, we also want to create blog

module.exports = fake;

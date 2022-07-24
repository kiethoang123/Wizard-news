const express = require('express');
const res = require('express/lib/response');
const morgan = require('morgan');
const postBank = require('./public/postBank');
var timeAgo = require('node-time-ago');

const app = express();

app.use(morgan('dev'));

app.use(express.static('public'));

// ROOT ROUTE
app.get('/', (req, res) => {
  // first, get the list of posts.
  const posts = postBank.list();
  // then, prepare some html to send as output.
  const html = `<!DOCTYPE html>
  <html>
  <head>
    <title>Wizard News</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <div class="news-list">
      <header><img src="/logo.png"/>Wizard News</header>
      ${posts
        .map(
          (post) => `
        <div class='news-item'>
          <p>
            <span class="news-position">${post.id}. ▲</span>
            <a href="/posts/${post.id}">${post.title}</a>
            <small>(by ${post.name})</small>
          </p>
          <small class="news-info">
            ${post.upvotes} upvotes | ${post.date}
          </small>
        </div>`
        )
        .join('')}
    </div>
  </body>
</html>`;

  res.send(html);
});

// SINGLE POST ROUTE
app.get('/posts/:id', (req, res, next) => {
  const id = req.params.id;
  const post = postBank.find(id);

  // ERROR ROUTE
  if (!post.id) {
    // If the post wasn't found, just throw an error
    next(err);
  } else {
    // ... Otherwise, send the regular post detail HTML

    const html = `<!DOCTYPE html>
  <html>
  <head>
    <title>Wizard News</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <div class="news-list">
      <header><img src="/logo.png"/>Wizard News</header>
      ${`
        <div class='news-item'>
          <p>
            <span class="news-position">${post.id}. ▲</span>${post.title}
            <small>(by ${post.name})</small>
            <span class="content">${post.content}</span>
          </p>
          <small class="news-info">
            ${post.upvotes} upvotes | ${post.date}
          </small>
        </div>`}
    </div>
  </body>
</html>`;

    res.send(html);
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(404).send('Oh no! Your wand broke!');
});

const { PORT = 1337 } = process.env;

app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});

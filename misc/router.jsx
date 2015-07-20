let Router = require('react-router');
let Route = Router.Route;

// declare our routes and their hierarchy
let routes = (
  <Route handler={App}>
    <Route path="about" handler={About}/>
    <Route path="inbox" handler={Inbox}/>
  </Route>
);

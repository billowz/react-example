let Compontent = require('../compontent');
let HorizontalNav = Compontent('nav-horizontal', {
  render() {
    return (<div className="navbar navbar-static-top" role="navigation">
                <div className="container-fluid">
                    <div className="navbar-header" >
                        <a className="navbar-brand" ng-bind="cfg.title"></a>
                        <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                    </div>
                    <ul className="nav navbar-nav navbar-right ">
                    </ul>
                    <div className="collapse navbar-collapse">

                    </div>
                </div>
            </div>
        );
  },
  toggle() {
    this.refs.nav.toggle();
  },
  _getSelectedIndex() {
    return 0;
  },
  _onNavChange(e, key, payload) {
    //this.context.router.transitionTo(payload.route);
  },
  _onHeaderClick() {
    //this.context.router.transitionTo('root');
    this.refs.nav.close();
  }
});
module.exports = HorizontalNav;

/*@MODULE_GENERATOR@*/
/*Tue, 28 Jul 2015 07:37:09 GMT*/
let React = require('react'),
    {Navbar, Nav, NavItem, DropdownButton, MenuItem} = require('react-bootstrap'),
    rui = require('react-ui'),
    doc = {
    
        Ccc : require('./ccc'),
    
        Doc : require('./doc'),
    
        Index : require('./index'),
    
        NavNav : require('./nav/nav'),
    
        NavSideNav : require('./nav/side-nav'),
    
        TtIndex : require('./tt/index'),
    
        TtTt : require('./tt/tt'),
    
        LayoutLayout : require('./layout/layout'),
    
        LayoutSide : require('./layout/side'),
    
        LayoutDocDemo : require('./layout/doc/demo'),
    
        WorkbenchWorkbench : require('./workbench/workbench'),
    
        WorkbenchDocDemo : require('./workbench/doc/demo'),
    
        WorkbenchDocReadme : require('./workbench/doc/readme')
    
    };
React.render(<Navbar brand='React UI'>
    <Nav>
      <NavItem eventKey={1} href='#'>Link</NavItem>
      <NavItem eventKey={2} href='#'>Link</NavItem>
      <DropdownButton eventKey={3} title='Dropdown'>
        <MenuItem eventKey='1'>Action</MenuItem>
        <MenuItem eventKey='2'>Another action</MenuItem>
        <MenuItem eventKey='3'>Something else here</MenuItem>
        <MenuItem divider />
        <MenuItem eventKey='4'>Separated link</MenuItem>
      </DropdownButton>
    </Nav>
  </Navbar>, document.body);
modules.exports = doc;

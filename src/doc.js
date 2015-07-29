/*@MODULE_GENERATOR@*/
/*Wed, 29 Jul 2015 16:28:35 GMT*/
let React = require('react'),
    {Navbar, Nav, NavItem, DropdownButton, MenuItem} = require('react-bootstrap'),
    rui = require('react-ui'),
    doc = {
        LayoutDocDemo : require('./layout/doc/demo'),
        WorkbenchDocDemo : require('./workbench/doc/demo')
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
rui.Doc = doc;
module.exports = rui;

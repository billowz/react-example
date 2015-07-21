let React = require('react'),
    {Navbar, Nav, NavItem, DropdownButton, MenuItem} = require('react-bootstrap'),
    rui = require('react-ui'),
    doc = {
    <% for (var i = 0; i < modules.length; i++) { %>
        <%= modules[i].name %> : require('<%=modules[i].path%>')<%= i < modules.length - 1 ? "," : "" %>
    <% } %>
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

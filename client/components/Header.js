// eslint-disable-next-line no-undef
const { Navbar, Nav, Button } = ReactBootstrap;

import Base from "./Base";

export default class Header extends Base {
  constructor(props) {
    super(props);

    this.state = {
      addressExpanded: false,
      expanded: "",
      pathname: window.location.pathname,
    };

    this.bindMany(["expandAddress", "checkPathname", "setExpanded"]);
  }

  setExpanded() {
    this.setState({
      expanded: this.state.expanded ? "" : "expanded",
    });
  }

  componentDidMount() {
    this.checkPathname();
    this.checkIfOperator();
  }

  expandAddress() {
    this.setState({
      addressExpanded: !this.state.addressExpanded,
    });
  }

  checkPathname() {
    let { pathname } = window.location;
    if (pathname !== this.state.pathname) {
      this.setState({
        pathname,
      });
    }
    setTimeout(this.checkPathname, 500);
  }

  render() {
    const { expanded } = this.state;

    let address = null;
    let shortAddress;
    if (this.Store.connectedWallet) {
      let fullAddress = this.Store.connectedWallet;
      shortAddress = this.ellipseAddress(fullAddress);
      if (this.state.addressExpanded) {
        address = (
          <span>
            {this.Store.connectedWallet}
            {/*  <i onClick={this.expandAddress}*/}
            {/*                                                className="command fa fa-minus-circle"*/}
            {/*/>*/}
          </span>
        );
      } else {
        address = (
          <span>
            {shortAddress}
            {/*{isPhone ? null :*/}
            {/*  <i style={{marginLeft: 5}} onClick={this.expandAddress}*/}
            {/*     className="command fa fa-plus-circle"*/}
            {/*  />*/}
            {/*}*/}
          </span>
        );
      }
    }

    // let connectedTo = "";
    //   =
    //   (
    //   <span className={"connected"}>
    //     {this.Store.connectedWallet ? (
    //       <span className={"notConnected"}>Switch to Ethereum Mainnet</span>
    //     ) : null}
    //   </span>
    // );
    // let { connectedNetwork } = this.Store;

    // if (connectedNetwork) {
    //   connectedTo = "";
    // }

    return (
      <Navbar
        expanded={expanded}
        fixed="top"
        bg="dark"
        expand="lg"
        className={"roboto"}
      >
        {/*<Navbar.Brand href="/">*/}
        {/*  <img*/}
        {/*    src={"/images/syncity-full-horizontal.png"}*/}
        {/*    style={{ height: 40 }}*/}
        {/*  />*/}
        {/*</Navbar.Brand>*/}
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          onClick={this.setExpanded}
        />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="mr-auto my-2 my-lg-0" navbarScroll></Nav>
        </Navbar.Collapse>

        <Navbar.Collapse
          className="justify-content-end"
          style={{ display: "block" }}
        >
          <Navbar.Text className={"socialLinks"}>
            <a
              href={"https://discord.gg/tSVtRkppnp"}
              style={{ color: "yellow" }}
              rel="noreferrer"
            >
              <span className={"bitSmaller"}>JOIN US</span>

              <i className="fab fa-discord" style={{ color: "yellow" }} />
            </a>
            <a
              href="http://t.me/SynCityHQ"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-telegram" />
            </a>
            <a
              href="https://twitter.com/SynCityHQ"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-twitter" />
            </a>
          </Navbar.Text>

          {/*<Navbar.Text>{connectedTo}</Navbar.Text>*/}

          {this.Store.connectedWallet ? (
            <Navbar.Text className={"aqua"}>
              <i
                className="fas fa-user-astronaut"
                style={{ marginRight: 10 }}
              />
              {address}
            </Navbar.Text>
          ) : (
            <Button onClick={this.props.connect}>Connect your wallet</Button>
          )}
          {/*{*/}
          {/*  this.state.isOperator*/}
          {/*    ? <Navbar.Text>*/}
          {/*      <Link to="/admin" className={'gold'}><i className="fas fa-tools"/> Admin</Link>*/}
          {/*    </Navbar.Text>*/}
          {/*    : null*/}
          {/*}*/}
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

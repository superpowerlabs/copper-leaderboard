import React from "react";
// eslint-disable-next-line no-undef
import { Navbar, Nav, Button } from "react-bootstrap";

import Base from "./Base";
import { addToken } from "../utils/Wallet";

import Logo from "./lib/Logo";

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

    const left = window.innerWidth / 2 - 146 / 2;

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
        fixed={this.isMobile() ? undefined : "top"}
        bg="dark"
        expand="lg"
        className={"roboto"}
      >
        <div style={{ width: this.isMobile() ? "60%" : "30%" }}>
          <Logo cls={"centeredLogo"} style={{ left, width: 146 }} />{" "}
          {this.isMobile() ? (
            <span className={"onTitle"}>Copperlaunch Leaderboard</span>
          ) : (
            ""
          )}
        </div>

        {this.isMobile() ? (
          this.Store.connectedWallet ? (
            <div className={"aqua floatRightAbsolute"}>
              <i
                className="fas fa-user-astronaut"
                style={{ marginRight: 10 }}
              />
              {address}
            </div>
          ) : (
            <Button
              className={"floatRightAbsolute"}
              size={"sm"}
              onClick={this.props.connect}
            >
              Connect your wallet
            </Button>
          )
        ) : null}

        <Navbar.Collapse>
          {this.Store.chainId === 1 && !this.isMobile() ? (
            <Nav className={"addSynr"} onClick={() => addToken()}>
              Click here to add SYNR to your wallet
            </Nav>
          ) : null}
        </Navbar.Collapse>
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
          {this.isMobile() ? null : (
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
                href="https://t.me/MobLandAnnouncements"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-telegram" />
              </a>
              <a
                href="https://twitter.com/MobLandHQ"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-twitter" />
              </a>
            </Navbar.Text>
          )}

          {/*<Navbar.Text>{connectedTo}</Navbar.Text>*/}

          {/*{this.isMobile() ? null : this.Store.connectedWallet ? (*/}
          {/*  <Navbar.Text className={"aqua"}>*/}
          {/*    <i*/}
          {/*      className="fas fa-user-astronaut"*/}
          {/*      style={{ marginRight: 10 }}*/}
          {/*    />*/}
          {/*    {address}*/}
          {/*  </Navbar.Text>*/}
          {/*) : (*/}
          {/*  <Button onClick={this.props.connect}>Connect your wallet</Button>*/}
          {/*)}*/}
        </Navbar.Collapse>
        {/*{*/}
        {/*  this.state.isOperator*/}
        {/*    ? <Navbar.Text>*/}
        {/*      <Link to="/admin" className={'gold'}><i className="fas fa-tools"/> Admin</Link>*/}
        {/*    </Navbar.Text>*/}
        {/*    : null*/}
        {/*}*/}
      </Navbar>
    );
  }
}

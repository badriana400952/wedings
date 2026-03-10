import React from "react";
import PropTypes from "prop-types";
import Backsound from "../Backsound";
import { BrowserView, MobileView } from "react-device-detect";
import Menu from "../Menu";
import SmoothScroll from "./SmoothScroll";

const GuestLayout = ({ children, ...rest }: any) => {
  // Dummy data
  const app = {
    name: "Wedding Invitation",
  };

  // Update title document
  React.useEffect(() => {
    document.title = app.name;
  }, []);

  // Konten
  const content = (
    <main id="mainContent" className="w-full min-h-screen" {...rest}>
      {children}
    </main>
  );

  return (
    <>
      <Menu />
      <Backsound />

      <BrowserView>
        <SmoothScroll>{content}</SmoothScroll>
      </BrowserView>

      <MobileView>{content}</MobileView>
    </>
  );
};

GuestLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default GuestLayout;
import PropTypes from "prop-types";

export default function MyProgressBar({ bgcolor, progress, height }) {
  const Parentdiv = {
    height: height,
    width: "100%",
    backgroundColor: "",
    borderRadius: 0,
  };

  const Childdiv = {
    height: 34,
    width: `${progress}%`,
    backgroundColor: bgcolor,
    backgroundImage: "linear-gradient(orange, gold)",
    borderRadius: 0,
    textAlign: "right",
    margin: "1px 0 0 1px"
  };

  const progresstext = {
    padding: 10,
    color: "black",
    fontWeight: 900,
  };

  return (
    <div style={Parentdiv}>
      <div style={Childdiv}>
        <span style={progresstext}></span>
      </div>
    </div>
  );
}

MyProgressBar.propTypes = {
  bgcolor: PropTypes.string,
  progress: PropTypes.number,
  height: PropTypes.number,
};

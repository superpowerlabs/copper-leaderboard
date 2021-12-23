import PropTypes from "prop-types";

export default function MyProgressBar({ bgcolor, progress, height }) {
  const Parentdiv = {
    height: height,
    width: "100%",
    backgroundColor: "",
    borderRadius: 0,
    margin: 10,
  };

  const Childdiv = {
    height: "100%",
    width: `${progress}%`,
    backgroundColor: bgcolor,
    borderRadius: 0,
    textAlign: "right",
  };

  const progresstext = {
    padding: 10,
    color: "black",
    fontWeight: 900,
  };

  return (
    <div style={Parentdiv}>
      <div style={Childdiv}>
        <span style={progresstext}>{`${progress}%`}</span>
      </div>
    </div>
  );
}

MyProgressBar.propTypes = {
  bgcolor: PropTypes.string,
  progress: PropTypes.number,
  height: PropTypes.number,
};

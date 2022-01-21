// eslint-disable-next-line no-undef
const { ProgressBar } = ReactBootstrap;

import PropTypes from "prop-types";

export default function MyProgressBar({ progress }) {
  let progress300 = progress > 33 ? 33 : progress || 0;
  let progress200 = progress > 66 ? 33 : progress > 33 ? progress - 33 : 0;
  let progress100 = progress > 83 ? 17 : progress > 66 ? progress - 66 : 0;
  let progress50 = progress > 83 ? progress - 83 : 0;

  return (
    <ProgressBar>
      <ProgressBar
        className={"progressBar"}
        now={progress300}
        key={1}
        style={{
          backgroundColor: "brown",
        }}
      />
      <ProgressBar
        className={"progressBar"}
        now={progress200}
        key={2}
        style={{
          backgroundImage: "linear-gradient(brown, red)",
          textShadow: "0 0 3px white",
        }}
        label="Top 200"
      />
      <ProgressBar
        className={"progressBar"}
        now={progress100}
        key={3}
        style={{
          backgroundImage: "linear-gradient(crimson, gold)",
          textShadow: "0 0 3px white",
        }}
        label="Top 100"
      />
      <ProgressBar
        className={"progressBar"}
        now={progress50}
        key={4}
        style={{
          textShadow: "0 0 3px white",
          backgroundImage: "linear-gradient(orange, gold)",
        }}
        label="Top 50"
      />
    </ProgressBar>
  );
}
//
// <ProgressBar
//   now={progress}
//   class={"progressBar"}
//   variant={"warning"}
//   style={{  margin: 1 }}
// />

MyProgressBar.propTypes = {
  progress: PropTypes.number,
};

import React from "react";
import Gold from '../../assets/pic/gold.jpeg';
export default function Welcome() {
  return (
    <div
      className="d-flex w-100 h-100 position-fixed top-0 start-0"
      style={{
        zIndex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
      }}
    >
      <div
        style={{
          backgroundImage: `url(${Gold})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100vh',
        }}
        className="border-3 rounded container-sm bg text-light h-50 mt-5 d-flex flex-column align-items-center justify-content-center"
      >
        <h1>Welcome To Database</h1>
        <div className="mt-5">
          <a
            href="/dashboard"
            type="button"
            style={{ backgroundColor: "#FDA403",border:'none' }}
            className="btn btn-secondary pe-5 ps-5"
          >
            Start
          </a>
        </div>
      </div>
    </div>
  );
}
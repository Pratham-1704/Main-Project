import React from 'react'

function Footer() {
  return (
    <>
      <footer id="footer" className="footer">
        <div className="copyright">
          &copy; {new Date().getFullYear()}{" "}
          <strong>
            <span>iGAP Technologies</span>
          </strong>
          . All Rights Reserved.
        </div>
        <div className="credits">
          Designed by <a href="https://igaptechnologies.com" target="_blank" rel="noopener noreferrer">iGAP Technologies Team</a>
        </div>
      </footer>

      <a
        href="#"
        className="back-to-top d-flex align-items-center justify-content-center"
      >
        <i className="bi bi-arrow-up-short"></i>
      </a>
    </>
  )
}

export default Footer
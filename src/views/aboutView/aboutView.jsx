import React, { useEffect } from 'react';

import './aboutView-styles.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faCheckCircle,
  faKeyboard,
} from '@fortawesome/free-solid-svg-icons';

const AboutView = (props) => {
  const { setView } = props;

  useEffect(() => {
    function handleKeyDown(e) {
      // press escape to go back to main
      if (e.keyCode === 27) {
        const buttonBack = document.querySelector('.return-btn');

        if (buttonBack) {
          buttonBack.click();
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="about-view-container">
      <div className="about-view-header">
        <button
          className="return-btn"
          onClick={() => setView(() => 'mainView')}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <div className="about-subheading">What's Vocabulazy?</div>
        <div className="about-heading">
          Welcome to the lazy language learning app that's as relaxed as you
          are!
        </div>
      </div>
      <div className="about-view-main">
        <div className="about-intro">
          We believe learning should be easy and fun, and with Vocabulazy,
          you'll feel right at home.
        </div>
        <div className="features">Features:</div>
        <p>
          On our <span className="span-strong">Main View</span>, you'll find
          everything you need to get started:
          <ul className="fa-ul">
            <li>
              <span className="fa-li">
                <FontAwesomeIcon icon={faCheckCircle} />
              </span>
              Manage decks
            </li>
            <li>
              <span className="fa-li">
                <FontAwesomeIcon icon={faCheckCircle} />
              </span>
              Explore flashcards
            </li>
          </ul>
        </p>
        <p>
          Ready to kickstart your study session? Dive into{' '}
          <span className="span-strong">Study Mode</span>:
          <ul className="fa-ul">
            <li>
              {' '}
              <span className="fa-li">
                <FontAwesomeIcon icon={faCheckCircle} />
              </span>
              Randomly presented flashcards.
            </li>
            <li>
              <span className="fa-li">
                <FontAwesomeIcon icon={faKeyboard} />
              </span>
              Intuitive Controls:
            </li>
            <ul>
              <li>
                <span className="span-strong">Escape:</span> Go back
              </li>
              <li>
                <span className="span-strong">Space:</span> mark card correct
              </li>
              <li>
                <span className="span-strong">X:</span> mark card wrong
              </li>
            </ul>
          </ul>
        </p>
        <p>
          Curious about your progress? Head over to your{' '}
          <span className="span-strong">Profile</span> for a quick recap:
          <ul className="fa-ul">
            <li>
              <span className="fa-li">
                <FontAwesomeIcon icon={faCheckCircle} />
              </span>
              Decks studied
            </li>
            <li>
              <span className="fa-li">
                <FontAwesomeIcon icon={faCheckCircle} />
              </span>
              Card Performance
            </li>
            <li>
              <span className="fa-li">
                <FontAwesomeIcon icon={faCheckCircle} />
              </span>
              Average Time per Session
            </li>
          </ul>
        </p>

        <div className="watermark-footer">
          &copy; Vincent {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
};

export default AboutView;

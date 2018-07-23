import React, { Component } from 'react';
import { giveReview } from '../actions/reviewActions';
import { Modal } from 'react-bootstrap';
import { showHome } from '../actions/showHomeActions';
import 'bootstrap/dist/css/bootstrap.css';

class Review extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleClose = this.handleClose.bind(this);

    this.state = {
      show: true
    };
  }

  handleClose() {
    this.setState({ show: false });
    this.props.dispatch(showHome());
  }

  handleSubmit(event) {
    event.preventDefault();
    const { rating, rating1, rating2 } = this.form;
    const { token } = this.props;
    // const { sessionOfUser } = this.state;
    //const sessionOfUser = 1;
    console.log('rating--', parseInt(rating.value));
    console.log('rating1--', parseInt(rating1.value));
    console.log('rating2--', parseInt(rating2.value));
    console.log('comment--', this.comment.value);
    console.log('this.props.token.classID ', token.classID);
    const { dispatch } = this.props;
    dispatch(
      giveReview(
        parseInt(rating.value),
        parseInt(rating1.value),
        parseInt(rating2.value),
        parseInt(token.classID),
        this.comment.value
      )
    );
  }

  render() {
    const { user } = this.props;
    console.log('this.props.user ', user);

    return (
      // <div className="container">
      <Modal show={this.state.show} onHide={this.handleClose}>
        <div className="header__review">
          <div className="close__text" onClick={this.handleClose}>
            Cancel
          </div>
          <div className="review__text">Review</div>
        </div>
        <Modal.Body>
          {/* <div className="myJumbotron"> */}

          <form
            ref={form => (this.form = form)}
            onSubmit={e => this.handleSubmit(e)}
          >
            <div className="form-group row justify-content-md-center">
              <fieldset className="rating">
                <legend className="textbox__title">Quality of Trainer</legend>
                <input type="radio" id="star5" name="rating" value="5" />
                <label htmlFor="star5" title="Rocks!">
                  5 stars
                </label>
                <input type="radio" id="star4" name="rating" value="4" />
                <label htmlFor="star4" title="Pretty good">
                  4 stars
                </label>
                <input type="radio" id="star3" name="rating" value="3" />
                <label htmlFor="star3" title="Meh">
                  3 stars
                </label>
                <input type="radio" id="star2" name="rating" value="2" />
                <label htmlFor="star2" title="Kinda bad">
                  2 stars
                </label>
                <input type="radio" id="star1" name="rating" value="1" />
                <label htmlFor="star1" title="Big time bad">
                  1 star
                </label>
              </fieldset>
            </div>
            <hr />
            <div className="form-group row justify-content-md-center">
              <fieldset className="rating1">
                <legend className="textbox__title">Video Quality</legend>
                <input type="radio" id="star5_1" name="rating1" value="5" />
                <label htmlFor="star5_1" title="Rocks!">
                  5 stars
                </label>
                <input type="radio" id="star4_1" name="rating1" value="4" />
                <label htmlFor="star4_1" title="Pretty good">
                  4 stars
                </label>
                <input type="radio" id="star3_1" name="rating1" value="3" />
                <label htmlFor="star3_1" title="Meh">
                  3 stars
                </label>
                <input type="radio" id="star2_1" name="rating1" value="2" />
                <label htmlFor="star2_1" title="Kinda bad">
                  2 stars
                </label>
                <input type="radio" id="star1_1" name="rating1" value="1" />
                <label htmlFor="star1_1" title="Big time bad">
                  1 star
                </label>
              </fieldset>
            </div>
            <hr />

            <div className="form-group row justify-content-md-center">
              <fieldset className="rating2">
                <legend className="textbox__title">Quality of Setup</legend>
                <input type="radio" id="star5_2" name="rating2" value="5" />
                <label htmlFor="star5_2" title="Rocks!">
                  5 stars
                </label>
                <input type="radio" id="star4_2" name="rating2" value="4" />
                <label htmlFor="star4_2" title="Pretty good">
                  4 stars
                </label>
                <input type="radio" id="star3_2" name="rating2" value="3" />
                <label htmlFor="star3_2" title="Meh">
                  3 stars
                </label>
                <input type="radio" id="star2_2" name="rating2" value="2" />
                <label htmlFor="star2_2" title="Kinda bad">
                  2 stars
                </label>
                <input type="radio" id="star1_2" name="rating2" value="1" />
                <label htmlFor="star1_2" title="Big time bad">
                  1 star
                </label>
              </fieldset>
            </div>
            <hr />
            <div className="form-group row justify-content-md-center">
              <div className="form-group">
                <label htmlFor="Textarea6" className="textbox__title">
                  Tell Us More
                </label>
                <textarea
                  ref={input => (this.comment = input)}
                  className="form-control textarea__review"
                  id="Textarea6"
                  rows="4"
                  placeholder="Your Comment..."
                />
              </div>
            </div>
            <div className="form-group row justify-content-md-center">
              <button type="submit" className="big-submit-btn">
                Submit
              </button>
            </div>
          </form>
          {/* </div> */}
        </Modal.Body>
      </Modal>
      // </div>
    );
  }
}

export default Review;

import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class HomepageRow extends Component {

  static defaultProps = {
    type: 1
  }

  render() {
    const { items, type } = this.props;
    const variant1 = 'cell smaller-cell';
    const variant2 = 'cell larger-cell';
    const temp_background = 'https://place-hold.it/800x500';

    let variant = variant1;
    let background = temp_background;

    return (
      <div className="alternating-rows">
        <div className="alternating-rows--inner">
          {items.map((item, index) => {
            variant = type === 1 ? variant1 : variant2;
            variant = index > 0 ? type === 1 ? variant2 : variant1 : variant;

            background = item.node.featuredImage ? item.node.featuredImage.sourceUrl : temp_background;

            return (
              <div className={variant} key={item.node.id}>
                <div className="cell--inner" style={{backgroundImage: 'url(' + background + ')'}}>
                  <div className="post-title">{item.node.title}</div>
                  <Link to={item.node.link} className="large-link"/>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default HomepageRow;

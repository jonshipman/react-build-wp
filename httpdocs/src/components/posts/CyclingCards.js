import React from 'react';
import { gql } from '@apollo/client';

import Image from '../elements/Image';

import RotatingCards from './RotatingCards';

const QUERY = gql`
  query CardSmallQuery(
    $first: Int,
    $last: Int,
    $after: String,
    $before: String
  ) {
    posts(
      first: $first,
      last: $last,
      after: $after,
      before: $before,
      where: {status: PUBLISH, hasPassword: false}
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
          title
        }
        cursor
      }
    }
  }
`;

const Wrapper = ({ cards, children, ...rest }) => {
  return (
    <ul className="cards-cycling list pl0 flex-l flex-wrap-l mw7 center" { ...rest }>
      {cards.map(card => children(card))}
    </ul>
  );
};

/**
 * Cycling cards
 */
export default () => (
  <div className="w-100 h-100 bg-dark-gray pa4 tc flex-l items-center-l">
    <div className="w-100-l">
      <h3><span className="fw4 f2 white">Our Company <span className="fw7">Advantage</span></span></h3>
      <RotatingCards query={QUERY} wrapper={Wrapper}>
        {card => (
          <li className="w-100 w-50-l card pa3" key={card.node.id}>
            <div className="w-100 bg-white aspect-ratio-l aspect-ratio--16x9-l">
              <div className="card--inner w-100 absolute-l z-1 pa2 pa0-l">
                <div className="w-100 grow">
                  <Image
                    width={64}
                    height={64}
                    alt="Replace with featured or custom meta (paste svg into acf textarea)"
                  />
                </div>
                <div className="mt2 f7 fw7 w-90 center">{card.node.title}</div>
              </div>
            </div>
          </li>
        )}
      </RotatingCards>
    </div>
  </div>
);

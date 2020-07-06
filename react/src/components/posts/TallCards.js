import React from "react";
import { Link } from "react-router-dom";
import { gql } from "@apollo/client";

import PostContent from "../elements/PostContent";
import Image from "../elements/Image";
import { BlocksThree } from "../elements/Blocks";

import RotatingCards from "./RotatingCards";

const QUERY = gql`
  query CardTallQuery(
    $first: Int
    $last: Int
    $after: String
    $before: String
  ) {
    posts(
      first: $first
      last: $last
      after: $after
      before: $before
      where: { status: PUBLISH, hasPassword: false }
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
          excerpt
          uri
        }
        cursor
      }
    }
  }
`;

const Wrapper = ({ cards, ...props }) => {
  return BlocksThree({ ...props, items: cards });
};

/**
 * Tall cards
 */
export default () => (
  <RotatingCards
    query={QUERY}
    wrapper={Wrapper}
    timeout={1001}
    classNames="cards-tall"
    count={3}
  >
    {(card) => (
      <div className="card bg-near-white h-100 ba b--light-gray relative z-1">
        <div className="card--image">
          <Image
            className="center db"
            alt={card.node.title}
            width={300}
            height={180}
          />
        </div>
        <div className="card--text pa4">
          <div className="card--title ttu f7 fw7">{card.node.title}</div>
          <PostContent
            className="card--content pb2 f7"
            content={card.node.excerpt}
          />
          {card.node.uri && (
            <div className="ba b--light-gray absolute bottom-0 right-0 left-0">
              <Link
                className="dark-gray fw7 ttu f7 db ph4 pv2 hover-white hover-bg-green"
                to={card.node.uri}
              >
                Learn More
              </Link>
            </div>
          )}
        </div>
      </div>
    )}
  </RotatingCards>
);
